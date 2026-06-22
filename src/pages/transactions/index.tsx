import { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface UserType {
    id: number;
    name: string;
    email: string;
}

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: string | number;
    subtotal: string | number;
}

interface Order {
    id: number;
    invoice_number: string;
    user_id: number;
    user: UserType;
    total_amount: string | number;
    amount_paid: string | number;
    change_amount: string | number;
    payment_method: string;
    items: OrderItem[];
    created_at: string;
}

export default function Index() {
    const { transactions = [], auth = { user: null } } = usePage<any>().props;

    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const currentUser = auth.user;

    // Format currency to IDR
    const formatPrice = (value: number | string) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    // Format price in thousands abbreviation (e.g. Rp 45.200k)
    const formatPriceK = (value: number | string) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        const thousands = num / 1000;
        return `Rp ${thousands.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k`;
    };

    // Filter transactions by invoice number or cashier name
    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx: Order) => {
            const matchesInvoice = tx.invoice_number.toLowerCase().includes(search.toLowerCase());
            const matchesCashier = tx.user?.name.toLowerCase().includes(search.toLowerCase());
            return matchesInvoice || matchesCashier;
        });
    }, [transactions, search]);

    const handleViewDetail = (tx: Order) => {
        setSelectedTransaction(tx);
        setIsDetailOpen(true);
    };

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'KS';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    // Metrics calculations
    const metrics = useMemo(() => {
        const count = transactions.length;
        const total = transactions.reduce((acc: number, tx: Order) => acc + parseFloat(tx.total_amount.toString()), 0);
        const avg = count > 0 ? total / count : 0;

        // Most popular payment method
        const counts: { [key: string]: number } = {};
        transactions.forEach((tx: Order) => {
            counts[tx.payment_method] = (counts[tx.payment_method] || 0) + 1;
        });
        const popular = Object.keys(counts).length > 0
            ? Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b).toUpperCase()
            : '-';

        return { count, total, avg, popular };
    }, [transactions]);

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Riwayat Transaksi</title>
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
                /* Hide scrollbar for Chrome, Safari and Opera */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
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
                    {/* Transactions (ACTIVE) */}
                    <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/transactions">
                        <span className="material-symbols-outlined active-icon">receipt_long</span>
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
                            placeholder="Cari transaksi atau invoice..." 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full text-secondary hover:bg-surface-container-low transition-all relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 rounded-full text-secondary hover:bg-surface-container-low transition-all">
                        <span className="material-symbols-outlined">help_outline</span>
                    </button>
                    <div className="w-px h-8 bg-surface-container-high mx-2"></div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold font-label-mono">POS-01</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="ml-0 lg:ml-72 pt-24 px-4 sm:px-[32px] pb-[32px] min-h-screen">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 mt-2">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Riwayat Transaksi</h2>
                        <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Histori lengkap penjualan kasir</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Total Revenue */}
                    <div className="bg-red-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-primary shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="flex items-center text-primary font-bold text-[10px] bg-primary/10 px-2 py-0.5 rounded-full uppercase font-label-mono">Revenue</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Nilai Penjualan</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{formatPriceK(metrics.total)}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Nilai bruto keseluruhan</p>
                    </div>

                    {/* Total Transaksi */}
                    <div className="bg-emerald-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-emerald-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">receipt</span>
                            </div>
                            <span className="flex items-center text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Sales</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Jumlah Transaksi</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.count.toLocaleString('id-ID')}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Total transaksi tercatat</p>
                    </div>

                    {/* Rata-rata Pesanan */}
                    <div className="bg-amber-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-amber-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">shopping_cart</span>
                            </div>
                            <span className="flex items-center text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full uppercase font-label-mono">AOV</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Rata-rata Transaksi</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{formatPrice(metrics.avg)}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Rata-rata belanja pelanggan</p>
                    </div>

                    {/* Metode Populer */}
                    <div className="bg-blue-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-blue-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">account_balance_wallet</span>
                            </div>
                            <span className="flex items-center text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Method</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Metode Populer</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.popular}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Pilihan metode pembayaran teratas</p>
                    </div>
                </div>

                {/* Transactions Table Section */}
                <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden mb-10">
                    <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
                        <h3 className="text-lg font-bold text-on-surface">Daftar Riwayat Penjualan</h3>
                        <span className="text-xs font-semibold text-secondary/60 bg-surface-container-low px-3 py-1 rounded-full font-label-mono">
                            {filteredTransactions.length} Transaksi Ditemukan
                        </span>
                    </div>
                    
                    {filteredTransactions.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-secondary py-12 font-label-mono text-xs">
                            <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">history</span>
                            <p>Tidak ada transaksi yang terdaftar.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[11px] uppercase tracking-wider font-label-mono">
                                        <th className="px-6 py-4">Tanggal & Waktu</th>
                                        <th className="px-6 py-4">No. Invoice</th>
                                        <th className="px-6 py-4">Kasir</th>
                                        <th className="px-6 py-4 text-center">Metode</th>
                                        <th className="px-6 py-4 text-right">Total Transaksi</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-low">
                                    {filteredTransactions.map((tx: Order) => (
                                        <tr key={tx.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-4 text-sm text-secondary font-label-mono">
                                                {new Date(tx.created_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-on-surface font-label-mono">
                                                {tx.invoice_number}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-secondary">
                                                {tx.user?.name || 'Kasir'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-3 py-1 bg-surface-container-low text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border border-surface-container-high/40 font-label-mono">
                                                    <span className="material-symbols-outlined text-[12px]">
                                                        {tx.payment_method.toLowerCase() === 'cash' ? 'payments' : tx.payment_method.toLowerCase() === 'card' ? 'credit_card' : 'account_balance_wallet'}
                                                    </span>
                                                    {tx.payment_method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-primary font-label-mono">
                                                {formatPrice(tx.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => handleViewDetail(tx)}
                                                    className="px-4 py-2 bg-primary/5 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95 inline-flex items-center gap-1.5 mx-auto cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Meta */}
                <footer className="mt-10 flex justify-between items-center text-secondary/40 px-2 pb-6 text-[10px] font-label-mono uppercase">
                    <p className="tracking-widest">Precision POS v2.4.0-Enterprise</p>
                    <p>Terakhir Sinkronisasi: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                </footer>
            </main>

            {/* Transaction Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[450px] bg-white border border-surface-container-high text-on-surface rounded-2xl shadow-soft p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-3 border-b border-surface-container-low no-print">
                        <DialogTitle className="font-label-mono text-base text-primary font-bold">{selectedTransaction?.invoice_number}</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Detail transaksi penjualan POS.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Receipt Print Area */}
                    <div className="p-6 pt-3" id="receipt-print-content">
                        {/* Header for print only */}
                        <div className="hidden print:flex flex-col items-center text-center pb-4 border-b border-dashed border-surface-container-high mb-4">
                            <h3 className="font-bold text-lg text-on-surface uppercase tracking-tight mb-0.5">{currentUser?.outlet_name || 'CAFE RESTO'}</h3>
                            <h4 className="text-xs text-on-surface font-bold uppercase tracking-widest mb-1">STRUK BELANJA</h4>
                            <p className="text-[10px] text-secondary/60 uppercase tracking-wider font-semibold font-mono">(CETAK ULANG / REPRINT)</p>
                        </div>

                        {/* Meta info */}
                        <div className="grid grid-cols-2 gap-4 py-3 text-xs border-b border-surface-container-low">
                            <div>
                                <span className="text-secondary/60 block mb-0.5 font-bold tracking-wider">KASIR OPERATOR</span>
                                <span className="font-bold text-on-surface">{selectedTransaction?.user?.name || 'Kasir'}</span>
                            </div>
                            <div>
                                <span className="text-secondary/60 block mb-0.5 font-bold tracking-wider">TANGGAL TRANSAKSI</span>
                                <span className="font-bold text-on-surface font-label-mono">
                                    {selectedTransaction?.created_at && new Date(selectedTransaction.created_at).toLocaleString('id-ID')} WIB
                                </span>
                            </div>
                        </div>

                        {/* Line items */}
                        <div className="py-4 max-h-[200px] overflow-y-auto flex flex-col gap-3 border-b border-surface-container-low custom-scrollbar">
                            <span className="text-xs font-bold text-secondary/70 uppercase tracking-wider block mb-1 no-print">Daftar Item</span>
                            {selectedTransaction?.items?.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                    <div className="flex flex-col min-w-0 pr-4">
                                        <span className="font-bold text-on-surface truncate">{item.product_name}</span>
                                        <span className="text-secondary/60 font-label-mono text-[10px]">
                                            {item.quantity} pcs x {formatPrice(item.price)}
                                        </span>
                                    </div>
                                    <span className="font-label-mono font-bold text-on-surface whitespace-nowrap">
                                        {formatPrice(item.subtotal)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Summary totals */}
                        <div className="py-3 text-xs font-label-mono flex flex-col gap-1.5">
                            <div className="flex justify-between text-secondary/70">
                                <span>Subtotal</span>
                                <span>{formatPrice(selectedTransaction ? parseFloat(selectedTransaction.total_amount.toString()) / 1.1 : 0)}</span>
                            </div>
                            <div className="flex justify-between text-secondary/70">
                                <span>PPN (10%)</span>
                                <span>{formatPrice(selectedTransaction ? parseFloat(selectedTransaction.total_amount.toString()) - (parseFloat(selectedTransaction.total_amount.toString()) / 1.1) : 0)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-on-surface text-sm pt-2 border-t border-surface-container-low font-sans">
                                <span>TOTAL TRANSAKSI</span>
                                <span className="text-primary font-bold font-label-mono">{formatPrice(selectedTransaction?.total_amount || 0)}</span>
                            </div>
                            
                            <div className="flex justify-between text-secondary/70 pt-2 border-t border-surface-container-high/60">
                                <span className="uppercase">METODE BAYAR</span>
                                <span className="font-bold text-on-surface uppercase">{selectedTransaction?.payment_method}</span>
                            </div>
                            <div className="flex justify-between text-secondary/70">
                                <span>BAYAR</span>
                                <span className="font-bold text-on-surface">{formatPrice(selectedTransaction?.amount_paid || 0)}</span>
                            </div>
                            <div className="flex justify-between text-secondary/70">
                                <span>KEMBALIAN</span>
                                <span className="font-bold text-on-surface">{formatPrice(selectedTransaction?.change_amount || 0)}</span>
                            </div>
                        </div>

                        {/* Print only footer */}
                        <div className="hidden print:block pt-4 border-t border-dashed border-surface-container-high text-center text-[10px] text-secondary/60">
                            <p>Terima kasih telah berbelanja!</p>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-2 flex justify-between gap-3 w-full no-print">
                        <Button 
                            variant="outline" 
                            className="flex-1 gap-2 text-xs border-surface-container-high hover:bg-surface-container-low hover:text-on-surface text-secondary" 
                            onClick={() => window.print()}
                        >
                            <span className="material-symbols-outlined text-sm">print</span> Cetak Struk
                        </Button>
                        <Button 
                            className="flex-1 text-xs bg-primary text-white font-bold hover:bg-primary/95 rounded-lg py-2.5 transition-all shadow-md shadow-primary/10" 
                            onClick={() => setIsDetailOpen(false)}
                        >
                            Tutup Detail
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

