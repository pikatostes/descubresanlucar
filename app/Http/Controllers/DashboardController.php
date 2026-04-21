<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $requestedTab = $request->query('tab');
        $availableTabs = array_filter([
            'perfil',
            $user->role === 'owner' ? 'negocios' : null,
            $user->role === 'owner' ? 'pago' : null,
            'likes',
            $user->role === 'admin' ? 'admin' : null,
        ]);

        $activeTab = in_array($requestedTab, $availableTabs, true)
            ? $requestedTab
            : 'perfil';

        $ownerPlaces = [];
        if ($user->role === 'owner') {
            $ownerPlaces = $user->places()
                ->with(['category', 'tags:id', 'images', 'primaryImage'])
                ->latest()
                ->get();
        }

        $likedPlaces = $user->likes()
            ->with(['place.category', 'place.tags', 'place.images', 'place.primaryImage'])
            ->with(['place' => fn ($q) => $q->withCount('likes')])
            ->latest()
            ->get()
            ->map(fn ($like) => $like->place)
            ->filter()
            ->map(fn ($place) => [
                'id' => $place->id,
                'name' => $place->name,
                'slug' => $place->slug,
                'description' => $place->description,
                'address' => $place->address,
                'hours' => $place->hours,
                'image' => $place->image,
                'images' => $place->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                ])->values(),
                'category' => $place->category,
                'tags' => $place->tags,
                'likes_count' => $place->likes_count,
                'is_liked' => true,
            ]);

        return Inertia::render('Dashboard', [
            'ownerPlaces' => $ownerPlaces,
            'likedPlaces' => $likedPlaces,
            'categories' => Category::orderBy('label')->get(['id', 'label']),
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'activeTab' => $activeTab,
            'bankData' => $user->role === 'owner' ? $user->bankData : [],
        ]);
    }
}
