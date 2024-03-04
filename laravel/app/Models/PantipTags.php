<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PantipTags extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'keyword',
        'created_by',
        'updated_by',
        'status',
    ];

    public function createdUser()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function updatedUser()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
