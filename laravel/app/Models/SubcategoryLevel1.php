<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubcategoryLevel1 extends Model
{
    use HasFactory;

    public $table = "subcategory_level1";
    
    protected $fillable = [
        'name',
        'code',
        'brand_id',
        'category_id'
    ];
}

