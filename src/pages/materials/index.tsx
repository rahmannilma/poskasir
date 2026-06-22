import { useMemo, useState } from 'react';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Material {
    id: number;
    name: string;
    stock: string | number;
    unit: string;
    min_stock: string | number;
    purchase_price: string | number;
}

interface ProductMaterial {
    id: number;
    name: string;
    stock: string | number;
    unit: string;
    pivot: {
        quantity: string | number;
    };
}

interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: string | number;
    stock: number;
    materials?: ProductMaterial[];
}

export default function Index() {
    const { materials = [], products = [], auth = { user: null } } = usePage<any>().props;

    const [activeTab, setActiveTab] = useState<'materials' | 'recipes'>('materials');
    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Dialog state for materials CRUD
    const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
    const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
    const [isDeleteMaterialOpen, setIsDeleteMaterialOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    // Dialog state for product recipes
    const [isRecipeOpen, setIsRecipeOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [recipeMaterials, setRecipeMaterials] = useState<{ id: number; quantity: number }[]>([]);

    const currentUser = auth.user;

    // Form handlers for material CRUD
    const materialForm = useForm({
        name: '',
        stock: '0',
        unit: 'gr',
        min_stock: '0',
        purchase_price: '0',
        purchase_quantity: '1',
        purchase_total: '0',
    });

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'OW';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    // Filter materials locally
    const filteredMaterials = useMemo(() => {
        return materials.filter((m: Material) => {
            return m.name.toLowerCase().includes(search.toLowerCase());
        });
    }, [materials, search]);

    // Filter products locally
    const filteredProducts = useMemo(() => {
        return products.filter((p: Product) => {
            return p.name.toLowerCase().includes(search.toLowerCase()) || 
                   p.sku.toLowerCase().includes(search.toLowerCase());
        });
    }, [products, search]);

    // Material CRUD handlers
    const handleAddMaterialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        materialForm.post('/materials/items', {
            onSuccess: () => {
                setIsAddMaterialOpen(false);
                materialForm.reset();
                toast.success("Bahan baku berhasil ditambahkan!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menambahkan bahan baku.";
                toast.error(firstErr);
            }
        });
    };

    const handleEditMaterialOpen = (material: Material) => {
        setSelectedMaterial(material);
        materialForm.setData({
            name: material.name,
            stock: String(material.stock),
            unit: material.unit,
            min_stock: String(material.min_stock || 0),
            purchase_price: String(material.purchase_price || 0),
            purchase_quantity: '1',
            purchase_total: String(Math.round(parseFloat(String(material.purchase_price || 0)) * 1)),
        });
        setIsEditMaterialOpen(true);
    };

    const handleEditMaterialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMaterial) return;

        materialForm.put(`/materials/items/${selectedMaterial.id}`, {
            onSuccess: () => {
                setIsEditMaterialOpen(false);
                toast.success("Bahan baku berhasil diperbarui!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal memperbarui bahan baku.";
                toast.error(firstErr);
            }
        });
    };

    const handleDeleteMaterialOpen = (material: Material) => {
        setSelectedMaterial(material);
        setIsDeleteMaterialOpen(true);
    };

    const handleDeleteMaterialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMaterial) return;

        router.delete(`/materials/items/${selectedMaterial.id}`, {
            onSuccess: () => {
                setIsDeleteMaterialOpen(false);
                toast.success("Bahan baku berhasil dihapus!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menghapus bahan baku.";
                toast.error(firstErr);
            }
        });
    };

    // Recipe handlers
    const handleOpenRecipe = (product: Product) => {
        setSelectedProduct(product);
        const existing = (product.materials || []).map(m => ({
            id: m.id,
            quantity: typeof m.pivot.quantity === 'string' ? parseFloat(m.pivot.quantity) : m.pivot.quantity
        }));
        setRecipeMaterials(existing);
        setIsRecipeOpen(true);
    };

    const handleAddRecipeRow = () => {
        if (materials.length === 0) {
            toast.error("Silakan tambahkan bahan baku terlebih dahulu!");
            return;
        }
        // Find first material not already in recipe or just use the first available one
        const unused = materials.find((m: Material) => !recipeMaterials.some(rm => rm.id === m.id));
        const selectId = unused ? unused.id : materials[0].id;
        setRecipeMaterials([...recipeMaterials, { id: selectId, quantity: 1 }]);
    };

    const handleRemoveRecipeRow = (index: number) => {
        const copy = [...recipeMaterials];
        copy.splice(index, 1);
        setRecipeMaterials(copy);
    };

    const handleRecipeChange = (index: number, field: 'id' | 'quantity', value: any) => {
        const copy = [...recipeMaterials];
        copy[index] = {
            ...copy[index],
            [field]: value
        };
        setRecipeMaterials(copy);
    };

    const handleRecipeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        router.post(`/materials/products/${selectedProduct.id}/recipe`, {
            materials: recipeMaterials
        }, {
            onSuccess: () => {
                setIsRecipeOpen(false);
                toast.success("Resep produk berhasil diperbarui!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal memperbarui resep produk.";
                toast.error(firstErr);
            }
        });
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Kelola Bahan Baku</title>
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
                    {/* Active Tab: Bahan Baku */}
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/materials">
                            <span className="material-symbols-outlined active-icon">grocery</span>
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
                            placeholder={activeTab === 'materials' ? "Cari bahan baku..." : "Cari produk resep..."}
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
                
                {/* Banner Penjelasan Plan (Informasi Panduan) */}
                <div className="bg-red-50/50 border border-primary/20 rounded-2xl p-6 mb-8 flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0 self-start">
                        <span className="material-symbols-outlined text-2xl">info</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-on-surface mb-1.5">Panduan Resep & Bahan Baku Produk</h3>
                        <p className="text-xs text-secondary/70 leading-relaxed">
                            1. Mengaitkan bahan baku ke produk bersifat <strong className="text-primary">sepenuhnya opsional</strong> (tidak wajib).<br/>
                            2. Produk yang tidak memiliki resep bahan tetap dapat dijual secara normal di halaman Kasir POS.<br/>
                            3. Modul ini bertujuan membantu pencatatan kebutuhan produksi dan estimasi pemakaian stok bahan baku per produk.
                        </p>
                    </div>
                </div>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 mt-2">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Kelola Bahan Baku</h2>
                        <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Daftar resep produk dan inventaris bahan dasar</p>
                    </div>
                    {activeTab === 'materials' && (
                        <div className="w-full md:w-auto">
                            <button 
                                onClick={() => {
                                    materialForm.reset();
                                    setIsAddMaterialOpen(true);
                                }}
                                className="w-full md:w-auto justify-center px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                TAMBAH BAHAN
                            </button>
                        </div>
                    )}
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl w-fit mb-8 select-none">
                    <button 
                        onClick={() => {
                            setActiveTab('materials');
                            setSearch('');
                        }}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                            activeTab === 'materials' 
                                ? 'bg-white shadow-sm text-primary' 
                                : 'text-secondary hover:text-on-surface'
                        }`}
                    >
                        Bahan Baku ({materials.length})
                    </button>
                    <button 
                        onClick={() => {
                            setActiveTab('recipes');
                            setSearch('');
                        }}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                            activeTab === 'recipes' 
                                ? 'bg-white shadow-sm text-primary' 
                                : 'text-secondary hover:text-on-surface'
                        }`}
                    >
                        Resep Produk ({products.length})
                    </button>
                </div>

                {activeTab === 'materials' ? (
                    /* MATERIALS TAB */
                    <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden mb-10 p-6 flex flex-col relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-on-surface">Daftar Inventaris Bahan</h3>
                            <span className="text-xs font-semibold text-secondary/60 bg-surface-container-low px-3 py-1 rounded-full font-label-mono">
                                {filteredMaterials.length} Bahan Ditemukan
                            </span>
                        </div>

                        {filteredMaterials.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center text-secondary py-12 font-label-mono text-xs">
                                <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">grocery</span>
                                <p>Tidak ada bahan baku yang ditemukan.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[11px] uppercase tracking-wider font-label-mono">
                                            <th className="px-6 py-4">Nama Bahan</th>
                                            <th className="px-6 py-4 text-center">Stok</th>
                                            <th className="px-6 py-4 text-right">Harga Beli / Satuan</th>
                                            <th className="px-6 py-4 text-center">Satuan</th>
                                            <th className="px-6 py-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-container-low">
                                        {filteredMaterials.map((material: Material) => (
                                            <tr key={material.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                                                    {material.name}
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-semibold font-label-mono">
                                                    {parseFloat(String(material.stock)) <= parseFloat(String(material.min_stock)) ? (
                                                        <span className="inline-flex items-center gap-1 text-error font-bold bg-error-container/20 px-2 py-0.5 rounded">
                                                            <span className="material-symbols-outlined text-xs">warning</span>
                                                            {parseFloat(String(material.stock)).toLocaleString('id-ID')}
                                                        </span>
                                                    ) : (
                                                        <span>{parseFloat(String(material.stock)).toLocaleString('id-ID')}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-semibold text-sm text-primary">
                                                    {new Intl.NumberFormat('id-ID', {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                        minimumFractionDigits: 0
                                                    }).format(parseFloat(String(material.purchase_price || 0)))}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block font-mono font-semibold text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-secondary">
                                                        {material.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleEditMaterialOpen(material)}
                                                            className="flex items-center justify-center p-1.5 text-secondary hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors active:scale-90 cursor-pointer"
                                                            title="Edit Bahan"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteMaterialOpen(material)}
                                                            className="flex items-center justify-center p-1.5 text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors active:scale-90 cursor-pointer"
                                                            title="Hapus Bahan"
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
                ) : (
                    /* RECIPES TAB */
                    <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden mb-10 p-6 flex flex-col relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-on-surface">Resep Bahan Baku per Produk</h3>
                            <span className="text-xs font-semibold text-secondary/60 bg-surface-container-low px-3 py-1 rounded-full font-label-mono">
                                {filteredProducts.length} Produk Ditemukan
                            </span>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center text-secondary py-12 font-label-mono text-xs">
                                <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">menu_book</span>
                                <p>Tidak ada produk yang ditemukan.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[11px] uppercase tracking-wider font-label-mono">
                                            <th className="px-6 py-4">Nama Produk</th>
                                            <th className="px-6 py-4">Kategori</th>
                                            <th className="px-6 py-4">Bahan Baku (Resep)</th>
                                            <th className="px-6 py-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-container-low">
                                        {filteredProducts.map((product: Product) => (
                                            <tr key={product.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                                                    <div>{product.name}</div>
                                                    <div className="text-[10px] text-secondary/60 font-label-mono mt-0.5">{product.sku}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-secondary font-medium">
                                                    {product.category}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {product.materials && product.materials.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1.5 max-w-md">
                                                            {product.materials.map((m: ProductMaterial) => (
                                                                <span key={m.id} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-50 text-primary border border-primary/10 px-2 py-0.5 rounded">
                                                                    {m.name} ({parseFloat(String(m.pivot.quantity))} {m.unit})
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-secondary/40 font-medium italic">
                                                            Tanpa bahan baku (opsional)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <button 
                                                            onClick={() => handleOpenRecipe(product)}
                                                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/5 hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-lg transition-colors active:scale-95 cursor-pointer border border-primary/10"
                                                        >
                                                            <span className="material-symbols-outlined text-[15px]">menu_book</span>
                                                            Atur Resep
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
                )}
            </main>

            {/* Add Material Dialog */}
            <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
                <DialogContent className="sm:max-w-[450px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Tambah Bahan Baku</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Masukkan detail bahan baku baru di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMaterialSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase">Nama Bahan Baku *</label>
                            <Input
                                required
                                placeholder="Contoh: Biji Kopi, Gula Pasir, Cup 16oz..."
                                value={materialForm.data.name}
                                onChange={(e) => materialForm.setData('name', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Stok Awal</label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={materialForm.data.stock}
                                    onChange={(e) => materialForm.setData('stock', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Satuan *</label>
                                <select
                                    required
                                    value={materialForm.data.unit}
                                    onChange={(e) => materialForm.setData('unit', e.target.value)}
                                    className="w-full px-3 py-2 bg-surface-container-low/50 border border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                                >
                                    <option value="gr">Gram (gr)</option>
                                    <option value="ml">Mililiter (ml)</option>
                                    <option value="pcs">Pieces (pcs)</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="liter">Liter (l)</option>
                                    <option value="pack">Pack</option>
                                </select>
                            </div>
                        </div>

                        {/* Initial Purchase Info */}
                        <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-xs font-semibold text-secondary uppercase">Info Pembelian Awal</label>
                            <div className="flex flex-col gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-secondary">Jumlah Pembelian</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={materialForm.data.purchase_quantity}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const qty = parseFloat(val) || 0;
                                                const total = parseFloat(materialForm.data.purchase_total) || 0;
                                                const price = qty > 0 ? Math.round(total / qty) : 0;
                                                materialForm.setData({
                                                    ...materialForm.data,
                                                    purchase_quantity: val,
                                                    purchase_price: String(price)
                                                });
                                            }}
                                            className="bg-white border-surface-container-high text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20"
                                            placeholder={`Jumlah (${materialForm.data.unit})`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-semibold text-secondary">Total Harga Beli (Rp)</label>
                                        <Input
                                            type="number"
                                            step="100"
                                            min="0"
                                            value={materialForm.data.purchase_total}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const total = parseFloat(val) || 0;
                                                const qty = parseFloat(materialForm.data.purchase_quantity) || 0;
                                                const price = qty > 0 ? Math.round(total / qty) : 0;
                                                materialForm.setData({
                                                    ...materialForm.data,
                                                    purchase_total: val,
                                                    purchase_price: String(price)
                                                });
                                            }}
                                            className="bg-white border-surface-container-high text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold text-secondary">Harga per Satuan (Rp)</label>
                                    <Input
                                        readOnly
                                        value={materialForm.data.purchase_price ? parseInt(materialForm.data.purchase_price).toLocaleString('id-ID') : '-'}
                                        className="bg-surface-container border-surface-container-high text-xs rounded-lg font-mono font-bold text-primary select-all"
                                    />
                                    <p className="text-[9px] text-secondary/50">Dihitung otomatis: Total / Jumlah</p>
                                </div>
                            </div>
                        </div>

                        {/* Min Stock */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase">Stok Minimum *</label>
                            <Input
                                required
                                type="number"
                                step="0.01"
                                min="0"
                                value={materialForm.data.min_stock}
                                onChange={(e) => materialForm.setData('min_stock', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            <p className="text-[10px] text-secondary/50">Peringatan akan muncul jika stok berada di bawah nilai ini.</p>
                        </div>

                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsAddMaterialOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={materialForm.processing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Simpan Bahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Material Dialog */}
            <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
                <DialogContent className="sm:max-w-[450px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Edit Bahan Baku</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Perbarui informasi bahan baku terpilih.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditMaterialSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase">Nama Bahan Baku *</label>
                            <Input
                                required
                                value={materialForm.data.name}
                                onChange={(e) => materialForm.setData('name', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Stok</label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={materialForm.data.stock}
                                    onChange={(e) => materialForm.setData('stock', e.target.value)}
                                    className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-secondary uppercase">Satuan *</label>
                                <select
                                    required
                                    value={materialForm.data.unit}
                                    onChange={(e) => materialForm.setData('unit', e.target.value)}
                                    className="w-full px-3 py-2 bg-surface-container-low/50 border border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                                >
                                    <option value="gr">Gram (gr)</option>
                                    <option value="ml">Mililiter (ml)</option>
                                    <option value="pcs">Pieces (pcs)</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="liter">Liter (l)</option>
                                    <option value="pack">Pack</option>
                                </select>
                            </div>
                        </div>

                        {/* Purchase Price Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase">Harga Beli per Satuan (Rp) *</label>
                            <Input
                                required
                                type="number"
                                step="1"
                                min="0"
                                value={materialForm.data.purchase_price}
                                onChange={(e) => materialForm.setData('purchase_price', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                        </div>

                        {/* Min Stock */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase">Stok Minimum *</label>
                            <Input
                                required
                                type="number"
                                step="0.01"
                                min="0"
                                value={materialForm.data.min_stock}
                                onChange={(e) => materialForm.setData('min_stock', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                        </div>

                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsEditMaterialOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={materialForm.processing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteMaterialOpen} onOpenChange={setIsDeleteMaterialOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-error font-bold">Konfirmasi Hapus</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            {selectedMaterial && selectedMaterial.name ? (
                                <span>
                                    Apakah Anda yakin ingin menghapus bahan baku <span className="font-semibold text-on-surface">"{selectedMaterial.name}"</span>? Tindakan ini tidak dapat dibatalkan.
                                </span>
                            ) : (
                                <span>Tindakan ini tidak dapat dibatalkan.</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsDeleteMaterialOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" className="text-xs bg-red-600 text-white hover:bg-red-700 font-bold" onClick={handleDeleteMaterialSubmit}>
                            Hapus Bahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Recipe Dialog */}
            <Dialog open={isRecipeOpen} onOpenChange={setIsRecipeOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl max-h-[85vh] flex flex-col">
                    <DialogHeader className="pb-2 border-b border-surface-container-high shrink-0">
                        <DialogTitle className="text-base text-primary font-bold">Atur Resep: {selectedProduct?.name}</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Pilih bahan baku yang digunakan beserta takaran kebutuhan per unit produk. Resep resep ini bersifat <strong className="text-primary font-bold">opsional</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleRecipeSubmit} className="flex-grow flex flex-col overflow-hidden text-xs">
                        <div className="flex-grow overflow-y-auto py-4 pr-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-secondary text-[11px] uppercase tracking-wider">Komponen Bahan Baku</span>
                                <button 
                                    type="button"
                                    onClick={handleAddRecipeRow}
                                    className="flex items-center gap-1 text-primary hover:text-primary/80 font-bold font-sans cursor-pointer text-xs"
                                >
                                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                    Tambah Baris
                                </button>
                            </div>

                            {recipeMaterials.length === 0 ? (
                                <div className="text-center py-8 bg-surface-container-low rounded-xl text-secondary/60 italic">
                                    Belum ada resep yang dikaitkan (produk ini dibuat tanpa mencatat bahan baku).
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recipeMaterials.map((row, idx) => {
                                        const materialDetail = materials.find((m: Material) => m.id === row.id);
                                        return (
                                            <div key={idx} className="flex gap-3 items-center bg-surface-container-low/30 p-2.5 rounded-lg border border-surface-container-low">
                                                <div className="flex-grow">
                                                    <select
                                                        value={row.id}
                                                        onChange={(e) => handleRecipeChange(idx, 'id', parseInt(e.target.value))}
                                                        className="w-full bg-white border border-surface-container-high focus:border-primary p-2 text-xs rounded-lg outline-none"
                                                    >
                                                        {materials.map((m: Material) => (
                                                            <option key={m.id} value={m.id}>
                                                                {m.name} (Stok: {parseFloat(String(m.stock))} {m.unit})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-24 shrink-0 flex items-center gap-1.5">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={row.quantity}
                                                        onChange={(e) => handleRecipeChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                                        className="bg-white border-surface-container-high focus:border-primary text-center px-1 text-xs h-8"
                                                    />
                                                    <span className="text-[11px] text-secondary font-semibold font-label-mono truncate w-10">
                                                        {materialDetail ? materialDetail.unit : ''}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRecipeRow(idx)}
                                                    className="p-1.5 text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2 shrink-0">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsRecipeOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Simpan Resep
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

