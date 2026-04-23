<?php

namespace Tests\Unit\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_user_can_be_created_with_valid_data(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);

        $this->assertTrue(Hash::check('password123', $user->password));
    }

    public function test_user_email_must_be_unique(): void
    {
        User::create([
            'name' => 'First User',
            'email' => 'duplicate@example.com',
            'password' => Hash::make('password123'),
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        User::create([
            'name' => 'Second User',
            'email' => 'duplicate@example.com',
            'password' => Hash::make('password123'),
        ]);
    }

    public function test_user_password_is_hashed(): void
    {
        $plainPassword = 'secretPassword123';

        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => $plainPassword,
        ]);

        $this->assertNotEquals($plainPassword, $user->password);
        $this->assertTrue(Hash::check($plainPassword, $user->password));
    }

    public function test_user_can_authenticate_with_correct_credentials(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'auth@example.com',
            'password' => Hash::make('correctPassword'),
        ]);

        $this->assertTrue(Hash::check('correctPassword', $user->password));
        $this->assertFalse(Hash::check('wrongPassword', $user->password));
    }
}