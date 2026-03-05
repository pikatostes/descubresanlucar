<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'restaurantes', 'label' => 'Restaurantes', 'icon' => '🍽️'],
            ['slug' => 'bares',        'label' => 'Bares',        'icon' => '🍺'],
            ['slug' => 'cafeterias',   'label' => 'Cafeterías',   'icon' => '☕'],
            ['slug' => 'hoteles',      'label' => 'Hoteles',      'icon' => '🏨'],
            ['slug' => 'tiendas',      'label' => 'Tiendas',      'icon' => '🛍️'],
            ['slug' => 'ocio',         'label' => 'Ocio',         'icon' => '🎭'],
            ['slug' => 'cultura',      'label' => 'Cultura',      'icon' => '🏛️'],
            ['slug' => 'naturaleza',   'label' => 'Naturaleza',   'icon' => '🌿'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}