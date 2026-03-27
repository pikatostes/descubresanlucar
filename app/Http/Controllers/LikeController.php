<?php

namespace App\Http\Controllers;

use App\Models\Places;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, Places $place): JsonResponse
    {
        $like = $request->user()->likes()
            ->where('place_id', $place->id)
            ->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $request->user()->likes()->create(['place_id' => $place->id]);
            $liked = true;
        }

        return response()->json([
            'liked' => $liked,
            'count' => $place->likes()->count(),
        ]);
    }
}
