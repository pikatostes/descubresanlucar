<?php

namespace Database\Seeders;

use App\Models\Places;
use App\Models\Category;
use App\Models\User;
use App\Models\PlaceImage;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin Test',
                'password' => 'password',
            ]
        );
        $user->assignRole('admin');

        $categories = [
            ['slug' => 'restaurantes', 'label' => 'Restaurantes', 'icon' => '🍽️'],
            ['slug' => 'bares', 'label' => 'Bares', 'icon' => '🍺'],
            ['slug' => 'cafeterias', 'label' => 'Cafeterías', 'icon' => '☕'],
        ];

        foreach ($categories as $catData) {
            $category = Category::firstOrCreate(['slug' => $catData['slug']], $catData);
        }

        $category = Category::where('slug', 'restaurantes')->first();

        $places = [
            [
                'name' => 'Bar El Gaitán',
                'description' => 'Bar tradicional en el centro de Sanlúcar. известная тапас и хорошая атмосфера.',
                'address' => 'Calle Marqués demount 5',
                'phone' => '956 123 456',
                'hours' => '12:00 - 23:00',
                'latitude' => 36.8421,
                'longitude' => -6.0456,
            ],
            [
                'name' => 'Café de la Plaza',
                'description' => 'Café con terraza en la plaza utama.',
                'address' => 'Plaza de la Constitución 12',
                'phone' => '956 234 567',
                'hours' => '09:00 - 21:00',
                'latitude' => 36.8435,
                'longitude' => -6.0442,
            ],
            [
                'name' => 'Restaurante El Pescador',
                'description' => 'Fresh fish and seafood. Mejor pescadilla de la zona.',
                'address' => 'Calle的低 8',
                'phone' => '956 345 678',
                'hours' => '13:00 - 24:00',
                'latitude' => 36.8410,
                'longitude' => -6.0470,
            ],
        ];

        foreach ($places as $placeData) {
            $place = Places::firstOrCreate(
                ['name' => $placeData['name']],
                array_merge($placeData, [
                    'category_id' => $category->id,
                    'user_id' => $user->id,
                ])
            );
        }

        $this->command->info('Datos de prueba creados:');
        $this->command->info('- Usuario: admin@test.com / password');
        $this->command->info('- Categorías: restaurantes, bares, cafeterías');
        $this->command->info('- Lugares: Bar El Gaitán, Café de la Plaza, Restaurante El Pescador');
    }
}