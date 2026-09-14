<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'response_id', 'question_id', 'question_option_id',
        'question_option_ids', 'text_value', 'rating_value',
    ];
    protected $casts = ['question_option_ids' => 'array'];

    public function response() { return $this->belongsTo(Response::class); }
    public function question() { return $this->belongsTo(Question::class); }
}