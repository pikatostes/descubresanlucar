<?php

namespace Tests\Unit\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserCreationTest extends TestCase
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
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }

    public function test_user_name_is_required(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        User::create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);
    }

    public function test_user_email_is_required(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        User::create([
            'name' => 'Test User',
            'password' => Hash::make('password123'),
        ]);
    }

    public function test_user_password_is_hashed(): void
    {
        $plainPassword = 'secretPassword';

        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => $plainPassword,
        ]);

        $this->assertNotEquals($plainPassword, $user->password);
        $this->assertTrue(Hash::check($plainPassword, $user->password));
    }

    public function test_user_can_be_created_with_google_id(): void
    {
        $user = User::create([
            'name' => 'Google User',
            'email' => 'google@example.com',
            'password' => Hash::make('password123'),
            'google_id' => 'google-123456',
        ]);

        $this->assertEquals('google-123456', $user->google_id);
    }

    public function test_user_can_be_created_with_avatar(): void
    {
        $user = User::create([
            'name' => 'Avatar User',
            'email' => 'avatar@example.com',
            'password' => Hash::make('password123'),
            'avatar' => 'avatars/user-avatar.jpg',
        ]);

        $this->assertEquals('avatars/user-avatar.jpg', $user->avatar);
    }

    public function test_user_gets_default_user_role(): void
    {
        $user = User::create([
            'name' => 'Role Test User',
            'email' => 'role@example.com',
            'password' => Hash::make('password123'),
        ]);

        $this->assertTrue($user->hasRole('user'));
    }
}