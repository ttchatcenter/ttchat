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
        Schema::create('chat_constant', function (Blueprint $table) {
            $table->integer('code');
            $table->string('channel_name');
            $table->string('value');
            $table->string('value2');
            $table->string('tw_userid');
            $table->string('twitter_bearer_token');
            $table->string('twitter_client_id');
            $table->string('twitter_client_secret');
            $table->string('twitter_access_token');
            $table->string('twitter_access_token_secret');
            $table->string('twitter_redirect_url');
            $table->string('twitter_code_challenge');
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
        //
    }
};
