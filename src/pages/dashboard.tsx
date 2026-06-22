import { Head, Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface Metric {
    today_revenue: number;
    monthly_revenue: number;
    today_sales_count: number;
    total_products_count: number;
    total_cashiers_count: number;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: string | number;
    stock: number;
    description?: string;
}

interface ChartItem {
    date: string;
    label: string;
    revenue: number;
    sales_count: number;
}

interface StaffPerformanceItem {
    id: number;
    name: string;
    transactions_count: number;
    total_sales: number;
    initials: string;
}

interface Order {
    id: number;
    invoice_number: string;
    created_at: string;
    payment_method: string;
    total_amount: number | string;
    user?: {
        name: string;
    };
}

export default function Dashboard() {
    const { 
        auth = { user: null },
        metrics = {
            today_revenue: 0,
            monthly_revenue: 0,
            today_sales_count: 0,
            total_products_count: 0,
            total_cashiers_count: 0
        }, 
        lowStockProducts = [], 
        topSellingProducts = [],
        revenueChartData = [],
        days = 7,
        staffPerformance = [],
        recentTransactions = []
    } = usePage<any>().props;

    const currentUser = auth.user;

    // Currency Formatter to IDR
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

    // Calculate Average Order Value
    const averageOrderValue = useMemo(() => {
        if (metrics.today_sales_count === 0) return 0;
        return metrics.today_revenue / metrics.today_sales_count;
    }, [metrics]);

    // Maximum revenue for chart calculation
    const maxRevenue = useMemo(() => {
        const max = Math.max(...revenueChartData.map((d: ChartItem) => d.revenue), 1000);
        return max;
    }, [revenueChartData]);

    // Maximum staff sales for progress bar calculations
    const maxStaffSales = useMemo(() => {
        const max = Math.max(...staffPerformance.map((s: StaffPerformanceItem) => s.total_sales), 1000);
        return max;
    }, [staffPerformance]);

    // Translate day name to Indonesian
    const translateDay = (day: string) => {
        const map: { [key: string]: string } = {
            'Mon': 'Sen',
            'Tue': 'Sel',
            'Wed': 'Rab',
            'Thu': 'Kam',
            'Fri': 'Jum',
            'Sat': 'Sab',
            'Sun': 'Min'
        };
        return map[day] || day;
    };

    // Match product name to mock images
    const getProductImage = (productName: string) => {
        const name = productName.toLowerCase();
        if (name.includes('kopi') || name.includes('espresso') || name.includes('cappuccino') || name.includes('latte') || name.includes('coffee')) {
            return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnGh-PMLPm3_pCi2R47WRCTKZGynhaCdifYnG0eH1GqjZtRlo0v9-OM7GoBDSTIEfoVGEmp1M1k_2TJOans2-06zOML1CoKJqvNlunSOAXULCFyZd07KipkjIMhDuLaGJa6hPhlEpcZhsfbPiKhvqPq7NQkQQ8yjhF8stwY3ir4CO9x16LeRnfxVgTMj1oi9gsuar6tVeLQpQX5Je0sxOZfLA6Ewn7qP3EVrfkHAbgh7STamtQIMVeinbuVlDXlAbuqRD8hV2ECI0';
        }
        if (name.includes('croissant') || name.includes('roti') || name.includes('bread') || name.includes('pastry') || name.includes('cake') || name.includes('almond')) {
            return 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_mOmY1fCu9HYu4Ee-EAiwVsaAhgdywfyRguK8bYsgRkLBhYSB-4Yp-4-5l0W6QdZfPCmN_yko6A4gDPs_46p-eHWat6nicZpjBiICpQDQ-Po30h7bgKB2IPTrnSSBZ1Komx9SfbhtOpCY5R7J4VMd5fTUeKvNqv5EFsbe5OSl2Ktpk6MY1iA36FH8iMpSu5NGby6QEUSJLR5UguMJsFjpCMQ0zKGCYM5xUq6gHj--tPxlv3edSE6vhZ901xfdxvWd8nHXsa-vEl0';
        }
        if (name.includes('matcha') || name.includes('susu') || name.includes('tea') || name.includes('drink') || name.includes('air') || name.includes('peach') || name.includes('latte')) {
            return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPB-XtocMlBAjRTW32ULOGCoz17sLmvEAtwPBiJ6gtLLT2FJ9WmIa4NMqyN08Lga11xL1gDhL9gM8uGYNXcZHPM1ScYRH2v6K5Vz4wonqEWc1HiZYcK3CWssFJvyhhhOn3xIuqwEN3lbMt2FFCSMyovE_Nadxbw8YzVPKWZn4jTO5xp1-X9okOHuXNXR0LZhfNA2EvYahcAvWry4P6wmwrRAU2gIQb9qtYC7vAE0xdUv29LtNUtDjEEzG9cRLpIKhDDeEQuvZnoh4';
        }
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG0IDLC-Fgr7jVeSczhv290FTlbcsyqxjSfPslWGr2EJQOXZJGLQwJv4GGEGUewXyenw6b-QozJ_m_1pRfFExSpXDa6I_EjnuN4UAIAI1B1gcxbkjis89v752aBYRvQGv88Tvf5UdSA7JiNHCqKszssMQLVU7DetNuABrjSf-pN55l6V2_jZrjAz-mQmAiDYs2drlwDCWJKWQ4O90Sn0OAdpASvWzB-lPTc_rVEZtE5nwi6Z-61sLbTUO7cEY4BibTxF2BUWkJ25k';
    };

    // Format transaction timestamp to Indonesian local format
    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'OW';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleTimeframeChange = (newDays: number) => {
        router.get(
            '/dashboard',
            { days: newDays },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['revenueChartData', 'days'],
            }
        );
    };

    const points = useMemo(() => {
        if (revenueChartData.length === 0) return [];
        return revenueChartData.map((d: ChartItem, i: number) => {
            const x = (i / (revenueChartData.length - 1)) * 100;
            const y = maxRevenue > 0 ? 80 - (d.revenue / maxRevenue) * 60 : 80;
            return { x, y, revenue: d.revenue, label: d.label };
        });
    }, [revenueChartData, maxRevenue]);

    const linePath = useMemo(() => {
        if (points.length === 0) return '';
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    }, [points]);

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Owner Dashboard</title>
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
                .chart-grid {
                    background-size: 100% 48px;
                    background-image: linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
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
                    {/* Dashboard (ACTIVE) */}
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/dashboard">
                            <span className="material-symbols-outlined active-icon">dashboard</span>
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
                            placeholder="Cari transaksi atau produk..." 
                            type="text"
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
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">Selamat datang kembali, {currentUser?.name}</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => window.print()}
                            className="px-6 py-2.5 bg-white border border-surface-container-highest text-secondary font-bold text-sm rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            EKSPOR DATA
                        </button>
                        <button 
                            onClick={() => router.get('/pos')}
                            className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">shopping_cart</span>
                            BUKA KASIR POS
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    
                    {/* Total Penjualan */}
                    <div className="bg-red-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-primary shadow-soft hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                12.5%
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Penjualan</p>
                        <h3 className="text-2xl font-bold text-on-surface">{formatPrice(metrics.today_revenue)}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">vs Kemarin</p>
                    </div>

                    {/* Total Pesanan */}
                    <div className="bg-emerald-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-emerald-500 shadow-soft hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">shopping_cart</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                8.2%
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Pesanan</p>
                        <h3 className="text-2xl font-bold text-on-surface">{metrics.today_sales_count.toLocaleString('id-ID')}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">vs Kemarin</p>
                    </div>

                    {/* Rata-rata Pesanan */}
                    <div className="bg-amber-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-amber-500 shadow-soft hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">calculate</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                                2.1%
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Rata-rata Pesanan</p>
                        <h3 className="text-2xl font-bold text-on-surface">{formatPrice(averageOrderValue)}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">vs Kemarin</p>
                    </div>

                    {/* Stok Rendah */}
                    <div className="bg-red-50 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-error shadow-soft hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-red-50 rounded-lg text-error">
                                <span className="material-symbols-outlined text-error">warning</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[14px]">warning</span>
                                KRITIS
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Stok Rendah</p>
                        <h3 className="text-2xl font-bold text-error">{lowStockProducts.length}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Perlu Restock</p>
                    </div>
                </div>

                {/* Main Graph & Top Products Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Sales Chart Section */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden">
                        <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-on-surface">Ikhtisar Penjualan</h3>
                                <p className="text-xs text-secondary/60 font-medium">{days === 30 ? 'Laporan Bulanan (30 Hari Terakhir)' : 'Laporan Mingguan (7 Hari Terakhir)'}</p>
                            </div>
                            <div className="flex p-1 bg-surface-container-low rounded-lg">
                                <button 
                                    onClick={() => handleTimeframeChange(7)}
                                    className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${days === 7 ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-on-surface'}`}
                                >
                                    7D
                                </button>
                                <button 
                                    onClick={() => handleTimeframeChange(30)}
                                    className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${days === 30 ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-on-surface'}`}
                                >
                                    30D
                                </button>
                            </div>
                        </div>
                        <div className="p-8 h-80 relative select-none">
                            {/* Gridlines */}
                            <div className="absolute inset-x-8 bottom-12 top-8 chart-grid"></div>
                            
                            {/* SVG Graph wrapper aligned with the gridlines */}
                            <div className="absolute inset-x-8 bottom-12 top-8">
                                {points.length > 0 && (
                                    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#d32f2f" stopOpacity="0.25"></stop>
                                                <stop offset="100%" stopColor="#d32f2f" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Drop shadow / Glow filter for premium effect */}
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#d32f2f" floodOpacity="0.15" />
                                        </filter>

                                        {/* Hover dashed vertical guideline */}
                                        {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                                            <line 
                                                x1={points[hoveredPointIndex].x} 
                                                y1={0} 
                                                x2={points[hoveredPointIndex].x} 
                                                y2={100} 
                                                stroke="#d32f2f" 
                                                strokeWidth="1.5" 
                                                strokeDasharray="4,4" 
                                                opacity="0.5"
                                            />
                                        )}

                                        {/* Line Path with glow effect */}
                                        <path d={linePath} fill="none" stroke="#d32f2f" strokeLinecap="round" strokeWidth="2.5" filter="url(#glow)" vectorEffect="non-scaling-stroke"></path>

                                        {/* Points Dots */}
                                        {points.map((p, i) => {
                                            const isHovered = hoveredPointIndex === i;
                                            return (
                                                <g key={i}>
                                                    {/* Outer pulse/glow circle when hovered */}
                                                    {isHovered && (
                                                        <circle 
                                                            cx={p.x} 
                                                            cy={p.y} 
                                                            r="3.5" 
                                                            fill="#d32f2f" 
                                                            opacity="0.3"
                                                            className="animate-ping"
                                                        />
                                                    )}
                                                    <circle 
                                                        cx={p.x} 
                                                        cy={p.y} 
                                                        r={isHovered ? "2.5" : "1"} 
                                                        fill={isHovered ? "#d32f2f" : "white"} 
                                                        stroke="#d32f2f" 
                                                        strokeWidth={isHovered ? "1.5" : "1"} 
                                                        className="transition-all duration-150 cursor-pointer"
                                                    />
                                                </g>
                                            );
                                        })}
                                    </svg>
                                )}

                                {/* Hover zones grid overlay */}
                                <div className="absolute inset-0 flex">
                                    {points.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex-grow cursor-pointer h-full"
                                            onMouseEnter={() => setHoveredPointIndex(i)}
                                            onMouseLeave={() => setHoveredPointIndex(null)}
                                        />
                                    ))}
                                </div>

                                {/* Floating Tooltip */}
                                {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                                    <div 
                                        className="absolute bg-inverse-surface text-inverse-on-surface px-3 py-2 rounded-xl text-xs font-bold shadow-xl border border-surface-container-high flex flex-col pointer-events-none transition-all duration-75 z-10"
                                        style={{
                                            left: `${points[hoveredPointIndex].x}%`,
                                            top: `${points[hoveredPointIndex].y}%`,
                                            transform: 'translate(-50%, -125%)',
                                        }}
                                    >
                                        <span className="text-[10px] opacity-75 uppercase font-label-mono leading-none mb-1">
                                            {translateDay(points[hoveredPointIndex].label)}
                                        </span>
                                        <span className="text-sm font-black text-primary leading-none">
                                            {formatPrice(points[hoveredPointIndex].revenue)}
                                        </span>
                                        {/* Small tail arrow for the tooltip */}
                                        <div className="w-2 h-2 bg-inverse-surface absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
                                    </div>
                                )}
                            </div>

                            {/* X-Axis Labels aligned underneath the grid box */}
                            <div className="absolute left-8 right-8 bottom-4 flex justify-between font-label-mono text-[10px] text-secondary/60 uppercase">
                                {revenueChartData.map((d: ChartItem, i: number) => {
                                    const shouldShow = days <= 7 || i % 5 === 0 || i === revenueChartData.length - 1;
                                    return (
                                        <span key={i} className="flex-1 text-center">
                                            {shouldShow ? translateDay(d.label) : ''}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Top Products (Produk Terlaris) Panel */}
                    <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft flex flex-col h-[400px]">
                        <div className="p-6 border-b border-surface-container-low">
                            <h3 className="text-lg font-bold text-on-surface">Produk Terlaris</h3>
                        </div>
                        <div className="p-6 space-y-6 flex-grow overflow-y-auto custom-scrollbar">
                            {topSellingProducts.length === 0 ? (
                                <div className="flex h-48 items-center justify-center text-xs text-secondary font-label-mono">
                                    Belum ada data penjualan produk.
                                </div>
                            ) : (
                                topSellingProducts.map((product: any, index: number) => (
                                    <div key={index} className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-14 h-14 rounded-xl bg-surface-container-low border border-surface-container-high overflow-hidden flex-shrink-0">
                                            <img 
                                                alt={product.product_name} 
                                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                                                src={getProductImage(product.product_name)}
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors truncate">{product.product_name}</h4>
                                            <p className="text-xs text-secondary/60 font-medium">{product.total_sold} Terjual</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-primary">
                                                {formatPrice(product.total_sold > 0 ? Math.round(product.total_revenue / product.total_sold) : 0)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button 
                            onClick={() => router.get('/products')}
                            className="m-6 p-3 bg-surface-container-low hover:bg-surface-container-high text-xs font-bold text-secondary hover:text-on-surface rounded-xl transition-all uppercase tracking-widest text-center active:scale-[0.98]"
                        >
                            Lihat Semua Produk
                        </button>
                    </div>
                </div>

                {/* Recent Transactions Table (Full Width) */}
                <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden mb-10">
                    <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
                        <h3 className="text-lg font-bold text-on-surface">Transaksi Terbaru</h3>
                        <Link className="flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-all font-sans active:scale-[0.98]" href="/transactions">
                            LIHAT HISTORI
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low/50">
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-secondary/60 uppercase tracking-wider font-label-mono">ID Pesanan</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-secondary/60 uppercase tracking-wider font-label-mono">Pelanggan</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-secondary/60 uppercase tracking-wider font-label-mono">Tanggal</th>
                                    <th className="px-6 py-4 text-right text-[11px] font-bold text-secondary/60 uppercase tracking-wider font-label-mono">Jumlah</th>
                                    <th className="px-6 py-4 text-center text-[11px] font-bold text-secondary/60 uppercase tracking-wider font-label-mono">Status</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low">
                                {recentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-6 text-center text-secondary font-label-mono text-xs">
                                            Belum ada transaksi terekam.
                                        </td>
                                    </tr>
                                ) : (
                                    recentTransactions.map((tx: Order) => (
                                        <tr key={tx.id} className="hover:bg-surface-container-low/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold font-label-mono text-on-surface">{tx.invoice_number}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-secondary">
                                                {tx.user?.name || 'Guest Checkout'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-secondary/70">
                                                {formatDateTime(tx.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-on-surface">
                                                {formatPrice(tx.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full">
                                                    Lunas
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1 hover:bg-surface-container-low rounded transition-all active:scale-[0.98]">
                                                    <span className="material-symbols-outlined text-secondary">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom section: Critical Stock & Staff Performance Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Inventory Critical Stock Panel */}
                    <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft flex flex-col h-[400px]">
                        <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
                            <h3 className="text-lg font-bold text-on-surface">Stok Kritis</h3>
                            <span className="text-[10px] font-bold text-error bg-red-50 border border-error/20 px-2 py-0.5 rounded-full font-label-mono">
                                {lowStockProducts.length} ITEM
                            </span>
                        </div>
                        <div className="p-6 space-y-6 flex-grow overflow-y-auto custom-scrollbar">
                            {lowStockProducts.length === 0 ? (
                                <div className="flex h-36 items-center justify-center text-xs text-secondary font-label-mono">
                                    Semua stok produk aman.
                                </div>
                            ) : (
                                lowStockProducts.map((product: Product) => (
                                    <div key={product.id} className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-14 h-14 rounded-xl bg-surface-container-low border border-surface-container-high overflow-hidden flex-shrink-0">
                                            <img 
                                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                                                alt={product.name} 
                                                src={getProductImage(product.name)}
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors truncate">{product.name}</h4>
                                            <p className="text-xs text-error font-bold font-label-mono">Stok: {product.stock} Unit</p>
                                        </div>
                                        <button 
                                            onClick={() => router.get('/products')}
                                            className="w-10 h-10 rounded-full border border-surface-container-high hover:bg-primary hover:text-white transition-all flex items-center justify-center shrink-0 text-secondary active:scale-[0.98]"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <button 
                            onClick={() => router.get('/products')}
                            className="m-6 p-3 bg-surface-container-low hover:bg-surface-container-high text-xs font-bold text-secondary hover:text-on-surface rounded-xl transition-all uppercase tracking-widest text-center active:scale-[0.98]"
                        >
                            Tinjau Inventaris Penuh
                        </button>
                    </div>

                    {/* Staff Performance Panel */}
                    <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft flex flex-col h-[400px]">
                        <div className="p-6 border-b border-surface-container-low">
                            <h3 className="text-lg font-bold text-on-surface">Staf Terbaik</h3>
                        </div>
                        <div className="p-6 space-y-6 flex-grow overflow-y-auto custom-scrollbar">
                            {staffPerformance.length === 0 ? (
                                <div className="flex h-48 items-center justify-center text-xs text-secondary font-label-mono">
                                    Belum ada staf kasir terdaftar.
                                </div>
                            ) : (
                                staffPerformance.map((staffMember: StaffPerformanceItem, index: number) => {
                                    const progressPercent = maxStaffSales > 0 ? (staffMember.total_sales / maxStaffSales) * 100 : 0;

                                    return (
                                        <div key={staffMember.id} className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-14 h-14 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-center shrink-0 font-bold text-primary text-lg font-label-mono">
                                                {staffMember.initials || 'KS'}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors truncate">{staffMember.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-secondary/60 shrink-0">{staffMember.transactions_count} Transaksi</span>
                                                    <div className="w-full max-w-[120px] h-1.5 bg-surface-container-low rounded-full overflow-hidden shrink-0">
                                                        <div style={{ width: `${progressPercent}%` }} className="bg-primary h-full rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-primary">{formatPrice(staffMember.total_sales)}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <button 
                            onClick={() => router.get('/staff')}
                            className="m-6 p-3 bg-surface-container-low hover:bg-surface-container-high text-xs font-bold text-secondary hover:text-on-surface rounded-xl transition-all uppercase tracking-widest text-center active:scale-[0.98]"
                        >
                            Kelola Semua Staff
                        </button>
                    </div>
                </div>

                {/* Footer Meta */}
                <footer className="flex justify-between items-center text-secondary opacity-50 pb-[24px] text-[10px] font-label-mono">
                    <p className="uppercase tracking-[0.2em] font-bold">Precision {currentUser?.outlet_name || 'CAFE RESTO'} v2.4.0</p>
                    <p>Terakhir Sinkronisasi: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                </footer>
            </main>
        </div>
    );
}

