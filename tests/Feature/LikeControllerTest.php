<?php

namespace Tests\Feature;

use App\Models\Places;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LikeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    public function test_guest_cannot_toggle_like(): void
    {
        $place = Places::factory()->create();

        $response = $this->postJson(route('likes.toggle', $place));

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_like_place(): void
    {
        $user = User::factory()->create();
        $place = Places::factory()->create();

        $response = $this->actingAs($user)->postJson(route('likes.toggle', $place));

        $response->assertOk()
            ->assertJson([
                'liked' => true,
            ]);

        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'place_id' => $place->id,
        ]);
    }

    public function test_authenticated_user_can_unlike_place(): void
    {
        $user = User::factory()->create();
        $place = Places::factory()->create();
        $user->likes()->create(['place_id' => $place->id]);

        $response = $this->actingAs($user)->postJson(route('likes.toggle', $place));

        $response->assertOk()
            ->assertJson([
                'liked' => false,
            ]);

        $this->assertDatabaseMissing('likes', [
            'user_id' => $user->id,
            'place_id' => $place->id,
        ]);
    }

    public function test_like_returns_correct_count(): void
    {
        $users = User::factory()->count(3)->create();
        $place = Places::factory()->create();

        $users[0]->likes()->create(['place_id' => $place->id]);
        $users[1]->likes()->create(['place_id' => $place->id]);

        $response = $this->actingAs($users[2])->postJson(route('likes.toggle', $place));

        $response->assertOk()
            ->assertJson([
                'liked' => true,
                'count' => 3,
            ]);
    }

    public function test_user_cannot_like_nonexistent_place(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('likes.toggle', ['place' => 9999]));

        $response->assertStatus(404);
    }

    public function test_user_cannot_like_soft_deleted_place(): void
    {
        $user = User::factory()->create();
        $place = Places::factory()->create();
        $place->delete();

        $response = $this->actingAs($user)->postJson(route('likes.toggle', $place));

        $response->assertStatus(404);
    }

    public function test_like_toggle_is_idempotent(): void
    {
        $user = User::factory()->create();
        $place = Places::factory()->create();

        $this->actingAs($user)->postJson(route('likes.toggle', $place));
        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'place_id' => $place->id,
        ]);

        $this->actingAs($user)->postJson(route('likes.toggle', $place));
        $this->assertDatabaseMissing('likes', [
            'user_id' => $user->id,
            'place_id' => $place->id,
        ]);

        $this->actingAs($user)->postJson(route('likes.toggle', $place));
        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'place_id' => $place->id,
        ]);
    }

    public function test_like_response_includes_count(): void
    {
        $user = User::factory()->create();
        $otherUsers = User::factory()->count(2)->create();
        $place = Places::factory()->create();

        $otherUsers[0]->likes()->create(['place_id' => $place->id]);

        $response = $this->actingAs($user)->postJson(route('likes.toggle', $place));

        $response->assertOk()
            ->assertJsonStructure([
                'liked',
                'count',
            ])
            ->assertJson([
                'liked' => true,
                'count' => 2,
            ]);
    }

    public function test_like_works_correctly_in_sequence(): void
    {
        $user = User::factory()->create();
        $place = Places::factory()->create();

        $like1 = $this->actingAs($user)->postJson(route('likes.toggle', $place));
        $like1->assertJson(['liked' => true, 'count' => 1]);

        $like2 = $this->actingAs($user)->postJson(route('likes.toggle', $place));
        $like2->assertJson(['liked' => false, 'count' => 0]);

        $like3 = $this->actingAs($user)->postJson(route('likes.toggle', $place));
        $like3->assertJson(['liked' => true, 'count' => 1]);
    }
}