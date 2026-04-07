<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Like;
use App\Models\Places;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExploreController extends Controller
{
    public function index(Request $request)
    {
        $categorySlug = $request->query('categoria');
        $legacyCategoryId = $request->query('category');
        $search = trim((string) $request->query('search', ''));
        $userId = Auth::id();

        $categories = Category::with('tags')->orderBy('label')->get();
        $selectedCategory = null;

        if ($categorySlug) {
            $selectedCategory = $categories->firstWhere('slug', $categorySlug);
        } elseif ($legacyCategoryId) {
            $selectedCategory = $categories->firstWhere('id', (int) $legacyCategoryId);
        }

        $placesQuery = Places::with('category', 'tags', 'images', 'primaryImage')
            ->withCount('likes');

        if ($search !== '') {
            $placesQuery->where('name', 'like', '%'.$search.'%');
        }

        $places = $placesQuery->latest()->get();

        $likedPlaceIds = $userId
            ? Like::where('user_id', $userId)->pluck('place_id')->all()
            : [];

        return Inertia::render('Explore', [
            'categories' => $categories,
            'places' => $places->map(fn ($place) => [
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
                'category' => $place->category,
                'tags' => $place->tags,
                'likes_count' => $place->likes_count,
                'is_liked' => in_array($place->id, $likedPlaceIds),
            ]),
            'selectedCategory' => $selectedCategory?->id,
            'search' => $search,
        ]);
    }
}
