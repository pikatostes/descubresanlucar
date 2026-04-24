<?php

namespace Tests\Unit;

use App\Console\Commands\GeocodePlaces;
use App\Models\Places;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class GeocodePlacesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_command_shows_message_when_no_places_to_geocode(): void
    {
        $this->artisan('places:geocode')
            ->expectsOutput('Todos los lugares ya tienen coordenadas.');
    }

    public function test_command_processes_places_without_coordinates(): void
    {
        Config::set('services.google.maps_api_key', 'test-api-key');

        Places::factory()->create([
            'name' => 'Test Place',
            'address' => 'Calle Test 123',
            'latitude' => null,
            'longitude' => null,
        ]);

        Http::fake([
            '*' => Http::response([
                'status' => 'OK',
                'results' => [
                    [
                        'geometry' => [
                            'location' => [
                                'lat' => 36.8421,
                                'lng' => -6.0456,
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $this->artisan('places:geocode')
            ->expectsOutput('Se procesarán 1 lugares...')
            ->assertExitCode(0);

        $this->assertNotNull(Places::first()->latitude);
        $this->assertNotNull(Places::first()->longitude);
    }

    public function test_command_skips_places_with_existing_coordinates(): void
    {
        Config::set('services.google.maps_api_key', 'test-api-key');

        Places::factory()->create([
            'name' => 'Place With Coords',
            'address' => 'Calle Test 123',
            'latitude' => 36.8421,
            'longitude' => -6.0456,
        ]);

        $this->artisan('places:geocode')
            ->expectsOutput('Todos los lugares ya tienen coordenadas.');
    }

    public function test_command_does_not_save_in_dry_run_mode(): void
    {
        Config::set('services.google.maps_api_key', 'test-api-key');

        $place = Places::factory()->create([
            'name' => 'Test Place',
            'address' => 'Calle Test 123',
            'latitude' => null,
            'longitude' => null,
        ]);

        Http::fake([
            '*' => Http::response([
                'status' => 'OK',
                'results' => [
                    [
                        'geometry' => [
                            'location' => [
                                'lat' => 36.8421,
                                'lng' => -6.0456,
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $this->artisan('places:geocode --dry-run')
            ->assertExitCode(0);

        $this->assertNull($place->fresh()->latitude);
        $this->assertNull($place->fresh()->longitude);
    }

    public function test_command_shows_error_when_api_key_not_configured(): void
    {
        Config::set('services.google.maps_api_key', null);

        Places::factory()->create([
            'name' => 'Test Place',
            'address' => 'Calle Test 123',
            'latitude' => null,
            'longitude' => null,
        ]);

        $this->artisan('places:geocode')
            ->expectsOutput('Google Maps API Key no configurada.');
    }

    public function test_command_handles_api_error(): void
    {
        Config::set('services.google.maps_api_key', 'test-api-key');

        Places::factory()->create([
            'name' => 'Test Place',
            'address' => 'Invalid Address That Fails',
            'latitude' => null,
            'longitude' => null,
        ]);

        Http::fake([
            '*' => Http::response([
                'status' => 'ZERO_RESULTS',
            ], 200),
        ]);

        $this->artisan('places:geocode')
            ->assertExitCode(0);
    }
}