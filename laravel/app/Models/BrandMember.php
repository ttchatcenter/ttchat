<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'user_id',
        'status',
        'display_name',
        'platform_1',
        'platform_2',
        'platform_3',
        'platform_4',
        'concurrent_1',
        'concurrent_2',
        'concurrent_3',
        'concurrent_4',
        'current_ticket_1',
        'current_ticket_2',
        'current_ticket_3',
        'current_ticket_4',
        'latest_assigned',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
