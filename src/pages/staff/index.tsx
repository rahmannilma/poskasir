import { useState, useMemo } from 'react';
import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface StaffUser {
    id: number;
    name: string;
    email: string;
    role?: string;
    created_at: string;
}

export default function Index() {
    const { staff = [], auth = { user: null } } = usePage<any>().props;

    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);

    const currentUser = auth.user;

    // Form for Adding Cashier
    const addForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'cashier',
    });

    // Form for Editing Cashier
    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'cashier',
    });

    // Metrics calculations
    const totalStaff = staff.length;

    const newestStaff = useMemo(() => {
        if (staff.length === 0) return '-';
        const sorted = [...staff].sort((a: StaffUser, b: StaffUser) => b.id - a.id);
        return sorted[0].name;
    }, [staff]);

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'OW';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    // Filter staff list locally
    const filteredStaff = useMemo(() => {
        return staff.filter((member: StaffUser) => {
            return (
                member.name.toLowerCase().includes(search.toLowerCase()) ||
                member.email.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [staff, search]);

    // Submit handler for creation
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        addForm.post('/staff', {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
                toast.success("Akun staf berhasil didaftarkan!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal membuat akun staf.";
                toast.error(firstErr);
            }
        });
    };

    // Open and load data for editing
    const handleEditOpen = (member: StaffUser) => {
        setSelectedStaff(member);
        editForm.setData({
            name: member.name,
            email: member.email,
            password: '',
            password_confirmation: '',
            role: member.role || 'cashier',
        });
        setIsEditOpen(true);
    };

    // Submit handler for editing
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStaff) return;

        editForm.put(`/staff/${selectedStaff.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                toast.success("Akun staf berhasil diperbarui!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal memperbarui akun.";
                toast.error(firstErr);
            }
        });
    };

    // Delete handlers
    const handleDeleteOpen = (member: StaffUser) => {
        setSelectedStaff(member);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStaff) return;

        router.delete(`/staff/${selectedStaff.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                toast.success("Akun staf berhasil dihapus!");
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menghapus akun staf.";
                toast.error(firstErr);
            }
        });
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Kelola Staf Kasir</title>
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

            {/* SideNavBar (The "Anchor") */}
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
                    {['owner', 'super_admin', 'manager'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/materials">
                            <span className="material-symbols-outlined group-hover:text-primary">grocery</span>
                            <span className="text-[15px] font-sans">Bahan Baku</span>
                        </Link>
                    )}
                    {/* Active Tab: Staff */}
                    {['owner', 'super_admin'].includes(currentUser?.role) && (
                        <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/staff">
                            <span className="material-symbols-outlined active-icon">groups</span>
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
                            placeholder="Cari nama atau email staf..." 
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Kelola Staf</h2>
                        <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Daftar akun staf dan otoritas akses POS</p>
                    </div>
                    <div className="w-full md:w-auto">
                        <button 
                            onClick={() => setIsAddOpen(true)}
                            className="w-full md:w-auto justify-center px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            DAFTARKAN STAF
                        </button>
                    </div>
                </div>

                {/* Metric Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Total Staff */}
                    <div className="bg-red-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-primary shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">groups</span>
                            </div>
                            <span className="flex items-center text-primary font-bold text-[10px] bg-primary/10 px-2 py-0.5 rounded-full uppercase font-label-mono">Staff</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Staf</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{totalStaff}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Staf terdaftar aktif</p>
                    </div>

                    {/* Peran Akses */}
                    <div className="bg-emerald-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-emerald-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">shield</span>
                            </div>
                            <span className="flex items-center text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Roles</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Peran Akses</p>
                        <h3 className="text-2xl font-bold text-on-surface">Kasir, Manager, Kitchen</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Hak akses terenkripsi</p>
                    </div>

                    {/* POS System */}
                    <div className="bg-amber-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-amber-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">dns</span>
                            </div>
                            <span className="flex items-center text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Online</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Sistem POS</p>
                        <h3 className="text-2xl font-bold text-on-surface">Aktif / Online</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Layanan POS stabil</p>
                    </div>

                    {/* Newest Staff */}
                    <div className="bg-blue-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-blue-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">person_add</span>
                            </div>
                            <span className="flex items-center text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Latest</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Staf Baru</p>
                        <h3 className="text-2xl font-bold text-on-surface truncate pr-2">{newestStaff}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Staf terakhir didaftarkan</p>
                    </div>
                </div>

                {/* Bento Table Section */}
                <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden mb-10 p-6 flex flex-col relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-on-surface">Daftar Staf Kasir</h3>
                        <span className="text-xs font-semibold text-secondary/60 bg-surface-container-low px-3 py-1 rounded-full font-label-mono">
                            {filteredStaff.length} Staf Ditemukan
                        </span>
                    </div>

                    {filteredStaff.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-secondary py-12 font-label-mono text-xs">
                            <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">groups</span>
                            <p>Tidak ada data staf yang terdaftar.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[11px] uppercase tracking-wider font-label-mono">
                                        <th className="px-6 py-4">Nama Staf</th>
                                        <th className="px-6 py-4">Alamat Email</th>
                                        <th className="px-6 py-4 text-center">Peran (Role)</th>
                                        <th className="px-6 py-4">Terdaftar Sejak</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-low">
                                    {filteredStaff.map((member: StaffUser) => (
                                        <tr key={member.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-4 text-sm text-on-surface">
                                                <span className="font-bold text-on-surface group-hover:text-primary transition-colors">
                                                    {member.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-1.5 text-secondary">
                                                    <span className="material-symbols-outlined text-sm">mail</span>
                                                    <span>{member.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                                    member.role === 'manager' 
                                                        ? 'text-amber-600 bg-amber-50 border-amber-200' 
                                                        : member.role === 'kitchen'
                                                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                                                        : 'text-blue-600 bg-blue-50 border-blue-200'
                                                }`}>
                                                    {member.role === 'manager' ? 'Manager' : member.role === 'kitchen' ? 'Kitchen' : 'Kasir'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-secondary font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    <span>{new Date(member.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleEditOpen(member)}
                                                        className="flex items-center justify-center p-1.5 text-secondary hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors active:scale-90 cursor-pointer"
                                                        title="Edit Staf"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteOpen(member)}
                                                        className="flex items-center justify-center p-1.5 text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors active:scale-90 cursor-pointer"
                                                        title="Hapus Staf"
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

            {/* Add Staff Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[420px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Daftarkan Akun Staf</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Daftarkan staf baru dengan email, peran, dan kata sandi mandiri.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Nama Lengkap</label>
                            <Input
                                required
                                placeholder="Masukkan nama kasir..."
                                value={addForm.data.name}
                                onChange={(e) => addForm.setData('name', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            {addForm.errors.name && <span className="text-xs text-error font-medium">{addForm.errors.name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Alamat Email</label>
                            <Input
                                type="email"
                                required
                                placeholder="email@store.com"
                                value={addForm.data.email}
                                onChange={(e) => addForm.setData('email', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            {addForm.errors.email && <span className="text-xs text-error font-medium">{addForm.errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Peran (Role)</label>
                            <select
                                required
                                value={addForm.data.role}
                                onChange={(e) => addForm.setData('role', e.target.value)}
                                className="w-full px-3 py-2.5 bg-surface-container-low/50 border border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                            >
                                <option value="cashier">Kasir (Penjualan Saja)</option>
                                <option value="manager">Manager (Kelola Produk & Penjualan)</option>
                                <option value="kitchen">Kitchen / KDS (Hanya Monitor Dapur)</option>
                            </select>
                            {addForm.errors.role && <span className="text-xs text-error font-medium">{addForm.errors.role}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Kata Sandi (Min 8 Karakter)</label>
                            <Input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={addForm.data.password}
                                onChange={(e) => addForm.setData('password', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            {addForm.errors.password && <span className="text-xs text-error font-medium">{addForm.errors.password}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Konfirmasi Kata Sandi</label>
                            <Input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={addForm.data.password_confirmation}
                                onChange={(e) => addForm.setData('password_confirmation', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                        </div>

                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsAddOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={addForm.processing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Daftarkan Akun
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Cashier Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[420px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-primary font-bold">Edit Akun Staf</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Perbarui nama, email, atau reset kata sandi kasir.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 py-2 text-xs">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Nama Lengkap</label>
                            <Input
                                required
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            {editForm.errors.name && <span className="text-xs text-error font-medium">{editForm.errors.name}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Alamat Email</label>
                            <Input
                                type="email"
                                required
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            {editForm.errors.email && <span className="text-xs text-error font-medium">{editForm.errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Peran (Role)</label>
                            <select
                                required
                                value={editForm.data.role}
                                onChange={(e) => editForm.setData('role', e.target.value)}
                                className="w-full px-3 py-2.5 bg-surface-container-low/50 border border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                            >
                                <option value="cashier">Kasir (Penjualan Saja)</option>
                                <option value="manager">Manager (Kelola Produk & Penjualan)</option>
                                <option value="kitchen">Kitchen / KDS (Hanya Monitor Dapur)</option>
                            </select>
                            {editForm.errors.role && <span className="text-xs text-error font-medium">{editForm.errors.role}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Kata Sandi Baru (Kosongkan jika tidak diubah)</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                            {editForm.errors.password && <span className="text-xs text-error font-medium">{editForm.errors.password}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-secondary uppercase">Konfirmasi Kata Sandi Baru</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={editForm.data.password_confirmation}
                                onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                                className="bg-surface-container-low/50 border-surface-container-high hover:border-surface-container-highest focus:bg-white text-on-surface text-xs rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                        </div>

                        <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                            <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsEditOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing} className="text-xs bg-primary text-white hover:bg-primary/90 font-bold">
                                Perbarui Akun
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Cashier Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base text-error font-bold">Hapus Akun Kasir</DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            Apakah Anda yakin ingin menghapus akun staf <span className="font-semibold text-on-surface">"{selectedStaff?.name}"</span>? Akun ini tidak akan dapat login lagi ke dalam aplikasi POS.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsDeleteOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" className="text-xs bg-red-600 text-white hover:bg-red-700 font-bold" onClick={handleDeleteSubmit}>
                            Hapus Akun
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

