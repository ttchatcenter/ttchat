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
        Schema::create('chat_activities', function (Blueprint $table) {
            $table->id();
            $table->integer('chat_id');
            $table->string('action');
            $table->integer('actor')->nullable()->default(NULL);
            $table->boolean('by_system')->default(false);
            $table->timestamps();
            $table->index('chat_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chat_activities');
    }
};
