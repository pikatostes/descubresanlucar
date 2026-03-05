<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Places;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'places' => Places::with('category')->get(),
            'categories' => Category::all(),
        ]);
    }
}