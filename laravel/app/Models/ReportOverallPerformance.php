<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportOverallPerformance extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'platform_id',
        'date_start',
        'date_end',
        'total_incoming_chat',
        'total_chat_handled',
        'total_no_response',
        'total_no_assigned',
        'total_abandon',
        'avg_chat_handling_time',
        'avg_chat_response_time',
        'avg_waiting_time_in_queue',
        'percent_sla',
        'percent_sla_line',
        'percent_sla_facebook',
        'percent_sla_messenger',
        'percent_sla_pantip'
    ];
}
