<?php

namespace App\Http\Controllers;

use App\Events\SurveyResponseSubmitted;
use App\Models\Survey;
use Illuminate\Http\Request;

class PublicSurveyController extends Controller
{
    // نمایش سروی برای پرکردن (بدون لاگین)
    public function show(Survey $survey)
    {
        abort_if(!$survey->is_active, 404, 'این نظرسنجی دیگر فعال نیست');

        return $survey->load('questions.options');
    }

    // ثبت جواب‌ها
    public function submit(Request $request, Survey $survey)
    {
        abort_if(!$survey->is_active, 404, 'این نظرسنجی دیگر فعال نیست');

        $validated = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.question_option_id' => 'nullable|exists:question_options,id',
            'answers.*.question_option_ids' => 'nullable|array',
            'answers.*.text_value' => 'nullable|string',
            'answers.*.rating_value' => 'nullable|integer|min:1|max:5',
        ]);

        $identifier = $request->session()->getId() ?: (string) $request->ip() . '-' . $request->userAgent();

        $existing = $survey->responses()->where('respondent_identifier', $identifier)->first();
        abort_if($existing, 409, 'شما قبلاً به این نظرسنجی پاسخ داده‌اید');

        $response = $survey->responses()->create([
            'respondent_identifier' => $identifier,
            'submitted_at' => now(),
        ]);

        foreach ($validated['answers'] as $answer) {
            $response->answers()->create($answer);
        }

        broadcast(new SurveyResponseSubmitted($survey->id));

        return response()->json(['message' => 'با تشکر از شرکت شما در نظرسنجی'], 201);
    }
}