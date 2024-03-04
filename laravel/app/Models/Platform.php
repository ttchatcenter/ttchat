<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Platform extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'name',
        'platform_id',
        'platform_secret',
        'status',
        'type',
    ];

}
