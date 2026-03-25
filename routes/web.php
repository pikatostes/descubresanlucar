<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\OwnerPlaceController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index']);

// Páginas legales
Route::get('/privacidad', fn () => Inertia::render('Privacidad'))->name('privacidad');
Route::get('/terminos', fn () => Inertia::render('Terminos'))->name('terminos');
Route::get('/contacto', fn () => Inertia::render('Contacto'))->name('contacto');

Route::get('/lugares/{place}', [PlaceController::class, 'show'])->name('places.show');

Route::get('/categorias', [CategoryController::class, 'index'])->name('categories.index');

Route::get('/explorar', [ExploreController::class, 'index'])->name('explore.index');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');

    // Propietario: crear negocio
    Route::post('/owner/places', [OwnerPlaceController::class, 'store'])
        ->name('owner.places.store');

    // Propietario: actualizar sus negocios
    Route::post('/owner/places/{place}', [OwnerPlaceController::class, 'update'])
        ->name('owner.places.update');

    Route::post('/lugares/{place}/likes', [LikeController::class, 'store'])
        ->name('likes.store');
    Route::delete('/lugares/{place}/likes', [LikeController::class, 'destroy'])
        ->name('likes.destroy');
});

require __DIR__.'/auth.php';
