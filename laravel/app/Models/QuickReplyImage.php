<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuickReplyImage extends Model
{
    use HasFactory;

    public $table = "quick_reply_image";
    protected $fillable = [
        'quick_reply_id',
        'image',
    ];
}
