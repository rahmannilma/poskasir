import { useMemo, useState, useEffect } from 'react';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface AttendanceLog {
    id: number;
    name: string;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
    is_clock_out: boolean;
    time: string;
}

interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    attendances: {
        id: number;
        date: string;
        clock_in: string;
        clock_out: string | null;
        status: string;
        notes: string | null;
    }[];
}

export default function AttendanceIndex() {
    const { 
        employees = null, 
        date = '', 
        search = '', 
        totalEmployees = 0, 
        presentCount = 0, 
        lateCount = 0, 
        absentCount = 0,
        myAttendanceToday = null,
        myHistory = null,
        owners = [],
        selectedOwnerId = '',
        attendanceMethod = 'manual',
        pendingMethodRequest = false,
        methodRequests = [],
        activationCode = null,
        auth = { user: null } 
    } = usePage<any>().props;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filterDate, setFilterDate] = useState(date || new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [currentTime, setCurrentTime] = useState(new Date());

    const currentUser = auth.user;

    // Owner and Terminal States
    const [selectedOwner, setSelectedOwner] = useState(selectedOwnerId || '');
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [qrAction, setQrAction] = useState<'masuk' | 'pulang'>('masuk');
    const [qrToken, setQrToken] = useState<string>('');
    const [qrCountdown, setQrCountdown] = useState<number>(20);
    const [terminalLogs, setTerminalLogs] = useState<any[]>([]);

    // Staff QR Scanner States
    const [attendanceMode, setAttendanceMode] = useState<'manual' | 'qr'>(attendanceMethod || 'manual');
    const [scannerActive, setScannerActive] = useState(false);
    const [html5Qrcode, setHtml5Qrcode] = useState<any>(null);

    // Keep attendanceMode synced with attendanceMethod
    useEffect(() => {
        if (attendanceMethod) {
            setAttendanceMode(attendanceMethod);
        }
    }, [attendanceMethod]);

    // Clock real-time update
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Load html5-qrcode script dynamically for staff scanner
    useEffect(() => {
        if (attendanceMode !== 'qr') {
            stopScanner();
            return;
        }

        const scriptId = 'html5-qrcode-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://unpkg.com/html5-qrcode';
            script.async = true;
            script.onload = () => {
                console.log('html5-qrcode library loaded');
            };
            document.body.appendChild(script);
        }

        return () => {
            stopScanner();
        };
    }, [attendanceMode]);

    // Owner Terminal QR fetcher & logs polling
    useEffect(() => {
        if (!isTerminalOpen) return;

        let tokenInterval: NodeJS.Timeout;
        let logInterval: NodeJS.Timeout;

        const fetchToken = async () => {
            try {
                const res = await fetch(`/api/absensi/shop-qr-token?action=${qrAction}`);
                const data = await res.json();
                if (data.success) {
                    setQrToken(data.token);
                    setQrCountdown(data.expires_in);
                }
            } catch (err) {
                console.error("Failed to fetch shop QR token", err);
            }
        };

        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/absensi/today-log');
                const data = await res.json();
                if (data.success) {
                    setTerminalLogs(data.log);
                }
            } catch (err) {
                console.error("Failed to fetch today log", err);
            }
        };

        fetchToken();
        fetchLogs();

        tokenInterval = setInterval(() => {
            setQrCountdown((prev) => {
                if (prev <= 1) {
                    fetchToken();
                    return 20;
                }
                return prev - 1;
            });
        }, 1000);

        logInterval = setInterval(fetchLogs, 5000);

        return () => {
            clearInterval(tokenInterval);
            clearInterval(logInterval);
        };
    }, [isTerminalOpen, qrAction]);

    // Form handlers for Employee Check-in
    const checkInForm = useForm({
        notes: '',
    });

    const handleClockIn = (e: React.FormEvent) => {
        e.preventDefault();
        checkInForm.post('/absensi/clock-in', {
            onSuccess: () => {
                checkInForm.reset();
                toast.success("Absen Masuk berhasil dicatat!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal mencatat Absen Masuk.";
                toast.error(firstErr);
            }
        });
    };

    const handleClockOut = () => {
        router.post('/absensi/clock-out', {}, {
            onSuccess: () => {
                toast.success("Absen Pulang berhasil dicatat!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal mencatat Absen Pulang.";
                toast.error(firstErr);
            }
        });
    };

    // Scanner helper methods
    const startScanner = () => {
        const Html5Qrcode = (window as any).Html5Qrcode;
        if (!Html5Qrcode) {
            toast.error("Pustaka scanner sedang dimuat, silakan coba lagi.");
            return;
        }

        try {
            const scanner = new Html5Qrcode("reader");
            setHtml5Qrcode(scanner);
            setScannerActive(true);

            scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 220, height: 220 }
                },
                (decodedText: string) => {
                    scanner.stop().then(() => {
                        setScannerActive(false);
                        setHtml5Qrcode(null);
                        processQrCode(decodedText);
                    });
                },
                (errorMessage: string) => {
                    // Ignore errors (no QR code in frame)
                }
            ).catch((err: any) => {
                console.error("Camera start error", err);
                toast.error("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
                setScannerActive(false);
                setHtml5Qrcode(null);
            });
        } catch (e) {
            console.error("Scanner init error", e);
            setScannerActive(false);
        }
    };

    const stopScanner = () => {
        if (html5Qrcode) {
            try {
                html5Qrcode.stop().then(() => {
                    setScannerActive(false);
                    setHtml5Qrcode(null);
                }).catch((err: any) => {
                    console.error("Scanner stop error", err);
                    setScannerActive(false);
                    setHtml5Qrcode(null);
                });
            } catch (e) {
                setScannerActive(false);
                setHtml5Qrcode(null);
            }
        }
    };

    const processQrCode = (token: string) => {
        const action = !myAttendanceToday ? 'masuk' : 'pulang';
        const xsrfToken = decodeURIComponent(
            document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] || ''
        );

        toast.promise(
            fetch('/api/absensi/scan-shop-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken
                },
                body: JSON.stringify({ token, action })
            }).then(async (res) => {
                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Gagal memproses QR Code.");
                }
                return data;
            }),
            {
                loading: 'Memverifikasi presensi...',
                success: (data) => {
                    router.reload();
                    return data.message || 'Presensi berhasil dicatat!';
                },
                error: (err) => err.message
            }
        );
    };

    // Owner filter submit
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params: any = { date: filterDate, search: searchTerm };
        if (currentUser?.role === 'super_admin') {
            params.owner_id = selectedOwner;
        }
        router.get('/absensi', params, { preserveState: true });
    };

    // Reset Owner filters
    const handleResetFilter = () => {
        setFilterDate(new Date().toISOString().split('T')[0]);
        setSearchTerm('');
        setSelectedOwner('');
        router.get('/absensi');
    };

    const handleMethodRequest = () => {
        router.post('/absensi/method-request', {}, {
            onSuccess: () => {
                toast.success("Pengajuan peralihan ke QR Code berhasil dikirim!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal mengirim pengajuan.";
                toast.error(firstErr);
            }
        });
    };

    const handleApproveRequest = (id: number) => {
        router.post(`/absensi/method-requests/${id}/approve`, {}, {
            onSuccess: () => {
                toast.success("Pengajuan peralihan metode absensi disetujui!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menyetujui pengajuan.";
                toast.error(firstErr);
            }
        });
    };

    const handleRejectRequest = (id: number) => {
        router.post(`/absensi/method-requests/${id}/reject`, {}, {
            onSuccess: () => {
                toast.success("Pengajuan peralihan metode absensi ditolak!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menolak pengajuan.";
                toast.error(firstErr);
            }
        });
    };

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'US';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    const formatPrice = (value: number | string) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Kehadiran Karyawan</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
            </Head>

            {/* Custom Styles Injector to strictly match Pro-Red Minimalist theme */}
            <style dangerouslySetInnerHTML={{__html: `
                body, html, #app, main {
                    background-color: #f7f9fb !important;
                    color: #191c1e !important;
                    font-family: 'Inter', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
                :root, .dark, body, html, #app, main {
                    --background: #f7f9fb !important;
                    --foreground: #191c1e !important;
                    --font-sans: 'Inter', sans-serif !important;
                    --card: #ffffff !important;
                    --card-foreground: #191c1e !important;
                    --border: #e6e8ea !important;
                    --sidebar: #f2f4f6 !important;
                    --sidebar-foreground: #515f74 !important;
                    --sidebar-border: #e2e8f0 !important;
                    --surface-container-lowest: #ffffff !important;
                    --surface-container-low: #f2f4f6 !important;
                    --surface-container: #eceef0 !important;
                    --surface-container-high: #e6e8ea !important;
                    --surface-container-highest: #e0e3e5 !important;
                    --outline-variant: #e2e8f0 !important;
                    --on-surface: #191c1e !important;
                    --on-surface-variant: #334155 !important;
                    --primary: #0d9488 !important;
                    --on-primary: #ffffff !important;
                    --secondary: #515f74 !important;
                    --error: #ba1a1a !important;
                    --error-container: #ffdad6 !important;
                }
                .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined';
                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
                    display: inline-block;
                    line-height: 1;
                }
                .active-icon {
                    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                .font-label-mono {
                    font-family: 'JetBrains Mono', monospace;
                }
                
                /* Scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #f5f5f5;
                }
                ::-webkit-scrollbar-thumb {
                    background: #0d9488;
                    border-radius: 0;
                }
                .shadow-soft {
                    box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05);
                }
            `}} />

            {/* Mobile Sidebar Backdrop Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity duration-300" 
                    onClick={() => setIsSidebarOpen(false)} 
                />
            )}

            {/* SideNavBar Shell */}
            <aside className={`fixed left-0 top-0 h-full flex flex-col bg-white border-r border-surface-container-high w-72 z-30 transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <div className="p-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                        <span className="material-symbols-outlined text-white text-3xl">terminal</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-on-surface uppercase">{currentUser?.outlet_name || 'CAFE RESTO'}</h1>
                    </div>
                </div>
                
                <div className="flex-grow px-4 mt-4 flex flex-col gap-2">
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/dashboard">
                            <span className="material-symbols-outlined group-hover:text-primary">dashboard</span>
                            <span className="text-[15px] font-sans">Dashboard</span>
                        </Link>
                    )}
                    {currentUser?.role === 'super_admin' && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/owners">
                            <span className="material-symbols-outlined group-hover:text-primary">supervised_user_circle</span>
                            <span className="text-[15px] font-sans">Pantau Owner</span>
                        </Link>
                    )}
                    <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/transactions">
                        <span className="material-symbols-outlined group-hover:text-primary">receipt_long</span>
                        <span className="text-[15px] font-sans">Transactions</span>
                    </Link>
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/products">
                            <span className="material-symbols-outlined group-hover:text-primary">inventory_2</span>
                            <span className="text-[15px] font-sans">Produk</span>
                        </Link>
                    )}
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/categories">
                            <span className="material-symbols-outlined group-hover:text-primary">category</span>
                            <span className="text-[15px] font-sans">Kategori</span>
                        </Link>
                    )}
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/tables">
                            <span className="material-symbols-outlined group-hover:text-primary">qr_code</span>
                            <span className="text-[15px] font-sans">Meja & QR</span>
                        </Link>
                    )}
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/materials">
                            <span className="material-symbols-outlined group-hover:text-primary">grocery</span>
                            <span className="text-[15px] font-sans">Bahan Baku</span>
                        </Link>
                    )}
                    {['owner', 'super_admin'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/staff">
                            <span className="material-symbols-outlined group-hover:text-primary">groups</span>
                            <span className="text-[15px] font-sans">Staff</span>
                        </Link>
                    )}
                    <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/absensi">
                        <span className="material-symbols-outlined active-icon text-primary">fingerprint</span>
                        <span className="text-[15px] font-sans">Absensi</span>
                    </Link>
                    <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/shifts">
                        <span className="material-symbols-outlined group-hover:text-primary">schedule</span>
                        <span className="text-[15px] font-sans">Shift Kerja</span>
                    </Link>
                    {currentUser?.role !== 'owner' && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href={['owner', 'super_admin', 'manager'].includes(currentUser?.role) ? '/pos' : '/kasir'}>
                            <span className="material-symbols-outlined group-hover:text-primary">shopping_cart</span>
                            <span className="text-[15px] font-sans">POS Kasir</span>
                        </Link>
                    )}

                    <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/settings">
                        <span className="material-symbols-outlined group-hover:text-primary">settings</span>
                        <span className="text-[15px] font-sans">Settings</span>
                    </Link>
                </div>

                <div className="p-6 mt-auto border-t border-surface-container-high">
                    <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-primary text-sm font-label-mono">
                            {userInitials}
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-bold text-on-surface truncate">{currentUser?.name || 'Admin Store'}</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Shift Active</p>
                        </div>
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="text-secondary hover:text-red-600 transition-colors flex items-center"
                        >
                            <span className="material-symbols-outlined">logout</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Top Navigation */}
            <header className="fixed top-0 right-0 left-0 lg:left-72 flex justify-between items-center px-4 sm:px-[32px] h-20 bg-white/80 backdrop-blur-md border-b border-surface-container-high z-10">
                <div className="flex items-center gap-2 sm:gap-8">
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="lg:hidden p-2 -ml-2 text-secondary hover:bg-surface-container-low rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <h2 className="text-lg font-bold text-on-surface tracking-tight whitespace-nowrap">Manajemen Absensi</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold font-label-mono">POS-01</span>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="ml-0 lg:ml-72 pt-24 px-4 sm:px-[32px] pb-[32px] min-h-screen">
                
                {['owner', 'super_admin'].includes(currentUser?.role) && employees ? (
                    /* OWNER VIEW */
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Rekap Absensi Harian</h2>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                    <p className="text-xs text-secondary/60 font-medium font-label-mono">Laporan kehadiran seluruh staff outlet</p>
                                    <span className="text-xs text-secondary/40">•</span>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                        attendanceMethod === 'qr' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                    }`}>
                                        <span className="material-symbols-outlined text-[12px]">{attendanceMethod === 'qr' ? 'qr_code' : 'edit_document'}</span>
                                        Metode: {attendanceMethod === 'qr' ? 'QR Code' : 'Manual'}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                {attendanceMethod === 'qr' && (
                                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                                        <Button 
                                            onClick={() => setIsTerminalOpen(true)}
                                            size="lg"
                                            className="justify-center px-4 bg-primary text-white font-bold text-xs rounded-lg hover:bg-primary/95 flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer whitespace-nowrap"
                                        >
                                            <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                                            TERMINAL (LOGIN)
                                        </Button>
                                        
                                        {activationCode && (
                                            <>
                                                <a 
                                                    href="/absensi/terminal"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex justify-center items-center gap-2 px-4 h-10 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-lg shadow-lg shadow-secondary/20 cursor-pointer whitespace-nowrap"
                                                >
                                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                    TERMINAL PUBLIK
                                                </a>
                                                
                                                <div className="flex items-center gap-2 bg-white border border-surface-container-high px-3 h-10 rounded-lg">
                                                    <span className="text-[10px] font-bold text-secondary uppercase font-label-mono">Kode Aktivasi:</span>
                                                    <span className="text-xs font-bold font-label-mono text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 select-all">{activationCode}</span>
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(activationCode);
                                                            toast.success("Kode Aktivasi berhasil disalin!");
                                                        }}
                                                        className="text-secondary hover:text-primary transition-colors flex items-center shrink-0"
                                                        title="Salin Kode"
                                                    >
                                                        <span className="material-symbols-outlined text-base">content_copy</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {currentUser?.role === 'owner' && attendanceMethod === 'manual' && (
                                    pendingMethodRequest ? (
                                        <div className="inline-flex items-center gap-1.5 px-4 h-10 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold justify-center">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                            Menunggu Persetujuan Peralihan QR Code
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={handleMethodRequest}
                                            size="lg"
                                            className="justify-center px-4 bg-amber-600 text-white font-bold text-xs rounded-lg hover:bg-amber-700 flex items-center gap-2 shadow-lg shadow-amber-600/20 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-sm">swap_horiz</span>
                                            AJUKAN PERALIHAN KE QR CODE
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Stats Summary Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-2xl p-6 border border-surface-container-high shadow-soft flex items-center gap-4">
                                <div className="p-3 bg-stone-100 text-stone-600 rounded-xl">
                                    <span className="material-symbols-outlined text-2xl">groups</span>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary/60 font-bold uppercase tracking-wider">Total Staff</p>
                                    <h4 className="text-xl font-bold text-on-surface font-label-mono">{totalEmployees}</h4>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-surface-container-high shadow-soft flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary/60 font-bold uppercase tracking-wider">Hadir Tepat Waktu</p>
                                    <h4 className="text-xl font-bold text-emerald-600 font-label-mono">{presentCount}</h4>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-surface-container-high shadow-soft flex items-center gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                    <span className="material-symbols-outlined text-2xl">warning</span>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary/60 font-bold uppercase tracking-wider">Terlambat</p>
                                    <h4 className="text-xl font-bold text-amber-600 font-label-mono">{lateCount}</h4>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-surface-container-high shadow-soft flex items-center gap-4">
                                <div className="p-3 bg-red-50/50 text-primary rounded-xl">
                                    <span className="material-symbols-outlined text-2xl">cancel</span>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary/60 font-bold uppercase tracking-wider">Belum Absen/Mangkir</p>
                                    <h4 className="text-xl font-bold text-primary font-label-mono">{absentCount}</h4>
                                </div>
                            </div>
                        </div>

                        {/* Super Admin Approval Panel for Method Requests */}
                        {currentUser?.role === 'super_admin' && methodRequests && methodRequests.length > 0 && (
                            <div className="bg-white border border-surface-container-high rounded-2xl shadow-soft p-6 space-y-4">
                                <div className="flex items-center gap-2 pb-3 border-b border-surface-container-low">
                                    <span className="material-symbols-outlined text-amber-500">pending_actions</span>
                                    <h3 className="text-base font-bold text-on-surface">Persetujuan Peralihan Metode Absensi Toko</h3>
                                </div>
                                <div className="divide-y divide-surface-container-low">
                                    {methodRequests.map((req: any) => (
                                        <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold text-on-surface">
                                                    {req.owner?.outlet_name || 'Outlet Tanpa Nama'}
                                                </h4>
                                                <p className="text-xs text-secondary/70">
                                                    Owner: <span className="font-semibold text-on-surface">{req.owner?.name}</span> ({req.owner?.email})
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded uppercase font-label-mono">
                                                        {req.current_method}
                                                    </span>
                                                    <span className="material-symbols-outlined text-xs text-secondary/60">arrow_forward</span>
                                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-label-mono">
                                                        {req.requested_method}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleApproveRequest(req.id)}
                                                    className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg cursor-pointer"
                                                >
                                                    Setujui Peralihan
                                                </Button>
                                                <Button
                                                    onClick={() => handleRejectRequest(req.id)}
                                                    variant="ghost"
                                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg cursor-pointer"
                                                >
                                                    Tolak
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filter Bar */}
                        <form onSubmit={handleFilterSubmit} className="bg-white border border-surface-container-high p-4 rounded-2xl shadow-soft flex flex-col md:flex-row gap-4 items-end">
                            {currentUser?.role === 'super_admin' && owners && owners.length > 0 && (
                                <div className="flex-1 w-full space-y-1.5">
                                    <label className="text-[10px] font-bold text-secondary uppercase font-label-mono font-semibold">Pilih Owner</label>
                                    <select
                                        value={selectedOwner}
                                        onChange={(e) => setSelectedOwner(e.target.value)}
                                        className="w-full px-3 py-2 bg-surface-container-low border border-surface-container-high focus:bg-white text-xs font-semibold rounded-lg outline-none cursor-pointer h-9 text-on-surface"
                                    >
                                        <option value="">Semua Owner</option>
                                        {owners.map((owner: any) => (
                                            <option key={owner.id} value={owner.id}>
                                                {owner.name} ({owner.outlet_name || 'Resto'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="flex-1 w-full space-y-1.5">
                                <label className="text-[10px] font-bold text-secondary uppercase font-label-mono font-semibold">Pilih Tanggal</label>
                                <Input 
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="bg-surface-container-low border-surface-container-high focus:bg-white text-xs font-semibold rounded-lg outline-none"
                                />
                            </div>
                            <div className="flex-1 w-full space-y-1.5">
                                <label className="text-[10px] font-bold text-secondary uppercase font-label-mono font-semibold">Cari Nama Karyawan</label>
                                <Input 
                                    placeholder="Ketik nama karyawan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-surface-container-low border-surface-container-high focus:bg-white text-xs font-semibold rounded-lg outline-none"
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button type="submit" className="flex-grow md:flex-grow-0 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95">
                                    Terapkan Filter
                                </Button>
                                <Button type="button" onClick={handleResetFilter} variant="ghost" className="px-4 py-2.5 text-xs text-secondary bg-surface-container-low rounded-lg hover:bg-surface-container-high">
                                    Reset
                                </Button>
                            </div>
                        </form>

                        {/* Recap Table */}
                        <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-base font-bold text-on-surface">Data Log Absensi Tanggal: {new Date(filterDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[11px] uppercase tracking-wider font-label-mono">
                                            <th className="px-6 py-4">Nama Pegawai</th>
                                            <th className="px-6 py-4">Jabatan</th>
                                            <th className="px-6 py-4 text-center">Absen Masuk</th>
                                            <th className="px-6 py-4 text-center">Absen Pulang</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4">Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-container-low">
                                        {employees.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-xs font-label-mono text-secondary">
                                                    Tidak ada data absensi untuk pencarian ini.
                                                </td>
                                            </tr>
                                        ) : (
                                            employees.data.map((emp: Employee) => {
                                                const att = emp.attendances[0] || null;
                                                return (
                                                    <tr key={emp.id} className="hover:bg-surface-container-low/30 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-bold text-on-surface">{emp.name}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-block text-[10px] font-bold bg-surface-container text-secondary px-2.5 py-0.5 rounded-md uppercase font-label-mono">
                                                                {emp.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-xs font-semibold font-label-mono">
                                                            {att && att.clock_in ? new Date(att.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-xs font-semibold font-label-mono">
                                                            {att && att.clock_out ? new Date(att.clock_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {att ? (
                                                                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                                                                    att.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                                                                    att.status === 'late' ? 'bg-amber-50 text-amber-700' :
                                                                    att.status === 'leave' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-primary'
                                                                }`}>
                                                                    {att.status === 'present' ? 'Hadir' :
                                                                     att.status === 'late' ? 'Terlambat' :
                                                                     att.status === 'leave' ? 'Izin' : 'Mangkir'}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-primary uppercase">
                                                                    Mangkir
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs text-secondary/70 italic max-w-xs truncate">
                                                            {att?.notes || '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* STAFF/EMPLOYEE VIEW */
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Presensi Kehadiran</h2>
                                <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Silakan lakukan pencatatan absen masuk dan pulang harian</p>
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-secondary/10 text-secondary rounded-full font-label-mono shadow-sm">
                                <span className="material-symbols-outlined text-[14px]">{attendanceMethod === 'qr' ? 'qr_code' : 'edit_document'}</span>
                                Metode Absensi Aktif: {attendanceMethod === 'qr' ? 'QR Code' : 'Manual'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Check in form */}
                            <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft p-6 flex flex-col justify-between items-center text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
                                
                                <div className="my-4 space-y-1">
                                    <span className="material-symbols-outlined text-4xl text-primary font-bold animate-pulse">schedule</span>
                                    <h4 className="text-3xl font-bold font-label-mono text-on-surface">
                                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </h4>
                                    <p className="text-xs text-secondary/60 font-semibold uppercase tracking-wider">
                                        {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>

                                {/* Toggle Mode Absensi - Hidden to lock active method */}

                                {/* Clock status card */}
                                {!myAttendanceToday ? (
                                    attendanceMode === 'manual' ? (
                                        <form onSubmit={handleClockIn} className="w-full space-y-4 pt-4 border-t border-surface-container-low mt-4 flex-grow flex flex-col justify-between">
                                            <div className="space-y-1 text-left">
                                                <label className="text-[10px] font-bold text-secondary uppercase font-label-mono">Catatan Kehadiran (Opsional)</label>
                                                <Input 
                                                    placeholder="Contoh: Sedang hujan, macet, dll..."
                                                    value={checkInForm.data.notes}
                                                    onChange={(e) => checkInForm.setData('notes', e.target.value)}
                                                    className="bg-surface-container-low border-surface-container-high focus:bg-white text-xs rounded-lg outline-none py-2"
                                                />
                                            </div>
                                            <Button 
                                                type="submit" 
                                                disabled={checkInForm.processing}
                                                className="w-full py-6 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all text-xs uppercase tracking-wider cursor-pointer"
                                            >
                                                Absen Masuk (Clock-In)
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="w-full space-y-4 pt-4 border-t border-surface-container-low mt-4 flex-grow flex flex-col items-center">
                                            <p className="text-xs text-secondary/70 max-w-[200px] mb-2">Posisikan kamera HP Anda ke QR Code Toko (Masuk).</p>
                                            
                                            {/* Video Frame container */}
                                            <div id="reader" className="w-full max-w-[240px] aspect-square bg-surface-container rounded-xl overflow-hidden border border-surface-container-high flex items-center justify-center font-label-mono text-[10px] text-secondary relative">
                                                {!scannerActive && (
                                                    <span className="material-symbols-outlined text-4xl text-secondary/40 absolute">photo_camera</span>
                                                )}
                                            </div>

                                            {scannerActive ? (
                                                <Button 
                                                    type="button"
                                                    onClick={stopScanner}
                                                    className="w-full py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:bg-secondary/95 transition-all text-xs uppercase tracking-wider cursor-pointer"
                                                >
                                                    Matikan Kamera
                                                </Button>
                                            ) : (
                                                <Button 
                                                    type="button"
                                                    onClick={startScanner}
                                                    className="w-full py-6 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all text-xs uppercase tracking-wider cursor-pointer animate-bounce"
                                                >
                                                    Buka Kamera & Scan
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : !myAttendanceToday.clock_out ? (
                                    attendanceMode === 'manual' ? (
                                        <div className="w-full space-y-4 pt-4 border-t border-surface-container-low mt-4 flex-grow flex flex-col justify-between">
                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-left space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-emerald-700 font-semibold">Absen Masuk:</span>
                                                    <span className="font-bold font-mono text-emerald-800">
                                                        {new Date(myAttendanceToday.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-emerald-700 font-semibold">Status:</span>
                                                    <span className="font-bold uppercase text-[9px] px-2 py-0.5 rounded bg-emerald-500 text-white font-label-mono">
                                                        {myAttendanceToday.status === 'present' ? 'Tepat Waktu' : 'Terlambat'}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={handleClockOut}
                                                className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all text-xs uppercase tracking-wider cursor-pointer"
                                            >
                                                Absen Pulang (Clock-Out)
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-full space-y-4 pt-4 border-t border-surface-container-low mt-4 flex-grow flex flex-col items-center">
                                            <p className="text-xs text-secondary/70 max-w-[200px] mb-2">Posisikan kamera HP Anda ke QR Code Toko (Pulang).</p>
                                            
                                            {/* Video Frame container */}
                                            <div id="reader" className="w-full max-w-[240px] aspect-square bg-surface-container rounded-xl overflow-hidden border border-surface-container-high flex items-center justify-center font-label-mono text-[10px] text-secondary relative">
                                                {!scannerActive && (
                                                    <span className="material-symbols-outlined text-4xl text-secondary/40 absolute">photo_camera</span>
                                                )}
                                            </div>

                                            {scannerActive ? (
                                                <Button 
                                                    type="button"
                                                    onClick={stopScanner}
                                                    className="w-full py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:bg-secondary/95 transition-all text-xs uppercase tracking-wider cursor-pointer"
                                                >
                                                    Matikan Kamera
                                                </Button>
                                            ) : (
                                                <Button 
                                                    type="button"
                                                    onClick={startScanner}
                                                    className="w-full py-6 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all text-xs uppercase tracking-wider cursor-pointer animate-bounce"
                                                >
                                                    Buka Kamera & Scan
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="w-full py-12 flex flex-col items-center justify-center text-emerald-600 gap-2">
                                        <span className="material-symbols-outlined text-5xl">task_alt</span>
                                        <h5 className="font-bold text-sm text-on-surface">Absensi Selesai</h5>
                                        <p className="text-xs text-secondary/60 max-w-[200px] text-center leading-relaxed">
                                            Terima kasih atas kerja keras Anda hari ini! Data presensi Anda telah tersimpan dengan aman.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Personal history list */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-container-high shadow-soft p-6 overflow-hidden flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-4 border-b border-surface-container-low pb-4">
                                    <h3 className="font-bold text-on-surface text-base">Riwayat Kehadiran Karyawan</h3>
                                </div>

                                <div className="overflow-x-auto flex-grow">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[10px] uppercase tracking-wider font-label-mono">
                                                <th className="px-4 py-3">Tanggal</th>
                                                <th className="px-4 py-3 text-center">Masuk</th>
                                                <th className="px-4 py-3 text-center">Pulang</th>
                                                <th className="px-4 py-3 text-center">Status</th>
                                                <th className="px-4 py-3">Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surface-container-low">
                                            {myHistory && myHistory.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-8 text-center text-xs font-label-mono text-secondary">
                                                        Belum ada riwayat absensi.
                                                    </td>
                                                </tr>
                                            ) : (
                                                myHistory?.data.map((hist: any) => (
                                                    <tr key={hist.id} className="hover:bg-surface-container-low/20 transition-colors">
                                                        <td className="px-4 py-3 text-xs font-bold text-on-surface">
                                                            {new Date(hist.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-xs font-semibold font-label-mono">
                                                            {hist.clock_in ? new Date(hist.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-xs font-semibold font-label-mono">
                                                            {hist.clock_out ? new Date(hist.clock_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                                hist.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                                                                hist.status === 'late' ? 'bg-amber-50 text-amber-700' :
                                                                hist.status === 'leave' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-primary'
                                                            }`}>
                                                                {hist.status === 'present' ? 'Hadir' :
                                                                 hist.status === 'late' ? 'Terlambat' :
                                                                 hist.status === 'leave' ? 'Izin' : 'Mangkir'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-secondary/60 italic truncate max-w-[150px]">
                                                            {hist.notes || '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* TERMINAL QR ABSENSI DIALOG */}
            <Dialog open={isTerminalOpen} onOpenChange={(open) => {
                setIsTerminalOpen(open);
                if (!open) {
                    setQrToken('');
                }
            }}>
                <DialogContent className="sm:max-w-[500px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl p-6">
                    <DialogHeader className="pb-3 border-b border-surface-container-high flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="text-base text-primary font-bold">Terminal QR Absensi</DialogTitle>
                            <DialogDescription className="text-xs text-secondary/60">
                                Scan QR Code ini menggunakan HP Anda untuk absensi.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="py-4 flex flex-col items-center gap-4 text-center">
                        {/* Selector Aksi (Masuk / Pulang) */}
                        <div className="flex bg-surface-container p-1 rounded-xl w-full border border-surface-container-high">
                            <button
                                type="button"
                                onClick={() => setQrAction('masuk')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                    qrAction === 'masuk' 
                                        ? 'bg-white text-primary shadow-sm' 
                                        : 'text-secondary/70 hover:text-on-surface'
                                }`}
                            >
                                Absen Masuk (Clock-In)
                            </button>
                            <button
                                type="button"
                                onClick={() => setQrAction('pulang')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                    qrAction === 'pulang' 
                                        ? 'bg-white text-primary shadow-sm' 
                                        : 'text-secondary/70 hover:text-on-surface'
                                }`}
                            >
                                Absen Pulang (Clock-Out)
                            </button>
                        </div>

                        {/* Display QR Code */}
                        <div className="my-2 p-4 bg-white border border-surface-container-high rounded-2xl shadow-inner relative flex flex-col items-center">
                            {qrToken ? (
                                <>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrToken)}`}
                                        alt="QR Absensi Toko"
                                        className="w-48 h-48 object-contain"
                                    />
                                    <div className="mt-3 text-[10px] font-bold font-label-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                        Token Aktif ({qrCountdown}s)
                                    </div>
                                </>
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center text-xs font-label-mono text-secondary">
                                    Membuat QR Code...
                                </div>
                            )}
                        </div>

                        {/* Recent Scan Logs List */}
                        <div className="w-full text-left space-y-2 border-t border-surface-container-low pt-4">
                            <h4 className="text-xs font-bold text-on-surface font-label-mono">Scan Terbaru Hari Ini (Real-time):</h4>
                            <div className="max-h-36 overflow-y-auto space-y-2 divide-y divide-surface-container-low">
                                {terminalLogs.length === 0 ? (
                                    <p className="text-[11px] text-secondary/60 italic text-center py-4 font-label-mono">Belum ada aktivitas scan hari ini.</p>
                                ) : (
                                    terminalLogs.map((log, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 text-xs">
                                            <div>
                                                <span className="font-bold text-on-surface block">{log.name}</span>
                                                <span className="text-[10px] text-secondary/60">{log.time}</span>
                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                                log.is_clock_out ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                                {log.is_clock_out ? 'Pulang' : 'Masuk'}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-2 pt-3 border-t border-surface-container-high flex justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary cursor-pointer"
                            onClick={() => setIsTerminalOpen(false)}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

