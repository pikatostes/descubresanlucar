<?php

namespace App\Http\Controllers;

use App\Models\Places;
use App\Models\PlaceImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
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
            'images'      => 'required|array|min:1',
            'images.*'    => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        DB::transaction(function () use ($request, $validated): void {
            $place = $request->user()->places()->create(Arr::except($validated, ['tags', 'images']));
            $place->tags()->sync($validated['tags'] ?? []);

            $this->storeUploadedImages($place, $request->file('images', []));
        });

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
            'images'      => 'nullable|array',
            'images.*'    => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        DB::transaction(function () use ($request, $validated, $place): void {
            $place->update(Arr::except($validated, ['tags', 'images']));
            $place->tags()->sync($validated['tags'] ?? []);

            $uploadedImages = $request->file('images', []);
            if (!empty($uploadedImages)) {
                $this->storeUploadedImages($place, $uploadedImages);
            }
        });

        return back()->with('success', 'Negocio actualizado correctamente.');
    }

    /**
     * @param  array<int, UploadedFile>  $uploadedImages
     */
    private function storeUploadedImages(Places $place, array $uploadedImages): void
    {
        if (empty($uploadedImages)) {
            return;
        }

        $nextSortOrder = ((int) $place->images()->max('sort_order')) + 1;
        $hasPrimaryImage = $place->images()->where('is_primary', true)->exists();

        foreach ($uploadedImages as $index => $image) {
            $path = $image->store('places', 'public');

            $place->images()->create([
                'path' => $path,
                'is_primary' => !$hasPrimaryImage && $index === 0,
                'sort_order' => $nextSortOrder + $index,
            ]);
        }

        $this->ensurePrimaryImage($place);
    }

    private function ensurePrimaryImage(Places $place): void
    {
        $hasPrimary = $place->images()->where('is_primary', true)->exists();

        if ($hasPrimary) {
            return;
        }

        $firstImage = $place->images()->orderBy('sort_order')->orderBy('id')->first();

        if ($firstImage instanceof PlaceImage) {
            $firstImage->update(['is_primary' => true]);
        }
    }
}
