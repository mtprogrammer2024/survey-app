<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SurveyResponseSubmitted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $surveyId;

    public function __construct(int $surveyId)
    {
        $this->surveyId = $surveyId;
    }

    public function broadcastOn(): array
    {
        return [new Channel('survey.' . $this->surveyId)];
    }

    public function broadcastAs(): string
    {
        return 'SurveyResponseSubmitted';
    }
}