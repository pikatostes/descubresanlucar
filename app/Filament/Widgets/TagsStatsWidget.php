<?php

namespace App\Filament\Widgets;

use App\Models\Tag;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TagsStatsWidget extends BaseWidget
{
    protected int | string | array $columnSpan = [
        'md' => 1,
        'xl' => 1,
    ];

    protected function getStats(): array
    {
        return [
            Stat::make('Total Tags', Tag::count())
                ->description('Etiquetas disponibles')
                ->icon('heroicon-o-tag'),
        ];
    }
}
