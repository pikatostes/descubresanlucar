<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Places extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'address',
        'phone',
        'hours',
        'latitude',
        'longitude',
    ];

    protected $appends = [
        'image',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Etiquetas via tabla pivot place_tag.
     * Nombres de FK explícitos para evitar ambigüedad.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'place_tag', 'place_id', 'tag_id');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class, 'place_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PlaceImage::class, 'place_id')->orderBy('sort_order')->orderBy('id');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(PlaceImage::class, 'place_id')->where('is_primary', true);
    }

    public function likedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'likes', 'place_id', 'user_id');
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: function () {
                $primary = $this->relationLoaded('primaryImage')
                    ? $this->getRelation('primaryImage')
                    : $this->primaryImage()->first();

                if ($primary) {
                    return $primary->url;
                }

                $firstImage = $this->relationLoaded('images')
                    ? $this->getRelation('images')->sortBy('sort_order')->first()
                    : $this->images()->first();

                return $firstImage?->url;
            },
        );
    }
}
