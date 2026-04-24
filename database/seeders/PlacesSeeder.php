<?php

namespace Database\Seeders;

use App\Models\Places;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class PlacesSeeder extends Seeder
{
    public function run(): void
    {
        // Helper: devuelve el id del tag por slug, o null si no existe
        $tag = fn(string $slug) => Tag::where('slug', $slug)->first()?->id;

        // ── RESTAURANTES ──────────────────────────────────────────────
        $cat = Category::where('slug', 'restaurantes')->firstOrFail();

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Casa Balbino',
            'slug'    => 'casa-balbino',
            'description' => 'Taberna histórica en la Plaza del Cabildo, famosa por sus tortillitas de camarones.',
            'address' => 'Plaza del Cabildo, 14, Sanlúcar de Barrameda',
            'phone'   => '956 360 513',
            'hours'   => 'Mar-Dom 12:00-16:00, 20:00-23:30',
        ])->tags()->attach(array_filter([
            $tag('cocina-tradicional'),
            $tag('pescado-fresco'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Restaurante Mirador Doñana',
            'slug'    => 'mirador-donana',
            'description' => 'Vistas privilegiadas al Parque de Doñana con cocina marinera de primera calidad.',
            'address' => 'Bajada de la Calzada, s/n, Sanlúcar de Barrameda',
            'phone'   => '956 364 205',
            'hours'   => 'Lun-Dom 13:00-16:30, 20:30-23:00',
        ])->tags()->attach(array_filter([
            $tag('mariscos'),
            $tag('pescado-fresco'),
            $tag('menu-del-dia'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'El Coto de la Isleta',
            'slug'    => 'coto-de-la-isleta',
            'description' => 'Especialistas en mariscos y langostinos de Sanlúcar, imprescindibles en cualquier visita.',
            'address' => 'Av. de la Playa, 2, Sanlúcar de Barrameda',
            'phone'   => '956 368 090',
            'hours'   => 'Lun-Dom 12:30-17:00, 20:00-24:00',
        ])->tags()->attach(array_filter([
            $tag('mariscos'),
            $tag('cocina-tradicional'),
            $tag('menu-del-dia'),
        ]));

        // ── BARES ─────────────────────────────────────────────────────
        $cat = Category::where('slug', 'bares')->firstOrFail();

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Bar Barbiana',
            'slug'    => 'bar-barbiana',
            'description' => 'Bar de tapas clásico, célebre por sus gambas blancas y su manzanilla de Sanlúcar.',
            'address' => 'Calle Luis Eguilaz, 2, Sanlúcar de Barrameda',
            'phone'   => '956 360 450',
            'hours'   => 'Mar-Dom 11:00-16:00, 19:00-23:00',
        ])->tags()->attach(array_filter([
            $tag('tapas'),
            $tag('manzanilla'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Taberna der Guerrita',
            'slug'    => 'taberna-der-guerrita',
            'description' => 'Auténtica taberna flamenca con música en vivo los fines de semana y terraza exterior.',
            'address' => 'Calle Ancha, 1, Sanlúcar de Barrameda',
            'phone'   => '956 361 200',
            'hours'   => 'Jue-Dom 18:00-02:00',
        ])->tags()->attach(array_filter([
            $tag('con-musica-en-vivo'),
            $tag('terraza'),
            $tag('manzanilla'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Bar El Espejo',
            'slug'    => 'bar-el-espejo',
            'description' => 'Bar de tapas con terraza en pleno centro, ideal para tomar el aperitivo.',
            'address' => 'Calle Bretones, 5, Sanlúcar de Barrameda',
            'phone'   => '956 362 310',
            'hours'   => 'Lun-Dom 09:00-23:00',
        ])->tags()->attach(array_filter([
            $tag('tapas'),
            $tag('terraza'),
        ]));

        // ── CAFETERÍAS ────────────────────────────────────────────────
        $cat = Category::where('slug', 'cafeterias')->firstOrFail();

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Cafetería El Pasaje',
            'slug'    => 'cafeteria-el-pasaje',
            'description' => 'Cafetería clásica en el centro con los mejores desayunos de la ciudad.',
            'address' => 'Calle San Juan, 5, Sanlúcar de Barrameda',
            'phone'   => '956 362 100',
            'hours'   => 'Lun-Dom 07:30-14:00',
        ])->tags()->attach(array_filter([
            $tag('desayunos'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Cafetería La Moderna',
            'slug'    => 'cafeteria-la-moderna',
            'description' => 'Cafetería con amplia carta de vinos y desayunos elaborados.',
            'address' => 'Calle Ancha, 12, Sanlúcar de Barrameda',
            'phone'   => '956 363 200',
            'hours'   => 'Lun-Sab 08:00-15:00',
        ])->tags()->attach(array_filter([
            $tag('desayunos'),
            $tag('carta-de-vinos'),
        ]));

        // ── HOTELES ───────────────────────────────────────────────────
        $cat = Category::where('slug', 'hoteles')->firstOrFail();

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Hotel Tartaneros',
            'slug'    => 'hotel-tartaneros',
            'description' => 'Hotel boutique instalado en un palacete del siglo XIX en el casco histórico.',
            'address' => 'Calle Tartaneros, 8, Sanlúcar de Barrameda',
            'phone'   => '956 385 378',
            'hours'   => 'Recepción 24h',
        ])->tags()->attach(array_filter([
            $tag('wifi'),
            $tag('parking-cercano'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Hotel Guadalquivir',
            'slug'    => 'hotel-guadalquivir',
            'description' => 'Hotel frente al río Guadalquivir con vistas al Parque Nacional de Doñana.',
            'address' => 'Calzada del Ejército, 10, Sanlúcar de Barrameda',
            'phone'   => '956 360 742',
            'hours'   => 'Recepción 24h',
        ])->tags()->attach(array_filter([
            $tag('vistas-al-mar'),
            $tag('wifi'),
            $tag('accesible'),
        ]));

        // ── TIENDAS ───────────────────────────────────────────────────
        $cat = Category::where('slug', 'tiendas')->firstOrFail();

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Mercado de Abastos de Sanlúcar',
            'slug'    => 'mercado-de-abastos',
            'description' => 'Mercado municipal con los mejores productos frescos: pescado, mariscos y frutas.',
            'address' => 'Calle Bretones, s/n, Sanlúcar de Barrameda',
            'hours'   => 'Lun-Sab 08:00-14:00',
        ])->tags()->attach(array_filter([
            $tag('solo-efectivo'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Bodegas Hidalgo — Tienda',
            'slug'    => 'bodegas-hidalgo-tienda',
            'description' => 'Tienda oficial de Bodegas Hidalgo con venta de Manzanilla La Gitana y productos gourmet.',
            'address' => 'Calle Banda de la Playa, 42, Sanlúcar de Barrameda',
            'phone'   => '956 385 304',
            'hours'   => 'Lun-Vie 10:00-14:00',
        ])->tags()->attach(array_filter([
            $tag('reservas'),
        ]));

        // ── OCIO ──────────────────────────────────────────────────────
        $cat = Category::where('slug', 'ocio')->firstOrFail();

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Castillo de Santiago',
            'slug'    => 'castillo-de-santiago',
            'description' => 'Fortaleza del siglo XV con visitas guiadas y vistas panorámicas sobre la ciudad.',
            'address' => 'Plaza del Castillo de Santiago, s/n, Sanlúcar de Barrameda',
            'phone'   => '956 393 945',
            'hours'   => 'Mar-Dom 10:00-14:00, 17:00-20:00',
        ])->tags()->attach(array_filter([
            $tag('visita-guiada'),
            $tag('familiar'),
            $tag('para-grupos'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Parque Nacional de Doñana — Visitas',
            'slug'    => 'donana-visitas',
            'description' => 'Visitas guiadas en 4x4 al Parque Nacional de Doñana desde el embarcadero de Sanlúcar.',
            'address' => 'Bajo de Guía, s/n, Sanlúcar de Barrameda',
            'phone'   => '956 360 000',
            'hours'   => 'Mar-Dom 08:30-13:00',
        ])->tags()->attach(array_filter([
            $tag('visita-guiada'),
            $tag('para-grupos'),
        ]));

        // ── CULTURA ───────────────────────────────────────────────────
        $cat = Category::where('slug', 'cultura')->firstOrFail();

        Places::create([
            'category_id' => $cat->id,
            'name'        => 'Fábrica de Hielo',
            'slug'        => 'fabrica-de-hielo',
            'description' => 'Centro cultural en un edificio industrial rehabilitado a orillas del Guadalquivir.',
            'address'     => 'Calle Trastamara, s/n, Sanlúcar de Barrameda',
            'phone'       => '956 010 200',
            'hours'       => 'Mar-Sab 10:00-21:00',
        ])->tags()->attach(array_filter([
            $tag('entrada-gratuita'),
            $tag('familiar'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'        => 'Palacio de los Duques de Medina Sidonia',
            'slug'        => 'palacio-medina-sidonia',
            'description' => 'Uno de los archivos nobiliarios más importantes de Europa, con visitas guiadas al palacio.',
            'address'     => 'Plaza Condes de Niebla, 1, Sanlúcar de Barrameda',
            'phone'       => '956 360 161',
            'hours'       => 'Lun-Vie 10:00-14:00, 16:00-19:00',
        ])->tags()->attach(array_filter([
            $tag('visita-guiada'),
            $tag('audioguia'),
        ]));

        // ── NATURALEZA ────────────────────────────────────────────────
        $cat = Category::where('slug', 'naturaleza')->firstOrFail();

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Playa de la Calzada',
            'slug'    => 'playa-de-la-calzada',
            'description' => 'La playa urbana de Sanlúcar, perfecta para familias con aguas tranquilas del estuario.',
            'address' => 'Paseo Marítimo de la Calzada, Sanlúcar de Barrameda',
            'hours'   => 'Acceso libre',
        ])->tags()->attach(array_filter([
            $tag('primera-linea-playa'),
            $tag('accesible-playa'),
        ]));

        Places::create([
            'category_id' => $cat->id,
            'name'    => 'Playa de Bajo de Guía',
            'slug'    => 'playa-bajo-de-guia',
            'description' => 'Playa junto al barrio de pescadores, famosa por sus chiringuitos y vistas a Doñana.',
            'address' => 'Bajo de Guía, Sanlúcar de Barrameda',
            'hours'   => 'Acceso libre',
        ])->tags()->attach(array_filter([
            $tag('primera-linea-playa'),
            $tag('pet-friendly'),
        ]));

        $this->command->info('✅ PlacesSeeder: 18 lugares creados con etiquetas.');
    }
}