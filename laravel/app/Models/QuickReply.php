<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuickReply extends Model
{
    use HasFactory;

    public $table = "quick_reply";

    protected $fillable = [
        'brand_id',
        'title',
        'message',
    ];

    // one to many table quick_reply_image
    public function quickReplyImage()
    {
        return $this->hasMany(QuickReplyImage::class);
    }
}
