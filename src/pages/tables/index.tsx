import { useMemo, useState, useEffect } from 'react';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface DiningTable {
    id: number;
    number: string;
    status: string;
    created_at: string;
}

export default function Index() {
    const { tables = [], auth = { user: null } } = usePage<any>().props;

    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Dialog state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<DiningTable | null>(null);

    // Print state
    const [printTarget, setPrintTarget] = useState<'all' | DiningTable | null>(null);

    const currentUser = auth.user;

    // Form handlers
    const addForm = useForm({
        number: '',
    });

    const editForm = useForm({
        number: '',
        status: 'active',
    });

    // Metrics calculations
    const totalTables = tables.length;
    const activeTables = tables.filter((t: DiningTable) => t.status === 'active').length;
    const inactiveTables = tables.filter((t: DiningTable) => t.status === 'inactive').length;

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'OW';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    // Filter tables locally
    const filteredTables = useMemo(() => {
        return tables.filter((table: DiningTable) => {
            return table.number.toLowerCase().includes(search.toLowerCase());
        });
    }, [tables, search]);

    // Handle trigger print
    useEffect(() => {
        if (printTarget !== null) {
            const timer = setTimeout(() => {
                window.print();
                setPrintTarget(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [printTarget]);

    // Submit handlers
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/tables', {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
                toast.success("Meja berhasil ditambahkan!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menambahkan meja.";
                toast.error(firstErr);
            }
        });
    };

    const handleEditOpen = (table: DiningTable) => {
        setSelectedTable(table);
        editForm.setData({
            number: table.number,
            status: table.status,
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable) return;

        editForm.put(`/tables/${selectedTable.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                toast.success("Meja berhasil diperbarui!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal memperbarui meja.";
                toast.error(firstErr);
            }
        });
    };

    const handleDeleteOpen = (table: DiningTable) => {
        setSelectedTable(table);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable) return;

        router.delete(`/tables/${selectedTable.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                toast.success("Meja berhasil dihapus!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menghapus meja.";
                toast.error(firstErr);
            }
        });
    };

    // Helper to get Table Order URL
    const getTableUrl = (tableNumber: string) => {
        return `${window.location.origin}/order/${encodeURIComponent(tableNumber)}`;
    };

    // Helper to get QR Code Image Src using qrserver API
    const getQrSrc = (tableNumber: string) => {
        const url = getTableUrl(tableNumber);
        return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Kelola Meja & QR</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
            </Head>

            {/* Print and custom styles */}
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
                .shadow-soft {
                    box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05);
                }
                
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    .print-layout {
                        display: block !important;
                        background: white !important;
                        min-height: 100vh;
                        padding: 20px;
                    }
                    .print-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 30px;
                    }
                    .print-card {
                        page-break-inside: avoid;
                        break-inside: avoid;
                        border: 3px dashed #0d9488;
                        border-radius: 16px;
                        padding: 24px;
                        text-align: center;
                        background: white;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        box-sizing: border-box;
                    }
                }
                @media screen {
                    .print-layout {
                        display: none !important;
                    }
                }
            `}} />

            {/* SCREEN VIEW (no-print) */}
            <div className="no-print">
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
                    
                    <div className="flex-grow px-4 mt-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                        {/* Dashboard */}
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
                        {/* Active Tab: Meja & QR */}
                        {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                            <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/tables">
                                <span className="material-symbols-outlined active-icon">qr_code</span>
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
                        {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                            <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/customers">
                                <span className="material-symbols-outlined group-hover:text-primary">loyalty</span>
                                <span className="text-[15px] font-sans">Pelanggan</span>
                            </Link>
                        )}
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/absensi">
                            <span className="material-symbols-outlined group-hover:text-primary">fingerprint</span>
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
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-4 text-secondary/50">search</span>
                            <input 
                                className="pl-12 pr-4 py-2.5 bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/30 rounded-full w-32 xs:w-48 sm:w-96 text-sm transition-all outline-none" 
                                placeholder="Cari nomor meja..." 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
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
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 mt-2">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Kelola Meja & QR</h2>
                            <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Daftar meja restoran dan cetak QR Code pemesanan pelanggan</p>
                        </div>
                        <div className="w-full md:w-auto flex gap-2">
                            {tables.filter((t: DiningTable) => t.status === 'active').length > 0 && (
                                <button 
                                    onClick={() => setPrintTarget('all')}
                                    className="w-full md:w-auto justify-center px-4 py-2.5 bg-secondary text-white font-bold text-sm rounded-lg hover:bg-secondary/90 transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-lg">print</span>
                                    CETAK SEMUA QR
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    addForm.reset();
                                    setIsAddOpen(true);
                                }}
                                className="w-full md:w-auto justify-center px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                TAMBAH MEJA
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Total Meja */}
                        <div className="bg-red-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-primary shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">table_restaurant</span>
                                </div>
                                <span className="flex items-center text-primary font-bold text-[10px] bg-primary/10 px-2 py-0.5 rounded-full uppercase font-label-mono">Total</span>
                            </div>
                            <p className="text-sm font-medium text-secondary/70 mb-1">Total Meja</p>
                            <h3 className="text-2xl font-bold text-on-surface font-label-mono">{totalTables}</h3>
                            <p className="text-[10px] text-secondary/50 mt-2 font-medium">Meja terdaftar di sistem</p>
                        </div>

                        {/* Meja Aktif */}
                        <div className="bg-emerald-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-emerald-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <span className="flex items-center text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Aktif</span>
                            </div>
                            <p className="text-sm font-medium text-secondary/70 mb-1">Meja Aktif</p>
                            <h3 className="text-2xl font-bold text-on-surface font-label-mono">{activeTables}</h3>
                            <p className="text-[10px] text-secondary/50 mt-2 font-medium">QR Code aktif & dapat dipesan</p>
                        </div>

                        {/* Meja Nonaktif */}
                        <div className="bg-amber-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-amber-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">cancel</span>
                                </div>
                                <span className="flex items-center text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Nonaktif</span>
                            </div>
                            <p className="text-sm font-medium text-secondary/70 mb-1">Meja Nonaktif</p>
                            <h3 className="text-2xl font-bold text-on-surface font-label-mono">{inactiveTables}</h3>
                            <p className="text-[10px] text-secondary/50 mt-2 font-medium">Pemesanan mandiri dinonaktifkan</p>
                        </div>
                    </div>

                    {/* Tables Grid Layout */}
                    <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-on-surface">Daftar Meja & QR Code</h3>
                            <span className="text-xs font-semibold text-secondary/60 bg-surface-container-low px-3 py-1 rounded-full font-label-mono">
                                {filteredTables.length} Meja Ditemukan
                            </span>
                        </div>

                        {filteredTables.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center text-secondary py-12 font-label-mono text-xs">
                                <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">qr_code</span>
                                <p>Tidak ada meja yang ditemukan.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredTables.map((table: DiningTable) => (
                                    <div 
                                        key={table.id} 
                                        className="bg-surface-container-low border border-surface-container-high rounded-2xl p-4 flex flex-col items-center justify-between hover:shadow-md transition-all relative overflow-hidden group"
                                    >
                                        {/* Status Tag */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                table.status === 'active' 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                    : 'bg-stone-100 text-stone-500 border border-stone-200'
                                            }`}>
                                                {table.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>

                                        {/* QR Image Preview */}
                                        <div className="my-6 flex flex-col items-center">
                                            <div className="w-36 h-36 bg-white border border-surface-container-high rounded-xl p-2 flex items-center justify-center shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                                                <img 
                                                    src={getQrSrc(table.number)} 
                                                    alt={`QR Meja ${table.number}`}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <h4 className="text-base font-bold text-on-surface mt-4">Meja {table.number}</h4>
                                            <p className="text-[10px] text-secondary/60 font-mono truncate max-w-[160px] mt-0.5">{getTableUrl(table.number)}</p>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="w-full pt-3 border-t border-surface-container-high/60 flex items-center justify-between gap-2">
                                            <button 
                                                onClick={() => setPrintTarget(table)}
                                                disabled={table.status !== 'active'}
                                                className="flex-1 py-1.5 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                                            >
                                                <span className="material-symbols-outlined text-sm">print</span>
                                                Cetak
                                            </button>
                                            <button 
                                                onClick={() => handleEditOpen(table)}
                                                className="p-1.5 text-secondary hover:text-primary hover:bg-white border border-transparent hover:border-surface-container-high rounded-lg transition-all cursor-pointer"
                                                title="Edit Meja"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteOpen(table)}
                                                className="p-1.5 text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                                title="Hapus Meja"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* PRINT VIEW (only visible during printing) */}
            <div className="print-layout">
                <div className="print-grid">
                    {printTarget === 'all' ? (
                        tables.filter((t: DiningTable) => t.status === 'active').map((table: DiningTable) => (
                            <div key={table.id} className="print-card">
                                <h1 className="text-xl font-bold tracking-widest text-[#0d9488] border-b-2 border-[#0d9488]/20 pb-1 mb-2 w-full uppercase">{currentUser?.outlet_name || 'CAFE RESTO'}</h1>
                                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Pesan Mandiri Lewat HP Anda</p>
                                
                                <div className="w-48 h-48 border-2 border-gray-100 p-2 rounded-xl mb-3 flex items-center justify-center">
                                    <img src={getQrSrc(table.number)} className="w-full h-full object-contain" />
                                </div>
                                
                                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-2">MEJA {table.number}</h2>
                                
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-left w-full text-[9px] text-gray-600 leading-normal">
                                    <p className="font-bold text-[#0d9488] mb-1">📋 Cara Pemesanan:</p>
                                    <ol className="list-decimal list-inside space-y-0.5">
                                        <li>Pindai (Scan) Kode QR di atas menggunakan kamera HP Anda.</li>
                                        <li>Pilih menu makanan & minuman favorit Anda di halaman web.</li>
                                        <li>Isi Nama Pemesan, lalu tekan tombol <strong>"Kirim Pesanan"</strong>.</li>
                                        <li>Pesanan Anda akan langsung dimasak & disajikan di meja ini.</li>
                                        <li>Lakukan pembayaran di kasir setelah Anda selesai makan.</li>
                                    </ol>
                                </div>
                            </div>
                        ))
                    ) : printTarget ? (
                        <div className="print-card" style={{margin: '0 auto', maxWidth: '380px'}}>
                            <h1 className="text-xl font-bold tracking-widest text-[#0d9488] border-b-2 border-[#0d9488]/20 pb-1 mb-2 w-full uppercase">{currentUser?.outlet_name || 'CAFE RESTO'}</h1>
                            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Pesan Mandiri Lewat HP Anda</p>
                            
                            <div className="w-48 h-48 border-2 border-gray-100 p-2 rounded-xl mb-3 flex items-center justify-center">
                                <img src={getQrSrc(printTarget.number)} className="w-full h-full object-contain" />
                            </div>
                            
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-2">MEJA {printTarget.number}</h2>
                            
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-left w-full text-[9px] text-gray-600 leading-normal">
                                <p className="font-bold text-[#0d9488] mb-1">📋 Cara Pemesanan:</p>
                                <ol className="list-decimal list-inside space-y-0.5">
                                    <li>Pindai (Scan) Kode QR di atas menggunakan kamera HP Anda.</li>
                                    <li>Pilih menu makanan & minuman favorit Anda di halaman web.</li>
                                    <li>Isi Nama Pemesan, lalu tekan tombol <strong>"Kirim Pesanan"</strong>.</li>
                                    <li>Pesanan Anda akan langsung dimasak & disajikan di meja ini.</li>
                                    <li>Lakukan pembayaran di kasir setelah Anda selesai makan.</li>
                                </ol>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* ADD MEJA DIALOG */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Tambah Meja Baru</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Masukkan nomor atau nama meja yang ingin didaftarkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase">Nomor / Nama Meja</label>
                            <Input
                                required
                                placeholder="Contoh: 01, 02, VIP-01..."
                                value={addForm.data.number}
                                onChange={(e) => addForm.setData('number', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            {addForm.errors.number && <span className="text-xs text-error font-medium">{addForm.errors.number}</span>}
                        </div>
                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={addForm.processing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Simpan Meja
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT MEJA DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Edit Meja</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Ubah nomor meja atau nonaktifkan fitur pemesanan mandiri meja ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase">Nomor / Nama Meja</label>
                            <Input
                                required
                                value={editForm.data.number}
                                onChange={(e) => editForm.setData('number', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            {editForm.errors.number && <span className="text-xs text-error font-medium">{editForm.errors.number}</span>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase">Status Meja</label>
                            <select
                                value={editForm.data.status}
                                onChange={(e) => editForm.setData('status', e.target.value)}
                                className="w-full px-3 py-2 bg-surface-container-low/50 border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                            >
                                <option value="active">Aktif (Pemesanan QR Aktif)</option>
                                <option value="inactive">Nonaktif (Pemesanan QR Tutup)</option>
                            </select>
                            {editForm.errors.status && <span className="text-xs text-error font-medium">{editForm.errors.status}</span>}
                        </div>
                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsEditOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRM DIALOG */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-error font-bold">Hapus Meja</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Apakah Anda yakin ingin menghapus meja <span className="font-semibold text-on-surface">"Meja {selectedTable?.number}"</span>? QR Code yang telah dicetak untuk meja ini tidak akan bisa digunakan lagi.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsDeleteOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" className="text-xs bg-red-600 text-white hover:bg-red-700 font-bold" onClick={handleDeleteSubmit}>
                            Hapus Meja
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

