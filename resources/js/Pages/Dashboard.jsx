import Speedometer from '@/Components/Speedometer';
import WaterBucketIndicator from '@/Components/WaterBucketIndicator';
import PumpSwitch from '@/Components/PumpSwitch';
import SensorChart from '@/Components/SensorChart';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ 
    auth, 
    kelembabanTanah = 0, 
    statusEmber = 'Kosong', 
    statusPompa = 'Mati', 
    chartData = [] 
}) {
    const isPompaHidup = statusPompa == 1 || statusPompa === 'Hidup' || statusPompa === 'hidup';

    const getKelembabanStatus = () => {
        if (kelembabanTanah > 60) return 'Lembab';
        if (kelembabanTanah > 30) return 'Sedang';
        return 'Kering';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard HydroCitrus</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 1. KOTAK KELEMBABAN TANAH */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-orange-200">
                            <h2 className="text-lg font-semibold text-orange-700 mb-4 text-center">
                                Kelembaban Tanah
                            </h2>
                            <Speedometer value={kelembabanTanah} />
                            <div className="text-center mt-4">
                                <span className="text-base font-medium text-gray-600">
                                    Status: {getKelembabanStatus()}
                                </span>
                            </div>
                        </div>

                        {/* 2. KOTAK SENSOR PELAMPUNG AIR */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
                            <h2 className="text-lg font-semibold text-blue-700 mb-4 text-center">
                                Sensor Pelampung Air
                            </h2>
                            <WaterBucketIndicator isFull={statusEmber === 'Penuh'} />
                            <div className="text-center mt-4">
                                <span className="text-base font-medium text-gray-600">
                                    Status Tangki: {statusEmber}
                                </span>
                            </div>
                        </div>

                        {/* 3. KOTAK KONTROL POMPA AIR */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200">
                            <h2 className="text-lg font-semibold text-green-700 mb-4 text-center">
                                Kontrol Pompa Air
                            </h2>
                            <div className="flex flex-col items-center justify-center h-full space-y-4 pt-4">
                                <PumpSwitch isOn={isPompaHidup} />
                                <span className="text-base font-medium text-gray-600">
                                    Status Pompa: {statusPompa}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION GRAFIK REAL-TIME */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Grafik Kelembaban</h2>
                        <SensorChart data={chartData} />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}