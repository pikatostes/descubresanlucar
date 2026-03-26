<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UsersStatsWidget extends BaseWidget
{
    protected int|string|array $columnSpan = [
        'md' => 1,
        'xl' => 1,
    ];

    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', cache()->remember('users_count', 300, fn () => User::count()))
                ->description('Usuarios registrados')
                ->icon('heroicon-o-users'),
        ];
    }
}
