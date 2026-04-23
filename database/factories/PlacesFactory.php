<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Places;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Places>
 */
class PlacesFactory extends Factory
{
    protected $model = Places::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => fake()->company(),
            'slug' => null,
            'description' => fake()->paragraph(),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'hours' => '09:00 - 21:00',
        ];
    }
}