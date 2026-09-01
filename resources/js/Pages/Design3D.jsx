import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Pot3D from '@/Components/Pot3D'; 
import { Box, Cpu, Info } from 'lucide-react';

export default function Design3D({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Desain 3D Perangkat" />
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200">
                        <Box size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-800">Prototipe Alat 3D</h2>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Desain Alat</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Pot3D />
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
                                <Cpu size={18} className="text-green-600" />
                                <h4 className="font-black text-gray-700 text-xs uppercase tracking-wider">
                                    Spesifikasi Hardware
                                </h4>
                            </div>
                            
                            <div className="space-y-4 text-xs font-semibold text-gray-600">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400">Microcontroller</span>
                                    <span className="text-gray-800 font-bold">ESP8266 D1 Mini</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400">Sensor Tanah</span>
                                    <span className="text-gray-800 font-bold">Resistive Soil Moisture Sensor</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400">Sensor Level Air</span>
                                    <span className="text-gray-800 font-bold">Water Float Switch</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-gray-400">Sistem Irigasi</span>
                                    <span className="text-green-600 font-bold">Water Pump 5V & Relay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}