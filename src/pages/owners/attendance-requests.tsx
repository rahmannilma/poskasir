import { useMemo, useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Owner {
    id: number;
    name: string;
    email: string;
    outlet_name: string;
}

interface MethodRequest {
    id: number;
    owner_id: number;
    current_method: string;
    requested_method: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    owner?: Owner;
}

interface Metrics {
    total_count: number;
    pending_count: number;
    approved_count: number;
    rejected_count: number;
}

export default function AttendanceRequests() {
    const { 
        methodRequests = [], 
        metrics = { total_count: 0, pending_count: 0, approved_count: 0, rejected_count: 0 }, 
        auth = { user: null } 
    } = usePage<any>().props;

    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<MethodRequest | null>(null);

    const currentUser = auth.user;

    // Filter requests list locally
    const filteredRequests = useMemo(() => {
        return methodRequests.filter((req: MethodRequest) => {
            const outletName = req.owner?.outlet_name?.toLowerCase() || '';
            const ownerName = req.owner?.name?.toLowerCase() || '';
            const ownerEmail = req.owner?.email?.toLowerCase() || '';
            const query = search.toLowerCase();

            return (
                outletName.includes(query) ||
                ownerName.includes(query) ||
                ownerEmail.includes(query)
            );
        });
    }, [methodRequests, search]);

    // User initials helper
    const userInitials = useMemo(() => {
        if (!currentUser?.name) return 'SA';
        return currentUser.name
            .split(' ')
            .map((n: string) => n.charAt(0))
            .slice(0, 2)
            .join('');
    }, [currentUser]);

    // Handle open dialogs
    const handleApproveOpen = (req: MethodRequest) => {
        setSelectedRequest(req);
        setIsApproveOpen(true);
    };

    const handleRejectOpen = (req: MethodRequest) => {
        setSelectedRequest(req);
        setIsRejectOpen(true);
    };

    // Submit actions
    const handleApproveSubmit = () => {
        if (!selectedRequest) return;

        router.post(`/absensi/method-requests/${selectedRequest.id}/approve`, {}, {
            onSuccess: () => {
                setIsApproveOpen(false);
                toast.success(`Pengajuan dari "${selectedRequest.owner?.outlet_name}" berhasil disetujui!`);
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menyetujui pengajuan.";
                toast.error(firstErr);
            }
        });
    };

    const handleRejectSubmit = () => {
        if (!selectedRequest) return;

        router.post(`/absensi/method-requests/${selectedRequest.id}/reject`, {}, {
            onSuccess: () => {
                setIsRejectOpen(false);
                toast.success(`Pengajuan dari "${selectedRequest.owner?.outlet_name}" berhasil ditolak!`);
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || "Gagal menolak pengajuan.";
                toast.error(firstErr);
            }
        });
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Head>
                <title>Precision POS - Persetujuan Absen</title>
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
                    {/* Super Admin Owner Monitor Tab */}
                    <Link className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-lg font-medium transition-all group" href="/owners">
                        <span className="material-symbols-outlined group-hover:text-primary">supervised_user_circle</span>
                        <span className="text-[15px] font-sans">Pantau Owner</span>
                    </Link>

                    {/* Super Admin Attendance Request Tab (Active) */}
                    <Link className="flex items-center gap-4 px-4 py-3 bg-primary/5 text-primary rounded-lg font-semibold transition-all group" href="/superadmin/absensi-approval">
                        <span className="material-symbols-outlined active-icon">pending_actions</span>
                        <span className="text-[15px] font-sans">Persetujuan Absen</span>
                    </Link>
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
                            placeholder="Cari berdasarkan outlet / owner..." 
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Persetujuan Absen</h2>
                        <p className="text-xs text-secondary/60 font-medium font-label-mono mt-1">Kelola permohonan peralihan metode absen owner ke QR Code</p>
                    </div>
                </div>

                {/* Metric Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Total Requests */}
                    <div className="bg-blue-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-blue-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <span className="flex items-center text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Total</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Total Pengajuan</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.total_count}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Total pengajuan masuk</p>
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-amber-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-amber-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                            <span className="flex items-center text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Menunggu</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Menunggu Persetujuan</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.pending_count}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Pengajuan butuh tindakan</p>
                    </div>

                    {/* Approved Requests */}
                    <div className="bg-emerald-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-emerald-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <span className="flex items-center text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Disetujui</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Disetujui</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.approved_count}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Peralihan metode aktif</p>
                    </div>

                    {/* Rejected Requests */}
                    <div className="bg-red-50/20 rounded-2xl p-6 border-y border-r border-surface-container-high border-l-4 border-l-red-500 shadow-soft hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary">
                                <span className="material-symbols-outlined">cancel</span>
                            </div>
                            <span className="flex items-center text-error font-bold text-[10px] bg-red-50 px-2 py-0.5 rounded-full uppercase font-label-mono">Ditolak</span>
                        </div>
                        <p className="text-sm font-medium text-secondary/70 mb-1">Ditolak</p>
                        <h3 className="text-2xl font-bold text-on-surface font-label-mono">{metrics.rejected_count}</h3>
                        <p className="text-[10px] text-secondary/50 mt-2 font-medium">Pengajuan tidak disetujui</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl border border-surface-container-high shadow-soft overflow-hidden mb-10 p-6 flex flex-col relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-on-surface">Daftar Pengajuan Peralihan Metode Absensi</h3>
                        <span className="text-xs font-semibold text-secondary/60 bg-surface-container-low px-3 py-1 rounded-full font-label-mono">
                            {filteredRequests.length} Pengajuan Ditemukan
                        </span>
                    </div>

                    {filteredRequests.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-secondary py-12 font-label-mono text-xs">
                            <span className="material-symbols-outlined text-6xl stroke-1 mb-2 opacity-30 animate-pulse text-primary">pending_actions</span>
                            <p>Tidak ada pengajuan peralihan absen.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 border-b border-surface-container-low text-secondary/60 font-bold text-[11px] uppercase tracking-wider font-label-mono">
                                        <th className="px-6 py-4">Nama Toko / Outlet</th>
                                        <th className="px-6 py-4">Owner</th>
                                        <th className="px-6 py-4 text-center">Peralihan Metode</th>
                                        <th className="px-6 py-4">Tanggal Pengajuan</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-low">
                                    {filteredRequests.map((req: MethodRequest) => (
                                        <tr key={req.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-4 text-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                                                {req.owner?.outlet_name || 'Outlet Tanpa Nama'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-semibold text-on-surface">{req.owner?.name}</div>
                                                <div className="flex items-center gap-1 text-secondary text-xs mt-0.5">
                                                    <span className="material-symbols-outlined text-[12px]">mail</span>
                                                    <span>{req.owner?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2.5 py-0.5 rounded font-label-mono uppercase">
                                                        {req.current_method}
                                                    </span>
                                                    <span className="material-symbols-outlined text-xs text-secondary/40">arrow_forward</span>
                                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded font-label-mono uppercase">
                                                        {req.requested_method}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-secondary font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    <span>{new Date(req.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                                    req.status === 'approved' 
                                                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                                                        : req.status === 'rejected'
                                                        ? 'text-error bg-red-50 border-red-200'
                                                        : 'text-amber-700 bg-amber-50 border-amber-200'
                                                }`}>
                                                    {req.status === 'approved' ? 'Disetujui' : req.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.status === 'pending' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleApproveOpen(req)}
                                                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-lg active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                            Setujui
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectOpen(req)}
                                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-error border border-red-200 font-bold text-xs rounded-lg active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                            Tolak
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-xs font-semibold text-secondary/40 font-mono">
                                                        Sudah Diproses
                                                    </div>
                                                )}
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

            {/* Approve Confirmation Dialog */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base font-bold text-primary flex items-center gap-1.5">
                            <span className="material-symbols-outlined">check_circle</span> Setujui Peralihan Absen
                        </DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60 mt-1">
                            Apakah Anda yakin ingin menyetujui pengajuan peralihan metode absensi untuk outlet <span className="font-semibold text-on-surface">"{selectedRequest?.owner?.outlet_name}"</span> milik <span className="font-semibold text-on-surface">"{selectedRequest?.owner?.name}"</span>?
                            Setelah disetujui, metode absensi untuk outlet ini akan dialihkan dari **{selectedRequest?.current_method?.toUpperCase()}** ke **{selectedRequest?.requested_method?.toUpperCase()}** secara instan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsApproveOpen(false)}>
                             Batal
                        </Button>
                        <Button 
                            className="text-xs text-white font-bold bg-primary hover:bg-primary/90 cursor-pointer" 
                            onClick={handleApproveSubmit}
                        >
                            Setujui Peralihan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Confirmation Dialog */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white border border-surface-container-high text-on-surface shadow-2xl rounded-2xl">
                    <DialogHeader className="pb-2 border-b border-surface-container-high">
                        <DialogTitle className="text-base font-bold text-error flex items-center gap-1.5">
                            <span className="material-symbols-outlined">cancel</span> Tolak Pengajuan
                        </DialogTitle>
                        <DialogDescription className="text-xs text-secondary/60 mt-1">
                            Apakah Anda yakin ingin menolak pengajuan peralihan metode absensi untuk outlet <span className="font-semibold text-on-surface">"{selectedRequest?.owner?.outlet_name}"</span> milik <span className="font-semibold text-on-surface">"{selectedRequest?.owner?.name}"</span>?
                            Owner dapat mengajukan kembali permohonan peralihan metode jika diperlukan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="text-xs hover:bg-surface-container-low hover:text-on-surface text-secondary" onClick={() => setIsRejectOpen(false)}>
                             Batal
                        </Button>
                        <Button 
                            className="text-xs text-white font-bold bg-red-600 hover:bg-red-700 cursor-pointer" 
                            onClick={handleRejectSubmit}
                        >
                            Tolak Pengajuan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

