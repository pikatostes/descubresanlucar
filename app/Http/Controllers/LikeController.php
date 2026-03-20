<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Places;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function store(Request $request, Places $place): RedirectResponse
    {
        $request->user()->likes()->firstOrCreate([
            'place_id' => $place->id,
        ]);

        return back()->with('success', 'Like agregado correctamente.');
    }

    public function destroy(Request $request, Places $place): RedirectResponse
    {
        $request->user()->likes()->where('place_id', $place->id)->delete();

        return back()->with('success', 'Like eliminado correctamente.');
    }
}
