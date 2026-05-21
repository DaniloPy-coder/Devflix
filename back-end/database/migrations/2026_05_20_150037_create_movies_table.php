<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();
            
            $table->string('title', 255); 
            $table->text('overview')->nullable(); 
            
            $table->string('poster_path', 2048)->nullable(); 
            
            $table->date('release_date')->nullable();
            
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};