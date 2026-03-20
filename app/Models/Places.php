<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'image',
        // 'tags' eliminado: ya no es columna JSON, ahora es relación pivot
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

    public function likedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'likes', 'place_id', 'user_id');
    }

    protected function image(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn($value) => $value ? asset('storage/' . $value) : null,
        );
    }
}
