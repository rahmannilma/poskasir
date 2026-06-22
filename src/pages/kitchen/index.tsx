import { useState, useMemo, useEffect } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { usePoll } from '@inertiajs/react';
import { toast } from 'sonner';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
}

interface Order {
    id: number;
    invoice_number: string;
    customer_name: string | null;
    table_number: string | null;
    prep_status: 'pending' | 'preparing' | 'ready' | 'served';
    created_at: string;
    items: OrderItem[];
}

// Timer Component for individual cooking tickets
function OrderTimer({ createdAt }: { createdAt: string }) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const calculateElapsed = () => {
            const start = new Date(createdAt).getTime();
            const now = new Date().getTime();
            setSeconds(Math.max(0, Math.floor((now - start) / 1000)));
        };

        calculateElapsed();
        const interval = setInterval(calculateElapsed, 1000);
        return () => clearInterval(interval);
    }, [createdAt]);

    const formattedTime = useMemo(() => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        const pad = (n: number) => String(n).padStart(2, '0');
        if (h > 0) {
            return `${pad(h)}:${pad(m)}:${pad(s)}`;
        }
        return `${pad(m)}:${pad(s)}`;
    }, [seconds]);

    const colorClass = useMemo(() => {
        if (seconds > 900) return 'text-error font-bold animate-pulse'; // > 15 mins
        if (seconds > 450) return 'text-amber-600 font-bold'; // > 7.5 mins
        return 'text-secondary/60';
    }, [seconds]);

    return (
        <span className={`font-mono text-xs ${colorClass}`}>
            ⏱️ {formattedTime}
        </span>
    );
}

export default function Index() {
    const { orders = [], auth = { user: null } } = usePage<{
        orders: Order[];
        auth: { user: any };
    }>().props;

    const currentUser = auth.user;

    const [isMobile, setIsMobile] = useState(false);
    const [expandedTickets, setExpandedTickets] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleTicketExpand = (ticketId: number) => {
        setExpandedTickets(prev => ({
            ...prev,
            [ticketId]: !prev[ticketId]
        }));
    };

    // Auto poll server every 5 seconds to get new kitchen tickets automatically!
    usePoll(5000);

    // Group orders by prep_status
    const pendingTickets = useMemo(() => orders.filter(o => o.prep_status === 'pending'), [orders]);
    const preparingTickets = useMemo(() => orders.filter(o => o.prep_status === 'preparing'), [orders]);
    const readyTickets = useMemo(() => orders.filter(o => o.prep_status === 'ready'), [orders]);

    // Handle prep status transitions
    const handleStatusTransition = (orderId: number, nextStatus: string) => {
        router.post(`/kitchen/order/${orderId}/status`, {
            prep_status: nextStatus
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success("Status persiapan pesanan berhasil diupdate.");
            },
            onError: () => {
                toast.error("Gagal merubah status persiapan dapur.");
            }
        });
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

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision KDS - Monitor Dapur</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
            </Head>

            {/* Custom Styles Injector */}
            <style dangerouslySetInnerHTML={{__html: `
                body, html, #app, main {
                    background-color: #eceef0 !important;
                    color: #191c1e !important;
                    font-family: 'Inter', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
                :root, .dark, body, html, #app, main {
                    --background: #eceef0 !important;
                    --foreground: #191c1e !important;
                    --font-sans: 'Inter', sans-serif !important;
                    --card: #ffffff !important;
                    --card-foreground: #191c1e !important;
                    --border: #e0e3e5 !important;
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

            {/* Top Navigation */}
            <header className="fixed top-0 right-0 left-0 flex justify-between items-center px-4 sm:px-[32px] h-20 bg-white/90 backdrop-blur-md border-b border-surface-container-high z-10">
                <div className="flex items-center gap-6">
                    {currentUser?.role !== 'kitchen' && (
                        <Link 
                            href={currentUser?.role === 'cashier' ? '/kasir' : '/dashboard'} 
                            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low border border-surface-container-high hover:bg-surface-container/80 text-secondary hover:text-on-surface rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 group"
                        >
                            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                            <span>Kembali</span>
                        </Link>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-on-surface tracking-tight">Monitor Dapur Restoran (KDS)</h2>
                        <p className="text-xs text-secondary/65 font-medium mt-0.5">Antrean memasak makanan dan minuman pesanan meja secara real-time</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-150">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold font-label-mono">Real-time Polling On</span>
                    </div>
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button"
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-600 hover:text-red-700 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm shrink-0 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        <span>Keluar</span>
                    </Link>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="ml-0 pt-24 px-4 sm:px-[32px] pb-[32px] min-h-screen">
                
                {/* Columns KDS Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[calc(100vh-140px)] overflow-y-auto lg:overflow-hidden mt-2">
                    
                    {/* Column 1: PENDING (Pesanan Baru) */}
                    <div className="bg-white rounded-2xl border border-surface-container-high flex flex-col h-full overflow-hidden shadow-soft">
                        <div className="p-4 border-b border-surface-container-low bg-red-50/10 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
                                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Antrean Masak</h3>
                            </div>
                            <span className="bg-error/15 text-error text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                                {pendingTickets.length} Tiket
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-surface-container-low/30">
                            {pendingTickets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-secondary/60 text-xs font-label-mono text-center">
                                    <span className="material-symbols-outlined text-4xl stroke-1 mb-1 opacity-30 text-primary">restaurant_menu</span>
                                    <p>Tidak ada antrean baru</p>
                                </div>
                            ) : (
                                pendingTickets.map((ticket) => {
                                    const isExpanded = !isMobile || !!expandedTickets[ticket.id];
                                    const showExpandLabel = isMobile && ticket.items.length > 2;

                                    return (
                                        <div 
                                            key={ticket.id} 
                                            onClick={() => isMobile && toggleTicketExpand(ticket.id)}
                                            className={`bg-white border border-surface-container-high rounded-xl p-4 shadow-sm flex flex-col gap-3 relative hover:border-error/30 transition-all ${
                                                isMobile ? 'cursor-pointer select-none active:scale-[0.99]' : ''
                                            }`}
                                        >
                                            <div className="flex justify-between items-start border-b border-surface-container-low pb-2">
                                                <div>
                                                    <h4 className="font-bold text-sm text-on-surface">
                                                        🍽️ {ticket.table_number ? `Meja ${ticket.table_number}` : (ticket.customer_name || 'Guest')}
                                                    </h4>
                                                    <span className="text-[10px] text-secondary/60 font-mono">{ticket.invoice_number}</span>
                                                </div>
                                                <OrderTimer createdAt={ticket.created_at} />
                                            </div>
                                            <div className="flex-1 space-y-2 py-1">
                                                {ticket.items.slice(0, isExpanded ? undefined : 2).map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center text-xs">
                                                        <span className="font-bold text-on-surface text-sm">{item.product_name}</span>
                                                        <span className="bg-surface-container-highest px-2 py-0.5 rounded font-bold font-mono text-sm">
                                                            x{item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                                
                                                {showExpandLabel && !isExpanded && (
                                                    <div className="text-[10px] text-primary font-bold text-center pt-2 flex items-center justify-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px] active-icon">expand_more</span>
                                                        <span>+ {ticket.items.length - 2} item lainnya (Ketuk untuk detail)</span>
                                                    </div>
                                                )}
                                                {showExpandLabel && isExpanded && (
                                                    <div className="text-[10px] text-secondary/50 font-bold text-center pt-2 flex items-center justify-center gap-1 border-t border-dashed border-surface-container-low mt-2">
                                                        <span className="material-symbols-outlined text-[12px] active-icon">expand_less</span>
                                                        <span>Lipat detail</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusTransition(ticket.id, 'preparing');
                                                }}
                                                className="w-full mt-2 bg-primary text-white font-bold text-xs py-2 rounded-lg hover:brightness-95 active:scale-98 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-xs">restaurant</span>
                                                Mulai Masak
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Column 2: PREPARING (Sedang Dimasak) */}
                    <div className="bg-white rounded-2xl border border-surface-container-high flex flex-col h-full overflow-hidden shadow-soft">
                        <div className="p-4 border-b border-surface-container-low bg-amber-50/10 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Sedang Memasak</h3>
                            </div>
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                                {preparingTickets.length} Tiket
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-surface-container-low/30">
                            {preparingTickets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-secondary/60 text-xs font-label-mono text-center">
                                    <span className="material-symbols-outlined text-4xl stroke-1 mb-1 opacity-30 text-amber-500">soup_kitchen</span>
                                    <p>Belum ada masakan diproses</p>
                                </div>
                            ) : (
                                preparingTickets.map((ticket) => {
                                    const isExpanded = !isMobile || !!expandedTickets[ticket.id];
                                    const showExpandLabel = isMobile && ticket.items.length > 2;

                                    return (
                                        <div 
                                            key={ticket.id} 
                                            onClick={() => isMobile && toggleTicketExpand(ticket.id)}
                                            className={`bg-white border border-amber-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative hover:border-amber-300 transition-all ${
                                                isMobile ? 'cursor-pointer select-none active:scale-[0.99]' : ''
                                            }`}
                                        >
                                            <div className="flex justify-between items-start border-b border-surface-container-low pb-2">
                                                <div>
                                                    <h4 className="font-bold text-sm text-on-surface">
                                                        🍳 {ticket.table_number ? `Meja ${ticket.table_number}` : (ticket.customer_name || 'Guest')}
                                                    </h4>
                                                    <span className="text-[10px] text-secondary/60 font-mono">{ticket.invoice_number}</span>
                                                </div>
                                                <OrderTimer createdAt={ticket.created_at} />
                                            </div>
                                            <div className="flex-1 space-y-2 py-1">
                                                {ticket.items.slice(0, isExpanded ? undefined : 2).map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center text-xs">
                                                        <span className="font-bold text-on-surface text-sm">{item.product_name}</span>
                                                        <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold font-mono text-sm border border-amber-100">
                                                            x{item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                                
                                                {showExpandLabel && !isExpanded && (
                                                    <div className="text-[10px] text-amber-600 font-bold text-center pt-2 flex items-center justify-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px] active-icon">expand_more</span>
                                                        <span>+ {ticket.items.length - 2} item lainnya (Ketuk untuk detail)</span>
                                                    </div>
                                                )}
                                                {showExpandLabel && isExpanded && (
                                                    <div className="text-[10px] text-secondary/50 font-bold text-center pt-2 flex items-center justify-center gap-1 border-t border-dashed border-surface-container-low mt-2">
                                                        <span className="material-symbols-outlined text-[12px] active-icon">expand_less</span>
                                                        <span>Lipat detail</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusTransition(ticket.id, 'ready');
                                                }}
                                                className="w-full mt-2 bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-emerald-700 active:scale-98 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                                Siap Sajikan
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Column 3: READY (Siap Disajikan / Waiter Pickup) */}
                    <div className="bg-white rounded-2xl border border-surface-container-high flex flex-col h-full overflow-hidden shadow-soft">
                        <div className="p-4 border-b border-surface-container-low bg-emerald-50/10 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Siap Disajikan</h3>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                                {readyTickets.length} Tiket
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-surface-container-low/30">
                            {readyTickets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-secondary/60 text-xs font-label-mono text-center">
                                    <span className="material-symbols-outlined text-4xl stroke-1 mb-1 opacity-30 text-emerald-500">dining</span>
                                    <p>Tidak ada hidangan siap saji</p>
                                </div>
                            ) : (
                                readyTickets.map((ticket) => {
                                    const isExpanded = !isMobile || !!expandedTickets[ticket.id];
                                    const showExpandLabel = isMobile && ticket.items.length > 2;

                                    return (
                                        <div 
                                            key={ticket.id} 
                                            onClick={() => isMobile && toggleTicketExpand(ticket.id)}
                                            className={`bg-emerald-50/20 border border-emerald-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative hover:border-emerald-300 transition-all ${
                                                isMobile ? 'cursor-pointer select-none active:scale-[0.99]' : ''
                                            }`}
                                        >
                                            <div className="flex justify-between items-start border-b border-emerald-100 pb-2">
                                                <div>
                                                    <h4 className="font-bold text-sm text-emerald-800">
                                                        🛎️ {ticket.table_number ? `Meja ${ticket.table_number}` : (ticket.customer_name || 'Guest')}
                                                    </h4>
                                                    <span className="text-[10px] text-secondary/60 font-mono">{ticket.invoice_number}</span>
                                                </div>
                                                <span className="text-[10px] text-emerald-600 font-bold font-label-mono">SIAP!</span>
                                            </div>
                                            <div className="flex-1 space-y-2 py-1">
                                                {ticket.items.slice(0, isExpanded ? undefined : 2).map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center text-xs">
                                                        <span className="font-bold text-on-surface text-sm">{item.product_name}</span>
                                                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono text-sm border border-emerald-250">
                                                            x{item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                                
                                                {showExpandLabel && !isExpanded && (
                                                    <div className="text-[10px] text-emerald-600 font-bold text-center pt-2 flex items-center justify-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px] active-icon">expand_more</span>
                                                        <span>+ {ticket.items.length - 2} item lainnya (Ketuk untuk detail)</span>
                                                    </div>
                                                )}
                                                {showExpandLabel && isExpanded && (
                                                    <div className="text-[10px] text-secondary/50 font-bold text-center pt-2 flex items-center justify-center gap-1 border-t border-dashed border-surface-container-low mt-2">
                                                        <span className="material-symbols-outlined text-[12px] active-icon">expand_less</span>
                                                        <span>Lipat detail</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusTransition(ticket.id, 'served');
                                                }}
                                                className="w-full mt-2 bg-secondary text-white font-bold text-xs py-2 rounded-lg hover:brightness-95 active:scale-98 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-xs">local_shipping</span>
                                                Tandai Selesai / Sajikan
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}

