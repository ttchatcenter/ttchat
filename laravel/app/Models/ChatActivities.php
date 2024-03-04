<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatActivities extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'action',
        'actor',
        'to',
        'by_system',
    ];

    public function actor_user()
    {
        return $this->belongsTo(User::class, 'actor', 'id');
    }

    public function to_user()
    {
        return $this->belongsTo(User::class, 'to', 'id');
    }
}
