<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PlacesResource\Pages;
use App\Models\Category;
use App\Models\Places;
use App\Models\Tag;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PlacesResource extends Resource
{
    protected static ?string $model = Places::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()
            ->with(['category', 'primaryImage', 'images']);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('category_id')
                    ->label('Category')
                    ->options(fn () => Category::all()->pluck('label', 'id'))
                    ->searchable()
                    ->required(),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('address')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->tel()
                    ->maxLength(20)
                    ->default(null),
                Forms\Components\TextInput::make('hours')
                    ->label('Horario (JSON)')
                    ->hint('Formato: {"monday": [{"open": "09:00", "close": "20:00"}]}')
                    ->default(null),
                Forms\Components\Repeater::make('images')
                    ->relationship('images')
                    ->minItems(1)
                    ->schema([
                        Forms\Components\FileUpload::make('path')
                            ->label('Imagen')
                            ->image()
                            ->disk('public')
                            ->directory('places')
                            ->required(),
                        Forms\Components\Toggle::make('is_primary')
                            ->label('Principal')
                            ->default(false),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Orden')
                            ->numeric()
                            ->default(0)
                            ->required(),
                    ])
                    ->columns(3)
                    ->columnSpanFull(),
                Forms\Components\Select::make('tags')
                    ->relationship('tags', 'name')
                    ->multiple()
                    ->options(fn () => Tag::query()->orderBy('name')->pluck('name', 'id'))
                    ->searchable()
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('category.label')
                    ->label('Category')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('address')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('hours')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('primaryImage.path')
                    ->disk('public')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPlaces::route('/'),
            'create' => Pages\CreatePlaces::route('/create'),
            'edit' => Pages\EditPlaces::route('/{record}/edit'),
        ];
    }
}
