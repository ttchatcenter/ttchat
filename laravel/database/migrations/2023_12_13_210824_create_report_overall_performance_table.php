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
        Schema::create('report_overall_performances', function (Blueprint $table) {
            $table->id();
            $table->integer('brand_id');
            $table->integer('platform_id')->nullable()->default(NULL);
            $table->dateTime('date_start');
            $table->dateTime('date_end');
            $table->integer('total_incoming_chat')->default(0);
            $table->integer('total_chat_handled')->default(0);
            $table->integer('total_no_response')->default(0);
            $table->integer('total_no_assigned')->default(0);
            $table->integer('total_abandon')->default(0);
            $table->string('avg_chat_handling_time')->nullable()->default(NULL);
            $table->string('avg_chat_response_time')->nullable()->default(NULL);
            $table->string('avg_waiting_time_in_queue')->nullable()->default(NULL);
            $table->string('percent_sla')->nullable()->default(NULL);
            $table->float('percent_sla_line', $precision = 8, $scale = 2)->nullable()->default(null);
            $table->float('percent_sla_facebook', $precision = 8, $scale = 2)->nullable()->default(null);
            $table->float('percent_sla_messenger', $precision = 8, $scale = 2)->nullable()->default(null);
            $table->float('percent_sla_pantip', $precision = 8, $scale = 2)->nullable()->default(null);
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
        Schema::dropIfExists('report_overall_performance');
    }
};
