<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("UPDATE places SET hours = NULL WHERE hours IS NOT NULL AND hours != '' AND JSON_VALID(hours) = 0");

        Schema::table('places', function (Blueprint $table) {
            $table->json('hours')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('places', function (Blueprint $table) {
            $table->string('hours')->nullable()->change();
        });
    }
};