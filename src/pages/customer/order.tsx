import { useState, useMemo, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

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

interface Props {
    products: Product[];
    categories: string[];
    table_number: string;
    qris_path?: string | null;
    outlet_name?: string;
}

const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name === 'all' || name === 'semua') return 'apps';
    if (name.includes('makan') || name.includes('food') || name.includes('utama') || name.includes('rice') || name.includes('mie') || name.includes('bakso') || name.includes('ramen')) return 'restaurant';
    if (name.includes('minum') || name.includes('drink') || name.includes('kopi') || name.includes('teh') || name.includes('coffee') || name.includes('tea') || name.includes('susu') || name.includes('es') || name.includes('juice')) return 'local_cafe';
    if (name.includes('snack') || name.includes('cemil') || name.includes('dessert') || name.includes('roti') || name.includes('pastry') || name.includes('cake') || name.includes('kue')) return 'cookie';
    return 'restaurant_menu';
};

export default function OrderPage({ products = [], categories = [], table_number, qris_path, outlet_name = 'CAFE RESTO' }: Props) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [placedInvoice, setPlacedInvoice] = useState('');
    const [submittedPaymentMethod, setSubmittedPaymentMethod] = useState<'qris' | 'cash'>('qris');
    const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
    const [qrisTimer, setQrisTimer] = useState(300);

    const form = useForm({
        customer_name: '',
        payment_method: 'qris',
        items: [] as { product_id: number; quantity: number }[],
    });

    // Synchronize form items with cart
    useEffect(() => {
        form.setData('items', cart.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
        })));
    }, [cart]);

    // QRIS Countdown Timer
    useEffect(() => {
        if (!isQrisModalOpen) {
            setQrisTimer(300);
            return;
        }
        const timer = setInterval(() => {
            setQrisTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsQrisModalOpen(false);
                    toast.error("Waktu pembayaran QRIS telah habis.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isQrisModalOpen]);

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Format currency to IDR
    const formatPrice = (value: number | string) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num);
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((p: Product) => {
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesCategory && p.stock > 0;
        });
    }, [products, selectedCategory]);

    // Cart operations
    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.product.id === product.id);
        const currentQty = existing ? existing.quantity : 0;

        if (currentQty >= product.stock) {
            toast.error(`Stok ${product.name} tidak mencukupi.`);
            return;
        }

        if (existing) {
            setCart(cart.map(item => 
                item.product.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
        toast.success(`${product.name} ditambahkan ke pesanan.`);
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
            setCart(cart.map(item => 
                item.product.id === productId 
                    ? { ...item, quantity: newQty }
                    : item
            ));
        }
    };

    // Calculate totals
    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    const totalAmount = useMemo(() => {
        return cart.reduce((sum, item) => {
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
            return sum + (price * item.quantity);
        }, 0);
    }, [cart]);

    // Handle Order Submission
    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            toast.error("Keranjang belanja kosong.");
            return;
        }

        if (!form.data.customer_name.trim()) {
            toast.error("Silakan masukkan nama Anda untuk memesan.");
            return;
        }

        if (form.data.payment_method === 'qris') {
            setIsQrisModalOpen(true);
            return;
        }

        submitOrder();
    };

    const submitOrder = () => {
        const method = form.data.payment_method;
        form.post(`/order/${table_number}`, {
            onSuccess: () => {
                setSubmittedPaymentMethod(method as 'qris' | 'cash');
                setOrderSuccess(true);
                setCart([]);
                setIsCartOpen(false);
                setIsQrisModalOpen(false);
                toast.success(method === 'qris' ? "Pembayaran QRIS Berhasil & Pesanan dikirim!" : "Pesanan Anda berhasil dikirim!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal mengirimkan pesanan.";
                toast.error(firstErr);
            }
        });
    };

    return (
        <div className={`bg-background text-on-background min-h-screen flex flex-col font-sans max-w-md mx-auto relative shadow-2xl bg-white transition-all duration-300 ${
            cart.length > 0 ? 'pb-36' : 'pb-16'
        }`}>
            <Head title={`${outlet_name} - Menu Meja ${table_number}`}>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
            </Head>

            {/* Custom Styles */}
            <style dangerouslySetInnerHTML={{__html: `
                body {
                    background-color: #eceef0 !important;
                }
                :root {
                    --background: #f7f9fb !important;
                    --foreground: #191c1e !important;
                    --primary: #0d9488 !important;
                    --on-primary: #ffffff !important;
                    --surface-container-low: #f2f4f6 !important;
                    --surface-container-high: #e6e8ea !important;
                    --outline-variant: #e2e8f0 !important;
                }
                .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined';
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                /* Hide scrollbars */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-scale-up {
                    animation: scaleUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}} />

            {/* Premium Header */}
            <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-surface-container-low p-4 z-20 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-2xl">restaurant_menu</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm leading-tight text-on-surface uppercase">{outlet_name}</h1>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Meja {table_number}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Self-Ordering</span>
                </div>
            </header>

            {/* Success State */}
            {orderSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
                    {submittedPaymentMethod === 'qris' ? (
                        <>
                            <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <span className="material-symbols-outlined text-5xl">check_circle</span>
                            </div>
                            <h2 className="text-xl font-bold text-on-surface">Pembayaran Berhasil!</h2>
                            <p className="text-sm text-secondary/70 mt-2 max-w-xs">
                                Pembayaran QRIS lunas. Pesanan Anda sudah dikirim langsung ke dapur. Silakan tunggu hidangan disajikan di meja Anda.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-amber-50 border border-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <span className="material-symbols-outlined text-5xl">pending_actions</span>
                            </div>
                            <h2 className="text-xl font-bold text-on-surface">Pesanan Dicatat!</h2>
                            <p className="text-sm text-secondary/70 mt-2 max-w-xs">
                                Silakan lakukan pembayaran di kasir terlebih dahulu agar pesanan Anda diteruskan dan mulai dimasak di dapur.
                            </p>
                        </>
                    )}
                    
                    <div className="mt-8 p-4 bg-surface-container-low rounded-xl border border-surface-container-high w-full font-mono text-xs text-left">
                        <div className="flex justify-between py-1 border-b border-surface-container-high/60">
                            <span className="text-secondary">Nomor Meja:</span>
                            <span className="font-bold text-on-surface">Meja {table_number}</span>
                        </div>
                        <div className="flex justify-between py-1 pt-2">
                            <span className="text-secondary">Status Pemesanan:</span>
                            {submittedPaymentMethod === 'qris' ? (
                                <span className="font-bold text-emerald-600 flex items-center gap-1">Lunas & Dapur 🍳</span>
                            ) : (
                                <span className="font-bold text-amber-600 flex items-center gap-1">Menunggu Kasir 💳</span>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => setOrderSuccess(false)}
                        className="mt-8 px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:brightness-95 active:scale-98 transition-all w-full cursor-pointer shadow-md"
                    >
                        Pesan Menu Lainnya
                    </button>
                </div>
            ) : (
                <>
                    {/* Catalog Grid */}
                    <div className="p-4 flex-1 overflow-y-auto space-y-4">
                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-secondary/60 text-xs font-label-mono">
                                <span className="material-symbols-outlined text-5xl mb-2 opacity-35 text-primary">inventory_2</span>
                                <p>Tidak ada menu tersedia.</p>
                            </div>
                        ) : (
                            filteredProducts.map((p) => {
                                const cartItem = cart.find(item => item.product.id === p.id);
                                const availableStock = p.stock - (cartItem?.quantity || 0);

                                return (
                                    <div key={p.id} className="bg-white rounded-xl border border-surface-container-low p-3.5 flex gap-4 shadow-sm relative overflow-hidden group">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-sm text-on-surface leading-tight truncate">{p.name}</h3>
                                            </div>
                                            <p className="text-[11px] text-secondary/60 line-clamp-2 mt-1 min-h-[32px]">
                                                {p.description || '-'}
                                            </p>
                                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-surface-container-low">
                                                <span className="font-bold font-mono text-primary text-sm">
                                                    {formatPrice(p.price)}
                                                </span>
                                                <button
                                                    onClick={() => availableStock > 0 && addToCart(p)}
                                                    disabled={availableStock <= 0}
                                                    className={`h-7 px-3.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                                        availableStock <= 0
                                                            ? 'bg-surface-container-high text-secondary/55'
                                                            : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                    }`}
                                                >
                                                    {availableStock <= 0 ? 'Habis' : '+ Tambah'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Floating Bottom Cart Bar */}
                    {cart.length > 0 && (
                        <div className="fixed bottom-14 inset-x-0 max-w-md mx-auto bg-white border-t border-surface-container-high p-4 flex justify-between items-center shadow-lg z-30 transition-all duration-300">
                            <div>
                                <p className="text-[10px] text-secondary/60 font-semibold uppercase font-label-mono">Pilihan Anda ({cartCount} Item)</p>
                                <p className="text-lg font-bold text-primary font-mono leading-none mt-0.5">{formatPrice(totalAmount)}</p>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:brightness-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                                <span className="material-symbols-outlined text-xs">shopping_basket</span>
                                Review Order
                            </button>
                        </div>
                    )}

                    {/* Bottom Category Selector (WhatsApp Style) */}
                    <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white border-t border-surface-container-low flex items-center z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] h-14 overflow-x-auto no-scrollbar px-2 gap-1 justify-around">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className="flex flex-col items-center justify-center flex-1 min-w-[72px] cursor-pointer py-1 text-center"
                        >
                            <div className={`flex items-center justify-center px-4 py-1 rounded-full transition-all ${
                                selectedCategory === 'All'
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-secondary/70 hover:text-on-surface'
                            }`}>
                                <span className="material-symbols-outlined text-xl">{getCategoryIcon('All')}</span>
                            </div>
                            <span className={`text-[10px] mt-1 font-semibold transition-colors truncate w-full px-1 ${
                                selectedCategory === 'All' ? 'text-primary font-bold' : 'text-secondary/70'
                            }`}>
                                Semua
                            </span>
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className="flex flex-col items-center justify-center flex-1 min-w-[72px] cursor-pointer py-1 text-center"
                            >
                                <div className={`flex items-center justify-center px-4 py-1 rounded-full transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-secondary/70 hover:text-on-surface'
                                }`}>
                                    <span className="material-symbols-outlined text-xl">{getCategoryIcon(cat)}</span>
                                </div>
                                <span className={`text-[10px] mt-1 font-semibold transition-colors truncate w-full px-1 ${
                                    selectedCategory === cat ? 'text-primary font-bold' : 'text-secondary/70'
                                }`}>
                                    {cat}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Cart Review Sheet Dialog */}
                    {isCartOpen && (
                        <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center">
                            <div className="bg-white rounded-t-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto flex flex-col gap-4 animate-slide-up relative z-50">
                                <div className="flex justify-between items-center border-b border-surface-container-low pb-3">
                                    <h3 className="font-bold text-base text-on-surface">Detail Pesanan Anda</h3>
                                    <button 
                                        onClick={() => setIsCartOpen(false)}
                                        className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>

                                <div className="flex-grow overflow-y-auto max-h-[300px] flex flex-col gap-3 py-2">
                                    {cart.map((item) => (
                                        <div key={item.product.id} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low/40 border border-surface-container-low">
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-bold text-xs text-on-surface truncate">{item.product.name}</h4>
                                                <span className="text-[10px] text-secondary/60 font-mono">{formatPrice(item.product.price)}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 shrink-0">
                                                <div className="flex items-center border border-surface-container-high rounded-lg bg-white overflow-hidden">
                                                    <button 
                                                        onClick={() => updateQuantity(item.product.id, -1)}
                                                        className="p-1 hover:bg-surface-container-low cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">remove</span>
                                                    </button>
                                                    <span className="px-1 text-xs font-bold font-mono w-6 text-center text-on-surface">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.product.id, 1)}
                                                        className="p-1 hover:bg-surface-container-low cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handlePlaceOrder} className="flex flex-col gap-3.5 pt-2 border-t border-surface-container-low">
                                    <div className="flex justify-between font-bold text-sm text-on-surface font-mono py-1.5">
                                        <span>Total Belanja:</span>
                                        <span className="text-primary text-base">{formatPrice(totalAmount)}</span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-secondary uppercase">Nama Pemesan (Untuk Meja)</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Masukkan nama Anda..."
                                            value={form.data.customer_name}
                                            onChange={(e) => form.setData('customer_name', e.target.value)}
                                            className="px-4 py-2.5 bg-surface-container-low border border-surface-container-high focus:bg-white text-xs rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-on-surface font-medium"
                                        />
                                    </div>

                                    {/* Payment Selector */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-secondary uppercase">Pilih Metode Pembayaran</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* QRIS Option */}
                                            <button
                                                type="button"
                                                onClick={() => form.setData('payment_method', 'qris')}
                                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[80px] ${
                                                    form.data.payment_method === 'qris'
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-surface-container-high bg-surface-container-low/40 text-secondary hover:text-on-surface'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    <span className="material-symbols-outlined text-lg">qr_code_2</span>
                                                    {form.data.payment_method === 'qris' && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                    )}
                                                </div>
                                                <div className="mt-1">
                                                    <p className="font-bold text-[10px] leading-tight">QRIS (Bayar Instan)</p>
                                                    <p className="text-[8px] opacity-75 mt-0.5">Langsung ke dapur</p>
                                                </div>
                                            </button>

                                            {/* Cash Option */}
                                            <button
                                                type="button"
                                                onClick={() => form.setData('payment_method', 'cash')}
                                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[80px] ${
                                                    form.data.payment_method === 'cash'
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-surface-container-high bg-surface-container-low/40 text-secondary hover:text-on-surface'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    <span className="material-symbols-outlined text-lg">payments</span>
                                                    {form.data.payment_method === 'cash' && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                    )}
                                                </div>
                                                <div className="mt-1">
                                                    <p className="font-bold text-[10px] leading-tight">Bayar di Kasir</p>
                                                    <p className="text-[8px] opacity-75 mt-0.5">Harus bayar dulu</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="mt-2 w-full bg-primary text-white font-bold text-xs py-3.5 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                                    >
                                        <span className="material-symbols-outlined text-xs">
                                            {form.data.payment_method === 'qris' ? 'credit_card' : 'payments'}
                                        </span>
                                        {form.processing 
                                            ? 'Mengirim Pesanan...' 
                                            : form.data.payment_method === 'qris' 
                                                ? 'Lanjut Pembayaran QRIS' 
                                                : 'Kirim & Bayar di Kasir'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* QRIS Payment Modal */}
            {isQrisModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-xs flex flex-col items-center gap-4 animate-scale-up shadow-2xl">
                        <div className="text-center w-full">
                            <h3 className="font-bold text-sm text-on-surface">Scan QRIS Untuk Bayar</h3>
                            <p className="text-[9px] text-secondary/60 uppercase font-bold tracking-wider mt-0.5">{outlet_name} (Meja {table_number})</p>
                        </div>

                        <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-3 w-full flex flex-col items-center gap-0.5">
                            <span className="text-[9px] font-bold text-secondary uppercase">Total Pembayaran</span>
                            <span className="text-xl font-black text-primary font-mono">{formatPrice(totalAmount)}</span>
                        </div>

                        <div className="w-44 h-44 bg-white border border-surface-container-high rounded-xl p-2.5 flex items-center justify-center shadow-sm relative overflow-hidden">
                            {qris_path ? (
                                <img 
                                    src={qris_path}
                                    alt="Merchant QRIS" 
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${outlet_name.replace(/\s+/g, '')}_Table_${table_number}_Amount_${totalAmount}`)}`}
                                    alt="QRIS Code" 
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-0.5 text-center">
                            <span className="text-[9px] text-secondary/60 font-semibold uppercase">Waktu Pembayaran</span>
                            <span className="text-xs font-bold font-mono text-amber-600 bg-amber-50 border border-amber-100 px-3 py-0.5 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px] animate-pulse">schedule</span>
                                {formatTimer(qrisTimer)}
                            </span>
                        </div>

                        <div className="w-full flex flex-col gap-1.5 pt-2 border-t border-surface-container-low">
                            <button
                                type="button"
                                onClick={submitOrder}
                                disabled={form.processing}
                                className="w-full bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/10"
                            >
                                <span className="material-symbols-outlined text-xs animate-bounce">check_circle</span>
                                {form.processing ? 'Memproses...' : 'Simulasi Bayar Berhasil'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setIsQrisModalOpen(false)}
                                className="w-full bg-surface-container-low text-secondary font-bold text-xs py-2.5 rounded-xl hover:bg-surface-container-high hover:text-on-surface active:scale-[0.98] transition-all cursor-pointer"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

