<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Like;
use App\Models\Places;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $likedPlaceIds = $userId
            ? Like::where('user_id', $userId)->pluck('place_id')->all()
            : [];

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,

            'places' => Places::with(['category', 'tags', 'images', 'primaryImage'])
                ->withCount('likes')
                ->get()
                ->map(fn ($place) => [
                    'id' => $place->id,
                    'name' => $place->name,
                    'slug' => $place->slug,
                    'description' => $place->description,
                    'address' => $place->address,
                    'image' => $place->image,
                    'images' => $place->images->map(fn ($image) => [
                        'id' => $image->id,
                        'url' => $image->url,
                        'is_primary' => $image->is_primary,
                        'sort_order' => $image->sort_order,
                    ])->values(),
                    'rating' => $place->rating,
                    'featured' => $place->featured,
                    'likes_count' => $place->likes_count,
                    'is_liked' => in_array($place->id, $likedPlaceIds),
                    'category' => $place->category ? [
                        'slug' => $place->category->slug,
                        'label' => $place->category->label,
                        'icon' => $place->category->icon,
                    ] : null,
                    'tags' => $place->tags->pluck('slug')->toArray(),
                ]),

            'categories' => Category::with('tags')->get()->map(fn ($cat) => [
                'id' => $cat->id,
                'slug' => $cat->slug,
                'label' => $cat->label,
                'icon' => $cat->icon,
                'tags' => $cat->tags->map(fn ($tag) => [
                    'id' => $tag->id,
                    'slug' => $tag->slug,
                    'label' => $tag->name,
                ])->values(),
            ]),
        ]);
    }
}
