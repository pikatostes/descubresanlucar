<?php

namespace App\Http\Controllers;

use App\Models\Places;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index(Request $request)
    {
        $latitude = $request->query('lat');
        $longitude = $request->query('lng');
        $radius = 500;

        $places = Places::with(['category', 'primaryImage'])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(function ($place) use ($latitude, $longitude, $radius) {
                $placeData = $place->toArray();

                if ($latitude && $longitude) {
                    $distance = $this->calculateDistance(
                        (float) $latitude,
                        (float) $longitude,
                        (float) $place->latitude,
                        (float) $place->longitude
                    );
                    $placeData['distance'] = round($distance);
                    $placeData['within_radius'] = $distance <= $radius;
                } else {
                    $placeData['distance'] = null;
                    $placeData['within_radius'] = null;
                }

                return $placeData;
            });

        if ($latitude && $longitude) {
            $places = $places->sortBy('distance')->values();
        }

        return Inertia::render('Mapa', [
            'places' => $places,
            'categories' => \App\Models\Category::all(),
            'userLocation' => $latitude && $longitude ? [
                'lat' => (float) $latitude,
                'lng' => (float) $longitude,
            ] : null,
            'radius' => $radius,
        ]);
    }

    private function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371000;

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
