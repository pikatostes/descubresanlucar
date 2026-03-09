<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'slug' => 'restaurantes', 'label' => 'Restaurantes', 'icon' => '🍽️',
                'tags' => [
                    ['slug' => 'cocina-tradicional', 'name' => 'Cocina tradicional'],
                    ['slug' => 'menu-del-dia',        'name' => 'Menú del día'],
                    ['slug' => 'pescado-fresco',      'name' => 'Pescado fresco'],
                    ['slug' => 'mariscos',            'name' => 'Mariscos'],
                ],
            ],
            [
                'slug' => 'bares', 'label' => 'Bares', 'icon' => '🍺',
                'tags' => [
                    ['slug' => 'tapas',              'name' => 'Tapas'],
                    ['slug' => 'manzanilla',         'name' => 'Manzanilla'],
                    ['slug' => 'con-musica-en-vivo', 'name' => 'Con música en vivo'],
                    ['slug' => 'terraza',            'name' => 'Terraza'],
                ],
            ],
            [
                'slug' => 'cafeterias', 'label' => 'Cafeterías', 'icon' => '☕',
                'tags' => [
                    ['slug' => 'desayunos',      'name' => 'Desayunos'],
                    ['slug' => 'carta-de-vinos', 'name' => 'Carta de vinos'],
                ],
            ],
            [
                'slug' => 'hoteles', 'label' => 'Hoteles', 'icon' => '🏨',
                'tags' => [
                    ['slug' => 'vistas-al-mar',   'name' => 'Vistas al mar'],
                    ['slug' => 'parking-cercano', 'name' => 'Parking cercano'],
                    ['slug' => 'wifi',            'name' => 'WiFi'],
                    ['slug' => 'accesible',       'name' => 'Accesible'],
                ],
            ],
            [
                'slug' => 'tiendas', 'label' => 'Tiendas', 'icon' => '🛍️',
                'tags' => [
                    ['slug' => 'solo-efectivo', 'name' => 'Solo efectivo'],
                    ['slug' => 'reservas',      'name' => 'Reservas'],
                ],
            ],
            [
                'slug' => 'ocio', 'label' => 'Ocio', 'icon' => '🎭',
                'tags' => [
                    ['slug' => 'visita-guiada', 'name' => 'Visita guiada'],
                    ['slug' => 'para-grupos',   'name' => 'Para grupos'],
                    ['slug' => 'familiar',      'name' => 'Familiar'],
                ],
            ],
            [
                'slug' => 'cultura', 'label' => 'Cultura', 'icon' => '🏛️',
                'tags' => [
                    ['slug' => 'entrada-gratuita', 'name' => 'Entrada gratuita'],
                    ['slug' => 'audioguia',        'name' => 'Audioguía'],
                ],
            ],
            [
                'slug' => 'naturaleza', 'label' => 'Naturaleza', 'icon' => '🌿',
                'tags' => [
                    ['slug' => 'primera-linea-playa', 'name' => 'Primera línea playa'],
                    ['slug' => 'pet-friendly',        'name' => 'Pet Friendly'],
                    ['slug' => 'accesible-playa',     'name' => 'Accesible'],
                ],
            ],
        ];

        foreach ($data as $item) {
            $category = Category::firstOrCreate(
                ['slug' => $item['slug']],
                ['label' => $item['label'], 'icon' => $item['icon']]
            );

            foreach ($item['tags'] as $tagData) {
                Tag::firstOrCreate(
                    ['slug' => $tagData['slug']],
                    ['name' => $tagData['name'], 'category_id' => $category->id]
                );
            }
        }
    }
}