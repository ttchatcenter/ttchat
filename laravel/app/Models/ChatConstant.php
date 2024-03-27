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
        // เพิ่มฟิลด์อื่นๆ ที่ต้องการเก็บลงในฐานข้อมูลได้ตามต้องการ
    ];

}
