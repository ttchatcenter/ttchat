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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('username')->unique();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('status', ['active', 'inactive']);
            $table->enum('role', ['super_admin', 'supervisor', 'admin'])->nullable()->default(NULL);
            $table->boolean('is_reset_password')->nullable()->default(0);
            $table->dateTime('changed_password_at')->nullable()->default(NULL);
            $table->string('profile_pic')->nullable()->default(NULL);
            $table->string('tel')->nullable()->default(NULL);
            $table->rememberToken();
            $table->softDeletes();
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
        Schema::dropIfExists('users');
    }
};
