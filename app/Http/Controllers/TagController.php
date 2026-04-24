<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    // Obtener todas las tags
    public function index()
    {
        $tags = Tag::all();

        return response()->json($tags);
    }
}
