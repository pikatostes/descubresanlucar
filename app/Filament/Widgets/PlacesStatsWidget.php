<?php

namespace App\Filament\Widgets;

use App\Models\Places;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PlacesStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Places', Places::count())
                ->description('Lugares registrados')
                ->icon('heroicon-o-map-pin'),
        ];
    }
}
