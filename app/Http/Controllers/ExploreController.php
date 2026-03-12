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
        
        $categories = Category::with('tags')->orderBy('label')->get();
        
        $placesQuery = Places::with('category', 'tags');
        
        if ($categoryId) {
            $placesQuery->where('category_id', $categoryId);
        }
        
        $places = $placesQuery->latest()->get();
        
        return Inertia::render('Explore', [
            'categories' => $categories,
            'places' => $places,
            'selectedCategory' => $categoryId ? (int) $categoryId : null,
        ]);
    }
}
