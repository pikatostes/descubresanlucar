<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Places;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExploreController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->query('category');
        $search = trim((string) $request->query('search', ''));

        $categories = Category::with('tags')->orderBy('label')->get();

        $placesQuery = Places::with('category', 'tags', 'images', 'primaryImage');

        if ($search !== '') {
            $placesQuery->where('name', 'like', '%'.$search.'%');
        }

        $places = $placesQuery->latest()->get();

        return Inertia::render('Explore', [
            'categories' => $categories,
            'places' => $places,
            'selectedCategory' => $categoryId ? (int) $categoryId : null,
            'search' => $search,
        ]);
    }
}
