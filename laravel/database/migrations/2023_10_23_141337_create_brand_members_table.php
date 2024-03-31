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
        Schema::create('brand_members', function (Blueprint $table) {
            $table->id();
            $table->integer('brand_id');
            $table->integer('user_id');
            $table->string('display_name');
            $table->enum('role', ['admin', 'supervisor']);
            $table->enum('status', ['active', 'inactive']);
            $table->enum('platform_1', ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter', 'dm', 'none'])->default('none');
            $table->enum('platform_2', ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter', 'dm', 'none'])->default('none');
            $table->enum('platform_3', ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter', 'dm', 'none'])->default('none');
            $table->enum('platform_4', ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter', 'dm', 'none'])->default('none');
            $table->enum('platform_5', ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter', 'dm', 'none'])->default('none');
            $table->enum('platform_6', ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter', 'dm', 'none'])->default('none');
            $table->enum('platform_7', ['facebook', 'messenger', 'line', 'pantip', 'inbox','twitter', 'dm', 'none'])->default('none');
            $table->integer('concurrent_1')->default(0);
            $table->integer('concurrent_2')->default(0);
            $table->integer('concurrent_3')->default(0);
            $table->integer('concurrent_4')->default(0);
            $table->integer('concurrent_5')->default(0);
            $table->integer('concurrent_6')->default(0);
            $table->integer('concurrent_7')->default(0);
            $table->timestamps();

            $table->index('brand_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('brand_members');
    }
};
