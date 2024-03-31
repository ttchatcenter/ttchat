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
        Schema::create('twitter_posts', function (Blueprint $table) {
            $table->string('tweet_id')->unique();
            $table->text('content')->nullable();
            $table->dateTime('created_at');
            $table->dateTime('createdate');
            $table->string('message_type');
            $table->string('referenced_tweet_id');
            $table->string('conversation_id');
            $table->string('in_reply_to_user_id');
            $table->int('chat_id');
            $table->int('brand_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('twitter_posts');
    }
};
