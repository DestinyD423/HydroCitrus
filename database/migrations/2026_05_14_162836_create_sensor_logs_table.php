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
    Schema::create('sensor_logs', function (Blueprint $table) {
        $table->id();
        $table->float('kelembaban'); // Menyimpan angka kelembaban (0-100)
        $table->string('status_ember'); // Menyimpan teks 'Penuh' atau 'Kosong'
        $table->boolean('pompa_on'); // Menyimpan status 1 (Hidup) atau 0 (Mati)
        $table->timestamps(); // Mencatat waktu data masuk (untuk grafik)
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_logs');
    }
};
