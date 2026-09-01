<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SensorApiController extends Controller
{
    public function store(Request $request)
    {
        // Bypass proteksi CORS biar Wemos lu lancar nembak API
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

        if ($request->getMethod() == "OPTIONS") {
            return response()->json(['status' => 'OK'], 200);
        }

        // 1. Ambil data asli dari Wemos D1 Mini bray
        $kelembaban  = $request->input('kelembaban', 0);
        $statusEmber = $request->input('status_ember', 'Kosong');
        $statusPompa = $request->input('status_pompa', 'Mati'); 

        try {
            // 2. Deteksi otomatis tipe data kolom 'pompa_on' di MySQL
            $columnInfo = DB::select("SHOW COLUMNS FROM sensor_logs LIKE 'pompa_on'");
            $type = isset($columnInfo[0]) ? strtolower($columnInfo[0]->Type) : 'string';

            if (str_contains($type, 'int') || str_contains($type, 'bit')) {
                $nilaiPompaAkhir = (strtolower($statusPompa) === 'hidup' || $statusPompa == '1') ? 1 : 0;
            } else {
                $nilaiPompaAkhir = $statusPompa;
            }

            // 3. AMBIL JAM SEKARANG DI LAPTOP (WIB - ASIA/JAKARTA) MURNI PAKE CARBON BRAY!
            $waktuLokalSekarang = Carbon::now('Asia/Jakarta');

            // 4. Eksekusi simpan ke database MySQL
            DB::table('sensor_logs')->insert([
                'kelembaban'   => $kelembaban,
                'status_ember' => $statusEmber,
                'pompa_on'     => $nilaiPompaAkhir,
                // KUNCI UTAMA: Kita abaikan jam kiriman Wemos, paksa pake jam laptop lu detik ini juga!
                'created_at'   => $waktuLokalSekarang,
                'updated_at'   => $waktuLokalSekarang
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Jam lokal sinkron total bray!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}