<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatConstant extends Model
{
    use HasFactory;
    protected $table = 'chat_constant'; // ระบุชื่อตาราง

    protected $fillable = [
        'code',
        'channel_name',
        'value',
        'value2',
        'tw_userid',
        'twitter_bearer_token',
        'twitter_client_id',
        'twitter_client_secret',
        'twitter_access_token',
        'twitter_access_token_secret',
        'twitter_redirect_url',
        'twitter_code_challenge',
        // เพิ่มฟิลด์อื่นๆ ที่ต้องการเก็บลงในฐานข้อมูลได้ตามต้องการ
    ];

}
