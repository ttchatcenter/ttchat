<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TwitterPosts extends Model
{
    use HasFactory;
    protected $table = 'twitter_posts'; // ระบุชื่อตาราง

    protected $fillable = [
        'tweet_id',
        'content',
        'created_at',
        'createdate',
        'message_type',
        'conversation_id',
        'in_reply_to_user_id',
        'chat_id',
        // เพิ่มฟิลด์อื่นๆ ที่ต้องการเก็บลงในฐานข้อมูลได้ตามต้องการ
    ];

    // protected $casts = [
    //     'edit_history_tweet_ids' => 'array', // กำหนดให้ฟิลด์นี้มีรูปแบบข้อมูลเป็น array
    //     'referenced_tweets' => 'array', // กำหนดให้ฟิลด์นี้มีรูปแบบข้อมูลเป็น array
    //     // เพิ่มการแปลงข้อมูลอื่นๆ ตามต้องการ
    // ];

}
