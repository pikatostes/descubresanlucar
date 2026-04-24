<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('place_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('place_id')->constrained('places')->cascadeOnDelete();
            $table->string('path');
            $table->boolean('is_primary')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['place_id', 'is_primary']);
            $table->index(['place_id', 'sort_order']);
        });

        if (Schema::hasColumn('places', 'image')) {
            $legacyImages = DB::table('places')
                ->select('id', 'image')
                ->whereNotNull('image')
                ->where('image', '!=', '')
                ->get();

            $now = now();

            foreach ($legacyImages as $legacyImage) {
                DB::table('place_images')->insert([
                    'place_id' => $legacyImage->id,
                    'path' => $legacyImage->image,
                    'is_primary' => true,
                    'sort_order' => 0,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            Schema::table('places', function (Blueprint $table) {
                $table->dropColumn('image');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('places', 'image')) {
            Schema::table('places', function (Blueprint $table) {
                $table->string('image')->nullable()->after('hours');
            });
        }

        $placeIds = DB::table('place_images')->distinct()->pluck('place_id');

        foreach ($placeIds as $placeId) {
            $row = DB::table('place_images')
                ->where('place_id', $placeId)
                ->orderByDesc('is_primary')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->first();

            if (!$row) {
                continue;
            }

            DB::table('places')
                ->where('id', $placeId)
                ->update(['image' => $row->path]);
        }

        Schema::dropIfExists('place_images');
    }
};
