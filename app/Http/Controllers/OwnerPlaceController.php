<?php

namespace App\Http\Controllers;

use App\Models\Places;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

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
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('places', 'public');
        }

        $request->user()->places()->create($validated);

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
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Elimina la imagen anterior para no dejar archivos huérfanos
            if ($place->image) {
                Storage::disk('public')->delete($place->image);
            }

            $validated['image'] = $request->file('image')->store('places', 'public');
        }

        $place->update($validated);

        return back()->with('success', 'Negocio actualizado correctamente.');
    }
}