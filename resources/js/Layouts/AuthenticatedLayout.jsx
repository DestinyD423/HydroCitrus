import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, History, LogOut, User, Menu, X, PieChart, Box } from 'lucide-react';

export default function AuthenticatedLayout({ user, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-orange-500 to-green-600 text-white flex flex-col transition-transform duration-300 ease-in-out transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-black tracking-tight">HydroCitrus</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-6 flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-white/20 rounded-full border border-white/10 shadow-inner">
                        <User size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-orange-100 uppercase tracking-wider">User Demo</span>
                        <span className="text-sm font-black truncate max-w-[140px]">{user.name}</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    {/* 1. Dashboard */}
                    <Link 
                        href={route('dashboard')} 
                        className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                            route().current('dashboard') ? 'bg-white/20 shadow-md font-bold' : 'hover:bg-white/10 text-white/80'
                        }`}
                    >
                        <LayoutDashboard className="mr-3" size={20} />
                        Dashboard
                    </Link>

                    {/* 2. Analisis */}
                    <Link 
                        href={route('analytics')} 
                        className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                            route().current('analytics') ? 'bg-white/20 shadow-md font-bold' : 'hover:bg-white/10 text-white/80'
                        }`}
                    >
                        <PieChart className="mr-3" size={20} />
                        Analisis
                    </Link>

                    {/* 3. Riwayat */}
                    <Link 
                        href={route('history')} 
                        className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                            route().current('history') ? 'bg-white/20 shadow-md font-bold' : 'hover:bg-white/10 text-white/80'
                        }`}
                    >
                        <History className="mr-3" size={20} />
                        Riwayat
                    </Link>

                    {/* 4. Desain 3D Perangkat */}
                    <Link 
                        href={route('design3d')} 
                        className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                            route().current('design3d') ? 'bg-white/20 shadow-md font-bold' : 'hover:bg-white/10 text-white/80'
                        }`}
                    >
                        <Box className="mr-3" size={20} />
                        Desain 3D
                    </Link>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        className="flex items-center text-white/70 hover:text-white w-full transition-colors group"
                    >
                        <LogOut className="mr-3 group-hover:-translate-x-1 transition-transform" size={20} />
                        <span className="font-bold">Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* AREA KONTEN UTAMA */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                {/* TOPBAR HEADER WITH BURGER BUTTON */}
                <header className="bg-white shadow-sm p-4 flex items-center space-x-4 sticky top-0 z-30">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all active:scale-90"
                    >
                        <Menu size={24} />
                    </button>
                    <div>
                        <h2 className="text-lg font-black text-gray-800 leading-tight">
                            {route().current('dashboard') && 'Dashboard Monitoring'}
                            {route().current('analytics') && 'Analisis Data'}
                            {route().current('history') && 'Riwayat Log'}
                            {route().current('design3d') && 'Visualisasi Komponen'}
                        </h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            HydroCitrus - Sistem Penyiram Otomatis Tanaman Jeruk Bali Berbasis IoT
                        </p>
                    </div>
                </header>
                
                {/* TEMPAT HALAMAN DI-RENDER */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Overlay gelap pas sidebar kebuka di HP */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}