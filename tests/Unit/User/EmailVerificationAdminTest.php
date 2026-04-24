<?php

namespace Tests\Unit\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmailVerificationAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_admin_can_mark_user_email_as_verified(): void
    {
        $user = User::factory()->unverified()->create();

        $user->update(['email_verified_at' => now()]);

        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    public function test_admin_can_mark_user_email_as_unverified(): void
    {
        $user = User::factory()->create();

        $user->update(['email_verified_at' => null]);

        $this->assertNull($user->fresh()->email_verified_at);
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_admin_can_revoke_email_verification(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($user->hasVerifiedEmail());

        $user->update(['email_verified_at' => null]);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_email_verification_timestamp_is_stored(): void
    {
        $verificationTime = now();
        $user = User::factory()->unverified()->create();

        $user->update(['email_verified_at' => $verificationTime]);

        $this->assertEquals($verificationTime->format('Y-m-d H:i:s'), $user->fresh()->email_verified_at->format('Y-m-d H:i:s'));
    }

    public function test_unverified_user_has_null_verification_date(): void
    {
        $user = User::factory()->unverified()->create();

        $this->assertNull($user->email_verified_at);
    }

    public function test_verified_user_has_verification_date(): void
    {
        $user = User::factory()->create();

        $this->assertNotNull($user->email_verified_at);
    }
}