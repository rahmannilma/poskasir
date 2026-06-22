import { useMemo, useState } from 'react';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Product {
    id: number;
    name: string;
    sku: string;
    barcode?: string;
    category: string;
    price: string | number;
    purchase_price: string | number;
    selling_price: string | number;
    stock: number;
    min_stock: number;
    description?: string;
    image?: string;
    is_active: boolean;
    materials?: {
        id: number;
        name: string;
        unit: string;
        pivot: {
            quantity: string | number;
        };
    }[];
}

export default function Index() {
    const { products = [], categories = [], materials = [], filters = {}, auth = { user: null } } = usePage<any>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNewCategoryAdd, setIsNewCategoryAdd] = useState(false);
    const [isNewCategoryEdit, setIsNewCategoryEdit] = useState(false);

    // Dialog state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const currentUser = auth.user;

    // Form handlers
    const addForm = useForm({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        purchase_price: '',
        selling_price: '',
        stock: '0',
        min_stock: '10',
        description: '',
        image: null as File | null,
        is_active: true,
        materials: [] as { material_id: string; quantity: string }[],
    });

    const editForm = useForm({
        _method: 'put',
        name: '',
        sku: '',
        barcode: '',
        category: '',
        purchase_price: '',
        selling_price: '',
        stock: '0',
        min_stock: '10',
        description: '',
        image: null as File | null,
        is_active: true,
        materials: [] as { material_id: string; quantity: string }[],
    });

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

    // Metrics calculations
    const totalProducts = products.length;
    const totalStock = products.reduce((acc: number, p: Product) => acc + p.stock, 0);
    const inventoryValue = products.reduce((acc: number, p: Product) => acc + (parseFloat(p.price.toString()) * p.stock), 0);
    const totalCategories = categories.length;

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'OW';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    // Filter products locally for instantaneous feel, but also support search query sync
    const filteredProducts = useMemo(() => {
        return products.filter((product: Product) => {
            const matchesSearch = 
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.sku.toLowerCase().includes(search.toLowerCase()) ||
                (product.barcode && product.barcode.toLowerCase().includes(search.toLowerCase()));
            
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    // Submit handlers
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prepare materials payload as JSON string if need be, but since forceFormData is true,
        // it can serialize nested arrays. However, it's safer to map to indexed object or JSON string.
        // Let's send materials directly as serialized objects, or we can send it as JSON string or standard request parameters.
        // Let's check how the controller parses it: 
        // `$materialsInput = is_string($request->input('materials')) ? json_decode($request->input('materials'), true) : $request->input('materials', []);`
        // We supported BOTH json string and standard array in the controller! This is extremely robust.
        // So we can send materials as a JSON string to avoid any issues with nested array serialization in FormData.
        
        const payload = {
            ...addForm.data,
            materials: JSON.stringify(addForm.data.materials),
        };
        
        // We must set the data manually before posting or use router
        router.post('/products', payload, {
            forceFormData: true,
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
                toast.success("Produk berhasil ditambahkan!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menambahkan produk.";
                toast.error(firstErr);
            }
        });
    };

    const handleEditOpen = (product: Product) => {
        setSelectedProduct(product);
        const isExisting = categories.includes(product.category);
        setIsNewCategoryEdit(!isExisting);
        
        const initialMaterials = (product.materials || []).map((m: any) => ({
            material_id: String(m.id),
            quantity: String(m.pivot.quantity),
        }));

        editForm.setData({
            _method: 'put',
            name: product.name,
            sku: product.sku,
            barcode: product.barcode || '',
            category: product.category,
            purchase_price: product.purchase_price ? product.purchase_price.toString() : '0',
            selling_price: product.selling_price ? product.selling_price.toString() : product.price.toString(),
            stock: product.stock.toString(),
            min_stock: product.min_stock !== undefined ? product.min_stock.toString() : '10',
            description: product.description || '',
            image: null,
            is_active: product.is_active !== undefined ? product.is_active : true,
            materials: initialMaterials,
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        const payload = {
            ...editForm.data,
            materials: JSON.stringify(editForm.data.materials),
        };

        router.post(`/products/${selectedProduct.id}`, payload, {
            forceFormData: true,
            onSuccess: () => {
                setIsEditOpen(false);
                toast.success("Produk berhasil diperbarui!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal diperbarui.";
                toast.error(firstErr);
            }
        });
    };

    const handleDeleteOpen = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        router.delete(`/products/${selectedProduct.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                toast.success("Produk berhasil dihapus!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menghapus produk.";
                toast.error(firstErr);
            }
        });
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Kelola Produk</title>
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
                    <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/transactions">
                        <span className="material-symbols-outlined group-hover:text-primary">receipt_long</span>
                        <span className="text-[15px] font-sans">Transactions</span>
                    </Link>
                    {/* Active Tab: Produk */}
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/products">
                            <span className="material-symbols-outlined active-icon">inventory_2</span>
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
                            placeholder="Cari produk berdasarkan nama atau SKU..." 
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

            {/* Main Workspace */}
            <main className="ml-0 lg:ml-72 pt-24 px-4 sm:px-[32px] pb-[32px] min-h-screen">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 mt-2">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Kelola Produk</h2>
                        <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Daftar katalog dan inventaris stok barang</p>
                    </div>
                    <div className="w-full md:w-auto">
                        <button 
                            onClick={() => {
                                setIsNewCategoryAdd(categories.length === 0);
                                addForm.reset();
                                setIsAddOpen(true);
                            }}
                            className="w-full md:w-auto justify-center px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            TAMBAH PRODUK
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Total Produk */}
                    <div className="bg-red-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-primary shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">inventory_2</span>
                            </div>
                            <span className="flex items-center text-primary font-bold text-[10px] bg-primary/10 px-2 py-0.5 rounded-full uppercase font-label-mono">Items</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Produk</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{totalProducts}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Item unik terdaftar</p>
                    </div>

                    {/* Total Stok */}
                    <div className="bg-emerald-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-emerald-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">widgets</span>
                            </div>
                            <span className="flex items-center text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Stock</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Stok</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{totalStock.toLocaleString('id-ID')}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Akumulasi seluruh barang</p>
                    </div>

                    {/* Nilai Inventaris */}
                    <div className="bg-amber-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-amber-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="flex items-center text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Valuation</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Nilai Inventaris</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{formatPriceK(inventoryValue)}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Nilai valuasi total harga jual</p>
                    </div>

                    {/* Total Kategori */}
                    <div className="bg-blue-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-blue-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">category</span>
                            </div>
                            <span className="flex items-center text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Categories</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Kategori</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{totalCategories}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Pengelompokan jenis produk</p>
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex gap-2 mb-6 bg-white border border-surface-container-high p-3 rounded-2xl shadow-soft overflow-x-auto no-scrollbar whitespace-nowrap">
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

                {/* Bento Table Section */}
                <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden mb-10 p-6 flex flex-col relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-on-surface">Katalog Inventaris Barang</h3>
                        <span className="text-xs font-semibold text-secondary/60 bg-surface-container-low px-3 py-1 rounded-full font-label-mono">
                            {filteredProducts.length} Produk Ditemukan
                        </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-secondary py-12 font-label-mono text-xs">
                            <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">inventory_2</span>
                            <p>Tidak ada data produk yang terdaftar.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[11px] uppercase tracking-wider font-label-mono">
                                        <th className="px-6 py-4">SKU / Kode</th>
                                        <th className="px-6 py-4">Nama Produk</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4 text-right">Harga Satuan</th>
                                        <th className="px-6 py-4 text-center">Stok</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-low">
                                    {filteredProducts.map((product: Product) => (
                                        <tr key={product.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-4 text-sm text-secondary font-mono font-semibold">
                                                <div>{product.sku}</div>
                                                {product.barcode && <div className="text-[10px] text-secondary/40 font-normal">BC: {product.barcode}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-on-surface">
                                                <div className="flex items-center gap-3">
                                                    {product.image ? (
                                                        <img 
                                                            src={`/storage/${product.image}`} 
                                                            alt={product.name} 
                                                            className="w-10 h-10 object-cover rounded-lg border border-surface-container-high shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-surface-container-high flex items-center justify-center text-secondary/30 shrink-0">
                                                            <span className="material-symbols-outlined text-xl">image</span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-on-surface group-hover:text-primary transition-colors">
                                                            {product.name}
                                                        </span>
                                                        <span className="text-[10px] text-secondary/60 mt-0.5 max-w-xs truncate">
                                                            {product.description || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-semibold text-right text-sm text-primary">
                                                {formatPrice(product.price)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    {product.stock <= product.min_stock ? (
                                                        <span className="flex items-center gap-1 text-error font-bold font-mono bg-error-container/20 px-2 py-0.5 rounded">
                                                            <span className="material-symbols-outlined text-xs">warning</span>
                                                            {product.stock}
                                                        </span>
                                                    ) : (
                                                        <span className="font-semibold font-mono text-secondary">
                                                            {product.stock}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {product.is_active ? (
                                                    <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-block text-[10px] font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-md border border-surface-container-highest">
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleEditOpen(product)}
                                                        className="flex items-center justify-center p-1.5 text-secondary hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors active:scale-90 cursor-pointer"
                                                        title="Edit Produk"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteOpen(product)}
                                                        className="flex items-center justify-center p-1.5 text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors active:scale-90 cursor-pointer"
                                                        title="Hapus Produk"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Meta */}
                <footer className="mt-8 flex justify-between items-center text-secondary/60 opacity-50 px-2 pb-6 text-[10px]">
                    <p className="uppercase tracking-[0.2em] font-bold">Precision POS v2.4.0-Enterprise</p>
                    <p>Terakhir Sinkronisasi: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                </footer>
            </main>

            {/* Add Product Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Tambah Produk Baru</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Masukkan detail data produk ke dalam inventaris katalog.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-xs font-semibold text-secondary uppercase">Nama Produk *</label>
                                <Input
                                    required
                                    placeholder="Masukkan nama produk..."
                                    value={addForm.data.name}
                                    onChange={(e) => addForm.setData('name', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {addForm.errors.name && <span className="text-xs text-error font-medium">{addForm.errors.name}</span>}
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">SKU / Kode unik</label>
                                <Input
                                    placeholder="Auto-generate jika kosong"
                                    value={addForm.data.sku}
                                    onChange={(e) => addForm.setData('sku', e.target.value)}
                                    className="font-mono uppercase bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {addForm.errors.sku && <span className="text-xs text-error font-medium">{addForm.errors.sku}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Barcode</label>
                                <Input
                                    placeholder="Masukkan barcode..."
                                    value={addForm.data.barcode}
                                    onChange={(e) => addForm.setData('barcode', e.target.value)}
                                    className="font-mono bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {addForm.errors.barcode && <span className="text-xs text-error font-medium">{addForm.errors.barcode}</span>}
                            </div>

                            {isNewCategoryAdd ? (
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-semibold text-secondary uppercase">Kategori Baru *</label>
                                        {categories.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsNewCategoryAdd(false);
                                                    addForm.setData('category', '');
                                                }}
                                                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                                            >
                                                Kembali ke Dropdown
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        required
                                        placeholder="Masukkan kategori baru (misal: Dessert)..."
                                        value={addForm.data.category}
                                        onChange={(e) => addForm.setData('category', e.target.value)}
                                        className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                    />
                                    {addForm.errors.category && <span className="text-xs text-error font-medium">{addForm.errors.category}</span>}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-xs font-semibold text-secondary uppercase">Kategori *</label>
                                    <select
                                        required
                                        value={addForm.data.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__new__') {
                                                setIsNewCategoryAdd(true);
                                                addForm.setData('category', '');
                                            } else {
                                                addForm.setData('category', e.target.value);
                                            }
                                        }}
                                        className="w-full px-3 py-2 bg-surface-container-low/50 border border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                                    >
                                        <option value="" disabled>Pilih Kategori...</option>
                                        {categories.map((cat: string) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="__new__" className="text-primary font-semibold">+ Tambah Kategori Baru</option>
                                    </select>
                                    {addForm.errors.category && <span className="text-xs text-error font-medium">{addForm.errors.category}</span>}
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Harga Beli * (Rp)</label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="15000"
                                    value={addForm.data.purchase_price}
                                    onChange={(e) => addForm.setData('purchase_price', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {addForm.errors.purchase_price && <span className="text-xs text-error font-medium">{addForm.errors.purchase_price}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Harga Jual * (Rp)</label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="20000"
                                    value={addForm.data.selling_price}
                                    onChange={(e) => addForm.setData('selling_price', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {addForm.errors.selling_price && <span className="text-xs text-error font-medium">{addForm.errors.selling_price}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Jumlah Stok</label>
                                <Input
                                    type="number"
                                    required
                                    placeholder="50"
                                    disabled={addForm.data.materials.length > 0}
                                    value={addForm.data.materials.length > 0 ? '0' : addForm.data.stock}
                                    onChange={(e) => addForm.setData('stock', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                                {addForm.data.materials.length > 0 && (
                                    <span className="text-[9px] text-primary">Stok otomatis dihitung dari resep bahan.</span>
                                )}
                                {addForm.errors.stock && <span className="text-xs text-error font-medium">{addForm.errors.stock}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Minimal Stok</label>
                                <Input
                                    type="number"
                                    required
                                    value={addForm.data.min_stock}
                                    onChange={(e) => addForm.setData('min_stock', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {addForm.errors.min_stock && <span className="text-xs text-error font-medium">{addForm.errors.min_stock}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-xs font-semibold text-secondary uppercase">Deskripsi</label>
                                <Input
                                    placeholder="Keterangan opsional produk..."
                                    value={addForm.data.description}
                                    onChange={(e) => addForm.setData('description', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                            </div>

                            {/* Image Uploader */}
                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-xs font-semibold text-secondary uppercase">Gambar Produk</label>
                                <div className="flex items-center gap-4">
                                    {addForm.data.image ? (
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-surface-container-high shrink-0">
                                            <img 
                                                src={URL.createObjectURL(addForm.data.image)} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => addForm.setData('image', null)}
                                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-surface-container-low border border-dashed border-surface-container-high flex items-center justify-center text-secondary/40 shrink-0">
                                            <span className="material-symbols-outlined text-2xl">image</span>
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                addForm.setData('image', file);
                                            }}
                                            className="hidden" 
                                            id="add-image-input"
                                        />
                                        <label 
                                            htmlFor="add-image-input"
                                            className="px-4 py-2 border border-surface-container-high rounded-lg hover:bg-surface-container-low transition-colors font-semibold text-xs cursor-pointer inline-block"
                                        >
                                            Pilih Gambar
                                        </label>
                                        <p className="text-[10px] text-secondary/50 mt-1">PNG, JPG max 2MB</p>
                                    </div>
                                </div>
                                {addForm.errors.image && <span className="text-xs text-error font-medium">{addForm.errors.image}</span>}
                            </div>

                            {/* Toggle Active Status */}
                            <div className="flex items-center gap-2 col-span-2 mt-2 bg-surface-container-low/50 p-3 rounded-lg border border-surface-container-high">
                                <input
                                    type="checkbox"
                                    id="add-is-active"
                                    checked={addForm.data.is_active}
                                    onChange={(e) => addForm.setData('is_active', e.target.checked)}
                                    className="accent-primary h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                                />
                                <label htmlFor="add-is-active" className="text-xs font-semibold text-on-surface cursor-pointer select-none">
                                    Produk Aktif & Dapat Dijual di POS
                                </label>
                            </div>

                            {/* Materials Recipe Composition */}
                            <div className="flex flex-col gap-1.5 col-span-2 mt-2 border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-semibold text-secondary uppercase">Komposisi Bahan (Resep / Takaran)</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (materials.length === 0) {
                                                toast.error("Tidak ada bahan baku yang terdaftar.");
                                                return;
                                            }
                                            const current = [...addForm.data.materials];
                                            current.push({ material_id: '', quantity: '' });
                                            addForm.setData('materials', current);
                                        }}
                                        className="text-xs text-primary hover:text-primary/80 font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">add</span>
                                        Tambah Bahan
                                    </button>
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    {addForm.data.materials.map((ing, idx) => {
                                        const selectedMat = materials.find((m: any) => String(m.id) === String(ing.material_id));
                                        return (
                                            <div key={idx} className="flex gap-2 items-center bg-surface-container-low p-2 rounded-lg border border-surface-container-high">
                                                <select
                                                    value={ing.material_id}
                                                    onChange={(e) => {
                                                        const current = [...addForm.data.materials];
                                                        current[idx].material_id = e.target.value;
                                                        addForm.setData('materials', current);
                                                    }}
                                                    className="flex-grow bg-white border border-surface-container-high text-xs rounded px-2 py-1 outline-none text-on-surface"
                                                    required
                                                >
                                                    <option value="" disabled>Pilih Bahan...</option>
                                                    {materials.map((m: any) => (
                                                        <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                                                    ))}
                                                </select>
                                                
                                                <div className="relative w-24 shrink-0">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={ing.quantity}
                                                        placeholder="Takaran"
                                                        onChange={(e) => {
                                                            const current = [...addForm.data.materials];
                                                            current[idx].quantity = e.target.value;
                                                            addForm.setData('materials', current);
                                                        }}
                                                        className="w-full bg-white border border-surface-container-high text-xs rounded px-2 py-1 pr-8 outline-none text-on-surface text-right"
                                                        required
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-secondary/60">
                                                        {selectedMat?.unit || ''}
                                                    </span>
                                                </div>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = [...addForm.data.materials];
                                                        current.splice(idx, 1);
                                                        addForm.setData('materials', current);
                                                    }}
                                                    className="p-1 text-secondary hover:text-error cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {addForm.data.materials.length === 0 && (
                                        <div className="text-center py-4 border border-dashed border-surface-container-high rounded-lg text-secondary/50 text-[11px]">
                                            Belum ada bahan baku terhubung.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2 shrink-0">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={addForm.processing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Simpan Produk
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Edit Produk</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Perbarui informasi detail data produk.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-xs font-semibold text-secondary uppercase">Nama Produk *</label>
                                <Input
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {editForm.errors.name && <span className="text-xs text-error font-medium">{editForm.errors.name}</span>}
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">SKU / Kode unik</label>
                                <Input
                                    value={editForm.data.sku}
                                    onChange={(e) => editForm.setData('sku', e.target.value)}
                                    className="font-mono uppercase bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {editForm.errors.sku && <span className="text-xs text-error font-medium">{editForm.errors.sku}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Barcode</label>
                                <Input
                                    value={editForm.data.barcode}
                                    onChange={(e) => editForm.setData('barcode', e.target.value)}
                                    className="font-mono bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {editForm.errors.barcode && <span className="text-xs text-error font-medium">{editForm.errors.barcode}</span>}
                            </div>

                            {isNewCategoryEdit ? (
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-semibold text-secondary uppercase">Kategori Baru *</label>
                                        {categories.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsNewCategoryEdit(false);
                                                    const isExisting = categories.includes(selectedProduct?.category || '');
                                                    editForm.setData('category', isExisting ? (selectedProduct?.category || '') : (categories[0] || ''));
                                                }}
                                                className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                                            >
                                                Kembali ke Dropdown
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        required
                                        placeholder="Masukkan kategori baru (misal: Dessert)..."
                                        value={editForm.data.category}
                                        onChange={(e) => editForm.setData('category', e.target.value)}
                                        className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                    />
                                    {editForm.errors.category && <span className="text-xs text-error font-medium">{editForm.errors.category}</span>}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-xs font-semibold text-secondary uppercase">Kategori *</label>
                                    <select
                                        required
                                        value={editForm.data.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__new__') {
                                                setIsNewCategoryEdit(true);
                                                editForm.setData('category', '');
                                            } else {
                                                editForm.setData('category', e.target.value);
                                            }
                                        }}
                                        className="w-full px-3 py-2 bg-surface-container-low/50 border border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                                    >
                                        <option value="" disabled>Pilih Kategori...</option>
                                        {categories.map((cat: string) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="__new__" className="text-primary font-semibold">+ Tambah Kategori Baru</option>
                                    </select>
                                    {editForm.errors.category && <span className="text-xs text-error font-medium">{editForm.errors.category}</span>}
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Harga Beli * (Rp)</label>
                                <Input
                                    type="number"
                                    required
                                    value={editForm.data.purchase_price}
                                    onChange={(e) => editForm.setData('purchase_price', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {editForm.errors.purchase_price && <span className="text-xs text-error font-medium">{editForm.errors.purchase_price}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Harga Jual * (Rp)</label>
                                <Input
                                    type="number"
                                    required
                                    value={editForm.data.selling_price}
                                    onChange={(e) => editForm.setData('selling_price', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {editForm.errors.selling_price && <span className="text-xs text-error font-medium">{editForm.errors.selling_price}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Jumlah Stok</label>
                                <Input
                                    type="number"
                                    required
                                    disabled={editForm.data.materials.length > 0}
                                    value={editForm.data.materials.length > 0 ? '0' : editForm.data.stock}
                                    onChange={(e) => editForm.setData('stock', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                                {editForm.data.materials.length > 0 && (
                                    <span className="text-[9px] text-primary">Stok otomatis dihitung dari resep bahan.</span>
                                )}
                                {editForm.errors.stock && <span className="text-xs text-error font-medium">{editForm.errors.stock}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Minimal Stok</label>
                                <Input
                                    type="number"
                                    required
                                    value={editForm.data.min_stock}
                                    onChange={(e) => editForm.setData('min_stock', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {editForm.errors.min_stock && <span className="text-xs text-error font-medium">{editForm.errors.min_stock}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-xs font-semibold text-secondary uppercase">Deskripsi</label>
                                <Input
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                            </div>

                            {/* Image Uploader */}
                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-xs font-semibold text-secondary uppercase">Gambar Produk</label>
                                <div className="flex items-center gap-4">
                                    {editForm.data.image ? (
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-surface-container-high shrink-0">
                                            <img 
                                                src={URL.createObjectURL(editForm.data.image)} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => editForm.setData('image', null)}
                                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                    ) : selectedProduct?.image ? (
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-surface-container-high shrink-0">
                                            <img 
                                                src={`/storage/${selectedProduct.image}`} 
                                                alt="Existing" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-surface-container-low border border-dashed border-surface-container-high flex items-center justify-center text-secondary/40 shrink-0">
                                            <span className="material-symbols-outlined text-2xl">image</span>
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                editForm.setData('image', file);
                                            }}
                                            className="hidden" 
                                            id="edit-image-input"
                                        />
                                        <label 
                                            htmlFor="edit-image-input"
                                            className="px-4 py-2 border border-surface-container-high rounded-lg hover:bg-surface-container-low transition-colors font-semibold text-xs cursor-pointer inline-block"
                                        >
                                            Ubah Gambar
                                        </label>
                                        <p className="text-[10px] text-secondary/50 mt-1">PNG, JPG max 2MB. Kosongkan jika tidak ingin mengubah.</p>
                                    </div>
                                </div>
                                {editForm.errors.image && <span className="text-xs text-error font-medium">{editForm.errors.image}</span>}
                            </div>

                            {/* Toggle Active Status */}
                            <div className="flex items-center gap-2 col-span-2 mt-2 bg-surface-container-low/50 p-3 rounded-lg border border-surface-container-high">
                                <input
                                    type="checkbox"
                                    id="edit-is-active"
                                    checked={editForm.data.is_active}
                                    onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    className="accent-primary h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                                />
                                <label htmlFor="edit-is-active" className="text-xs font-semibold text-on-surface cursor-pointer select-none">
                                    Produk Aktif & Dapat Dijual di POS
                                </label>
                            </div>

                            {/* Materials Recipe Composition */}
                            <div className="flex flex-col gap-1.5 col-span-2 mt-2 border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-semibold text-secondary uppercase">Komposisi Bahan (Resep / Takaran)</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (materials.length === 0) {
                                                toast.error("Tidak ada bahan baku yang terdaftar.");
                                                return;
                                            }
                                            const current = [...editForm.data.materials];
                                            current.push({ material_id: '', quantity: '' });
                                            editForm.setData('materials', current);
                                        }}
                                        className="text-xs text-primary hover:text-primary/80 font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">add</span>
                                        Tambah Bahan
                                    </button>
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    {editForm.data.materials.map((ing, idx) => {
                                        const selectedMat = materials.find((m: any) => String(m.id) === String(ing.material_id));
                                        return (
                                            <div key={idx} className="flex gap-2 items-center bg-surface-container-low p-2 rounded-lg border border-surface-container-high">
                                                <select
                                                    value={ing.material_id}
                                                    onChange={(e) => {
                                                        const current = [...editForm.data.materials];
                                                        current[idx].material_id = e.target.value;
                                                        editForm.setData('materials', current);
                                                    }}
                                                    className="flex-grow bg-white border border-surface-container-high text-xs rounded px-2 py-1 outline-none text-on-surface"
                                                    required
                                                >
                                                    <option value="" disabled>Pilih Bahan...</option>
                                                    {materials.map((m: any) => (
                                                        <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                                                    ))}
                                                </select>
                                                
                                                <div className="relative w-24 shrink-0">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={ing.quantity}
                                                        placeholder="Takaran"
                                                        onChange={(e) => {
                                                            const current = [...editForm.data.materials];
                                                            current[idx].quantity = e.target.value;
                                                            editForm.setData('materials', current);
                                                        }}
                                                        className="w-full bg-white border border-surface-container-high text-xs rounded px-2 py-1 pr-8 outline-none text-on-surface text-right"
                                                        required
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-secondary/60">
                                                        {selectedMat?.unit || ''}
                                                    </span>
                                                </div>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = [...editForm.data.materials];
                                                        current.splice(idx, 1);
                                                        editForm.setData('materials', current);
                                                    }}
                                                    className="p-1 text-secondary hover:text-error cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {editForm.data.materials.length === 0 && (
                                        <div className="text-center py-4 border border-dashed border-surface-container-high rounded-lg text-secondary/50 text-[11px]">
                                            Belum ada bahan baku terhubung.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2 shrink-0">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsEditOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Perbarui Produk
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-error font-bold">Konfirmasi Hapus</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Apakah Anda yakin ingin menghapus produk <span className="font-semibold text-on-surface">"{selectedProduct?.name}"</span> dari katalog? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsDeleteOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" className="text-xs bg-red-600 text-white hover:bg-red-700 font-bold" onClick={handleDeleteSubmit}>
                            Hapus Produk
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

