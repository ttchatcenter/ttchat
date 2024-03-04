<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subcategory_level2', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable()->default(NULL);
            $table->integer('brand_id');
            $table->integer('category_id');
            $table->integer('subcategory_level1_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subcategory_level2');
    }
};
