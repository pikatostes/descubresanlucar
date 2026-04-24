<?php

namespace App\Policies;

use App\Models\BankData;
use App\Models\User;

class BankDataPolicy
{
    public function update(User $user, BankData $bankData): bool
    {
        return $user->id === $bankData->user_id;
    }

    public function delete(User $user, BankData $bankData): bool
    {
        return $user->id === $bankData->user_id;
    }
}
