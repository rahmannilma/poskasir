import { useMemo, useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { toast } from 'sonner';

export default function PublicTerminal() {
    const [activationCode, setActivationCode] = useState<string>(() => localStorage.getItem('attendance_activation_code') || '');
    const [outletName, setOutletName] = useState<string>(() => localStorage.getItem('attendance_outlet_name') || '');
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // QR Code States
    const [qrToken, setQrToken] = useState<string>('');
    const [qrCountdown, setQrCountdown] = useState<number>(20);
    
    // Clock States
    const [currentTime, setCurrentTime] = useState(new Date());

    const isActivated = !!activationCode;

    // Clock real-time update
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch public QR token polling
    useEffect(() => {
        if (!isActivated) return;

        let tokenInterval: NodeJS.Timeout;

        const fetchToken = async () => {
            try {
                const res = await fetch(`/api/absensi/terminal/qr-token?code=${activationCode}`);
                const data = await res.json();
                if (data.success) {
                    setQrToken(data.token);
                    setQrCountdown(data.expires_in);
                } else {
                    setError(data.message || 'Sesi terminal tidak valid.');
                    handleReset();
                }
            } catch (err) {
                console.error("Failed to fetch shop QR token", err);
            }
        };

        fetchToken();

        tokenInterval = setInterval(() => {
            setQrCountdown((prev) => {
                if (prev <= 1) {
                    fetchToken();
                    return 20;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(tokenInterval);
        };
    }, [isActivated, activationCode]);

    // Handle Activation Form Submit
    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputCode.trim()) {
            setError('Silakan masukkan kode aktivasi.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const xsrfToken = decodeURIComponent(
                document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1] || ''
            );

            const res = await fetch('/api/absensi/terminal/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken
                },
                body: JSON.stringify({ code: inputCode.trim() })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('attendance_activation_code', inputCode.trim());
                localStorage.setItem('attendance_outlet_name', data.outlet_name);
                setActivationCode(inputCode.trim());
                setOutletName(data.outlet_name);
                toast.success(`Terminal absensi untuk "${data.outlet_name}" berhasil diaktifkan!`);
            } else {
                setError(data.message || 'Kode aktivasi tidak valid.');
            }
        } catch (err) {
            console.error(err);
            setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Reset/Deactivate Terminal
    const handleReset = () => {
        localStorage.removeItem('attendance_activation_code');
        localStorage.removeItem('attendance_outlet_name');
        setActivationCode('');
        setOutletName('');
        setQrToken('');
        setInputCode('');
        toast.info('Terminal absensi telah dinonaktifkan.');
    };

    return (
        <div className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col justify-between p-6 select-none relative overflow-hidden">
            <Head>
                <title>Precision POS - Terminal Absensi</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&amp;family=Outfit:wght@300;400;600;800&amp;display=swap" rel="stylesheet" />
            </Head>

            {/* Premium Styles */}
            <style dangerouslySetInnerHTML={{__html: `
                body, html, #app, main {
                    background-color: #0b0f19 !important;
                    color: #f8fafc !important;
                    font-family: 'Outfit', sans-serif;
                }
                .font-label-mono {
                    font-family: 'JetBrains Mono', monospace;
                }
                .font-orbitron {
                    font-family: 'Orbitron', sans-serif;
                }
                
                /* Radial Background Glows */
                .radial-glow-1 {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0) 70%);
                    top: -200px;
                    left: -100px;
                    z-index: 0;
                    pointer-events: none;
                }
                .radial-glow-2 {
                    position: absolute;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0) 70%);
                    bottom: -300px;
                    right: -100px;
                    z-index: 0;
                    pointer-events: none;
                }

                /* Grid Overlay */
                .grid-bg {
                    position: absolute;
                    inset: 0;
                    background-image: linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
                    background-size: 32px 32px;
                    z-index: 0;
                    pointer-events: none;
                }

                /* Glassmorphism Styles */
                .glass-panel {
                    background: rgba(17, 24, 39, 0.55);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                }
                
                /* Scanner Laser Line Animation */
                @keyframes scanLaser {
                    0% { top: 0%; opacity: 0.2; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0.2; }
                }
                .scanner-line {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent 10%, #10b981 50%, transparent 90%);
                    box-shadow: 0 0 12px 2px rgba(16, 185, 129, 0.8);
                    animation: scanLaser 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    z-index: 10;
                    pointer-events: none;
                }

                /* Pulsing Status Ring */
                .pulsing-emerald {
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                    animation: pulseEmerald 2.5s infinite;
                }
                @keyframes pulseEmerald {
                    0% {
                        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 25px rgba(16, 185, 129, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
                    }
                }
            `}} />

            {/* Background elements */}
            <div className="radial-glow-1"></div>
            <div className="radial-glow-2"></div>
            <div className="grid-bg"></div>

            {/* Header */}
            <header className="flex justify-between items-center pb-4 border-b border-slate-800/60 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="material-symbols-outlined text-white text-2xl font-bold">fingerprint</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-extrabold tracking-[0.2em] text-slate-100 font-orbitron">PRECISION KIOSK</h1>
                        <p className="text-[10px] text-slate-500 font-label-mono uppercase tracking-widest">Attendance System</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <a 
                        href="/login" 
                        className="text-xs font-semibold text-slate-300 hover:text-white transition-all duration-200 flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 px-4 py-2 rounded-full shadow-sm cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[15px]">login</span>
                        Dashboard Login
                    </a>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold font-label-mono">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        TERMINAL ACTIVE
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center my-6 z-10 w-full max-w-6xl mx-auto">
                {!isActivated ? (
                    /* ACTIVATION SCREEN */
                    <div className="glass-panel p-8 sm:p-10 rounded-3xl w-full max-w-[440px] shadow-2xl flex flex-col gap-6 relative border border-slate-700/30">
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-3xl" />
                        
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <span className="material-symbols-outlined text-3xl text-emerald-500 animate-pulse">lock_open</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-white font-orbitron">Aktivasi Kiosk</h2>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Silakan masukkan Kode Aktivasi Terminal yang tertera pada akun Owner untuk menghubungkan browser Kiosk ini dengan sistem absensi outlet Anda.
                            </p>
                        </div>

                        <form onSubmit={handleActivate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase font-label-mono tracking-widest block">Kode Aktivasi</label>
                                <input
                                    placeholder="CONTOH: 1-A3F8B9"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-center text-md font-bold tracking-widest font-label-mono uppercase outline-none transition-all text-white placeholder-slate-600 shadow-inner"
                                />
                                {error && (
                                    <p className="text-xs text-red-400 text-center font-medium mt-2">{error}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 active:scale-[0.98] transition-all text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Memverifikasi Sistem...' : 'Aktifkan Kiosk Sekarang'}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* PREMIUM SPLIT KIOSK DISPLAY */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                        {/* LEFT WIDGET: Outlet & Digital Live Clock */}
                        <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
                            <div className="space-y-2 lg:space-y-3">
                                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold font-label-mono uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-[14px]">storefront</span>
                                    Outlet Terkoneksi
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight font-orbitron drop-shadow-md">
                                    {outletName}
                                </h2>
                                <p className="text-slate-400 text-sm font-semibold tracking-wider max-w-md">
                                    Pindai Kode QR dynamic di sebelah kanan untuk memperbarui data absensi harian Anda.
                                </p>
                            </div>

                            {/* Clock Widget */}
                            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/20 flex flex-col items-center lg:items-start gap-2 shadow-xl bg-gradient-to-br from-slate-900/60 to-slate-950/40">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-label-mono">Waktu Kiosk Lokal (WIB)</span>
                                <h4 className="text-5xl sm:text-6xl font-black font-orbitron text-white tracking-tight leading-none bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-slate-400 font-semibold mt-1">
                                    <span className="material-symbols-outlined text-base text-emerald-400">calendar_today</span>
                                    <span>
                                        {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT WIDGET: Advanced QR Code scanner display */}
                        <div className="lg:col-span-6 flex justify-center items-center">
                            <div className="glass-panel p-8 sm:p-10 rounded-[44px] shadow-2xl flex flex-col items-center gap-6 relative border border-slate-700/25 max-w-[420px] w-full pulsing-emerald">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-[44px]" />
                                
                                {/* Scanning Laser Area */}
                                <div className="p-4 bg-white rounded-[32px] shadow-inner relative overflow-hidden aspect-square w-full max-w-[280px]">
                                    {/* Moving scanning line */}
                                    {qrToken && <div className="scanner-line" />}
                                    
                                    {qrToken ? (
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrToken)}`}
                                            alt="QR Absensi Outlet"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-56 h-56 flex flex-col items-center justify-center text-xs font-label-mono text-slate-700 gap-2">
                                            <span className="material-symbols-outlined text-3xl animate-spin">refresh</span>
                                            <span>Mencari Token...</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 w-full text-center">
                                    {/* Countdown Timer */}
                                    <div className="text-[11px] font-bold font-label-mono text-emerald-400 bg-emerald-950/60 border border-emerald-950 px-4 py-2 rounded-full flex items-center justify-center gap-2 mx-auto max-w-[230px] shadow-inner">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                                        Token Kedaluwarsa: {qrCountdown}s
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                                        Buka menu kamera absensi di HP Anda, kemudian posisikan kamera menghadap Kode QR di atas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="flex justify-between items-center text-slate-600 border-t border-slate-900/60 pt-4 text-[10px] z-10">
                <p className="uppercase tracking-[0.25em] font-extrabold font-orbitron text-slate-500">Precision POS Ecosystem</p>
                {isActivated && (
                    <button
                        onClick={handleReset}
                        className="text-slate-500 hover:text-red-400 font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-colors bg-slate-950/60 hover:bg-red-950/20 border border-slate-900 hover:border-red-900/30 px-3.5 py-2 rounded-xl"
                        title="Reset terminal dari browser ini"
                    >
                        <span className="material-symbols-outlined text-sm font-bold">power_settings_new</span>
                        Reset Terminal
                    </button>
                )}
            </footer>
        </div>
    );
}

