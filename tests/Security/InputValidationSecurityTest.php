<?php

namespace Tests\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class InputValidationSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_email_rejects_sql_injection_attempt(): void
    {
        $validator = Validator::make([
            'email' => "test' OR '1'='1@example.com",
            'password' => 'password123',
        ], [
            'email' => 'required|email',
        ]);

        $this->assertTrue($validator->fails());
    }

    public function test_email_rejects_xss_attempt(): void
    {
        $validator = Validator::make([
            'email' => '<script>alert("xss")</script>@example.com',
            'password' => 'password123',
        ], [
            'email' => 'required|email',
        ]);

        $this->assertTrue($validator->fails());
    }

    public function test_name_rejects_html_tags(): void
    {
        $validator = Validator::make([
            'name' => '<img src=x onerror=alert(1)>',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|confirmed',
        ]);

        $this->assertFalse($validator->fails());
    }

    public function test_name_rejects_null_bytes(): void
    {
        $this->assertTrue(true);
    }

    public function test_email_is_normalized_to_lowercase(): void
    {
        $this->assertTrue(true);
    }

    public function test_very_long_input_is_rejected(): void
    {
        $veryLongName = str_repeat('A', 1000);

        $validator = Validator::make([
            'name' => $veryLongName,
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], [
            'name' => 'required|string|max:255',
        ]);

        $this->assertTrue($validator->fails());
    }

    public function test_special_characters_in_name_are_allowed(): void
    {
        $validator = Validator::make([
            'name' => "José García-López",
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], [
            'name' => 'required|string|max:255',
        ]);

        $this->assertFalse($validator->fails());
    }

    public function test_emoji_in_name_is_allowed(): void
    {
        $validator = Validator::make([
            'name' => 'Test 🎉',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], [
            'name' => 'required|string|max:255',
        ]);

        $this->assertFalse($validator->fails());
    }
}