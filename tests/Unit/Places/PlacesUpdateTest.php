<?php

namespace Tests\Unit\Places;

use App\Models\Category;
use App\Models\Places;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlacesUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_place_name_can_be_updated(): void
    {
        $category = Category::factory()->create();
        $place = Places::factory()->create(['category_id' => $category->id]);

        $place->update(['name' => 'Updated Name']);

        $this->assertEquals('Updated Name', $place->fresh()->name);
    }

    public function test_place_slug_updates_when_name_changes(): void
    {
        $category = Category::factory()->create();
        $place = Places::factory()->create([
            'category_id' => $category->id,
            'name' => 'Original Name',
        ]);

        $place->update(['name' => 'New Name']);

        $this->assertEquals('new-name', $place->fresh()->slug);
    }

    public function test_place_description_can_be_updated(): void
    {
        $category = Category::factory()->create();
        $place = Places::factory()->create([
            'category_id' => $category->id,
            'description' => 'Original description',
        ]);

        $place->update(['description' => 'Updated description']);

        $this->assertEquals('Updated description', $place->fresh()->description);
    }

    public function test_place_address_can_be_updated(): void
    {
        $category = Category::factory()->create();
        $place = Places::factory()->create([
            'category_id' => $category->id,
            'address' => 'Old Address',
        ]);

        $place->update(['address' => 'New Address 456']);

        $this->assertEquals('New Address 456', $place->fresh()->address);
    }

    public function test_place_phone_can_be_updated(): void
    {
        $category = Category::factory()->create();
        $place = Places::factory()->create([
            'category_id' => $category->id,
            'phone' => '123456789',
        ]);

        $place->update(['phone' => '987654321']);

        $this->assertEquals('987654321', $place->fresh()->phone);
    }

    public function test_place_hours_can_be_updated(): void
    {
        $category = Category::factory()->create();
        $place = Places::factory()->create([
            'category_id' => $category->id,
            'hours' => '09:00 - 18:00',
        ]);

        $place->update(['hours' => '10:00 - 22:00']);

        $this->assertEquals('10:00 - 22:00', $place->fresh()->hours);
    }

    public function test_place_category_can_be_changed(): void
    {
        $category1 = Category::factory()->create();
        $category2 = Category::factory()->create();
        $place = Places::factory()->create(['category_id' => $category1->id]);

        $place->update(['category_id' => $category2->id]);

        $this->assertEquals($category2->id, $place->fresh()->category_id);
    }

    public function test_place_slug_keeps_unique_on_update(): void
    {
        $category = Category::factory()->create();

        $place1 = Places::factory()->create([
            'category_id' => $category->id,
            'name' => 'Same Name',
        ]);
        $place2 = Places::factory()->create([
            'category_id' => $category->id,
            'name' => 'Same Name',
        ]);

        $place1->update(['name' => 'Same Name']);

        $this->assertEquals('same-name', $place1->fresh()->slug);

        $place2->update(['name' => 'Same Name']);

        $this->assertEquals('same-name-1', $place2->fresh()->slug);
    }
}