<?php

namespace Tests\Unit\Places;

use App\Models\Category;
use App\Models\Places;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlacesCreationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_place_can_be_created_with_valid_data(): void
    {
        $category = Category::factory()->create();

        $place = Places::create([
            'category_id' => $category->id,
            'name' => 'Test Place',
            'description' => 'A nice test place',
            'address' => 'Test Street 123',
            'phone' => '123456789',
            'hours' => '09:00 - 18:00',
        ]);

        $this->assertDatabaseHas('places', [
            'name' => 'Test Place',
            'address' => 'Test Street 123',
        ]);
    }

    public function test_place_slug_is_auto_generated(): void
    {
        $category = Category::factory()->create();

        $place = Places::create([
            'category_id' => $category->id,
            'name' => 'My Test Place',
            'description' => 'Description',
            'address' => 'Test Address',
        ]);

        $this->assertEquals('my-test-place', $place->fresh()->slug);
    }

    public function test_place_name_is_required(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Places::create([
            'category_id' => 1,
            'name' => '',
            'address' => 'Test',
        ]);
    }

    public function test_place_address_is_required(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Places::create([
            'category_id' => 1,
            'name' => 'Test Place',
        ]);
    }

    public function test_place_category_is_required(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Places::create([
            'name' => 'Test Place',
            'address' => 'Test Address',
        ]);
    }
}