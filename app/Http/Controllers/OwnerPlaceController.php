<?php

namespace App\Http\Controllers;

use App\Models\Places;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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
            'tags'        => 'nullable|array',
            'tags.*'      => ['integer', Rule::exists('tags', 'id')->where(
                fn ($query) => $query->where('category_id', $request->input('category_id'))
            )],
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('places', 'public');
        }

        $place = $request->user()->places()->create(Arr::except($validated, ['tags']));
        $place->tags()->sync($validated['tags'] ?? []);

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
            'tags'        => 'nullable|array',
            'tags.*'      => ['integer', Rule::exists('tags', 'id')->where(
                fn ($query) => $query->where('category_id', $request->input('category_id'))
            )],
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Elimina la imagen anterior para no dejar archivos huérfanos
            if ($place->image) {
                Storage::disk('public')->delete($place->image);
            }

            $validated['image'] = $request->file('image')->store('places', 'public');
        } else {
            unset($validated['image']);
        }

        $place->update(Arr::except($validated, ['tags']));
        $place->tags()->sync($validated['tags'] ?? []);

        return back()->with('success', 'Negocio actualizado correctamente.');
    }
}
