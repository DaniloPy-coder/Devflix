<?php

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::post('/register', function (Request $request) {
    $dadosValidados = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
    ]);

    $dadosValidados['password'] = Hash::make($dadosValidados['password']);
    $user = User::create($dadosValidados);

    return response()->json([
        'message' => 'Usuário criado com sucesso!',
        'user' => $user
    ], 201);
});

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (!$user || !Hash::check($credentials['password'], $user->password)) {
        return response()->json([
            'message' => 'E-mail ou senha incorretos.'
        ], 401);
    }

    return response()->json([
        'message' => 'Login realizado com sucesso!',
        'user' => $user
    ], 200);
});

Route::options('{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');