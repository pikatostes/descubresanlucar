<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Places;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function show(Places $place)
    {
        return Inertia::render('PlaceShow', [
            'place' => $place,
        ]);
    }
}
