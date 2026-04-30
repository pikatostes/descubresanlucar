<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ImageValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
        $this->seed(\Database\Seeders\CategorySeeder::class);
    }

    protected function authenticate(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
    }

    protected function getCategoryId(): int
    {
        return Category::first()->id;
    }

    public function test_valid_jpeg_image_is_accepted(): void
    {
        $this->authenticate();

        $image = UploadedFile::fake()->image('test.jpg', 800, 600);

        $response = $this->post('/owner/places', [
            'name' => 'Test Place',
            'description' => 'Test description',
            'address' => 'Calle Test 123',
            'category_id' => $this->getCategoryId(),
            'images' => [$image],
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_valid_png_image_is_accepted(): void
    {
        $this->authenticate();

        $image = UploadedFile::fake()->image('test.png', 800, 600);

        $response = $this->post('/owner/places', [
            'name' => 'Test Place',
            'description' => 'Test description',
            'address' => 'Calle Test 123',
            'category_id' => $this->getCategoryId(),
            'images' => [$image],
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_valid_webp_image_is_accepted(): void
    {
        $this->authenticate();

        $response = $this->post('/owner/places', [
            'name' => 'Test Place',
            'description' => 'Test description',
            'address' => 'Calle Test 123',
            'category_id' => 1,
            'images' => [UploadedFile::fake()->image('test.webp', 800, 600)],
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_image_exceeding_max_size_is_rejected(): void
    {
        $this->authenticate();

        $image = UploadedFile::fake()->image('test.jpg', 800, 600)->size(3000);

        $response = $this->post('/owner/places', [
            'name' => 'Test Place',
            'description' => 'Test description',
            'address' => 'Calle Test 123',
            'category_id' => $this->getCategoryId(),
            'images' => [$image],
        ]);

        $response->assertRedirect();
    }

    public function test_non_image_file_is_rejected(): void
    {
        $this->authenticate();

        $file = UploadedFile::fake()->create('document.pdf', 1024);

        $response = $this->post('/owner/places', [
            'name' => 'Test Place',
            'description' => 'Test description',
            'address' => 'Calle Test 123',
            'category_id' => $this->getCategoryId(),
            'images' => [$file],
        ]);

        $response->assertRedirect();
    }

    public function test_script_file_is_rejected(): void
    {
        $this->authenticate();

        $file = UploadedFile::fake()->create('malicious.php', 1024, 'application/octet-stream');

        $response = $this->post('/owner/places', [
            'name' => 'Test Place',
            'description' => 'Test description',
            'address' => 'Calle Test 123',
            'category_id' => $this->getCategoryId(),
            'images' => [$file],
        ]);

        $response->assertRedirect();
    }
}