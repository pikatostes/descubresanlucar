<?php

namespace App\Policies;

use App\Models\Places;
use App\Models\User;

class PlacesPolicy
{
    /**
     * Solo el propietario del negocio puede actualizarlo.
     * Se comprueba contra la columna 'role' directa de la tabla users.
     */
    public function update(User $user, Places $place): bool
    {
        return $user->role === 'owner'
            && $place->user_id === $user->id;
    }
}