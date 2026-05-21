<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    
    public function index()
    {
        $movies = Movie::with('genres')->latest()->get();
        
        return response()->json($movies, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'overview' => 'nullable|string',
            'poster_path' => 'nullable|string|max:2048',
            'release_date' => 'nullable|date',
            'genre_ids' => 'required|array', 
            'genre_ids.*' => 'exists:genres,id', 
        ]);

        
        $movie = Movie::create([
            'title' => $validatedData['title'],
            'overview' => $validatedData['overview'] ?? null,
            'poster_path' => $validatedData['poster_path'] ?? null,
            'release_date' => $validatedData['release_date'] ?? null,
            'user_id' => 1, 
        ]);

        
        $movie->genres()->sync($validatedData['genre_ids']);

        return response()->json($movie->load('genres'), 210);
    }
}