<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubcategoryLevel2 extends Model
{
    use HasFactory;
    
    public $table = "subcategory_level2";

    protected $fillable = [
        'name',
        'code',
        'brand_id',
        'category_id',
        'subcategory_level1_id'
    ];
}

