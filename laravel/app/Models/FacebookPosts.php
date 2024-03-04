<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacebookPosts extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'post_id',
        'post_url',
        'comment_id',
    ];
}
