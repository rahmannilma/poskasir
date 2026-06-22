import { useMemo, useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Owner {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

interface Metrics {
    total_owners: number;
    active_owners: number;
    inactive_owners: number;
    newest_owner: string;
}

export default function Index() {
    const { owners = [], metrics = { total_owners: 0, active_owners: 0, inactive_owners: 0, newest_owner: '-' }, auth = { user: null } } = usePage<any>().props;

    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

    const currentUser = auth.user;

    // Filter owners list locally
    const filteredOwners = useMemo(() => {
        return owners.filter((owner: Owner) => {
            return (
                owner.name.toLowerCase().includes(search.toLowerCase()) ||
                owner.email.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [owners, search]);

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'SA';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    // Handle toggle status dialog opening
    const handleToggleOpen = (owner: Owner) => {
        setSelectedOwner(owner);
        setIsConfirmOpen(true);
    };

    // Submit the status change request
    const handleToggleSubmit = () => {
        if (!selectedOwner) return;

        router.post(`/owners/${selectedOwner.id}/toggle-status`, {}, {
            onSuccess: () => {
                setIsConfirmOpen(false);
                toast.success(`Akun owner "${selectedOwner.name}" berhasil ${selectedOwner.is_active ? 'dinonaktifkan' : 'disetujui & diaktifkan'}!`);
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal mengubah status akun.";
                toast.error(firstErr);
            }
        });
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Pantau Owner</title>
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
            `}} />

            {/* Mobile Sidebar Backdrop Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity duration-300" 
                    onClick={() => setIsSidebarOpen(false)} 
                />
            )}

            {/* SideNavBar */}
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
                    {currentUser?.role === 'super_admin' ? (
                        <>
                            {/* Super Admin Owner Monitor Active Tab */}
                            <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/owners">
                                <span className="material-symbols-outlined active-icon">supervised_user_circle</span>
                                <span className="text-[15px] font-sans">Pantau Owner</span>
                            </Link>

                            {/* Super Admin Attendance Request Tab */}
                            <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/superadmin/absensi-approval">
                                <span className="material-symbols-outlined group-hover:text-primary">pending_actions</span>
                                <span className="text-[15px] font-sans">Persetujuan Absen</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Dashboard */}
                            {['owner', 'manager'].includes(currentUser?.role) && (
                                <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/dashboard">
                                    <span className="material-symbols-outlined group-hover:text-primary">dashboard</span>
                                    <span className="text-[15px] font-sans">Dashboard</span>
                                </Link>
                            )}

                            <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/transactions">
                                <span className="material-symbols-outlined group-hover:text-primary">receipt_long</span>
                                <span className="text-[15px] font-sans">Transactions</span>
                            </Link>
                            {['owner', 'manager'].includes(currentUser?.role) && (
                                <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/products">
                                    <span className="material-symbols-outlined group-hover:text-primary">inventory_2</span>
                                    <span className="text-[15px] font-sans">Produk</span>
                                </Link>
                            )}
                            {['owner', 'manager'].includes(currentUser?.role) && (
                                <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/categories">
                                    <span className="material-symbols-outlined group-hover:text-primary">category</span>
                                    <span className="text-[15px] font-sans">Kategori</span>
                                </Link>
                            )}
                            {['owner', 'manager'].includes(currentUser?.role) && (
                                <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/tables">
                                    <span className="material-symbols-outlined group-hover:text-primary">qr_code</span>
                                    <span className="text-[15px] font-sans">Meja & QR</span>
                                </Link>
                            )}
                            {['owner', 'manager'].includes(currentUser?.role) && (
                                <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/materials">
                                    <span className="material-symbols-outlined group-hover:text-primary">grocery</span>
                                    <span className="text-[15px] font-sans">Bahan Baku</span>
                                </Link>
                            )}
                            {currentUser?.role === 'owner' && (
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
                                <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href={['owner', 'manager'].includes(currentUser?.role) ? '/pos' : '/kasir'}>
                                    <span className="material-symbols-outlined group-hover:text-primary">shopping_cart</span>
                                    <span className="text-[15px] font-sans">POS Kasir</span>
                                </Link>
                            )}

                            <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/settings">
                                <span className="material-symbols-outlined group-hover:text-primary">settings</span>
                                <span className="text-[15px] font-sans">Settings</span>
                            </Link>
                        </>
                    )}
                </div>

                <div className="p-6 mt-auto border-t border-surface-container-high">
                    <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-primary text-sm font-label-mono">
                            {userInitials}
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-bold text-on-surface truncate">{currentUser?.name || 'Super Admin'}</p>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Super Admin</p>
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
                            placeholder="Cari owner terdaftar..." 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold font-label-mono">POS-SA</span>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="ml-0 lg:ml-72 pt-24 px-4 sm:px-[32px] pb-[32px] min-h-screen">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 mt-2">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Pantau Owner</h2>
                        <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Daftar pemilik toko (owner) terdaftar di sistem POS</p>
                    </div>
                </div>

                {/* Metric Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Total Owners */}
                    <div className="bg-red-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-primary shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">supervised_user_circle</span>
                            </div>
                            <span className="flex items-center text-primary font-bold text-[10px] bg-primary/10 px-2 py-0.5 rounded-full uppercase font-label-mono">Owner</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Owner</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.total_owners}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Owner terdaftar di database</p>
                    </div>

                    {/* Active Owners */}
                    <div className="bg-emerald-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-emerald-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <span className="flex items-center text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Aktif</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Owner Aktif</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.active_owners}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Owner dengan akses aktif</p>
                    </div>

                    {/* Inactive Owners */}
                    <div className="bg-amber-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-amber-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">block</span>
                            </div>
                            <span className="flex items-center text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Nonaktif</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Owner Nonaktif</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.inactive_owners}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Akses toko ditangguhkan</p>
                    </div>

                    {/* Latest Owner */}
                    <div className="bg-blue-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-blue-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">person_add</span>
                            </div>
                            <span className="flex items-center text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Terbaru</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Owner Baru</p>
                        <h3 className="text-2xl font-bold text-on-surface truncate pr-2">{metrics.newest_owner}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Owner terakhir yang mendaftar</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden mb-10 p-6 flex flex-col relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-on-surface">Daftar Akun Owner</h3>
                        <span className="text-xs font-semibold text-secondary/60 bg-surface-container-low px-3 py-1 rounded-full font-label-mono">
                            {filteredOwners.length} Owner Ditemukan
                        </span>
                    </div>

                    {filteredOwners.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-secondary py-12 font-label-mono text-xs">
                            <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">supervised_user_circle</span>
                            <p>Tidak ada data owner yang terdaftar.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[11px] uppercase tracking-wider font-label-mono">
                                        <th className="px-6 py-4">Nama Owner</th>
                                        <th className="px-6 py-4">Alamat Email</th>
                                        <th className="px-6 py-4">Bergabung Sejak</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Kontrol Akses</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-low">
                                    {filteredOwners.map((owner: Owner) => (
                                        <tr key={owner.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-4 text-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                                                {owner.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-1.5 text-secondary">
                                                    <span className="material-symbols-outlined text-sm">mail</span>
                                                    <span>{owner.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-secondary font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    <span>{new Date(owner.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                                    owner.is_active 
                                                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                                                        : 'text-error bg-red-50 border-red-200'
                                                }`}>
                                                    {owner.is_active ? 'Aktif' : 'Pending / Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleOpen(owner)}
                                                    className={`px-4 py-1.5 font-bold text-xs rounded-lg active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 mx-auto border cursor-pointer ${
                                                        owner.is_active
                                                            ? 'bg-red-50 hover:bg-red-100 text-error border-red-200'
                                                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {owner.is_active ? 'block' : 'check_circle'}
                                                    </span>
                                                    {owner.is_active ? 'Nonaktifkan' : 'Setujui / Aktifkan'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <footer className="mt-8 flex justify-between items-center text-secondary/60 opacity-50 px-2 pb-6 text-[10px]">
                    <p className="uppercase tracking-[0.2em] font-bold">Precision POS v2.4.0-Enterprise</p>
                    <p>Terakhir Sinkronisasi: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                </footer>
            </main>

            {/* Toggle Status Confirmation Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className={`text-base font-bold ${selectedOwner?.is_active ? 'text-error' : 'text-primary'}`}>
                            {selectedOwner?.is_active ? 'Nonaktifkan Owner' : 'Aktifkan & Setujui Owner'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60">
                            {selectedOwner?.is_active ? (
                                <span>
                                    Apakah Anda yakin ingin menonaktifkan akun owner <span className="font-semibold text-on-surface">"{selectedOwner?.name}"</span>? 
                                    Semua toko dan kasir/staf yang berada di bawah owner ini akan otomatis kehilangan akses login ke sistem seketika.
                                </span>
                            ) : (
                                <span>
                                    Apakah Anda yakin ingin mengaktifkan dan menyetujui akun owner <span className="font-semibold text-on-surface">"{selectedOwner?.name}"</span>?
                                    Akses login owner beserta kasir/staf tokonya akan dipulihkan atau mulai aktif secara normal.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsConfirmOpen(false)}>
                             Batal
                        </Button>
                        <Button 
                            className={`text-xs text-white font-bold cursor-pointer ${selectedOwner?.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`} 
                            onClick={handleToggleSubmit}
                        >
                            {selectedOwner?.is_active ? 'Ya, Nonaktifkan' : 'Ya, Setujui & Aktifkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

