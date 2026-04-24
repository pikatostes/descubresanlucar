<?php

namespace App\Console\Commands;

use App\Models\Places;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GeocodePlaces extends Command
{
    protected $signature = 'places:geocode {--dry-run : Simular sin guardar}';

    protected $description = 'Geocodifica las direcciones de los lugares para obtener latitud y longitud';

    public function handle(): int
    {
        $places = Places::whereNull('latitude')
            ->orWhereNull('longitude')
            ->get();

        if ($places->isEmpty()) {
            $this->info('Todos los lugares ya tienen coordenadas.');

            return Command::SUCCESS;
        }

        $this->info("Se procesarán {$places->count()} lugares...");

        $bar = $this->output->createProgressBar($places->count());
        $bar->start();

        foreach ($places as $place) {
            $address = $place->address.', Sanlúcar de Barrameda, Cádiz, España';
            $coords = $this->geocode($address);

            if ($coords && ! $this->option('dry-run')) {
                $place->latitude = $coords['lat'];
                $place->longitude = $coords['lng'];
                $place->save();
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Geocodificación completada.');

        return Command::SUCCESS;
    }

    private function geocode(string $address): ?array
    {
        $apiKey = config('services.google.maps_api_key');

        if (empty($apiKey)) {
            $this->error('Google Maps API Key no configurada.');

            return null;
        }

        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $address,
            'key' => $apiKey,
        ]);

        if ($response->successful() && $response['status'] === 'OK') {
            $location = $response['results'][0]['geometry']['location'];

            return ['lat' => $location['lat'], 'lng' => $location['lng']];
        }

        $this->warn("No se pudo geocodificar: {$address}");

        return null;
    }
}