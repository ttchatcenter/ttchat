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
        Schema::create('user_status_logs', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->enum('status', ['idle', 'available', 'awc', 'break', 'toilet', 'meeting', 'consult', 'training', 'special_assign'])->nullable()->default(NULL);
            $table->timestamp('started_at', $precision = 0)->nullable()->default(NULL);
            $table->timestamp('ended_at', $precision = 0)->nullable()->default(NULL);
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_status_log');
    }
};
