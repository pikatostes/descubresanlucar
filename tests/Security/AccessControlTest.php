<?php

namespace Tests\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccessControlTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_guest_cannot_access_protected_routes(): void
    {
        $response = $this->get('/dashboard');
        $response->assertStatus(302);
    }

    public function test_regular_user_cannot_access_admin_panel(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin');

        $response->assertStatus(403);
    }

    public function test_admin_user_can_access_admin_panel(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertStatus(200);
    }

    public function test_user_cannot_modify_other_user_profile(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $response = $this->actingAs($user1)->patch('/profile', [
            'name' => 'Hacked Name',
            'email' => $user2->email,
        ]);

        $this->assertNotEquals('Hacked Name', $user2->fresh()->name);
    }

    public function test_user_cannot_delete_other_user_account(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $response = $this->actingAs($user1)->delete('/profile', [
            'password' => 'password',
        ]);

        $this->assertNotNull($user2->fresh());
    }

    public function test_unverified_user_can_still_login(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
    }

    public function test_user_with_deleted_account_cannot_login(): void
    {
        $user = User::factory()->create();
        $user->delete();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
    }
}