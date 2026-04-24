<?php

namespace App\Filament\Widgets;

use App\Models\Category;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CategoriesStatsWidget extends BaseWidget
{
    protected int|string|array $columnSpan = [
        'md' => 1,
        'xl' => 1,
    ];

    protected function getStats(): array
    {
        return [
            Stat::make('Total Categories', cache()->remember('categories_count', 300, fn () => Category::count()))
                ->description('Categorías disponibles')
                ->icon('heroicon-o-folder'),
        ];
    }
}
