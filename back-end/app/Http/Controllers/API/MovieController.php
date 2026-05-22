<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function index(Request $request)
    {
        try {
            $movies = Movie::with('genres')->latest()->get();
            return response()->json($movies, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao listar filmes.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title'        => 'required|string|max:255',
            'overview'     => 'nullable|string',
            'poster_path'  => 'nullable|string|max:2048',
            'release_date' => 'nullable|date',
            'genre_ids'    => 'nullable|array',
            'user_id'      => 'required',
        ]);

        try {
            $movie = Movie::create([
                'title'        => $validatedData['title'],
                'overview'     => $validatedData['overview'] ?? null,
                'poster_path'  => $validatedData['poster_path'] ?? null,
                'release_date' => $validatedData['release_date'] ?? null,
                'user_id'      => $validatedData['user_id'],
            ]);

            if (!empty($validatedData['genre_ids'])) {
                $movie->genres()->sync($validatedData['genre_ids']);
            }

            return response()->json($movie, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno ao salvar no banco de dados.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $movie = Movie::find($id);

            if (!$movie) {
                return response()->json(['message' => 'Filme não encontrado.'], 404);
            }

            if (method_exists($movie, 'genres')) {
                $movie->genres()->detach();
            }

            $movie->delete();

            return response()->json(['message' => 'Filme excluído com sucesso!'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao excluir o filme.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $movie = Movie::with('genres')->find($id);

            if (!$movie) {
                return response()->json(['message' => 'Filme não encontrado.'], 404);
            }

            return response()->json($movie, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar detalhes do filme.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}