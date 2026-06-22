import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: string | number;
    stock: number;
    description?: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function Pos() {
    const { products = [], categories = [], auth = { user: null }, active_shift = null, pending_orders = [], customers = [], dining_tables = [] } = usePage<any>().props;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    
    // Buka Shift states
    const [initialCash, setInitialCash] = useState('');
    const [isOpenShiftProcessing, setIsOpenShiftProcessing] = useState(false);
    
    // Responsive layout states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    
    // Checkout states
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qris'>('cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [discountPercent, setDiscountPercent] = useState('0');
    const [customerName, setCustomerName] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Loyalty states
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [pointsRedeemed, setPointsRedeemed] = useState('');
    
    // Member registration states
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    
    // Member dropdown search state
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);

    // Split Bill states
    const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
    const [splitQuantities, setSplitQuantities] = useState<Record<number, number>>({});
    const [splitPaymentMethod, setSplitPaymentMethod] = useState<'cash' | 'card' | 'qris'>('cash');
    const [splitAmountPaid, setSplitAmountPaid] = useState('');
    const [splitDiscountPercent, setSplitDiscountPercent] = useState('0');
    const [splitCustomerId, setSplitCustomerId] = useState<number | null>(null);
    const [splitPointsRedeemed, setSplitPointsRedeemed] = useState('');
    const [isSplitProcessing, setIsSplitProcessing] = useState(false);
    const [splitMemberSearchQuery, setSplitMemberSearchQuery] = useState('');
    const [showSplitMemberDropdown, setShowSplitMemberDropdown] = useState(false);
    
    // Receipt state
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptOrder, setReceiptOrder] = useState<any>(null);

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

    // Filter products based on search and category
    const filteredProducts = useMemo(() => {
        return products.filter((product: Product) => {
            const matchesSearch = 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    // Handle cart operations
    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                toast.error(`Stok ${product.name} tidak mencukupi.`);
                return;
            }
            setCart(
                cart.map(item => 
                    item.product.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                )
            );
        } else {
            if (product.stock < 1) {
                toast.error(`Stok ${product.name} habis.`);
                return;
            }
            setCart([...cart, { product, quantity: 1 }]);
        }
        toast.success(`${product.name} ditambahkan ke keranjang.`);
    };

    const updateQuantity = (productId: number, delta: number) => {
        const item = cart.find(item => item.product.id === productId);
        if (!item) return;

        const newQty = item.quantity + delta;
        if (newQty <= 0) {
            setCart(cart.filter(item => item.product.id !== productId));
        } else {
            if (newQty > item.product.stock) {
                toast.error(`Stok ${item.product.name} tidak mencukupi.`);
                return;
            }
            setCart(
                cart.map(item => 
                    item.product.id === productId 
                        ? { ...item, quantity: newQty } 
                        : item
                )
            );
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product.id !== productId));
        toast.info("Item dihapus dari keranjang.");
    };

    // Calculate totals
    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => {
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
            return sum + (price * item.quantity);
        }, 0);
    }, [cart]);

    const discountAmount = useMemo(() => {
        const pct = parseFloat(discountPercent) || 0;
        return (subtotal * pct) / 100;
    }, [subtotal, discountPercent]);

    const pointsDiscount = useMemo(() => {
        const pts = parseInt(pointsRedeemed) || 0;
        return pts * 1000;
    }, [pointsRedeemed]);

    const total = useMemo(() => Math.max(0, subtotal - discountAmount - pointsDiscount), [subtotal, discountAmount, pointsDiscount]);

    const changeAmount = useMemo(() => {
        const paid = parseFloat(amountPaid) || 0;
        return Math.max(0, paid - total);
    }, [amountPaid, total]);

    const underpaidAmount = useMemo(() => {
        const paid = parseFloat(amountPaid) || 0;
        return Math.max(0, total - paid);
    }, [amountPaid, total]);

    // Split Bill Calculations
    const splitSubtotal = useMemo(() => {
        return cart.reduce((sum, item) => {
            const qty = splitQuantities[item.product.id] || 0;
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
            return sum + (price * qty);
        }, 0);
    }, [cart, splitQuantities]);

    const splitDiscountAmount = useMemo(() => {
        const pct = parseFloat(splitDiscountPercent) || 0;
        return (splitSubtotal * pct) / 100;
    }, [splitSubtotal, splitDiscountPercent]);

    const splitPointsDiscount = useMemo(() => {
        const pts = parseInt(splitPointsRedeemed) || 0;
        return pts * 1000;
    }, [splitPointsRedeemed]);

    const splitTotal = useMemo(() => {
        return Math.max(0, splitSubtotal - splitDiscountAmount - splitPointsDiscount);
    }, [splitSubtotal, splitDiscountAmount, splitPointsDiscount]);

    const splitChangeAmount = useMemo(() => {
        const paid = parseFloat(splitAmountPaid) || 0;
        return Math.max(0, paid - splitTotal);
    }, [splitAmountPaid, splitTotal]);

    const splitUnderpaidAmount = useMemo(() => {
        const paid = parseFloat(splitAmountPaid) || 0;
        return Math.max(0, splitTotal - paid);
    }, [splitAmountPaid, splitTotal]);

    const remainingSubtotal = useMemo(() => {
        return cart.reduce((sum, item) => {
            const qty = item.quantity - (splitQuantities[item.product.id] || 0);
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
            return sum + (price * qty);
        }, 0);
    }, [cart, splitQuantities]);

    // Handle Submit Checkout
    const handleCheckoutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const paidNum = parseFloat(amountPaid) || 0;
        if (paymentMethod === 'cash' && paidNum < total) {
            toast.error("Jumlah bayar kurang dari total transaksi.");
            return;
        }

        setIsProcessing(true);

        const payload = {
            payment_method: paymentMethod,
            amount_paid: paymentMethod === 'cash' ? Math.max(paidNum, total) : total,
            status: 'completed',
            discount_percent: parseFloat(discountPercent) || 0,
            customer_name: customerName || null,
            table_number: tableNumber || null,
            pending_order_id: editingOrderId,
            customer_id: selectedCustomerId,
            points_redeemed: parseInt(pointsRedeemed) || 0,
            items: cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
            }))
        };

        router.post('/checkout', payload, {
            onSuccess: (page) => {
                setIsProcessing(false);
                setIsMobileCartOpen(false);
                
                // Show receipt if invoice returned
                const resInvoice = page.props.flash?.invoice;
                if (resInvoice) {
                    setReceiptOrder(resInvoice);
                    setShowReceipt(true);
                    setCart([]);
                    setDiscountPercent('0');
                    setCustomerName('');
                    setTableNumber('');
                    setAmountPaid('');
                    setEditingOrderId(null);
                    setSelectedCustomerId(null);
                    setPointsRedeemed('');
                }
            },
            onError: (err) => {
                setIsProcessing(false);
                const errMsg = err.error || Object.values(err)[0] || "Terjadi kesalahan saat checkout.";
                toast.error(errMsg);
            }
        });
    };

    const handleSaveOrderPending = () => {
        if (cart.length === 0) {
            toast.error("Keranjang belanja kosong.");
            return;
        }

        const name = (customerName || '').trim();
        const table = (tableNumber || '').trim();
        if (!name && !table) {
            toast.error("Nama pelanggan atau nomor meja harus diisi salah satunya.");
            return;
        }

        setIsProcessing(true);

        const payload = {
            status: 'pending',
            payment_method: 'cash',
            amount_paid: 0,
            discount_percent: parseFloat(discountPercent) || 0,
            customer_name: name || null,
            table_number: table || null,
            pending_order_id: editingOrderId,
            customer_id: selectedCustomerId,
            items: cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
            }))
        };

        router.post('/checkout', payload, {
            onSuccess: () => {
                setIsProcessing(false);
                setIsMobileCartOpen(false);
                setCart([]);
                setDiscountPercent('0');
                setCustomerName('');
                setTableNumber('');
                setAmountPaid('');
                setEditingOrderId(null);
                setSelectedCustomerId(null);
                setPointsRedeemed('');
                toast.success("Pesanan berhasil disimpan.");
            },
            onError: (err) => {
                setIsProcessing(false);
                const errMsg = err.error || Object.values(err)[0] || "Gagal menyimpan pesanan.";
                toast.error(errMsg);
            }
        });
    };

    const handleVoidPendingOrder = () => {
        if (!editingOrderId) return;
        
        if (!confirm("Yakin ingin membatalkan dan menghapus pesanan meja ini? Stok barang/bahan baku akan dipulihkan.")) {
            return;
        }

        setIsProcessing(true);

        router.post(`/checkout/void/${editingOrderId}`, {}, {
            onSuccess: () => {
                setIsProcessing(false);
                setIsMobileCartOpen(false);
                setCart([]);
                setDiscountPercent('0');
                setCustomerName('');
                setTableNumber('');
                setAmountPaid('');
                setEditingOrderId(null);
                setSelectedCustomerId(null);
                setPointsRedeemed('');
                toast.success("Pesanan berhasil dibatalkan dan dihapus.");
            },
            onError: (err) => {
                setIsProcessing(false);
                const errMsg = err.error || Object.values(err)[0] || "Gagal membatalkan pesanan.";
                toast.error(errMsg);
            }
        });
    };

    const loadPendingOrder = (order: any) => {
        setEditingOrderId(order.id);
        setCustomerName(order.customer_name || '');
        setTableNumber(order.table_number || '');
        setDiscountPercent(order.discount_percent.toString());
        setAmountPaid('');
        setSelectedCustomerId(order.customer_id || null);
        setPointsRedeemed('');

        // Map items to cart structure
        const cartItems = order.items.map((item: any) => {
            const prod = products.find((p: Product) => p.id === item.product_id);
            const maxStock = (prod ? prod.stock : 0) + item.quantity;
            return {
                product: {
                    id: item.product_id,
                    name: item.product_name,
                    price: item.price,
                    stock: maxStock,
                    sku: prod?.sku || '',
                    category: prod?.category || ''
                },
                quantity: item.quantity
            };
        });

        setCart(cartItems);
        setIsMobileCartOpen(true);
        toast.info(`Memuat pesanan: ${order.invoice_number}`);
    };

    const renderMemberSelector = () => {
        const selectedCustomer = customers.find((c: any) => c.id === selectedCustomerId);
        
        // Filter customers based on search query
        const filteredCustomers = customers.filter((c: any) => {
            const query = memberSearchQuery.toLowerCase();
            return c.name.toLowerCase().includes(query) || c.phone.includes(query);
        });

        if (selectedCustomer) {
            return (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex flex-col gap-2 relative">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCustomerId(null);
                            setPointsRedeemed('');
                        }}
                        className="absolute top-2 right-2 text-emerald-800/60 hover:text-emerald-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-sm">verified_user</span>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-emerald-800">{selectedCustomer.name}</span>
                            <span className="text-[9px] text-emerald-600 font-mono">{selectedCustomer.phone}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-medium text-emerald-800 pt-1 border-t border-emerald-200/50">
                        <span>Poin Tersedia:</span>
                        <span className="font-bold font-mono">{selectedCustomer.points} Poin</span>
                    </div>

                    {selectedCustomer.points > 0 && (
                        <div className="flex flex-col gap-1 mt-1">
                            <label className="text-[9px] font-semibold text-emerald-800 uppercase">Tukar Poin (1 Poin = Rp1.000)</label>
                            <div className="flex gap-1.5 items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max={selectedCustomer.points}
                                    placeholder="0"
                                    value={pointsRedeemed}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const pts = parseInt(val) || 0;
                                        if (val === '' || (pts >= 0 && pts <= selectedCustomer.points)) {
                                            setPointsRedeemed(val);
                                        }
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-emerald-300 text-emerald-800 rounded text-xs font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                                />
                                {pointsRedeemed && (
                                    <span className="text-[9px] font-bold text-red-600 whitespace-nowrap">
                                        - {formatPrice((parseInt(pointsRedeemed) || 0) * 1000)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-1.5 relative">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold text-secondary uppercase">Loyalty Member</label>
                    <button
                        type="button"
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="text-[9px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[10px]">person_add</span>
                        <span>Daftar Member</span>
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari member dengan nama/telepon..."
                        value={memberSearchQuery}
                        onChange={(e) => {
                            setMemberSearchQuery(e.target.value);
                            setShowMemberDropdown(true);
                        }}
                        onFocus={() => setShowMemberDropdown(true)}
                        className="w-full px-3 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                    />
                    {showMemberDropdown && memberSearchQuery && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-surface-container-high rounded-xl shadow-lg z-50 max-h-[160px] overflow-y-auto no-scrollbar">
                            {filteredCustomers.length === 0 ? (
                                <div className="p-3 text-[10px] text-secondary text-center">
                                    Member tidak ditemukan
                                </div>
                            ) : (
                                filteredCustomers.map((cust: any) => (
                                    <button
                                        key={cust.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCustomerId(cust.id);
                                            setCustomerName(cust.name);
                                            setMemberSearchQuery('');
                                            setShowMemberDropdown(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-surface-container-low transition-colors border-b border-surface-container-high/30 last:border-none cursor-pointer"
                                    >
                                        <div className="text-[11px] font-bold text-on-surface">{cust.name}</div>
                                        <div className="text-[9px] text-secondary font-mono flex justify-between">
                                            <span>{cust.phone}</span>
                                            <span className="text-primary font-bold">{cust.points} Poin</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
                {/* Backdrop to close dropdown when clicked outside */}
                {showMemberDropdown && (
                    <div 
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setShowMemberDropdown(false)}
                    />
                )}
            </div>
        );
    };

    const handleOpenShiftSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cashNum = parseFloat(initialCash);
        if (isNaN(cashNum) || cashNum < 0) {
            toast.error("Nominal modal awal tidak valid.");
            return;
        }

        setIsOpenShiftProcessing(true);

        router.post('/shifts/open', {
            initial_cash: cashNum
        }, {
            onSuccess: () => {
                setIsOpenShiftProcessing(false);
                toast.success("Shift berhasil dibuka.");
            },
            onError: (err) => {
                setIsOpenShiftProcessing(false);
                const errMsg = err.error || Object.values(err)[0] || "Gagal membuka shift.";
                toast.error(errMsg);
            }
        });
    };

    // Quick Cash Payment buttons helper
    const quickCashAmounts = useMemo(() => {
        if (total <= 0) return [];
        const base = [20000, 50000, 100000];
        // Calculate rounded values above total
        const suggestions = new Set<number>();
        suggestions.add(Math.ceil(total / 10000) * 10000);
        suggestions.add(Math.ceil(total / 50000) * 50000);
        base.forEach(amt => {
            if (amt >= total) suggestions.add(amt);
        });
        return Array.from(suggestions).sort((a, b) => a - b).slice(0, 4);
    }, [total]);

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
        <div className="bg-background text-on-background min-h-screen flex font-sans overflow-x-hidden antialiased">
            <Head>
                <title>Precision POS - POS Kasir</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
            </Head>

            {/* Custom Styles Injector to strictly match colors */}
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
                
                /* Hide scrollbar for Chrome, Safari and Opera */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
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

            {/* Sidebar Backdrop Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-20 transition-opacity duration-300" 
                    onClick={() => setIsSidebarOpen(false)} 
                />
            )}

            {/* SideNavBar (The "Anchor") */}
            <aside className={`fixed left-0 top-0 h-full flex flex-col bg-white border-r border-surface-container-high w-72 z-30 transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                    <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/shifts">
                        <span className="material-symbols-outlined group-hover:text-primary">schedule</span>
                        <span className="text-[15px] font-sans">Shift Kerja</span>
                    </Link>
                    <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/kitchen">
                        <span className="material-symbols-outlined group-hover:text-primary">soup_kitchen</span>
                        <span className="text-[15px] font-sans">Dapur (KDS)</span>
                    </Link>
                    {/* Active Tab: POS Kasir */}
                    {currentUser?.role !== 'owner' && (
                        <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href={['owner', 'super_admin', 'manager'].includes(currentUser?.role) ? '/pos' : '/kasir'}>
                            <span className="material-symbols-outlined active-icon">shopping_cart</span>
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
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${active_shift ? 'text-emerald-600' : 'text-primary'}`}>
                                {active_shift ? 'Shift Active' : 'Owner Mode'}
                            </p>
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

            {/* Main Workspace */}
            <main className="ml-0 flex-1 h-screen flex flex-col relative overflow-hidden">
                
                {/* TopAppBar */}
                <header className="fixed top-0 right-0 left-0 h-20 bg-white/80 backdrop-blur-md border-b border-surface-container-high flex justify-between items-center px-4 sm:px-8 z-10">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="p-2 -ml-2 text-secondary hover:bg-surface-container-low rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        <h2 className="text-base sm:text-lg font-bold text-on-surface tracking-tight whitespace-nowrap">Point of Sale (POS)</h2>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary/50 text-sm">search</span>
                            <input 
                                className="pl-12 pr-4 py-2.5 bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/30 rounded-full w-32 xs:w-48 sm:w-64 text-sm transition-all outline-none text-on-surface" 
                                placeholder="Cari nama atau SKU..." 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-secondary hover:bg-surface-container-low rounded-full transition-all relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2 text-secondary hover:bg-surface-container-low rounded-full transition-all">
                                <span className="material-symbols-outlined">calendar_today</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Canvas */}
                <div className="mt-20 p-4 sm:p-8 flex-1 overflow-hidden bg-background flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)]">
                    
                    {/* Catalog Section */}
                    <div className="flex flex-1 flex-col gap-4 overflow-hidden h-full">
                        {/* Meja Aktif (Pesanan Belum Bayar) */}
                        {pending_orders.length > 0 && (
                            <div className="bg-white border border-surface-container-high p-4 rounded-2xl shadow-soft shrink-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-orange-500 text-lg">restaurant</span>
                                    <h3 className="font-bold text-xs text-on-surface uppercase tracking-wider">🍽️ Meja Aktif (Pesanan Tertunda)</h3>
                                    <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {pending_orders.length}
                                    </span>
                                </div>
                                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                                    {pending_orders.map((order: any) => {
                                        const totalItems = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                                        const displayName = order.table_number 
                                            ? `Meja ${order.table_number}` 
                                            : (order.customer_name || 'Pelanggan');
                                        const subLabel = order.table_number && order.customer_name 
                                            ? order.customer_name 
                                            : order.invoice_number;
                                        const isCurrent = editingOrderId === order.id;

                                        return (
                                            <button
                                                key={order.id}
                                                type="button"
                                                onClick={() => loadPendingOrder(order)}
                                                className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer min-w-[140px] shrink-0 active:scale-95 ${
                                                    isCurrent 
                                                        ? 'bg-primary/5 border-primary shadow-sm' 
                                                        : 'bg-surface-container-low/40 border-surface-container-high/60 hover:border-orange-300 hover:bg-white'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`font-bold text-xs truncate max-w-[110px] ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                                                        {displayName}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-secondary/65 truncate max-w-[120px] font-mono">
                                                    {subLabel}
                                                </span>
                                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-surface-container-high/40 text-[10px] font-semibold text-secondary font-mono">
                                                    <span>{totalItems} Pcs</span>
                                                    <span className="text-primary font-bold">{formatPrice(order.total_amount)}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {/* Category Pills */}
                        <div className="flex gap-2 bg-white border border-surface-container-high p-3 rounded-2xl shadow-soft shrink-0 overflow-x-auto no-scrollbar whitespace-nowrap">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                                    selectedCategory === 'All'
                                        ? 'bg-primary text-white font-bold'
                                        : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((cat: string) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                                        selectedCategory === cat
                                            ? 'bg-primary text-white font-bold'
                                            : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Products Grid */}
                        <div className={`flex-1 overflow-y-auto pr-1 custom-scrollbar ${cart.length > 0 ? 'pb-24' : 'pb-6'} lg:pb-6`}>
                            {filteredProducts.length === 0 ? (
                                <div className="flex h-64 flex-col items-center justify-center text-secondary font-label-mono text-xs">
                                    <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">inventory_2</span>
                                    <p>Tidak ada produk ditemukan.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                                    {filteredProducts.map((product: Product) => {
                                        const cartItem = cart.find(item => item.product.id === product.id);
                                        const currentStock = product.stock - (cartItem?.quantity || 0);

                                        return (
                                            <div 
                                                key={product.id} 
                                                onClick={() => currentStock > 0 && addToCart(product)}
                                                className={`group overflow-hidden cursor-pointer rounded-2xl bg-white border border-surface-container-high p-4 flex flex-col justify-between min-h-[160px] transition-all duration-150 active:scale-98 shadow-soft ${
                                                    currentStock === 0 ? 'opacity-50 grayscale' : 'hover:border-primary/50 hover:shadow-md'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start gap-2 mb-2">
                                                        <span className="text-[9px] uppercase tracking-wider text-secondary/70 font-mono font-bold">
                                                            {product.sku}
                                                        </span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold font-mono ${
                                                            currentStock <= 5 ? 'bg-red-50 text-error font-bold border border-red-100' : 'bg-surface-container-low text-secondary'
                                                        }`}>
                                                            Stok: {currentStock}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-[10px] text-secondary/60 line-clamp-1 mt-1">
                                                        {product.description || '-'}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-surface-container-low">
                                                    <span className="font-bold font-mono text-primary text-xs">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <button 
                                                        disabled={currentStock <= 0}
                                                        className="h-6 w-6 rounded-full flex items-center justify-center bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-sm font-bold">add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="hidden lg:flex w-full flex-col bg-white border border-surface-container-high rounded-2xl lg:w-96 overflow-hidden h-full shrink-0 shadow-soft">
                        {/* Cart Header */}
                        <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">shopping_cart</span>
                                <h2 className="font-bold text-on-surface text-sm">Keranjang Belanja</h2>
                            </div>
                            <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-full">
                                {cart.reduce((sum, item) => sum + item.quantity, 0)} Item
                            </span>
                        </div>

                        {/* Cart Items List */}
                        <div className={`p-4 flex flex-col gap-3 custom-scrollbar bg-surface-container-lowest border-b border-surface-container-high/45 ${
                            cart.length === 0 
                                ? 'flex-1 items-center justify-center text-secondary/60 py-12' 
                                : 'max-h-[220px] overflow-y-auto shrink-0'
                        }`}>
                            {cart.length === 0 ? (
                                <>
                                    <span className="material-symbols-outlined text-5xl stroke-1 mb-2 opacity-35 text-primary">shopping_cart</span>
                                    <p className="text-xs">Keranjang masih kosong.</p>
                                </>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.product.id} className="flex gap-3 items-center justify-between p-3 rounded-xl bg-surface-container-low/50 border border-surface-container-high/40">
                                        <div className="flex-1 min-w-0 pr-2">
                                            <h4 className="text-xs font-semibold text-on-surface truncate leading-tight">
                                                {item.product.name}
                                            </h4>
                                            <span className="text-[10px] text-secondary/60 font-mono">
                                                {formatPrice(item.product.price)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="flex items-center border border-surface-container-high rounded bg-white">
                                                <button 
                                                    onClick={() => updateQuantity(item.product.id, -1)}
                                                    className="p-1 hover:bg-surface-container-low transition-colors cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-xs">remove</span>
                                                </button>
                                                <span className="px-1 text-xs font-semibold font-mono w-6 text-center text-on-surface">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => updateQuantity(item.product.id, 1)}
                                                    className="p-1 hover:bg-surface-container-low transition-colors cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-xs">add</span>
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="p-1 text-secondary/60 hover:text-error rounded transition-colors cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Summary & Checkout Form */}
                        {cart.length > 0 && (
                            <form onSubmit={handleCheckoutSubmit} className="p-4 bg-surface-container-low/20 flex flex-col gap-3 overflow-y-auto flex-1 custom-scrollbar">
                                {/* Discount Input */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-semibold text-secondary uppercase">Diskon (%)</label>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="100"
                                        placeholder="0"
                                        value={discountPercent}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 100)) {
                                                setDiscountPercent(val);
                                            }
                                        }}
                                        className="w-full px-3 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface font-mono"
                                    />
                                </div>

                                {/* Totals Breakdown */}
                                <div className="flex flex-col gap-1 text-[11px] border-t border-b border-surface-container-high/60 py-2 my-1">
                                    <div className="flex justify-between text-secondary">
                                        <span>Subtotal</span>
                                        <span className="font-mono">{formatPrice(subtotal)}</span>
                                    </div>
                                    {parseFloat(discountPercent) > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Diskon ({discountPercent}%)</span>
                                            <span className="font-mono">- {formatPrice(discountAmount)}</span>
                                        </div>
                                    )}
                                    {pointsDiscount > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Potongan Poin</span>
                                            <span className="font-mono">- {formatPrice(pointsDiscount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-on-surface text-xs pt-1 border-t border-surface-container-high/40">
                                        <span>Total</span>
                                        <span className="text-primary font-mono">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Payment Method Grid */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-semibold text-secondary uppercase">Metode Pembayaran</label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => { setPaymentMethod('cash'); setAmountPaid(''); }}
                                            className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                                                paymentMethod === 'cash' 
                                                    ? 'bg-primary text-white font-bold border-primary shadow-sm' 
                                                    : 'bg-white border-surface-container-high text-secondary hover:bg-surface-container-low hover:text-on-surface'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-sm mb-0.5">payments</span>
                                            <span>Tunai</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setPaymentMethod('card'); setAmountPaid(total.toString()); }}
                                            className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                                                paymentMethod === 'card' 
                                                    ? 'bg-primary text-white font-bold border-primary shadow-sm' 
                                                    : 'bg-white border-surface-container-high text-secondary hover:bg-surface-container-low hover:text-on-surface'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-sm mb-0.5">credit_card</span>
                                            <span>Kartu</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setPaymentMethod('qris'); setAmountPaid(total.toString()); }}
                                            className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                                                paymentMethod === 'qris' 
                                                    ? 'bg-primary text-white font-bold border-primary shadow-sm' 
                                                    : 'bg-white border-surface-container-high text-secondary hover:bg-surface-container-low hover:text-on-surface'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-sm mb-0.5">qr_code_2</span>
                                            <span>QRIS</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Uang Diterima & Suggestions (Tunai only) */}
                                {paymentMethod === 'cash' && (
                                    <div className="flex flex-col gap-1.5 bg-surface-container-low/40 p-2.5 rounded-xl border border-surface-container-high/50">
                                        <div className="flex justify-between items-center text-[10px] text-secondary">
                                            <span className="font-semibold uppercase">Uang Diterima</span>
                                        </div>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-2.5 text-xs font-bold text-secondary/60">Rp</span>
                                            <input 
                                                type="number"
                                                required
                                                placeholder="0"
                                                value={amountPaid}
                                                onChange={(e) => setAmountPaid(e.target.value)}
                                                className="w-full pl-8 pr-2 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs font-mono text-right outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface font-bold"
                                            />
                                        </div>

                                        {/* Suggestion Buttons */}
                                        <div className="grid grid-cols-2 gap-1 mt-0.5">
                                            {quickCashAmounts.map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setAmountPaid(amt.toString())}
                                                    className="py-1 rounded bg-white border border-surface-container-high text-[9px] text-on-surface font-mono hover:bg-surface-container-low transition-colors cursor-pointer text-center"
                                                >
                                                    +{formatPrice(amt).replace('Rp', '').trim()}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setAmountPaid(total.toString())}
                                                className="col-span-2 py-1 rounded bg-primary/10 border border-primary/20 text-[9px] text-primary font-bold hover:bg-primary/20 transition-colors cursor-pointer text-center"
                                            >
                                                ✨ Uang Pas (UPPT)
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Change / Underpaid Status */}
                                {paymentMethod === 'cash' && (
                                    <div className="text-[10px] font-mono font-bold">
                                        {parseFloat(amountPaid) >= total ? (
                                            <div className="flex justify-between items-center p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                                                <span>Kembalian:</span>
                                                <span className="text-xs">{formatPrice(changeAmount)}</span>
                                            </div>
                                        ) : parseFloat(amountPaid) > 0 ? (
                                            <div className="flex justify-between items-center p-2 bg-red-50 text-error rounded-lg border border-red-200">
                                                <span>Uang Kurang:</span>
                                                <span className="text-xs">{formatPrice(underpaidAmount)}</span>
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-surface-container-low text-secondary text-center rounded-lg border border-surface-container-high/60">
                                                Masukkan uang diterima
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Member Selector */}
                                <div className="border-t border-dashed border-surface-container-high/60 pt-2.5 my-0.5">
                                    {renderMemberSelector()}
                                </div>

                                {/* Customer Name & Table Number */}
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-secondary uppercase">Pelanggan</label>
                                        <input 
                                            type="text" 
                                            placeholder="Nama..."
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="px-2.5 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                         <label className="text-[10px] font-semibold text-secondary uppercase">No. Meja</label>
                                         {dining_tables.length > 0 ? (
                                             <select
                                                 value={tableNumber}
                                                 onChange={(e) => setTableNumber(e.target.value)}
                                                 className="px-2.5 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                                             >
                                                 <option value="">Pilih Meja...</option>
                                                 {dining_tables.map((table: any) => (
                                                     <option key={table.id} value={table.number}>
                                                         {table.number}
                                                     </option>
                                                 ))}
                                                 {tableNumber && !dining_tables.find((t: any) => t.number === tableNumber) && (
                                                     <option value={tableNumber}>{tableNumber}</option>
                                                 )}
                                             </select>
                                         ) : (
                                             <input 
                                                 type="text" 
                                                 placeholder="Meja..."
                                                 value={tableNumber}
                                                 onChange={(e) => setTableNumber(e.target.value)}
                                                 className="px-2.5 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                                             />
                                         )}
                                     </div>
                                 </div>

                                {/* Actions buttons */}
                                <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-surface-container-high/60">
                                    {editingOrderId !== null ? (
                                        <>
                                            <button 
                                                type="submit"
                                                disabled={isProcessing || (paymentMethod === 'cash' && (parseFloat(amountPaid) || 0) < total)}
                                                className="w-full bg-primary text-white font-bold text-xs py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">soup_kitchen</span>
                                                <span>{isProcessing ? 'Memproses...' : 'Bayar & Kirim ke Dapur'}</span>
                                            </button>

                                            <button 
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={() => {
                                                    const init: Record<number, number> = {};
                                                    cart.forEach(item => {
                                                        init[item.product.id] = 0;
                                                    });
                                                    setSplitQuantities(init);
                                                    setSplitPaymentMethod('cash');
                                                    setSplitAmountPaid('');
                                                    setSplitDiscountPercent('0');
                                                    setSplitCustomerId(null);
                                                    setSplitPointsRedeemed('');
                                                    setIsSplitModalOpen(true);
                                                }}
                                                className="w-full bg-blue-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">call_split</span>
                                                <span>Pisah Tagihan (Split Bill)</span>
                                            </button>

                                            <button 
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={handleSaveOrderPending}
                                                className="w-full bg-orange-500 text-white font-bold text-[10px] py-1.5 rounded-lg hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-xs">save</span>
                                                <span>Simpan Perubahan</span>
                                            </button>

                                            <div className="grid grid-cols-2 gap-2">
                                                <button 
                                                    type="button"
                                                    disabled={isProcessing}
                                                    onClick={handleVoidPendingOrder}
                                                    className="bg-red-600 text-white font-semibold text-[10px] py-1.5 rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-xs">delete</span>
                                                    <span>Hapus Pesanan</span>
                                                </button>
                                                <button 
                                                    type="button"
                                                    disabled={isProcessing}
                                                    onClick={() => {
                                                        setCart([]);
                                                        setDiscountPercent('0');
                                                        setCustomerName('');
                                                        setTableNumber('');
                                                        setAmountPaid('');
                                                        setEditingOrderId(null);
                                                    }}
                                                    className="border border-surface-container-highest text-secondary font-medium text-[10px] py-1.5 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-xs">close</span>
                                                    <span>Batal Edit</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                type="submit"
                                                disabled={isProcessing || (paymentMethod === 'cash' && (parseFloat(amountPaid) || 0) < total)}
                                                className="w-full bg-primary text-white font-bold text-xs py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">soup_kitchen</span>
                                                <span>{isProcessing ? 'Memproses...' : 'Bayar & Kirim ke Dapur'}</span>
                                            </button>

                                            <button 
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={handleSaveOrderPending}
                                                className="w-full bg-orange-500 text-white font-bold text-[10px] py-1.5 rounded-lg hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-xs">bookmark</span>
                                                <span>Simpan Pesanan</span>
                                            </button>

                                            <button 
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={() => {
                                                    setCart([]);
                                                    setDiscountPercent('0');
                                                    setCustomerName('');
                                                    setTableNumber('');
                                                    setAmountPaid('');
                                                }}
                                                className="w-full border border-surface-container-highest text-secondary font-medium text-[10px] py-1.5 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-xs">close</span>
                                                <span>Kosongkan</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </main>

            {/* Mobile Floating Cart Bar */}
            {cart.length > 0 && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-surface-container-high flex gap-3 shadow-lg z-20 animate-in fade-in slide-in-from-bottom duration-300">
                    <button
                        onClick={() => setIsMobileCartOpen(true)}
                        className="flex-grow bg-primary text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-between shadow-lg shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            <span>Lihat Keranjang ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                        </span>
                        <span className="font-mono font-bold">{formatPrice(total)}</span>
                    </button>
                </div>
            )}

            {/* Mobile Cart Dialog */}
            <Dialog open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
                <DialogContent className="w-[95%] sm:max-w-[480px] p-0 overflow-hidden bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl flex flex-col max-h-[85vh]">
                    {/* Cart Header */}
                    <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">shopping_cart</span>
                            <h2 className="font-bold text-on-surface text-sm">Keranjang Belanja</h2>
                        </div>
                        <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-full">
                            {cart.reduce((sum, item) => sum + item.quantity, 0)} Item
                        </span>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-surface-container-lowest max-h-[25vh]">
                        {cart.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-secondary/60 py-12">
                                <span className="material-symbols-outlined text-5xl stroke-1 mb-2 opacity-35 text-primary">shopping_cart</span>
                                <p className="text-xs">Keranjang masih kosong.</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.product.id} className="flex gap-3 items-center justify-between p-3 rounded-xl bg-surface-container-low/50 border border-surface-container-high/40">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h4 className="text-xs font-semibold text-on-surface truncate leading-tight">
                                            {item.product.name}
                                        </h4>
                                        <span className="text-[10px] text-secondary/60 font-mono">
                                            {formatPrice(item.product.price)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="flex items-center border border-surface-container-high rounded bg-white">
                                            <button 
                                                onClick={() => updateQuantity(item.product.id, -1)}
                                                className="p-1 hover:bg-surface-container-low transition-colors cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-xs">remove</span>
                                            </button>
                                            <span className="px-1 text-xs font-semibold font-mono w-6 text-center text-on-surface">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => updateQuantity(item.product.id, 1)}
                                                className="p-1 hover:bg-surface-container-low transition-colors cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-xs">add</span>
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="p-1 text-secondary/60 hover:text-error rounded transition-colors cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Summary & Checkout Form */}
                    {cart.length > 0 && (
                        <form onSubmit={handleCheckoutSubmit} className="p-4 border-t border-surface-container-high bg-surface-container-low/20 flex flex-col gap-3 overflow-y-auto max-h-[45vh] custom-scrollbar">
                            {/* Discount Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-semibold text-secondary uppercase">Diskon (%)</label>
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="100"
                                    placeholder="0"
                                    value={discountPercent}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 100)) {
                                            setDiscountPercent(val);
                                        }
                                    }}
                                    className="w-full px-3 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface font-mono"
                                />
                            </div>

                            {/* Totals Breakdown */}
                            <div className="flex flex-col gap-1 text-[11px] border-t border-b border-surface-container-high/60 py-2 my-1">
                                <div className="flex justify-between text-secondary">
                                    <span>Subtotal</span>
                                    <span className="font-mono">{formatPrice(subtotal)}</span>
                                </div>
                                {parseFloat(discountPercent) > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Diskon ({discountPercent}%)</span>
                                        <span className="font-mono">- {formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                {pointsDiscount > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Potongan Poin</span>
                                        <span className="font-mono">- {formatPrice(pointsDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-on-surface text-xs pt-1 border-t border-surface-container-high/40">
                                    <span>Total</span>
                                    <span className="text-primary font-mono">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Payment Method Grid */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-semibold text-secondary uppercase">Metode Pembayaran</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('cash'); setAmountPaid(''); }}
                                        className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                                            paymentMethod === 'cash' 
                                                ? 'bg-primary text-white font-bold border-primary shadow-sm' 
                                                : 'bg-white border-surface-container-high text-secondary hover:bg-surface-container-low hover:text-on-surface'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm mb-0.5">payments</span>
                                        <span>Tunai</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('card'); setAmountPaid(total.toString()); }}
                                        className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                                            paymentMethod === 'card' 
                                                ? 'bg-primary text-white font-bold border-primary shadow-sm' 
                                                : 'bg-white border-surface-container-high text-secondary hover:bg-surface-container-low hover:text-on-surface'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm mb-0.5">credit_card</span>
                                        <span>Kartu</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setPaymentMethod('qris'); setAmountPaid(total.toString()); }}
                                        className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                                            paymentMethod === 'qris' 
                                                ? 'bg-primary text-white font-bold border-primary shadow-sm' 
                                                : 'bg-white border-surface-container-high text-secondary hover:bg-surface-container-low hover:text-on-surface'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm mb-0.5">qr_code_2</span>
                                        <span>QRIS</span>
                                    </button>
                                </div>
                            </div>

                            {/* Uang Diterima & Suggestions (Tunai only) */}
                            {paymentMethod === 'cash' && (
                                <div className="flex flex-col gap-1.5 bg-surface-container-low/40 p-2.5 rounded-xl border border-surface-container-high/50">
                                    <div className="flex justify-between items-center text-[10px] text-secondary">
                                        <span className="font-semibold uppercase">Uang Diterima</span>
                                    </div>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-2.5 text-xs font-bold text-secondary/60">Rp</span>
                                        <input 
                                            type="number"
                                            required
                                            placeholder="0"
                                            value={amountPaid}
                                            onChange={(e) => setAmountPaid(e.target.value)}
                                            className="w-full pl-8 pr-2 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs font-mono text-right outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface font-bold"
                                        />
                                    </div>

                                    {/* Suggestion Buttons */}
                                    <div className="grid grid-cols-2 gap-1 mt-0.5">
                                        {quickCashAmounts.map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setAmountPaid(amt.toString())}
                                                className="py-1 rounded bg-white border border-surface-container-high text-[9px] text-on-surface font-mono hover:bg-surface-container-low transition-colors cursor-pointer text-center"
                                            >
                                                +{formatPrice(amt).replace('Rp', '').trim()}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setAmountPaid(total.toString())}
                                            className="col-span-2 py-1 rounded bg-primary/10 border border-primary/20 text-[9px] text-primary font-bold hover:bg-primary/20 transition-colors cursor-pointer text-center"
                                        >
                                            ✨ Uang Pas (UPPT)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Change / Underpaid Status */}
                            {paymentMethod === 'cash' && (
                                <div className="text-[10px] font-mono font-bold">
                                    {parseFloat(amountPaid) >= total ? (
                                        <div className="flex justify-between items-center p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                                            <span>Kembalian:</span>
                                            <span className="text-xs">{formatPrice(changeAmount)}</span>
                                        </div>
                                    ) : parseFloat(amountPaid) > 0 ? (
                                        <div className="flex justify-between items-center p-2 bg-red-50 text-error rounded-lg border border-red-200">
                                            <span>Uang Kurang:</span>
                                            <span className="text-xs">{formatPrice(underpaidAmount)}</span>
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-surface-container-low text-secondary text-center rounded-lg border border-surface-container-high/60">
                                            Masukkan uang diterima
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Member Selector */}
                            <div className="border-t border-dashed border-surface-container-high/60 pt-2.5 my-0.5">
                                {renderMemberSelector()}
                            </div>

                            {/* Customer Name & Table Number */}
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold text-secondary uppercase">Pelanggan</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nama..."
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="px-2.5 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold text-secondary uppercase">No. Meja</label>
                                    {dining_tables.length > 0 ? (
                                        <select
                                            value={tableNumber}
                                            onChange={(e) => setTableNumber(e.target.value)}
                                            className="px-2.5 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                                        >
                                            <option value="">Pilih Meja...</option>
                                            {dining_tables.map((table: any) => (
                                                <option key={table.id} value={table.number}>
                                                    {table.number}
                                                    </option>
                                            ))}
                                            {tableNumber && !dining_tables.find((t: any) => t.number === tableNumber) && (
                                                <option value={tableNumber}>{tableNumber}</option>
                                            )}
                                        </select>
                                    ) : (
                                        <input 
                                            type="text" 
                                            placeholder="Meja..."
                                            value={tableNumber}
                                            onChange={(e) => setTableNumber(e.target.value)}
                                            className="px-2.5 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Actions buttons */}
                            <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-surface-container-high/60 font-bold text-xs">
                                {editingOrderId !== null ? (
                                    <>
                                        <button 
                                            type="submit"
                                            disabled={isProcessing || (paymentMethod === 'cash' && (parseFloat(amountPaid) || 0) < total)}
                                            className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">soup_kitchen</span>
                                            <span>{isProcessing ? 'Memproses...' : 'Bayar & Kirim ke Dapur'}</span>
                                        </button>

                                        <button 
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={() => {
                                                const init: Record<number, number> = {};
                                                cart.forEach(item => {
                                                    init[item.product.id] = 0;
                                                });
                                                setSplitQuantities(init);
                                                setSplitPaymentMethod('cash');
                                                setSplitAmountPaid('');
                                                setSplitDiscountPercent('0');
                                                setSplitCustomerId(null);
                                                setSplitPointsRedeemed('');
                                                setIsMobileCartOpen(false);
                                                setIsSplitModalOpen(true);
                                            }}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">call_split</span>
                                            <span>Pisah Tagihan (Split Bill)</span>
                                        </button>

                                        <button 
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={handleSaveOrderPending}
                                            className="w-full bg-orange-500 text-white py-1.5 rounded-lg hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-xs">save</span>
                                            <span>Simpan Perubahan</span>
                                        </button>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button 
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={() => {
                                                    setIsMobileCartOpen(false);
                                                    handleVoidPendingOrder();
                                                }}
                                                className="bg-red-600 text-white font-semibold text-[10px] py-1.5 rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-xs">delete</span>
                                                <span>Hapus Pesanan</span>
                                            </button>
                                            <button 
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={() => {
                                                    setCart([]);
                                                    setDiscountPercent('0');
                                                    setCustomerName('');
                                                    setTableNumber('');
                                                    setAmountPaid('');
                                                    setEditingOrderId(null);
                                                    setIsMobileCartOpen(false);
                                                }}
                                                className="border border-surface-container-highest text-secondary font-medium text-[10px] py-1.5 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-xs">close</span>
                                                <span>Batal Edit</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            type="submit"
                                            disabled={isProcessing || (paymentMethod === 'cash' && (parseFloat(amountPaid) || 0) < total)}
                                            className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">soup_kitchen</span>
                                            <span>{isProcessing ? 'Memproses...' : 'Bayar & Kirim ke Dapur'}</span>
                                        </button>

                                        <button 
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={handleSaveOrderPending}
                                            className="w-full bg-orange-500 text-white py-1.5 rounded-lg hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-xs">bookmark</span>
                                            <span>Simpan Pesanan</span>
                                        </button>

                                        <button 
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={() => {
                                                setCart([]);
                                                setDiscountPercent('0');
                                                setCustomerName('');
                                                setTableNumber('');
                                                setAmountPaid('');
                                                setIsMobileCartOpen(false);
                                            }}
                                            className="w-full border border-surface-container-highest text-secondary py-1.5 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                            <span>Kosongkan</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Receipt Modal */}
            <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <div className="p-6" id="receipt-print-content">
                        <div className="flex flex-col items-center text-center pb-4 border-b border-dashed border-surface-container-high">
                            <span className="material-symbols-outlined text-4xl text-green-500 mb-2 no-print">check_circle</span>
                            <h3 className="font-bold text-lg text-on-surface uppercase tracking-tight mb-0.5">{currentUser?.outlet_name || 'CAFE RESTO'}</h3>
                            <h4 className="text-[10px] text-secondary/50 font-bold uppercase tracking-wider mb-2 no-print">Transaksi Berhasil!</h4>
                            <h4 className="text-xs text-on-surface font-bold uppercase tracking-widest mb-2 hidden print:block">STRUK BELANJA</h4>
                            <p className="text-xs text-secondary/60 font-mono">Invoice: {receiptOrder?.invoice_number}</p>
                            <p className="text-[10px] text-secondary/60 font-mono mt-0.5">{receiptOrder?.created_at && new Date(receiptOrder.created_at).toLocaleString('id-ID')} WIB</p>
                        </div>

                        {/* Invoice content mock */}
                        <div className="py-4 border-b border-dashed border-surface-container-high text-xs font-mono flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                            {receiptOrder?.items?.map((item: any) => (
                                <div key={item.id} className="flex justify-between gap-4">
                                    <div className="flex-1 truncate">
                                        <span className="text-on-surface font-semibold">{item.product_name}</span>
                                        <span className="block text-[10px] text-secondary/60">
                                            {item.quantity} x {formatPrice(item.price)}
                                        </span>
                                    </div>
                                    <span className="whitespace-nowrap text-on-surface">{formatPrice(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="py-4 text-xs font-mono flex flex-col gap-1.5">
                            <div className="flex justify-between text-secondary">
                                <span>Subtotal</span>
                                <span>{formatPrice(receiptOrder?.total_amount)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-on-surface text-sm pt-2 border-t border-surface-container-high">
                                <span>TOTAL</span>
                                <span className="text-primary font-mono">{formatPrice(receiptOrder?.total_amount)}</span>
                            </div>
                            <div className="flex justify-between text-secondary pt-2 border-t border-surface-container-high/60 text-[11px]">
                                <span className="uppercase font-semibold">Metode: {receiptOrder?.payment_method}</span>
                                <span>Bayar: {formatPrice(receiptOrder?.amount_paid)}</span>
                            </div>
                            <div className="flex justify-between text-secondary text-[11px]">
                                <span>Kembali</span>
                                <span>{formatPrice(receiptOrder?.change_amount)}</span>
                            </div>
                        </div>

                        <div className="pt-2 text-center text-[10px] text-secondary/60">
                            <p>Terima kasih telah berbelanja!</p>
                        </div>
                    </div>

                    <div className="bg-surface-container-low/50 p-4 border-t border-surface-container-high flex justify-between gap-3 no-print">
                        <Button 
                            variant="outline" 
                            className="flex-1 gap-2 text-xs border-surface-container-high hover:bg-surface-container-low hover:text-on-surface text-secondary" 
                            onClick={() => window.print()}
                        >
                            <span className="material-symbols-outlined text-sm">print</span> Cetak
                        </Button>
                        <Button 
                            className="flex-1 text-xs bg-primary text-white hover:bg-primary/95 font-bold" 
                            onClick={() => setShowReceipt(false)}
                        >
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Open Shift Modal */}
            <Dialog open={!active_shift && currentUser?.role !== 'owner'} onOpenChange={() => {}}>
                <DialogContent 
                    className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl"
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Mulai Sesi Shift Kerja</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Masukkan jumlah uang modal awal (cash float) di laci kasir untuk mengaktifkan fitur Point of Sale.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleOpenShiftSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-secondary uppercase">Uang Modal Awal (Rp)</label>
                            <Input
                                type="number"
                                required
                                min="0"
                                placeholder="Masukkan nominal modal awal..."
                                value={initialCash}
                                onChange={(e) => setInitialCash(e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high text-on-surface text-base text-right font-mono focus:ring-primary focus:border-primary rounded-lg"
                                autoFocus
                            />
                        </div>

                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-between gap-2">
                            <Link href="/dashboard" className="text-xs text-secondary hover:bg-surface-container-low px-4 py-2 rounded-lg flex items-center transition-colors">
                                Kembali ke Dashboard
                            </Link>
                            <Button type="submit" disabled={isOpenShiftProcessing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold animate-pulse-slow">
                                {isOpenShiftProcessing ? 'Membuka...' : 'Buka Shift Kerja'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Register Member Modal */}
            <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Daftar Member Baru</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Daftarkan pelanggan baru ke program loyalitas untuk akumulasi dan penukaran poin belanja.
                        </DialogDescription>
                    </DialogHeader>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!newMemberName || !newMemberPhone) {
                                toast.error("Semua field harus diisi.");
                                return;
                            }
                            setIsRegistering(true);
                            router.post('/customers', {
                                name: newMemberName,
                                phone: newMemberPhone
                            }, {
                                onSuccess: (page) => {
                                    setIsRegistering(false);
                                    setIsRegisterModalOpen(false);
                                    setNewMemberName('');
                                    setNewMemberPhone('');
                                    toast.success("Member baru berhasil didaftarkan.");
                                    
                                    // Auto-select the newly created customer by searching phone
                                    const updatedCustomers = page.props.customers || [];
                                    const newCust = updatedCustomers.find((c: any) => c.phone === newMemberPhone);
                                    if (newCust) {
                                        setSelectedCustomerId(newCust.id);
                                        setCustomerName(newCust.name);
                                    }
                                },
                                onError: (err) => {
                                    setIsRegistering(false);
                                    const msg = err.phone || err.name || "Gagal mendaftarkan member.";
                                    toast.error(msg);
                                }
                            });
                        }} 
                        className="flex flex-col gap-4 py-2 text-xs"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-secondary uppercase">Nama Lengkap</label>
                            <input
                                type="text"
                                required
                                placeholder="Masukkan nama pelanggan..."
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-secondary uppercase">Nomor WhatsApp / Telepon</label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: 081234567890..."
                                value={newMemberPhone}
                                onChange={(e) => setNewMemberPhone(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface"
                            />
                        </div>

                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsRegisterModalOpen(false)}
                                className="text-xs border-surface-container-high hover:bg-surface-container-low"
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isRegistering} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                {isRegistering ? 'Menyimpan...' : 'Daftarkan Member'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Split Bill Modal */}
            <Dialog open={isSplitModalOpen} onOpenChange={setIsSplitModalOpen}>
                <DialogContent className="sm:max-w-[800px] w-[95%] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                    <DialogHeader className="p-4 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined">call_split</span>
                            <span>Pisah Tagihan (Split Bill)</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Pilih item yang ingin dipisahkan untuk dibayar sekarang. Item sisa akan tetap disimpan di meja/pending order.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-grow overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] bg-surface-container-low/20">
                        {/* Left: Split Items Selector */}
                        <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-surface-container-high">
                            <h3 className="text-xs font-bold text-on-surface border-b border-surface-container-high pb-2">Pilih Item & Jumlah</h3>
                            <div className="flex flex-col gap-3 overflow-y-auto max-h-[40vh] pr-1">
                                {cart.map(item => {
                                    const splitQty = splitQuantities[item.product.id] || 0;
                                    return (
                                        <div key={item.product.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/50 border border-surface-container-high/40 text-xs">
                                            <div className="flex-grow min-w-0 pr-2">
                                                <h4 className="font-semibold text-on-surface truncate">{item.product.name}</h4>
                                                <span className="text-[10px] text-secondary font-mono">
                                                    {formatPrice(item.product.price)} x {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center border border-surface-container-high rounded bg-white font-mono">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSplitQuantities({
                                                                ...splitQuantities,
                                                                [item.product.id]: Math.max(0, splitQty - 1)
                                                            });
                                                        }}
                                                        disabled={splitQty === 0}
                                                        className="p-1 hover:bg-surface-container-low disabled:opacity-30 cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">remove</span>
                                                    </button>
                                                    <span className="px-2 text-xs font-bold w-8 text-center text-on-surface">
                                                        {splitQty} / {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSplitQuantities({
                                                                ...splitQuantities,
                                                                [item.product.id]: Math.min(item.quantity, splitQty + 1)
                                                            });
                                                        }}
                                                        disabled={splitQty === item.quantity}
                                                        className="p-1 hover:bg-surface-container-low disabled:opacity-30 cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Split Payment Form */}
                        <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-surface-container-high justify-between">
                            <div className="flex flex-col gap-3 overflow-y-auto max-h-[45vh] pr-1">
                                <h3 className="text-xs font-bold text-on-surface border-b border-surface-container-high pb-2">Pembayaran Bagian Terpisah</h3>

                                {/* Split Subtotal */}
                                <div className="flex flex-col gap-1 text-[11px]">
                                    <div className="flex justify-between text-secondary">
                                        <span>Subtotal Terpisah:</span>
                                        <span className="font-mono">{formatPrice(splitSubtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-secondary">
                                        <span>Subtotal Tersisa:</span>
                                        <span className="font-mono font-bold text-orange-600">{formatPrice(remainingSubtotal)}</span>
                                    </div>
                                </div>

                                {splitSubtotal > 0 && (
                                    <>
                                        {/* Split Discount Input */}
                                        <div className="flex flex-col gap-1 mt-1">
                                            <label className="text-[10px] font-semibold text-secondary uppercase">Diskon Bagian Terpisah (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                value={splitDiscountPercent}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 100)) {
                                                        setSplitDiscountPercent(val);
                                                    }
                                                }}
                                                className="w-full px-2.5 py-1.5 bg-white border border-surface-container-high rounded-lg text-xs outline-none focus:border-primary/50 text-on-surface font-mono"
                                            />
                                        </div>

                                        {/* Split Loyalty Member Selector */}
                                        <div className="flex flex-col gap-1.5 relative border border-dashed border-surface-container-high p-2.5 rounded-lg">
                                            {(() => {
                                                const splitCust = customers.find((c: any) => c.id === splitCustomerId);
                                                const filteredSplitCusts = customers.filter((c: any) => {
                                                    const query = splitMemberSearchQuery.toLowerCase();
                                                    return c.name.toLowerCase().includes(query) || c.phone.includes(query);
                                                });

                                                if (splitCust) {
                                                    return (
                                                        <div className="flex flex-col gap-1.5 relative">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSplitCustomerId(null);
                                                                    setSplitPointsRedeemed('');
                                                                }}
                                                                className="absolute top-0 right-0 text-emerald-800/60 hover:text-emerald-800 transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-xs">close</span>
                                                            </button>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="material-symbols-outlined text-emerald-600 text-xs">verified_user</span>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-bold text-emerald-800">{splitCust.name}</span>
                                                                    <span className="text-[8px] text-emerald-600 font-mono">{splitCust.phone}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center text-[9px] font-medium text-emerald-800 pt-1 border-t border-emerald-200/50">
                                                                <span>Poin Tersedia:</span>
                                                                <span className="font-bold font-mono">{splitCust.points} Poin</span>
                                                            </div>

                                                            {splitCust.points > 0 && (
                                                                <div className="flex flex-col gap-1 mt-1">
                                                                    <label className="text-[8px] font-semibold text-emerald-800 uppercase">Tukar Poin</label>
                                                                    <div className="flex gap-1.5 items-center">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max={splitCust.points}
                                                                            placeholder="0"
                                                                            value={splitPointsRedeemed}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                const pts = parseInt(val) || 0;
                                                                                if (val === '' || (pts >= 0 && pts <= splitCust.points)) {
                                                                                    setSplitPointsRedeemed(val);
                                                                                }
                                                                            }}
                                                                            className="w-full px-2 py-0.5 bg-white border border-emerald-300 text-emerald-800 rounded text-[10px] font-mono outline-none focus:border-emerald-500"
                                                                        />
                                                                        {splitPointsRedeemed && (
                                                                            <span className="text-[8px] font-bold text-red-600 whitespace-nowrap">
                                                                                - {formatPrice((parseInt(splitPointsRedeemed) || 0) * 1000)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="flex flex-col gap-1 relative">
                                                        <label className="text-[9px] font-bold text-secondary uppercase">Member untuk Split</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Cari member..."
                                                            value={splitMemberSearchQuery}
                                                            onChange={(e) => {
                                                                setSplitMemberSearchQuery(e.target.value);
                                                                setShowSplitMemberDropdown(true);
                                                            }}
                                                            onFocus={() => setShowSplitMemberDropdown(true)}
                                                            className="w-full px-2.5 py-1 bg-white border border-surface-container-high rounded text-[10px] outline-none focus:border-primary/50 text-on-surface"
                                                        />
                                                        {showSplitMemberDropdown && splitMemberSearchQuery && (
                                                            <div className="absolute left-0 right-0 mt-8 bg-white border border-surface-container-high rounded-lg shadow-lg z-50 max-h-[120px] overflow-y-auto no-scrollbar">
                                                                {filteredSplitCusts.length === 0 ? (
                                                                    <div className="p-2 text-[9px] text-secondary text-center">
                                                                        Member tidak ditemukan
                                                                    </div>
                                                                ) : (
                                                                    filteredSplitCusts.map((cust: any) => (
                                                                        <button
                                                                            key={cust.id}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSplitCustomerId(cust.id);
                                                                                setSplitMemberSearchQuery('');
                                                                                setShowSplitMemberDropdown(false);
                                                                            }}
                                                                            className="w-full text-left px-2 py-1.5 hover:bg-surface-container-low transition-colors border-b border-surface-container-high/30 last:border-none cursor-pointer"
                                                                        >
                                                                            <div className="text-[10px] font-bold text-on-surface">{cust.name}</div>
                                                                            <div className="text-[8px] text-secondary font-mono flex justify-between">
                                                                                <span>{cust.phone}</span>
                                                                                <span className="text-primary font-bold">{cust.points} Poin</span>
                                                                            </div>
                                                                        </button>
                                                                    ))
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* Backdrop for split member dropdown */}
                                                        {showSplitMemberDropdown && (
                                                            <div 
                                                                className="fixed inset-0 z-40 bg-transparent"
                                                                onClick={() => setShowSplitMemberDropdown(false)}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Split Totals breakdown */}
                                        <div className="flex flex-col gap-0.5 text-[10px] border-t border-b border-surface-container-high/60 py-1.5 font-mono">
                                            <div className="flex justify-between text-secondary">
                                                <span>Subtotal Terpisah</span>
                                                <span>{formatPrice(splitSubtotal)}</span>
                                            </div>
                                            {parseFloat(splitDiscountPercent) > 0 && (
                                                <div className="flex justify-between text-red-600">
                                                    <span>Diskon ({splitDiscountPercent}%)</span>
                                                    <span>- {formatPrice(splitDiscountAmount)}</span>
                                                </div>
                                            )}
                                            {splitPointsDiscount > 0 && (
                                                <div className="flex justify-between text-red-600">
                                                    <span>Potongan Poin</span>
                                                    <span>- {formatPrice(splitPointsDiscount)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-bold text-on-surface text-xs pt-1 border-t border-surface-container-high/40">
                                                <span>Total Bayar</span>
                                                <span className="text-primary">{formatPrice(splitTotal)}</span>
                                            </div>
                                        </div>

                                        {/* Split Payment Method */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[9px] font-semibold text-secondary uppercase">Metode Pembayaran</label>
                                            <div className="grid grid-cols-3 gap-1">
                                                {['cash', 'card', 'qris'].map((method) => (
                                                    <button
                                                        key={method}
                                                        type="button"
                                                        onClick={() => {
                                                            setSplitPaymentMethod(method as any);
                                                            setSplitAmountPaid(method === 'cash' ? '' : splitTotal.toString());
                                                        }}
                                                        className={`py-1.5 rounded-lg border text-[9px] font-bold text-center cursor-pointer transition-all ${
                                                            splitPaymentMethod === method
                                                                ? 'bg-primary text-white border-primary shadow-sm'
                                                                : 'bg-white border-surface-container-high text-secondary hover:bg-surface-container-low'
                                                        }`}
                                                    >
                                                        {method === 'cash' ? 'Tunai' : method === 'card' ? 'Kartu' : 'QRIS'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Split Cash input & suggestions */}
                                        {splitPaymentMethod === 'cash' && (
                                            <div className="flex flex-col gap-1.5 bg-surface-container-low/40 p-2 rounded-lg border border-surface-container-high/50">
                                                <label className="text-[9px] font-bold text-secondary uppercase">Uang Diterima (Tunai)</label>
                                                <div className="relative flex items-center">
                                                    <span className="absolute left-2 text-[10px] font-bold text-secondary/60">Rp</span>
                                                    <input
                                                        type="number"
                                                        required
                                                        placeholder="0"
                                                        value={splitAmountPaid}
                                                        onChange={(e) => setSplitAmountPaid(e.target.value)}
                                                        className="w-full pl-6 pr-2 py-1 bg-white border border-surface-container-high rounded text-xs font-mono text-right outline-none focus:border-primary/50 text-on-surface font-bold"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center text-[9px] font-mono mt-0.5">
                                                    {parseFloat(splitAmountPaid) >= splitTotal ? (
                                                        <div className="text-emerald-700">Kembalian: {formatPrice(splitChangeAmount)}</div>
                                                    ) : parseFloat(splitAmountPaid) > 0 ? (
                                                        <div className="text-error font-bold">Uang Kurang: {formatPrice(splitUnderpaidAmount)}</div>
                                                    ) : (
                                                        <div className="text-secondary">Masukkan nominal bayar</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Split submit buttons */}
                            <div className="flex gap-2 pt-3 border-t border-surface-container-high mt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsSplitModalOpen(false)}
                                    className="flex-1 text-xs border-surface-container-high"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="button"
                                    disabled={
                                        splitSubtotal === 0 ||
                                        isSplitProcessing ||
                                        (splitPaymentMethod === 'cash' && (parseFloat(splitAmountPaid) || 0) < splitTotal)
                                    }
                                    onClick={() => {
                                        setIsSplitProcessing(true);
                                        const splitItems = cart
                                            .filter(item => (splitQuantities[item.product.id] || 0) > 0)
                                            .map(item => ({
                                                product_id: item.product.id,
                                                quantity: splitQuantities[item.product.id]
                                            }));

                                        const remainingItems = cart
                                            .filter(item => item.quantity - (splitQuantities[item.product.id] || 0) > 0)
                                            .map(item => ({
                                                product_id: item.product.id,
                                                quantity: item.quantity - (splitQuantities[item.product.id] || 0)
                                            }));

                                        const payload = {
                                            split_items: splitItems,
                                            remaining_items: remainingItems,
                                            payment_method: splitPaymentMethod,
                                            amount_paid: splitPaymentMethod === 'cash' ? Math.max(parseFloat(splitAmountPaid) || 0, splitTotal) : splitTotal,
                                            discount_percent: parseFloat(splitDiscountPercent) || 0,
                                            customer_id: splitCustomerId,
                                            points_redeemed: parseInt(splitPointsRedeemed) || 0
                                        };

                                        router.post(`/checkout/split/${editingOrderId}`, payload, {
                                            onSuccess: (page) => {
                                                setIsSplitProcessing(false);
                                                setIsSplitModalOpen(false);
                                                setIsMobileCartOpen(false);
                                                
                                                const resInvoice = page.props.flash?.invoice;
                                                if (resInvoice) {
                                                    setReceiptOrder(resInvoice);
                                                    setShowReceipt(true);
                                                    setCart([]);
                                                    setDiscountPercent('0');
                                                    setCustomerName('');
                                                    setTableNumber('');
                                                    setAmountPaid('');
                                                    setEditingOrderId(null);
                                                    setSelectedCustomerId(null);
                                                    setPointsRedeemed('');
                                                }
                                                toast.success("Transaksi pisah tagihan berhasil dibayarkan.");
                                            },
                                            onError: (err) => {
                                                setIsSplitProcessing(false);
                                                const msg = err.error || Object.values(err)[0] || "Gagal memproses pisah tagihan.";
                                                toast.error(msg);
                                            }
                                        });
                                    }}
                                    className="flex-grow text-xs bg-primary text-white hover:bg-primary/90 font-bold"
                                >
                                    {isSplitProcessing ? 'Memproses...' : 'Selesaikan Split'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

