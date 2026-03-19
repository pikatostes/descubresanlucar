<?php

namespace App\Filament\Widgets;

use App\Models\Places;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentPlacesWidget extends BaseWidget
{
    protected static ?int $sort = 99;

    protected int | string | array $columnSpan = 'full';

    protected function getTableHeading(): string
    {
        return 'Lugares Recientes';
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(Places::latest()->take(5))
            ->columns([
                ImageColumn::make('image')
                    ->square()
                    ->size(40),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('category.label')
                    ->label('Category')
                    ->sortable(),
                TextColumn::make('address')
                    ->searchable()
                    ->limit(30),
            ])
            ->paginated(false);
    }
}
