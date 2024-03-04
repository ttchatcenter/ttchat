<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineChats extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'type',
        'content',
        'sender',
    ];
}
