<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('account_holder');
            $table->string('iban')->encrypted();
            $table->string('bic_swift')->encrypted();
            $table->string('bank_name')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_data');
    }
};