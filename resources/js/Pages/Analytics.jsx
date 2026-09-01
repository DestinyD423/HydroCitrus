import { TrendingUp, TrendingDown, Activity, Droplets } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Speedometer from '@/Components/Speedometer'; 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Analytics({ auth, logs = [], currentKelembaban = 0, stats, chart_distribusi, frekuensi_ember }) {
    
    // REVISI SAKTI: Langsung ambil angka asli dari string (contoh "99%" dirubah langsung jadi 99 murni!)
    const kelembabanValues = logs.length > 0 ? logs.map((log) => {
        // Hapus lambang % lalu ubah string menjadi angka integer biasa bray!
        return log.kelembabanTanah ? parseInt(log.kelembabanTanah.replace('%', '')) : 0;
    }) : [0];

    // Jika backend mengirim stats lengkap, pakai data dari backend bray
    // Kalau belum ada, dia otomatis nge-fallback pakai kalkulasi lokal di bawah ini
    const rataRata = stats ? Math.round(stats.rata_rata) : Math.round(kelembabanValues.reduce((a, b) => a + b, 0) / kelembabanValues.length);
    const tertinggi = stats ? stats.tertinggi : Math.max(...kelembabanValues);
    const terendah = stats ? stats.terendah : Math.min(...kelembabanValues);
    
    const variance = kelembabanValues.reduce((acc, val) => acc + Math.pow(val - rataRata, 2), 0) / kelembabanValues.length;
    const stabilitasScore = stats ? stats.stabilitas : (logs.length > 0 ? Math.max(0, 100 - Math.round(Math.sqrt(variance))) : 0);

    // Menyesuaikan frekuensi ember berdasarkan data olahan database
    const statusEmberData = frekuensi_ember ? [
        { name: 'Penuh', value: frekuensi_ember.penuh },
        { name: 'Kosong', value: frekuensi_ember.kosong },
    ] : [
        { name: 'Penuh', value: logs.filter(l => l.statusEmber === 'Penuh' || l.statusEmber === 'penuh').length || 1 },
        { name: 'Kosong', value: logs.filter(l => l.statusEmber === 'Kosong' || l.statusEmber === 'kosong').length || 0 },
    ];

    // Menyesuaikan distribusi grafik berdasarkan data olahan database bray!
    const distribusiGabungan = chart_distribusi ? [
        { kategori: 'Kering', jumlah: chart_distribusi.kering },
        { kategori: 'Sedang', jumlah: chart_distribusi.sedang },
        { kategori: 'Lembab', jumlah: chart_distribusi.lembab },
    ] : [
        { kategori: 'Kering', jumlah: kelembabanValues.filter(v => v <= 30).length },
        { kategori: 'Sedang', jumlah: kelembabanValues.filter(v => v > 30 && v <= 60).length },
        { kategori: 'Lembab', jumlah: kelembabanValues.filter(v => v > 60).length },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Analisis Data" />
            
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Rata-rata" value={rataRata} icon={<Activity className="text-orange-500" />} label="Kelembaban" />
                    <StatCard title="Tertinggi" value={tertinggi} icon={<TrendingUp className="text-green-500" />} label="Kelembaban" />
                    <StatCard title="Terendah" value={terendah} icon={<TrendingDown className="text-red-500" />} label="Kelembaban" />
                    <StatCard title="Stabilitas" value={stabilitasScore} icon={<Droplets className="text-blue-500" />} label="Skor Sistem" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-700 mb-8 uppercase text-xs tracking-widest">Tren Distribusi Kelembaban</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={distribusiGabungan}>
                                <defs>
                                    <linearGradient id="colorJumlah" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="kategori" axisLine={false} tickLine={false} style={{fontSize: '11px', fontWeight: 'bold'}} />
                                <YAxis axisLine={false} tickLine={false} style={{fontSize: '11px'}} />
                                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="jumlah" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorJumlah)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <h3 className="font-black text-gray-700 mb-8 uppercase text-xs tracking-widest w-full text-center">Frekuensi Status Ember</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={statusEmberData} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#f97316" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex space-x-8 mt-6 text-[10px] font-black">
                            <span className="text-blue-500">● PENUH</span>
                            <span className="text-orange-500">● KOSONG</span>
                        </div>
                    </div>
                </div>

                {/* Kesimpulan Analisis */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <h3 className="text-xl font-black mb-6 flex items-center">
                        <Activity className="mr-3 text-orange-500" /> Kesimpulan Analisis
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-gray-300">
                        <li>• Rata-rata kelembaban: <span className="text-white font-bold">{rataRata}%</span></li>
                        <li>• Skor stabilitas: <span className="text-blue-400 font-bold">{stabilitasScore}%</span></li>
                        <li>• Status Tanaman: <span className="text-orange-500 font-black underline">{currentKelembaban > 50 ? 'Optimal' : 'Perlu Monitoring'}</span></li>
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon, label }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
            <div className="flex justify-between w-full mb-4 items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</span>
                {icon}
            </div>
            <div className="w-24 mb-2">
                <Speedometer value={value} />
            </div>
            <span className="text-xl font-black text-gray-800">{value}%</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{label}</span>
        </div>
    );
}