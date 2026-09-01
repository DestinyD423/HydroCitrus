<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB; 
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

// 1. ROUTE Dashboard
Route::get('/dashboard', function () {
    $logTerbaru = DB::table('sensor_logs')->latest()->first();
    $logGrafik = DB::table('sensor_logs')
                    ->latest()
                    ->take(12)
                    ->get()
                    ->reverse() 
                    ->map(function($item) {
                        return [
                            'waktu' => date('H:i', strtotime($item->created_at)), 
                            'kelembaban' => $item->kelembaban 
                        ];
                    });

    return Inertia::render('Dashboard', [
        'kelembabanTanah' => $logTerbaru ? $logTerbaru->kelembaban : 0, 
        'statusEmber' => $logTerbaru ? $logTerbaru->status_ember : 'Kosong',
        'statusPompa' => $logTerbaru ? $logTerbaru->pompa_on : 'Mati', 
        'chartData' => $logGrafik->values()->all(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// 2. ROUTE Analytics (SUDAH DI-BENERIN, ANTI 0% BRAY!)
Route::get('/analytics', function () {
    $logTerbaru = DB::table('sensor_logs')->latest()->first();
    $logsAll = DB::table('sensor_logs')->get();

    // Set nilai default kalau database kosong biar gak crash
    if ($logsAll->isEmpty()) {
        return Inertia::render('Analytics', [
            'currentKelembaban' => 0,
            'logs' => [],
            'stats' => [
                'rata_rata'  => 0,
                'tertinggi'  => 0,
                'terendah'   => 0,
                'stabilitas' => 100
            ],
            'chart_distribusi' => ['kering' => 0, 'sedang' => 0, 'lembab' => 0],
            'frekuensi_ember'  => ['penuh' => 0, 'kosong' => 0]
        ]);
    }

    // HITUNG AGREGAT KELEMBABAN BERDASARKAN DATA ASLI
    $rataRata  = round($logsAll->avg('kelembaban'), 1);
    $tertinggi = intval($logsAll->max('kelembaban'));
    $terendah  = intval($logsAll->min('kelembaban'));

    // HITUNG TREN DISTRIBUSI KELEMBABAN
    $kering = DB::table('sensor_logs')->where('kelembaban', '<', 40)->count();
    $sedang = DB::table('sensor_logs')->whereBetween('kelembaban', [40, 70])->count();
    $lembab = DB::table('sensor_logs')->where('kelembaban', '>', 70)->count();

    // HITUNG FREKUENSI STATUS EMBER (Mencegah masalah huruf besar/kecil)
    $emberPenuh  = DB::table('sensor_logs')->where('status_ember', 'LIKE', 'Penuh')->count();
    $emberKosong = DB::table('sensor_logs')->where('status_ember', 'LIKE', 'Kosong')->count();

    // List 10 log terbaru bawaan kode lu
    $allLogs = DB::table('sensor_logs')
                    ->latest()
                    ->take(10)
                    ->get()
                    ->map(function($item) {
                        return [
                            'id' => $item->id,
                            'tanggal' => date('d/m/Y H:i', strtotime($item->created_at)),
                            'kelembabanTanah' => $item->kelembaban . '%', 
                            'statusEmber' => $item->status_ember,
                            'status_pompa' => $item->pompa_on, 
                        ];
                    });

    return Inertia::render('Analytics', [
        'currentKelembaban' => $logTerbaru ? $logTerbaru->kelembaban : 0, 
        'logs' => $allLogs,
        // OPER DATA STATS BARU BIAR GA 0% LAGI NJIR!
        'stats' => [
            'rata_rata'  => $rataRata,
            'tertinggi'  => $tertinggi,
            'terendah'   => $terendah,
            'stabilitas' => 100
        ],
        'chart_distribusi' => [
            'kering' => $kering,
            'sedang' => $sedang,
            'lembab' => $lembab
        ],
        'frekuensi_ember' => [
            'penuh'  => $emberPenuh,
            'kosong' => $emberKosong
        ]
    ]);
})->middleware(['auth', 'verified'])->name('analytics');

// 3. ROUTE History (SUDAH ADA FILTER TANGGAL ANTI-LAG JAM PAGI)
Route::get('/history', function (Request $request) {
    $tanggalMulai = $request->input('tanggal_mulai');
    $tanggalAkhir = $request->input('tanggal_akhir');

    $query = DB::table('sensor_logs');

    // Jika user memfilter rentang tanggal di web
    if ($tanggalMulai && $tanggalAkhir) {
        $mulai = $tanggalMulai . ' 00:00:00';
        $akhir = $tanggalAkhir . ' 23:59:59'; // Paksa ke akhir hari biar data jam pagi keangkut bray!
        $query->whereBetween('created_at', [$mulai, $akhir]);
    }

    $allLogs = $query->latest()
                    ->get()
                    ->map(function($item) {
                        return [
                            'id' => $item->id,
                            'tanggal' => date('d/m/Y H:i', strtotime($item->created_at)),
                            'kelembabanTanah' => $item->kelembaban . '%', 
                            'statusEmber' => $item->status_ember,
                            'status_pompa' => $item->pompa_on, 
                        ];
                    });

    return Inertia::render('History', [
        'logs' => $allLogs,
    ]);
})->middleware(['auth', 'verified'])->name('history');

// 3.1 RUTE KHUSUS DOWNLOAD CSV (FIX TOTAL ANTI-CRASH DI PHP_MYADMIN LU BRAY!)
Route::get('/download-csv', function (Request $request) {
    $tanggalMulai = $request->input('tanggal_mulai'); // Isinya format murni HTML: YYYY-MM-DD
    $tanggalAkhir = $request->input('tanggal_akhir'); // Isinya format murni HTML: YYYY-MM-DD

    $query = DB::table('sensor_logs');

    // FIX COK: Jika salah satu tanggal kosong, kita otomatis set ke hari ini biar ga alert zonk!
    if ($tanggalMulai || $tanggalAkhir) {
        $start = $tanggalMulai ? $tanggalMulai : date('Y-m-d');
        $end = $tanggalAkhir ? $tanggalAkhir : date('Y-m-d');

        // Gunakan DATE() murni MySQL untuk membandingkan format YYYY-MM-DD bawaan phpMyAdmin lu!
        $query->whereRaw("DATE(created_at) BETWEEN ? AND ?", [$start, $end]);
    }

    $logs = $query->latest()->get();

    // JIKA DATA TETEP KOSONG DI RENTANG ITU
    if ($logs->isEmpty()) {
        return response("<script>alert('Tidak ada data untuk rentang tanggal yang dipilih'); window.history.back();</script>");
    }

    $filename = "HydroCitrus_Log_" . date('Ymd_His') . ".csv";
    
    $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => 'attachment; filename="' . $filename . '"',
    ];

    $callback = function() use ($logs) {
        $handle = fopen('php://output', 'w');
        fputcsv($handle, ['ID', 'Tanggal Log', 'Kelembaban Tanah', 'Status Ember', 'Status Pompa']);

        foreach ($logs as $log) {
            fputcsv($handle, [
                $log->id,
                // Kita balikin ke format Indo pas di dalam Excel biar dosen lu seneng bray
                date('d/m/Y H:i', strtotime($log->created_at)),
                $log->kelembaban . '%',
                $log->status_ember,
                ($log->pompa_on == 1 || strtolower($log->pompa_on) == 'hidup') ? 'Hidup' : 'Mati'
            ]);
        }
        fclose($handle);
    };

    return response()->stream($callback, 200, $headers);
})->middleware(['auth'])->name('download.csv');

// 4. ROUTE DESAIN 3D: 
Route::get('/design-3d', function () {
    return Inertia::render('Design3D');
})->middleware(['auth', 'verified'])->name('design3d');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';