<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // La tabla users tiene columna 'role' directa (varchar)
        $ownerPlaces = [];
        if ($user->role === 'owner') {
            $ownerPlaces = $user->places()
                ->with('category')
                ->latest()
                ->get();
        }

        return Inertia::render('Dashboard', [
            'ownerPlaces' => $ownerPlaces,
            // La tabla categories usa 'label' como nombre visible
            'categories'  => Category::orderBy('label')->get(['id', 'label']),
        ]);
    }
}