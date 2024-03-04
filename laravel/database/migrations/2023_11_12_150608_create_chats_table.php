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
        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->integer('brand_id');
            $table->integer('platform_id')->nullable()->default(NULL);
            $table->string('customer_name')->nullable()->default(NULL);
            $table->string('customer_id')->nullable()->default(NULL);
            $table->string('customer_profile')->nullable()->default(NULL);
            $table->enum('source', ['facebook', 'messenger', 'line', 'pantip']);
            $table->string('status')->default('new');
            $table->string('note')->nullable()->default(NULL);
            $table->integer('assignee')->nullable()->default(NULL);
            $table->string('latest_message')->nullable()->default(NULL);
            $table->dateTime('latest_message_time')->nullable()->default(NULL);
            $table->integer('unread_count')->default(0);
            $table->timestamps();

            $table->index('brand_id');
            $table->index('platform_id');
            $table->index('source');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chats');
    }
};
