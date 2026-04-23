<?php

namespace Tests\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_password_is_never_stored_in_plain_text(): void
    {
        $plainPassword = 'MySecretPassword123!';

        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => $plainPassword,
        ]);

        $user = $user->fresh();

        $this->assertNotEquals($plainPassword, $user->password);
        $this->assertTrue(Hash::check($plainPassword, $user->password));
    }

    public function test_different_users_have_different_hashes_for_same_password(): void
    {
        $password = 'SamePassword123';

        $user1 = User::create([
            'name' => 'User 1',
            'email' => 'user1@example.com',
            'password' => $password,
        ]);

        $user2 = User::create([
            'name' => 'User 2',
            'email' => 'user2@example.com',
            'password' => $password,
        ]);

        $this->assertNotEquals($user1->password, $user2->password);
    }

    public function test_password_cannot_be_updated_with_empty_value(): void
    {
        $user = User::factory()->create();
        $originalPassword = $user->password;

        $user->update(['password' => '']);

        $this->assertNotEquals('', $user->fresh()->password);
    }

    public function test_login_fails_with_incorrect_password(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('correct-password'),
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_remember_token_is_generated(): void
    {
        $user = User::factory()->create();

        $this->assertNotNull($user->remember_token);
        $this->assertEquals(10, strlen($user->remember_token));
    }
}