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
        Schema::create('pantip_tags', function (Blueprint $table) {
            $table->id();
            $table->integer('brand_id');
            $table->string('keyword');
            $table->integer('created_by');
            $table->integer('updated_by')->nullable()->default(NULL);
            $table->enum('status', ['active', 'inactive']);
            $table->timestamps();

            $table->index('brand_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pantip_tags');
    }
};
