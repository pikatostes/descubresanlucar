<?php

namespace App\Filament\Resources\PlacesResource\Pages;

use App\Filament\Resources\PlacesResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPlaces extends EditRecord
{
    protected static string $resource = PlacesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
