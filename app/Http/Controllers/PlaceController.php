<?php

namespace App\Http\Controllers;

use App\Models\Places;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function show(Places $place)
    {
        $place->load(['category', 'tags', 'images', 'primaryImage']);
        $place->loadCount('likes');
        $userId = Auth::id();

        return Inertia::render('PlaceShow', [
            'place' => [
                'id' => $place->id,
                'name' => $place->name,
                'slug' => $place->slug,
                'description' => $place->description,
                'address' => $place->address,
                'phone' => $place->phone,
                'hours' => $place->hours,
                'image' => $place->image,
                'images' => $place->images->map(fn ($image) => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'is_primary' => $image->is_primary,
                    'sort_order' => $image->sort_order,
                ])->values(),
                'gallery' => $place->images->pluck('url')->values(),
                'category' => $place->category,
                'tags' => $place->tags,
                'rating' => $place->rating,
                'featured' => $place->featured,
                'latitude' => $place->latitude,
                'longitude' => $place->longitude,
                'email' => $place->email,
                'website' => $place->website,
                'price_range' => $place->price_range,
                'likes_count' => $place->likes_count,
                'is_liked' => $userId ? $place->likes()->where('user_id', $userId)->exists() : false,
            ],
        ]);
    }
}
