<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['survey_id', 'text', 'type', 'order', 'required'];
    protected $casts = ['required' => 'boolean'];

    public function survey() { return $this->belongsTo(Survey::class); }
    public function options() { return $this->hasMany(QuestionOption::class)->orderBy('order'); }
    public function answers() { return $this->hasMany(Answer::class); }
}