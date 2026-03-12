<?php

namespace App\Http\Controllers;

use App\Models\Places;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OwnerPlaceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'address'     => 'nullable|string|max:255',
            'phone'       => 'nullable|string|max:30',
            'hours'       => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $place = $request->user()->places()->create($validated);

        return redirect()->route('dashboard')->with('success', 'Negocio creado correctamente.');
    }

    public function update(Request $request, Places $place)
    {
        Gate::authorize('update', $place);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'address'     => 'nullable|string|max:255',
            'phone'       => 'nullable|string|max:30',
            'hours'       => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $place->update($validated);

        return back()->with('success', 'Negocio actualizado correctamente.');
    }
}
