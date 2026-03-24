<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlaceImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'place_id',
        'path',
        'is_primary',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected $appends = [
        'url',
    ];

    protected static function booted(): void
    {
        static::saving(function (PlaceImage $image): void {
            if ($image->is_primary && $image->place_id) {
                self::query()
                    ->where('place_id', $image->place_id)
                    ->whereKeyNot($image->id)
                    ->update(['is_primary' => false]);
            }
        });
    }

    public function place(): BelongsTo
    {
        return $this->belongsTo(Places::class, 'place_id');
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}
