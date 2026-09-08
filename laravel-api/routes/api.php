<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::get('/v1/health', static fn (): JsonResponse => response()->json([
    'status' => 'ok',
    'timestamp' => now()->toISOString(),
]))->name('api.v1.health');
