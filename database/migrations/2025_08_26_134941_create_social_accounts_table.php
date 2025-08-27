<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('workos_id')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->text('avatar')->nullable()->change();
        });
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('workos_id', 'password');
        });
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->string('provider_id')->unique();
            $table->string('provider_name');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->change();
            $table->string('email')->change();
            $table->text('avatar')->change();
        });
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('password', 'workos_id');
        });
        Schema::dropIfExists('social_accounts');
    }
};
