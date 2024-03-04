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
        Schema::table('brand_members', function (Blueprint $table) {
            $table->integer('current_ticket_1')->default(0);
            $table->integer('current_ticket_2')->default(0);
            $table->integer('current_ticket_3')->default(0);
            $table->integer('current_ticket_4')->default(0);
            $table->dateTime('latest_assigned')->nullable()->default(NULL);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('brand_members', function (Blueprint $table) {
            $table->dropColumn('current_ticket_1');
            $table->dropColumn('current_ticket_2');
            $table->dropColumn('current_ticket_3');
            $table->dropColumn('current_ticket_4');
            $table->dropColumn('latest_assigned');
        });
    }
};
