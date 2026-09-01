import { useState } from 'react';
import { Download } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function History({ auth, logs = [] }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // FILTER LOKAL HANYA UNTUK TAMPILAN TABEL DI LAYAR WEB LU BRAY
    const filteredLogs = logs.filter((log) => {
        if (!startDate && !endDate) return true;

        // Potong string tanggal bawaan DB lu '07/06/2026 22:35' jadi murni tanggal
        const parts = log.tanggal.split(' ')[0].split('/');
        const logDay = parseInt(parts[0], 10);
        const logMonth = parseInt(parts[1], 10) - 1;
        const logYear = parseInt(parts[2], 10);
        const logDateObj = new Date(logYear, logMonth, logDay);

        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2100-12-31');

        logDateObj.setHours(0,0,0,0);
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);

        return logDateObj >= start && logDateObj <= end;
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Riwayat Log" />
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Mulai</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Akhir</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* REVISI FIX: Tombol diubah jadi tag <a> murni untuk direct download ke Laravel backend bray! */}
                        <a
                            href={`/download-csv?tanggal_mulai=${startDate}&tanggal_akhir=${endDate}`}
                            className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md active:scale-95"
                        >
                            <Download size={18} />
                            Download CSV
                        </a>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-green-500 px-6 py-5">
                        <h2 className="text-xl font-bold text-white">Riwayat Log Sistem</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Kelembaban Tanah</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Status Ember</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Status Pompa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{log.tanggal}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${
                                                log.kelembabanTanah.replace('%', '') > 70 ? 'bg-green-50 text-green-600 border border-green-100' : 
                                                log.kelembabanTanah.replace('%', '') >= 40 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                                                'bg-red-50 text-red-600 border border-red-100'
                                            }`}>
                                                {log.kelembabanTanah}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${
                                                log.statusEmber === 'Penuh' || log.statusEmber === 'penuh' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                                            }`}>
                                                {log.statusEmber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${
                                                log.status_pompa == 1 || log.status_pompa === 'Hidup' || log.status_pompa === 'hidup' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                                            }`}>
                                                {log.status_pompa == 1 || log.status_pompa === 'Hidup' || log.status_pompa === 'hidup' ? 'Hidup' : 'Mati'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}