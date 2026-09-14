<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    // لیست سروی‌های خود کاربر لاگین‌کرده
    public function index(Request $request)
    {
        return $request->user()->surveys()
            ->withCount('responses')
            ->latest()
            ->get();
    }

    // ساخت سروی جدید همراه با سوال‌ها و گزینه‌ها
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.text' => 'required|string|max:500',
            'questions.*.type' => 'required|in:single_choice,multiple_choice,rating,text',
            'questions.*.required' => 'boolean',
            'questions.*.options' => 'required_if:questions.*.type,single_choice,multiple_choice|array',
            'questions.*.options.*' => 'string|max:255',
        ]);

        $survey = $request->user()->surveys()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        foreach ($validated['questions'] as $index => $q) {
            $question = $survey->questions()->create([
                'text' => $q['text'],
                'type' => $q['type'],
                'order' => $index,
                'required' => $q['required'] ?? true,
            ]);

            if (in_array($q['type'], ['single_choice', 'multiple_choice']) && !empty($q['options'])) {
                foreach ($q['options'] as $optIndex => $optText) {
                    $question->options()->create([
                        'text' => $optText,
                        'order' => $optIndex,
                    ]);
                }
            }
        }

        return response()->json($survey->load('questions.options'), 201);
    }

    // نمایش یک سروی همراه با سوال‌ها (فقط برای صاحبش)
    public function show(Request $request, Survey $survey)
    {
        $this->authorizeOwner($request, $survey);

        return $survey->load('questions.options');
    }

    public function update(Request $request, Survey $survey)
    {
        $this->authorizeOwner($request, $survey);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $survey->update($validated);

        return $survey;
    }

    public function destroy(Request $request, Survey $survey)
    {
        $this->authorizeOwner($request, $survey);
        $survey->delete();

        return response()->json(['message' => 'حذف شد']);
    }

    // نتایج تجمیع‌شده برای نمودارها
    public function results(Request $request, Survey $survey)
    {
        $this->authorizeOwner($request, $survey);

        $survey->load('questions.options');
        $totalResponses = $survey->responses()->count();

        $questions = $survey->questions->map(function ($question) {
            $result = [
                'id' => $question->id,
                'text' => $question->text,
                'type' => $question->type,
            ];

            if (in_array($question->type, ['single_choice', 'multiple_choice'])) {
                $result['options'] = $question->options->map(function ($option) {
                    $count = Answer::where('question_option_id', $option->id)->count();
                    $countInMultiple = Answer::where('question_id', $option->question_id)
                        ->whereJsonContains('question_option_ids', $option->id)
                        ->count();

                    return [
                        'id' => $option->id,
                        'text' => $option->text,
                        'votes' => $count + $countInMultiple,
                    ];
                });
            } elseif ($question->type === 'rating') {
                $avg = $question->answers()->avg('rating_value');
                $result['average'] = $avg ? round($avg, 2) : 0;
            } else {
                $result['answers'] = $question->answers()->pluck('text_value')->filter()->values();
            }

            return $result;
        });

        return response()->json([
            'total_responses' => $totalResponses,
            'questions' => $questions,
        ]);
    }

    private function authorizeOwner(Request $request, Survey $survey): void
    {
        abort_if($survey->user_id !== $request->user()->id, 403, 'اجازه دسترسی نداری');
    }
}