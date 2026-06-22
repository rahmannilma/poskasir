import { useState, useMemo } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface User {
    id: number;
    name: string;
    role: string;
}

interface Shift {
    id: number;
    user_id: number;
    start_date: string;
    end_date: string | null;
    initial_cash: string | number;
    expected_cash: string | number;
    actual_cash: string | number | null;
    discrepancy: string | number;
    total_cash_sales: string | number;
    total_qris_sales: string | number;
    total_transfer_sales: string | number;
    notes: string | null;
    status: 'open' | 'closed';
    user: User;
}

interface PaginatedShifts {
    data: Shift[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
    from: number;
    to: number;
}

export default function ShiftsIndex() {
    const { shifts, active_shift, auth = { user: null } } = usePage<{
        shifts: PaginatedShifts;
        active_shift: Shift | null;
        auth: { user: User | null };
    }>().props;

    const currentUser = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Close Shift Dialog States
    const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
    const [actualCash, setActualCash] = useState('');
    const [notes, setNotes] = useState('');
    const [isClosingProcessing, setIsClosingProcessing] = useState(false);

    // Format currency to IDR
    const formatPrice = (value: number | string | null | undefined) => {
        if (value === null || value === undefined) return '-';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    // Parse numeric fields safely
    const getFloat = (val: any) => {
        if (val === null || val === undefined) return 0;
        return typeof val === 'string' ? parseFloat(val) : val;
    };

    // Expected cash calculation based on active shift
    const expectedCashValue = useMemo(() => {
        if (!active_shift) return 0;
        return getFloat(active_shift.initial_cash) + getFloat(active_shift.total_cash_sales);
    }, [active_shift]);

    // Live discrepancy calculation
    const discrepancyValue = useMemo(() => {
        const actualNum = parseFloat(actualCash);
        if (isNaN(actualNum)) return null;
        return actualNum - expectedCashValue;
    }, [actualCash, expectedCashValue]);

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'US';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    // Handle Close Shift Submission
    const handleCloseShiftSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cashNum = parseFloat(actualCash);
        if (isNaN(cashNum) || cashNum < 0) {
            toast.error("Nominal kas riil tidak valid.");
            return;
        }

        setIsClosingProcessing(true);

        router.post('/shifts/close', {
            actual_cash: cashNum,
            notes: notes
        }, {
            onSuccess: () => {
                setIsClosingProcessing(false);
                setIsCloseDialogOpen(false);
                setActualCash('');
                setNotes('');
                toast.success("Shift kerja berhasil ditutup.");
            },
            onError: (err) => {
                setIsClosingProcessing(false);
                const errMsg = err.error || Object.values(err)[0] || "Gagal menutup shift.";
                toast.error(errMsg);
            }
        });
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Sesi Shift Kerja</title>
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
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #f5f5f5;
                }
                ::-webkit-scrollbar-thumb {
                    background: #0d9488;
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
                    {/* Active Tab: Shift Kerja */}
                    <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/shifts">
                        <span className="material-symbols-outlined active-icon text-primary">schedule</span>
                        <span className="text-[15px] font-sans">Shift Kerja</span>
                    </Link>
                    <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/kitchen">
                        <span className="material-symbols-outlined group-hover:text-primary">soup_kitchen</span>
                        <span className="text-[15px] font-sans">Dapur (KDS)</span>
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
                    <h2 className="text-lg font-bold text-on-surface tracking-tight whitespace-nowrap">Shift Kerja & Kas Drawer</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full">
                        <div className={`w-1.5 h-1.5 rounded-full ${active_shift ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-bold font-label-mono">{active_shift ? 'Shift Aktif' : 'Shift Off'}</span>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="ml-0 lg:ml-72 pt-24 px-4 sm:px-[32px] pb-[32px] min-h-screen">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Manajemen Sesi Shift</h2>
                        <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Kelola pembukaan modal, monitoring penjualan real-time, dan rekonsiliasi kas laci kasir.</p>
                    </div>

                    {/* ACTIVE SHIFT AREA FOR CASHIER/STAFF */}
                    {!['owner', 'super_admin'].includes(currentUser?.role) && (
                        <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft p-6 overflow-hidden relative">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
                            <h3 className="text-base font-bold text-on-surface mb-4">Sesi Shift Aktif Anda</h3>
                            
                            {active_shift ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="p-4 bg-surface-container-low rounded-xl">
                                            <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-wider">Mulai Shift</p>
                                            <p className="text-sm font-bold text-on-surface font-label-mono mt-1">
                                                {new Date(active_shift.start_date).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                                            </p>
                                            <p className="text-[10px] text-secondary/60 mt-0.5">
                                                {new Date(active_shift.start_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-surface-container-low rounded-xl">
                                            <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-wider">Modal Awal</p>
                                            <p className="text-sm font-bold text-on-surface font-label-mono mt-1">
                                                {formatPrice(active_shift.initial_cash)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-surface-container-low rounded-xl">
                                            <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-wider">Total Penjualan Tunai</p>
                                            <p className="text-sm font-bold text-emerald-600 font-label-mono mt-1">
                                                {formatPrice(active_shift.total_cash_sales)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-surface-container-low rounded-xl">
                                            <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-wider">Estimasi Kas Laci (Expected)</p>
                                            <p className="text-sm font-bold text-primary font-label-mono mt-1">
                                                {formatPrice(expectedCashValue)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Non-cash breakdown */}
                                    <div className="p-4 border border-surface-container-high rounded-xl bg-surface-container-low/30">
                                        <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 font-label-mono">Detail Metode Pembayaran Non-Tunai</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex justify-between items-center text-xs p-2.5 bg-white rounded-lg border border-surface-container-high">
                                                <span className="text-secondary font-medium">Transaksi QRIS</span>
                                                <span className="font-bold text-on-surface font-label-mono">{formatPrice(active_shift.total_qris_sales)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs p-2.5 bg-white rounded-lg border border-surface-container-high">
                                                <span className="text-secondary font-medium">Transaksi Kartu (Transfer)</span>
                                                <span className="font-bold text-on-surface font-label-mono">{formatPrice(active_shift.total_transfer_sales)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            onClick={() => setIsCloseDialogOpen(true)}
                                            className="bg-primary text-white hover:bg-primary/95 font-bold px-6 py-3 rounded-xl flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">lock</span>
                                            Tutup Shift & Rekonsiliasi Kas
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 space-y-4">
                                    <span className="material-symbols-outlined text-5xl text-red-500 font-bold animate-pulse">lock</span>
                                    <h4 className="text-sm font-bold text-on-surface">Shift Kerja Belum Dimulai</h4>
                                    <p className="text-xs text-secondary/60 max-w-md mx-auto">
                                        Anda belum memiliki sesi shift aktif untuk hari ini. Silakan buka halaman **POS Kasir** terlebih dahulu untuk memasukkan modal awal dan memulai penjualan.
                                    </p>
                                    <div className="pt-2">
                                        <Link href={['owner', 'super_admin', 'manager'].includes(currentUser?.role) ? '/pos' : '/kasir'} className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/95 px-5 py-2.5 text-xs font-bold rounded-lg shadow-md shadow-primary/10">
                                            <span className="material-symbols-outlined text-xs">shopping_cart</span> Buka POS Kasir
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SHIFTS LOG / HISTORY TABLE */}
                    <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-base font-bold text-on-surface">
                                {['owner', 'super_admin'].includes(currentUser?.role) ? 'Seluruh Riwayat Shift Outlet' : 'Riwayat Shift Kerja Anda'}
                            </h3>
                            <span className="text-xs font-bold font-label-mono text-secondary/60">
                                Total Sesi: {shifts.total}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[10px] uppercase tracking-wider font-label-mono">
                                        <th className="px-4 py-3">Kasir</th>
                                        <th className="px-4 py-3">Waktu Sesi</th>
                                        <th className="px-4 py-3 text-right">Modal Awal</th>
                                        <th className="px-4 py-3 text-right">Tunai (Expected)</th>
                                        <th className="px-4 py-3 text-right">Kas Laci (Actual)</th>
                                        <th className="px-4 py-3 text-right">Selisih</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3">Catatan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-low">
                                    {shifts.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-8 text-center text-xs font-label-mono text-secondary">
                                                Belum ada riwayat shift kerja yang tersimpan.
                                            </td>
                                        </tr>
                                    ) : (
                                        shifts.data.map((shift) => {
                                            const shiftExpected = getFloat(shift.initial_cash) + getFloat(shift.total_cash_sales);
                                            const discrepancy = getFloat(shift.discrepancy);
                                            
                                            return (
                                                <tr key={shift.id} className="hover:bg-surface-container-low/20 transition-colors text-xs">
                                                    <td className="px-4 py-4 font-bold text-on-surface">{shift.user?.name || 'Kasir'}</td>
                                                    <td className="px-4 py-4 space-y-0.5">
                                                        <p className="font-semibold text-on-surface">
                                                            {new Date(shift.start_date).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                            {shift.end_date ? ` - ${new Date(shift.end_date).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : ' (Berjalan)'}
                                                        </p>
                                                        <p className="text-[10px] text-secondary/60 font-label-mono">
                                                            {new Date(shift.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-mono font-semibold">{formatPrice(shift.initial_cash)}</td>
                                                    <td className="px-4 py-4 text-right font-mono font-semibold">{formatPrice(shiftExpected)}</td>
                                                    <td className="px-4 py-4 text-right font-mono font-semibold">
                                                        {shift.status === 'open' ? '-' : formatPrice(shift.actual_cash)}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-mono font-semibold">
                                                        {shift.status === 'open' ? '-' : (
                                                            <span className={discrepancy < 0 ? 'text-primary font-bold' : discrepancy > 0 ? 'text-green-600 font-bold' : 'text-secondary/60'}>
                                                                {discrepancy < 0 ? `-${formatPrice(Math.abs(discrepancy))}` : discrepancy > 0 ? `+${formatPrice(discrepancy)}` : 'Cocok'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                            shift.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-stone-100 text-stone-600'
                                                        }`}>
                                                            {shift.status === 'open' ? 'Aktif' : 'Selesai'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-secondary/60 italic max-w-xs truncate">{shift.notes || '-'}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginated Links */}
                        {shifts.prev_page_url || shifts.next_page_url ? (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-surface-container-high">
                                <span className="text-xs text-secondary/60">
                                    Menampilkan {shifts.from || 0}-{shifts.to || 0} dari {shifts.total || 0} entri
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        disabled={!shifts.prev_page_url}
                                        onClick={() => router.get(shifts.prev_page_url!)}
                                        variant="outline"
                                        className="text-xs py-1.5 border-surface-container-high hover:bg-surface-container-low"
                                    >
                                        Sebelumnya
                                    </Button>
                                    <Button
                                        disabled={!shifts.next_page_url}
                                        onClick={() => router.get(shifts.next_page_url!)}
                                        variant="outline"
                                        className="text-xs py-1.5 border-surface-container-high hover:bg-surface-container-low"
                                    >
                                        Selanjutnya
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>

            {/* Close Shift Dialog */}
            {active_shift && (
                <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
                    <DialogContent className="sm:max-w-[450px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                        <DialogHeader className="pb-2 border-b border-surface-container-high">
                            <DialogTitle className="text-base text-primary font-bold">Tutup Shift & Rekonsiliasi Kas</DialogTitle>
                            <DialogDescription className="text-xs text-secondary/60">
                                Hitung seluruh uang tunai yang ada di dalam laci kasir dan masukkan nominalnya untuk menyelesaikan sesi shift.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCloseShiftSubmit} className="flex flex-col gap-4 py-2 text-xs">
                            <div className="rounded-xl bg-surface-container-low border border-surface-container-high p-4 flex flex-col gap-2 font-mono">
                                <div className="flex justify-between text-secondary">
                                    <span>Modal Awal:</span>
                                    <span>{formatPrice(active_shift.initial_cash)}</span>
                                </div>
                                <div className="flex justify-between text-secondary">
                                    <span>Penjualan Tunai:</span>
                                    <span className="text-green-600 font-bold">+{formatPrice(active_shift.total_cash_sales)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-on-surface text-sm pt-2 border-t border-surface-container-high/60">
                                    <span>Estimasi Kas Laci (Expected):</span>
                                    <span className="text-primary">{formatPrice(expectedCashValue)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Jumlah Uang Kas Riil (Actual Cash)</label>
                                <Input
                                    type="number"
                                    required
                                    min="0"
                                    placeholder="Masukkan nominal kas riil di laci..."
                                    value={actualCash}
                                    onChange={(e) => setActualCash(e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high text-on-surface text-base text-right font-mono focus:ring-primary focus:border-primary rounded-lg"
                                    autoFocus
                                />
                            </div>

                            {/* Discrepancy live update display */}
                            {discrepancyValue !== null && (
                                <div className={`p-3 rounded-xl border flex justify-between items-center font-bold ${
                                    discrepancyValue === 0 
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                        : discrepancyValue < 0 
                                            ? 'bg-red-50 border-red-100 text-primary' 
                                            : 'bg-green-50 border-green-100 text-green-700'
                                }`}>
                                    <span>Status Selisih Kas:</span>
                                    <span>
                                        {discrepancyValue === 0 ? (
                                            'Kas Cocok / Seimbang'
                                        ) : discrepancyValue < 0 ? (
                                            `Selisih Kurang: -${formatPrice(Math.abs(discrepancyValue))}`
                                        ) : (
                                            `Selisih Lebih: +${formatPrice(discrepancyValue)}`
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Catatan Laporan Shift (Opsional)</label>
                                <textarea
                                    placeholder="Ketik catatan jika terjadi selisih kas..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="p-3 bg-surface-container-low/50 border border-surface-container-high focus:bg-white text-on-surface focus:ring-primary focus:border-primary rounded-lg text-xs font-sans h-20 outline-none transition-colors"
                                />
                            </div>

                            <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                                <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low text-secondary" onClick={() => setIsCloseDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isClosingProcessing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                    {isClosingProcessing ? 'Memproses...' : 'Selesaikan & Tutup Shift'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

