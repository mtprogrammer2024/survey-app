<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicSurveyController;
use App\Http\Controllers\SurveyController;
use Illuminate\Support\Facades\Route;

// ---------- Auth ----------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ---------- مدیریت سروی توسط سازنده (نیاز به لاگین) ----------
    Route::get('/surveys', [SurveyController::class, 'index']);
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::get('/surveys/{survey}', [SurveyController::class, 'show']);
    Route::put('/surveys/{survey}', [SurveyController::class, 'update']);
    Route::delete('/surveys/{survey}', [SurveyController::class, 'destroy']);
    Route::get('/surveys/{survey}/results', [SurveyController::class, 'results']);
});

// ---------- دسترسی عمومی برای پرکردن سروی (بدون لاگین) ----------
Route::get('/public/surveys/{survey}', [PublicSurveyController::class, 'show']);
Route::post('/public/surveys/{survey}/submit', [PublicSurveyController::class, 'submit']);