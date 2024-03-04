<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BrandCrm extends Model
{
    use HasFactory;

    public $table = "brand_crm";

    protected $fillable = [
        'brand_id',
        'link',
        'status',
    ];
}
