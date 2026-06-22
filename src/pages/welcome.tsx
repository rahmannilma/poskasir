import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, logout, register } from '@/routes';
import { useMemo, useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<any>().props;
    const currentUser = auth?.user;
    
    // State for interactive features showcase tab if needed
    const [activeFeatureTab, setActiveFeatureTab] = useState<'chart' | 'receipt' | 'tables'>('chart');

    // Helper for initials
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'US';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }, [currentUser]);

    return (
        <div className="bg-[#090d16] text-slate-100 font-sans min-h-screen selection:bg-teal-500 selection:text-slate-900 antialiased overflow-x-hidden">
            <Head>
                <title>NexaPOS - Smart. Secure. POS.</title>
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
            </Head>

            {/* Global Smooth Scroll and Typography styles */}
            <style dangerouslySetInnerHTML={{__html: `
                body, html {
                    scroll-behavior: smooth;
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    overflow: auto !important;
                    height: auto !important;
                }
                .font-display {
                    font-family: 'Outfit', sans-serif;
                }
                .bg-grid-pattern {
                    background-size: 40px 40px;
                    background-image: 
                        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                }
            `}} />

            {/* STICKY GLASSMORPHIC NAVBAR */}
            <nav className="bg-[#090d16]/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Brand Logo */}
                    <a href="#home" className="flex items-center gap-3 group">
                        <img 
                            src="/logo.png?v=2" 
                            alt="NexaPOS Logo" 
                            className="h-9 w-auto rounded-lg object-contain transform group-hover:scale-105 transition-transform duration-350"
                        />
                        <span className="text-xl font-black font-display tracking-wide text-white flex items-center">
                            Nexa<span className="text-teal-400">POS</span>
                        </span>
                    </a>

                    {/* Navigation Menu */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-350">
                        <a href="#home" className="hover:text-teal-400 hover:scale-[1.02] transition">Beranda</a>
                        <a href="#why-choose" className="hover:text-teal-400 hover:scale-[1.02] transition">Mengapa Kami</a>
                        <a href="#features" className="hover:text-teal-400 hover:scale-[1.02] transition">Fitur Unggulan</a>
                        <a href="#preview" className="hover:text-teal-400 hover:scale-[1.02] transition">Demo Sistem</a>
                    </div>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-4">
                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col text-right">
                                    <span className="text-xs text-slate-400 font-semibold">Selamat Datang</span>
                                    <span className="text-sm font-bold text-white leading-tight">{currentUser.name.split(' ')[0]}</span>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-bold font-display shadow-inner">
                                    {userInitials}
                                </div>
                                <Link 
                                    href={dashboard()} 
                                    className="bg-teal-500 text-slate-950 text-xs px-5 py-2.5 rounded-full font-bold hover:bg-teal-400 shadow-lg shadow-teal-500/15 hover:shadow-teal-400/20 active:scale-[0.98] transition flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">dashboard</span>
                                    KE DASHBOARD
                                </Link>
                                <Link 
                                    href={logout()} 
                                    method="post" 
                                    as="button"
                                    className="border border-slate-700 text-slate-350 text-xs px-4 py-2.5 rounded-full font-bold hover:bg-slate-800/60 hover:text-white transition flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">logout</span>
                                    KELUAR
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    href={login()} 
                                    className="text-slate-300 hover:text-white text-xs px-4 py-2.5 rounded-full font-semibold transition"
                                >
                                    Masuk
                                </Link>
                                <Link 
                                    href={register()} 
                                    className="bg-teal-500 text-slate-950 text-xs px-5 py-2.5 rounded-full font-bold hover:bg-teal-400 shadow-lg shadow-teal-500/15 hover:shadow-teal-400/20 active:scale-[0.98] transition flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">person_add</span>
                                    Coba Gratis
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section 
                id="home" 
                className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 bg-grid-pattern overflow-hidden" 
            >
                {/* Background decorative glow spots */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-teal-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-blue-600/10 rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 sm:gap-16 items-center w-full">
                    {/* Left Column - Copywriting & CTAs */}
                    <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
                        <div className="inline-flex items-center gap-2.5 bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                            <span className="text-teal-400 font-bold tracking-widest text-xs uppercase font-display">
                                POS PINTAR GENERASI BARU
                            </span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-white leading-[1.1] tracking-tight">
                            Kelola Bisnis <br />
                            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Lebih Cerdas</span>, <br />
                            Transaksi <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">Lebih Aman</span>.
                        </h1>
                        
                        <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                            NexaPOS hadir sebagai solusi kasir digital (POS) pintar generasi baru untuk membantu kafe, restoran, dan retail Anda berkembang tanpa batas. Pantau penjualan dan stok secara real-time, kapan saja dan di mana saja.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                            {currentUser ? (
                                <Link 
                                    href={dashboard()} 
                                    className="bg-teal-500 text-slate-950 text-center px-8 py-4 rounded-full font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-400 active:scale-[0.98] transition tracking-wide text-sm"
                                >
                                    Masuk ke Dashboard
                                </Link>
                            ) : (
                                <Link 
                                    href={register()} 
                                    className="bg-teal-500 text-slate-950 text-center px-8 py-4 rounded-full font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-400 active:scale-[0.98] transition tracking-wide text-sm"
                                >
                                    Coba Gratis 14 Hari
                                </Link>
                            )}
                            <a 
                                 href="#preview" 
                                 className="border border-slate-700 text-slate-300 text-center px-8 py-4 rounded-full font-bold hover:bg-slate-800/50 hover:text-white transition active:scale-[0.98] text-sm"
                            >
                                Hubungi Tim Sales
                            </a>
                        </div>

                        {/* Badges / Micro features info */}
                        <div className="flex items-center gap-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-teal-400 text-base">verified_user</span>
                                <span>Tersertifikasi Aman</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-teal-400 text-base">cloud_sync</span>
                                <span>Backup Cloud Otomatis</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-teal-400 text-base">support_agent</span>
                                <span>Dukungan 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Premium Graphic Logo Mockup */}
                    <div className="lg:col-span-6 relative flex justify-center items-center">
                        <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-sky-500 rounded-3xl blur-2xl opacity-15" />
                        <div className="relative bg-slate-900/60 border border-slate-800 backdrop-blur-md p-8 sm:p-12 rounded-3xl w-full max-w-[500px] shadow-2xl flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform duration-350">
                            <div className="absolute top-4 left-4 h-3 w-3 rounded-full bg-slate-800 flex items-center justify-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            </div>
                            
                            <img 
                                src="/logo.png?v=2" 
                                alt="NexaPOS Premium Wall Mockup" 
                                className="w-64 sm:w-80 h-auto rounded-3xl object-contain py-8 hover:rotate-1 transition-transform duration-500"
                            />
                            
                            <div className="w-full text-center border-t border-slate-800/80 pt-6">
                                <p className="text-teal-400 font-bold tracking-widest text-xs uppercase font-display mb-1">Branding Konsisten & Modern</p>
                                <p className="text-slate-400 text-xs sm:text-sm">Smart. Secure. POS. - Sinergi Grafik Naik dan Struk Digital</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TENTANG KAMI / BANNER PREMIUM */}
            <section className="bg-slate-950 py-16 sm:py-24 border-y border-slate-900 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
                    <div className="relative group overflow-hidden rounded-3xl border border-slate-800">
                        {/* Background Cafe Image Mockup with Logo Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                        <img 
                            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" 
                            alt="Suasana Cafe di Latar Belakang" 
                            className="w-full object-cover h-[350px] sm:h-[450px] transform group-hover:scale-[1.03] transition duration-700 filter brightness-75"
                        />
                        {/* High Fidelity Logo Overlay on Cafe Wall mockup */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center bg-[#090d16]/95 border border-teal-500/20 px-8 py-6 rounded-2xl shadow-2xl backdrop-blur-sm max-w-[280px]">
                            <img 
                                src="/logo.png?v=2" 
                                alt="NexaPOS Logo Wall" 
                                className="h-16 w-auto rounded-xl object-contain mb-3"
                            />
                            <p className="text-white font-bold text-sm tracking-wider font-display">NexaPOS Active</p>
                            <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full mt-1 border border-teal-500/20">Secure Cloud Node</span>
                        </div>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        <span className="text-teal-400 font-bold tracking-widest text-xs uppercase font-display bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full inline-block">
                            Evolusi Bisnis Kuliner & Retail
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white leading-tight">
                            Solusi Terbaik untuk Operasional Kafe, Restoran, dan Toko Anda
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Kami percaya bahwa kasir digital tidak hanya sekadar mencatat transaksi pembayaran. NexaPOS dirancang dengan standar kualitas visual premium dan performa super cepat untuk mendukung pengambilan keputusan bisnis secara real-time.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2 border-l-2 border-teal-500 pl-4">
                                <h4 className="text-white font-bold font-display text-lg">99.9% Uptime</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Sistem kasir siap bertransaksi setiap saat tanpa kendala server lambat.</p>
                            </div>
                            <div className="space-y-2 border-l-2 border-teal-500 pl-4">
                                <h4 className="text-white font-bold font-display text-lg">100% Real-Time</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Pantau data stok, pesanan dapur, dan omzet instan dari genggaman Anda.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NILAI JUAL UTAMA (Why Choose NexaPOS?) */}
            <section id="why-choose" className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
                <div className="text-center mb-16 sm:mb-20 space-y-4">
                    <span className="text-teal-400 font-bold tracking-widest text-xs uppercase font-display bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full inline-block">
                        Mengapa NexaPOS?
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white">
                        Sinergi Sempurna: Smart. Secure. POS.
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Kami menerjemahkan komitmen kami ke dalam tiga pilar utama yang menjamin keandalan sistem operasional bisnis Anda.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Pilar SMART */}
                    <div className="relative bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl hover:border-teal-500/40 group transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-teal-500/5">
                        <div className="space-y-6">
                            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition duration-300">
                                <span className="material-symbols-outlined text-2xl font-bold">auto_awesome</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-display text-white group-hover:text-teal-400 transition mb-3">
                                    SMART (Pintar & Otomatis)
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    Membantu Anda mengambil keputusan berbasis data secara otomatis dengan analisis cerdas.
                                </p>
                            </div>
                            
                            <div className="space-y-4 border-t border-slate-800/80 pt-6">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-teal-400 shrink-0 text-lg mt-0.5">analytics</span>
                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Analisis Penjualan Otomatis</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">Dapatkan laporan laba-rugi dan produk terlaris secara instan untuk ambil keputusan bisnis yang tepat.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-teal-400 shrink-0 text-lg mt-0.5">notification_important</span>
                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Manajemen Stok Akurat</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">Notifikasi otomatis saat bahan baku atau stok barang menipis agar jualan tidak terganggu.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pilar SECURE */}
                    <div className="relative bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl hover:border-teal-500/40 group transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-teal-500/5">
                        <div className="space-y-6">
                            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition duration-300">
                                <span className="material-symbols-outlined text-2xl font-bold">shield</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-display text-white group-hover:text-teal-400 transition mb-3">
                                    SECURE (Keamanan Data Kelas Atas)
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    Menjaga keamanan data finansial dan internal dari kecurangan maupun kebocoran.
                                </p>
                            </div>

                            <div className="space-y-4 border-t border-slate-800/80 pt-6">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-teal-400 shrink-0 text-lg mt-0.5">cloud_done</span>
                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Perlindungan Data Cloud</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">Seluruh data transaksi, keuangan, dan pelanggan tersimpan aman dengan enkripsi tingkat tinggi.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-teal-400 shrink-0 text-lg mt-0.5">admin_panel_settings</span>
                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Kontrol Akses Karyawan</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">Batasi hak akses staf kasir untuk mencegah kecurangan (fraud) internal di toko Anda.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pilar POS */}
                    <div className="relative bg-slate-900/40 border border-slate-800/85 p-8 rounded-3xl hover:border-teal-500/40 group transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-teal-500/5">
                        <div className="space-y-6">
                            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition duration-300">
                                <span className="material-symbols-outlined text-2xl font-bold">devices</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-display text-white group-hover:text-teal-400 transition mb-3">
                                    POS (Fitur Kasir Modern)
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    Alur transaksi kasir super cepat dan lancar tanpa peduli tingkat kesibukan antrean.
                                </p>
                            </div>

                            <div className="space-y-4 border-t border-slate-800/80 pt-6">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-teal-400 shrink-0 text-lg mt-0.5">touch_app</span>
                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Antarmuka Intuitif</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">Desain kasir sangat mudah digunakan, staf baru bisa langsung lancar bertransaksi dalam hitungan menit.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-teal-400 shrink-0 text-lg mt-0.5">credit_card</span>
                                    <div>
                                        <h4 className="text-white text-sm font-semibold mb-1">Metode Pembayaran Lengkap</h4>
                                        <p className="text-slate-400 text-xs leading-relaxed">Terima pembayaran tunai, debit, kartu kredit, hingga QRIS dalam satu sistem terintegrasi.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FITUR UNGGULAN SHOWCASE (Interactive & Alternating Grid) */}
            <section id="features" className="bg-slate-950/80 py-24 sm:py-32 border-y border-slate-900 px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto space-y-24 sm:space-y-36">
                    
                    {/* Header Fitur */}
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <span className="text-teal-400 font-bold tracking-widest text-xs uppercase font-display bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full inline-block">
                            Eksplorasi Fitur
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white">
                            Fitur Hebat Yang Mendongkrak Keuntungan
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Simak demonstrasi interaktif bagaimana NexaPOS menyederhanakan alur kerja bisnis harian Anda.
                        </p>
                    </div>

                    {/* Fitur 1: Grafik Performa Naik */}
                    <div className="grid lg:grid-cols-12 gap-12 sm:gap-16 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <span className="material-symbols-outlined font-bold">trending_up</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                                📈 Grafik Performa Naik
                            </h3>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Pantau pertumbuhan omzet harian hingga bulanan lewat dasbor visual yang interaktif. Anda tidak perlu lagi pusing menghitung laporan manual di akhir bulan.
                            </p>
                            <ul className="space-y-3 text-slate-350 text-xs sm:text-sm">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Visualisasi grafik garis & batang interaktif</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Filter laporan per hari, minggu, atau bulan</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Ekspor laporan ke file PDF / Excel dalam satu ketukan</span>
                                </li>
                            </ul>
                        </div>

                        {/* Interactive Chart Mockup Graphic */}
                        <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                            <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs text-slate-400 font-semibold font-display uppercase tracking-wider">Metrik Live Penjualan</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold">Harian</span>
                                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Bulanan</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-900/60 border border-slate-800/50 p-4 rounded-2xl text-left">
                                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">Total Pendapatan</span>
                                    <div className="text-white font-bold text-sm sm:text-base font-display">Rp 12.840k</div>
                                    <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                                        <span className="material-symbols-outlined text-[10px]">arrow_upward</span>
                                        +14.2%
                                    </span>
                                </div>
                                <div className="bg-slate-900/60 border border-slate-800/50 p-4 rounded-2xl text-left">
                                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">Transaksi</span>
                                    <div className="text-white font-bold text-sm sm:text-base font-display">342 Nota</div>
                                    <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                                        <span className="material-symbols-outlined text-[10px]">arrow_upward</span>
                                        +8.6%
                                    </span>
                                </div>
                                <div className="bg-slate-900/60 border border-slate-800/50 p-4 rounded-2xl text-left">
                                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">Produk Terjual</span>
                                    <div className="text-white font-bold text-sm sm:text-base font-display">512 Item</div>
                                    <span className="text-[9px] text-amber-400 font-semibold flex items-center gap-0.5">
                                        <span className="material-symbols-outlined text-[10px]">horizontal_rule</span>
                                        Stabil
                                    </span>
                                </div>
                            </div>

                            {/* Simulated SVG Graph Line */}
                            <div className="relative h-44 w-full flex items-end">
                                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Filled Area */}
                                    <path 
                                        d="M 0 80 Q 20 60 40 70 T 80 30 T 100 15 L 100 100 L 0 100 Z" 
                                        fill="url(#chart-grad)"
                                    />
                                    {/* Stroke Line */}
                                    <path 
                                        d="M 0 80 Q 20 60 40 70 T 80 30 T 100 15" 
                                        fill="none" 
                                        stroke="#14b8a6" 
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                    {/* Dynamic Glowing Dots */}
                                    <circle cx="40" cy="70" r="3" fill="#14b8a6" stroke="#090d16" strokeWidth="1" />
                                    <circle cx="80" cy="30" r="3" fill="#14b8a6" stroke="#090d16" strokeWidth="1" />
                                    <circle cx="100" cy="15" r="4.5" fill="#14b8a6" className="animate-ping origin-center" />
                                    <circle cx="100" cy="15" r="3.5" fill="#22c55e" stroke="#090d16" strokeWidth="1" />
                                </svg>
                                
                                {/* Tooltip Simulation */}
                                <div className="absolute top-6 right-20 bg-slate-900 border border-teal-500/40 rounded-xl px-2.5 py-1.5 shadow-xl text-center">
                                    <span className="text-[8px] text-slate-400 block font-semibold">Omzet Puncak (17:00)</span>
                                    <span className="text-teal-400 font-bold text-xs font-mono">Rp 4.150.000</span>
                                </div>

                                {/* X Axis indicators */}
                                <div className="absolute bottom-0 inset-x-0 flex justify-between text-[9px] text-slate-500 font-semibold px-1">
                                    <span>09:00</span>
                                    <span>12:00</span>
                                    <span>15:00</span>
                                    <span>18:00</span>
                                    <span>22:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fitur 2: Struk Digital & Cetak */}
                    <div className="grid lg:grid-cols-12 gap-12 sm:gap-16 items-center">
                        {/* Interactive Smartphone Chat Mockup Graphic */}
                        <div className="lg:col-span-7 order-last lg:order-first bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex justify-center">
                            
                            {/* Phone Frame */}
                            <div className="border-[8px] border-slate-950 rounded-[40px] bg-slate-900 w-full max-w-[320px] shadow-2xl overflow-hidden aspect-[9/18] flex flex-col justify-between">
                                {/* Phone Notch */}
                                <div className="h-6 bg-slate-950 w-full flex justify-center items-center relative">
                                    <div className="h-4 w-28 bg-black rounded-b-xl absolute top-0" />
                                </div>

                                {/* Phone Screen - Chat App Simulator */}
                                <div className="flex-1 bg-[#070c12] flex flex-col justify-between p-3.5 space-y-4">
                                    {/* Whatsapp Header */}
                                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-[10px] font-bold font-display">
                                                NP
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-[10px] text-white font-bold leading-tight">NexaPOS Billing</span>
                                                <span className="text-[8px] text-teal-400 font-semibold flex items-center gap-0.5">
                                                    <span className="h-1 w-1 rounded-full bg-teal-400" />
                                                    Online
                                                </span>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 text-sm">more_vert</span>
                                    </div>

                                    {/* Messages Bubble Container */}
                                    <div className="flex-grow space-y-3 overflow-y-auto text-left py-1 text-[10px] flex flex-col">
                                        {/* Received system notice */}
                                        <div className="bg-slate-900 border border-slate-800 text-slate-350 p-2.5 rounded-2xl max-w-[85%] self-start shadow-sm mb-2">
                                            Halo Kak Budi, terima kasih telah berbelanja di **Nexa Cafe**! Berikut adalah struk transaksi digital Anda.
                                        </div>

                                        {/* Digital Receipt Card */}
                                        <div className="bg-slate-950 border border-teal-500/20 text-slate-305 p-3 rounded-2xl max-w-[90%] self-start space-y-2 shadow-lg relative">
                                            <div className="border-b border-slate-800/80 pb-2 text-center">
                                                <span className="font-bold text-white block text-[11px] font-display">Nexa Cafe & Bistro</span>
                                                <span className="text-[8px] text-slate-400">Nota: #20260622-0034</span>
                                            </div>
                                            
                                            <div className="space-y-1.5 text-[9px] border-b border-slate-800/80 pb-2 font-mono">
                                                <div className="flex justify-between">
                                                    <span>1x Espresso Macchiato</span>
                                                    <span>Rp 28.000</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>1x Butter Croissant</span>
                                                    <span>Rp 22.000</span>
                                                </div>
                                                <div className="flex justify-between text-teal-400 font-bold">
                                                    <span>1x Senja Premium Blend</span>
                                                    <span>Rp 25.000</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-[9px] font-bold">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span>Rp 75.000</span>
                                                </div>
                                                <div className="flex justify-between text-white">
                                                    <span>TOTAL BAYAR:</span>
                                                    <span className="text-teal-400">Rp 75.000</span>
                                                </div>
                                            </div>

                                            <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 p-1 rounded text-center text-[8px] font-bold flex items-center justify-center gap-1.5">
                                                <span className="material-symbols-outlined text-[10px]">qr_code_2</span>
                                                LUNAS VIA QRIS
                                            </div>
                                        </div>
                                    </div>

                                    {/* Whatsapp Chat Input Simulator */}
                                    <div className="flex gap-2">
                                        <div className="flex-grow bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 flex items-center justify-between text-slate-500 text-[9px]">
                                            <span>Ketik pesan balasan...</span>
                                            <span className="material-symbols-outlined text-xs">attach_file</span>
                                        </div>
                                        <div className="h-7 w-7 rounded-full bg-teal-500 flex items-center justify-center text-slate-950 font-bold shrink-0">
                                            <span className="material-symbols-outlined text-xs">send</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <span className="material-symbols-outlined font-bold">receipt_long</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                                🧾 Struk Digital & Cetak
                            </h3>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Kirim struk belanja langsung ke WhatsApp/Email pelanggan secara paperless, atau cetak fisik lewat printer thermal portable melalui bluetooth dengan sangat instan.
                            </p>
                            <ul className="space-y-3 text-slate-350 text-xs sm:text-sm">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Pengiriman struk otomatis via API WhatsApp resmi</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Hemat biaya kertas struk belanja (ramah lingkungan)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Konektivitas printer bluetooth/wifi serbaguna</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Fitur 3: Mode Restoran & Kafe */}
                    <div className="grid lg:grid-cols-12 gap-12 sm:gap-16 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <span className="material-symbols-outlined font-bold">restaurant</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                                ☕ Mode Restoran & Kafe
                            </h3>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Kelola meja pelanggan, nomor antrean pesanan, dan sinkronisasi pesanan ke monitor dapur secara instan. Menghindari kesalahan penyajian makanan atau minuman.
                            </p>
                            <ul className="space-y-3 text-slate-350 text-xs sm:text-sm">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Layout manajemen meja visual (isi, kosong, siap bayar)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Sistem monitor antrean koki di dapur (kitchen display)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-teal-400 text-sm">check_circle</span>
                                    <span>Pengaturan split bill atau gabung meja fleksibel</span>
                                </li>
                            </ul>
                        </div>

                        {/* Interactive Table Layout Mockup Graphic */}
                        <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                            <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                                    <span className="text-xs text-slate-400 font-semibold font-display uppercase tracking-wider">Manajemen Meja Dine-In</span>
                                </div>
                                <span className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-bold">Lantai 1 - Kafe</span>
                            </div>

                            {/* Tables Grid Simulation */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {/* Table Card 1 */}
                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[9px] text-emerald-400 font-bold block mb-1">M-01</span>
                                    <span className="material-symbols-outlined text-emerald-400 text-xl">table_bar</span>
                                    <span className="text-[8px] text-slate-400 mt-1">Kosong</span>
                                </div>
                                
                                {/* Table Card 2 */}
                                <div className="bg-sky-500/10 border border-sky-500/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center relative">
                                    <div className="absolute top-1 right-1 flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500"></span>
                                    </div>
                                    <span className="text-[9px] text-sky-400 font-bold block mb-1">M-02</span>
                                    <span className="material-symbols-outlined text-sky-400 text-xl">table_restaurant</span>
                                    <span className="text-[8px] text-slate-400 mt-1">Dipesan (4p)</span>
                                </div>

                                {/* Table Card 3 */}
                                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[9px] text-amber-400 font-bold block mb-1">M-03</span>
                                    <span className="material-symbols-outlined text-amber-400 text-xl">table_restaurant</span>
                                    <span className="text-[8px] text-slate-400 mt-1">Siap Sajian</span>
                                </div>

                                {/* Table Card 4 */}
                                <div className="bg-[#090d16] border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center opacity-60">
                                    <span className="text-[9px] text-slate-500 font-bold block mb-1">M-04</span>
                                    <span className="material-symbols-outlined text-slate-500 text-xl">table_bar</span>
                                    <span className="text-[8px] text-slate-500 mt-1">Reserved</span>
                                </div>

                                {/* Table Card 5 */}
                                <div className="bg-sky-500/10 border border-sky-500/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[9px] text-sky-400 font-bold block mb-1">M-05</span>
                                    <span className="material-symbols-outlined text-sky-400 text-xl">table_restaurant</span>
                                    <span className="text-[8px] text-slate-400 mt-1">Makan (2p)</span>
                                </div>

                                {/* Table Card 6 */}
                                <div className="bg-teal-500/10 border border-teal-500/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[9px] text-teal-400 font-bold block mb-1">M-06</span>
                                    <span className="material-symbols-outlined text-teal-400 text-xl">table_restaurant</span>
                                    <span className="text-[8px] text-slate-400 mt-1">Billing</span>
                                </div>

                                {/* Table Card 7 */}
                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[9px] text-emerald-400 font-bold block mb-1">M-07</span>
                                    <span className="material-symbols-outlined text-emerald-400 text-xl">table_bar</span>
                                    <span className="text-[8px] text-slate-400 mt-1">Kosong</span>
                                </div>

                                {/* Table Card 8 */}
                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[9px] text-emerald-400 font-bold block mb-1">M-08</span>
                                    <span className="material-symbols-outlined text-emerald-400 text-xl">table_bar</span>
                                    <span className="text-[8px] text-slate-400 mt-1">Kosong</span>
                                </div>
                            </div>

                            {/* Simulated Kitchen monitor alert at bottom */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex justify-between items-center text-left">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xs">
                                        KT
                                    </span>
                                    <div>
                                        <span className="text-[10px] text-white font-bold block leading-tight">Antrean Dapur Aktif</span>
                                        <span className="text-[8px] text-slate-400">2 Pesanan sedang dimasak oleh Koki</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/25">Monitor Dapur</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PREVIEW DEMO SECTION (Visual Live Dashboard Mockup) */}
            <section id="preview" className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-teal-400 font-bold tracking-widest text-xs uppercase font-display bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full inline-block">
                        Demo Aplikasi
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white">
                        Sistem Kasir Yang Sangat Intuitif
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Kami merancang NexaPOS untuk efisiensi transaksi Anda. Staf kasir baru Anda akan terbiasa dalam waktu kurang dari 5 menit.
                    </p>
                </div>

                {/* Big Dashboard Visual Graphic Mockup */}
                <div className="relative bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-sky-500 to-teal-500" />
                    
                    {/* Simulated Interface Topbar */}
                    <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-6">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png?v=2" alt="NexaPOS" className="h-6 w-auto rounded" />
                            <span className="text-sm font-bold font-display text-white">NexaPOS Cloud Dashboard</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded font-semibold flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Cloud Connected
                            </span>
                            <span className="text-slate-400 hidden sm:inline-block">Staff: Kasir Utama</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Sidebar simulator */}
                        <div className="lg:col-span-3 space-y-2 border-r border-slate-800/80 pr-4 hidden lg:block text-left text-xs">
                            <div className="bg-teal-500/10 text-teal-400 font-bold p-2.5 rounded-xl flex items-center gap-3">
                                <span className="material-symbols-outlined text-sm">point_of_sale</span>
                                <span>Menu Transaksi Kasir</span>
                            </div>
                            <div className="text-slate-400 hover:bg-slate-800/40 font-semibold p-2.5 rounded-xl flex items-center gap-3 transition">
                                <span className="material-symbols-outlined text-sm">inventory_2</span>
                                <span>Kelola Stok Barang</span>
                            </div>
                            <div className="text-slate-400 hover:bg-slate-800/40 font-semibold p-2.5 rounded-xl flex items-center gap-3 transition">
                                <span className="material-symbols-outlined text-sm">receipt</span>
                                <span>Riwayat Transaksi</span>
                            </div>
                            <div className="text-slate-400 hover:bg-slate-800/40 font-semibold p-2.5 rounded-xl flex items-center gap-3 transition">
                                <span className="material-symbols-outlined text-sm">group</span>
                                <span>Kelola Data Karyawan</span>
                            </div>
                            <div className="text-slate-400 hover:bg-slate-800/40 font-semibold p-2.5 rounded-xl flex items-center gap-3 transition">
                                <span className="material-symbols-outlined text-sm">settings</span>
                                <span>Pengaturan Sistem</span>
                            </div>
                        </div>

                        {/* POS cashier screen simulator */}
                        <div className="lg:col-span-9 grid md:grid-cols-12 gap-6">
                            {/* Products menu grid */}
                            <div className="md:col-span-8 space-y-4">
                                <div className="flex justify-between items-center text-left">
                                    <span className="text-xs font-bold text-white">Menu Terlaris</span>
                                    <span className="text-[10px] text-teal-400 font-bold hover:underline cursor-pointer">Lihat Semua (24)</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {/* Item 1 */}
                                    <div className="bg-[#090d16] border border-slate-800 p-3 rounded-2xl flex flex-col justify-between h-32 text-left relative group/item cursor-pointer">
                                        <div className="absolute top-2 right-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                            Kopi
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 text-lg">local_cafe</span>
                                        <div>
                                            <span className="font-bold text-xs text-white block truncate">Senja Aren Latte</span>
                                            <span className="text-[10px] text-teal-400 font-bold font-mono">Rp 25.000</span>
                                        </div>
                                    </div>
                                    {/* Item 2 */}
                                    <div className="bg-[#090d16] border border-slate-800 p-3 rounded-2xl flex flex-col justify-between h-32 text-left relative group/item cursor-pointer">
                                        <div className="absolute top-2 right-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                            Kopi
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 text-lg">coffee_maker</span>
                                        <div>
                                            <span className="font-bold text-xs text-white block truncate">V60 Gayo Premium</span>
                                            <span className="text-[10px] text-teal-400 font-bold font-mono">Rp 28.000</span>
                                        </div>
                                    </div>
                                    {/* Item 3 */}
                                    <div className="bg-[#090d16] border border-slate-800 p-3 rounded-2xl flex flex-col justify-between h-32 text-left relative group/item cursor-pointer">
                                        <div className="absolute top-2 right-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                            Pastry
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 text-lg">bakery_dining</span>
                                        <div>
                                            <span className="font-bold text-xs text-white block truncate">Butter Croissant</span>
                                            <span className="text-[10px] text-teal-400 font-bold font-mono">Rp 22.000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current order details simulator */}
                            <div className="md:col-span-4 bg-[#090d16] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between text-left h-full min-h-[260px]">
                                <div className="space-y-4 flex flex-col flex-1">
                                    <span className="text-xs font-bold text-white block border-b border-slate-800/80 pb-2">Keranjang Pesanan</span>
                                    <div className="space-y-2.5 text-[10px] font-medium text-slate-350 flex flex-col flex-grow mt-2">
                                        <div className="flex justify-between items-center">
                                            <span>2x Senja Aren Latte</span>
                                            <span className="font-mono font-bold">Rp 50.000</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>1x Butter Croissant</span>
                                            <span className="font-mono font-bold">Rp 22.000</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-800 mt-4">
                                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                        <span>Total Belanja:</span>
                                        <span className="text-white font-mono">Rp 72.000</span>
                                    </div>
                                    <button className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-teal-500/10 active:scale-[0.98] transition flex items-center justify-center gap-1.5">
                                        <span className="material-symbols-outlined text-sm font-bold">payment</span>
                                        Proses Bayar (QRIS)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CLOSING / FOOTER CTA SECTION */}
            <section className="relative py-24 sm:py-32 overflow-hidden px-6">
                {/* Decorative glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl -z-10" />
                
                <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-b from-[#111a2e] to-[#0b0f19] border border-slate-800 p-8 sm:p-16 rounded-[40px] shadow-2xl relative">
                    <img 
                        src="/logo.png?v=2" 
                        alt="NexaPOS Decorative Logo" 
                        className="h-16 w-auto mx-auto rounded-xl object-contain mb-4 transform hover:scale-105 transition"
                    />
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white leading-tight">
                        Siap Bawa Bisnis Anda <br />
                        ke Level Berikutnya?
                    </h2>
                    
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Bergabunglah dengan ratusan pemilik bisnis yang telah mempercayakan operasional harian mereka kepada NexaPOS. Tanpa biaya tersembunyi, tanpa ribet.
                    </p>
                    
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {currentUser ? (
                            <Link 
                                href={dashboard()} 
                                className="w-full sm:w-auto bg-teal-500 text-slate-950 px-8 py-4 rounded-full font-bold shadow-lg shadow-teal-500/25 hover:bg-teal-400 active:scale-[0.98] transition tracking-wide text-sm"
                            >
                                Mulai Gunakan Sekarang
                            </Link>
                        ) : (
                            <Link 
                                href={register()} 
                                className="w-full sm:w-auto bg-teal-500 text-slate-950 px-8 py-4 rounded-full font-bold shadow-lg shadow-teal-500/25 hover:bg-teal-400 active:scale-[0.98] transition tracking-wide text-sm"
                            >
                                Mulai Langganan Sekarang
                            </Link>
                        )}
                        <a 
                             href="#features" 
                             className="w-full sm:w-auto border border-slate-700 text-slate-350 px-8 py-4 rounded-full font-bold hover:bg-slate-800/40 hover:text-white transition active:scale-[0.98] text-sm"
                        >
                            Pelajari Fitur Dulu
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#050810] text-slate-500 py-16 border-t border-slate-900 text-xs sm:text-sm">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-10 sm:gap-16 pb-12 border-b border-slate-900/60">
                    
                    {/* Brand Footer Info */}
                    <div className="md:col-span-5 space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png?v=2" alt="NexaPOS Logo" className="h-8 w-auto rounded-md object-contain" />
                            <span className="text-lg font-black font-display tracking-wide text-white">
                                Nexa<span className="text-teal-400">POS</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                            Solusi sistem kasir (Point of Sale) digital terintegrasi untuk bisnis modern Anda. Mempercepat alur kerja, mendongkrak profitabilitas, dan menjaga keamanan data finansial.
                        </p>
                        <div className="flex items-center gap-3 pt-2 text-slate-400">
                            <span className="text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">Smart. Secure. POS.</span>
                        </div>
                    </div>

                    {/* Quick Links Column 1 */}
                    <div className="md:col-span-3 space-y-4 text-left">
                        <h4 className="text-white font-bold font-display text-xs uppercase tracking-widest text-teal-400">Fitur Utama</h4>
                        <ul className="space-y-2.5 text-xs text-slate-400">
                            <li><a href="#features" className="hover:text-white transition">Analisis Omzet Penjualan</a></li>
                            <li><a href="#features" className="hover:text-white transition">Manajemen Stok Real-Time</a></li>
                            <li><a href="#features" className="hover:text-white transition">WhatsApp Struk Digital</a></li>
                            <li><a href="#features" className="hover:text-white transition">Mode Kitchen & Dining</a></li>
                        </ul>
                    </div>

                    {/* Quick Links Column 2 */}
                    <div className="md:col-span-4 space-y-4 text-left">
                        <h4 className="text-white font-bold font-display text-xs uppercase tracking-widest text-teal-400">Hubungi Kami</h4>
                        <ul className="space-y-2.5 text-xs text-slate-400">
                            <li className="flex items-start gap-2.5 text-left">
                                <span className="material-symbols-outlined text-teal-400 text-sm mt-0.5">location_on</span>
                                <span>Gedung Nexa Center, Lantai 5, Jakarta, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-teal-400 text-sm">phone_in_talk</span>
                                <span>+62 (21) 8800-9988</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-teal-400 text-sm">mail</span>
                                <span>support@nexapos.co.id</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
                    <p>&copy; 2026 NexaPOS. Semua hak cipta dilindungi undang-undang.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:underline transition">Syarat & Ketentuan</a>
                        <a href="#" className="hover:underline transition">Kebijakan Privasi</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
