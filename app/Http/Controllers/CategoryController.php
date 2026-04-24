<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('label')->get();

        return Inertia::render('CategoryIndex', [
            'categories' => $categories,
        ]);
    }
}
