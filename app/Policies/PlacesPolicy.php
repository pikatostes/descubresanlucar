<?php

namespace App\Policies;

use App\Models\Places;
use App\Models\User;

class PlacesPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('owner');
    }

    public function view(User $user, Places $place): bool
    {
        return $user->hasRole('admin') || $user->id === $place->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('owner');
    }

    public function update(User $user, Places $place): bool
    {
        return $user->hasRole('admin') || $user->id === $place->user_id;
    }

    public function delete(User $user, Places $place): bool
    {
        return $user->hasRole('admin');
    }

    public function restore(User $user, Places $place): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Places $place): bool
    {
        return $user->hasRole('admin');
    }
}