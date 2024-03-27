<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chats extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'platform_id',
        'customer_name',
        'customer_id',
        'customer_profile',
        'source',
        'status',
        'note',
        'assignee',
        'latest_message',
        'latest_message_time',
        'unread_count',
        'replied_at',
        'closed_at',
    ];

    public function gen_uuid()
    {
        return sprintf( '%04x%04x%04x%04x%04x',
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000
        );
    }

    public function assigned()
    {
        return $this->belongsTo(User::class, 'assignee', 'id');
    }


    public function platform()
    {
        return $this->belongsTo(Platform::class, 'platform_id', 'id');
    }

    public function fbPost()
    {
        return $this->belongsTo(FacebookPosts::class, 'id', 'chat_id');
    }
    public function twPost()
    {
        return $this->belongsTo(TwitterPosts::class, 'id', 'chat_id');
    }
}
