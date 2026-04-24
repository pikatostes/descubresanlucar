<?php

namespace Tests\Unit\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_user_name_can_be_updated(): void
    {
        $user = User::factory()->create();

        $user->update(['name' => 'Updated Name']);

        $this->assertEquals('Updated Name', $user->fresh()->name);
    }

    public function test_user_email_can_be_updated(): void
    {
        $user = User::factory()->create();

        $user->update(['email' => 'newemail@example.com']);

        $this->assertEquals('newemail@example.com', $user->fresh()->email);
    }

    public function test_user_password_can_be_updated(): void
    {
        $user = User::factory()->create();

        $user->update(['password' => 'newpassword']);

        $this->assertTrue(Hash::check('newpassword', $user->fresh()->password));
    }

    public function test_user_google_id_can_be_updated(): void
    {
        $user = User::factory()->create();

        $user->update(['google_id' => 'new-google-id']);

        $this->assertEquals('new-google-id', $user->fresh()->google_id);
    }

    public function test_user_avatar_can_be_updated(): void
    {
        $user = User::factory()->create();

        $user->update(['avatar' => 'new-avatar.jpg']);

        $this->assertEquals('new-avatar.jpg', $user->fresh()->avatar);
    }

    public function test_user_can_be_assigned_admin_role(): void
    {
        $user = User::factory()->create();

        $user->assignRole('admin');

        $this->assertTrue($user->fresh()->hasRole('admin'));
    }

    public function test_user_can_be_removed_from_admin_role(): void
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $user->removeRole('admin');

        $this->assertFalse($user->fresh()->hasRole('admin'));
    }

    public function test_user_email_must_be_unique_on_update(): void
    {
        $user1 = User::factory()->create(['email' => 'user1@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);

        $user2->update(['email' => 'user1@example.com']);
    }
}