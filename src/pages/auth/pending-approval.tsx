import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';

export default function PendingApproval({ user, superAdminWa }: { user: { name: string; email: string }; superAdminWa: string }) {
    return (
        <>
            <Head title="Menunggu Persetujuan" />

            <div className="flex flex-col gap-6 text-center">
                <div className="flex flex-col items-center justify-center p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 gap-2 shadow-soft">
                    <span className="material-symbols-outlined text-4xl animate-pulse">hourglass_empty</span>
                    <p className="text-sm font-bold">Pendaftaran Anda Sedang Ditinjau</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        Akun Owner untuk <strong>{user.name}</strong> ({user.email}) belum aktif atau sedang menunggu persetujuan dari Super Admin.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-xs text-secondary/70 leading-relaxed">
                        Minta persetujuan instan? Klik tombol di bawah untuk menghubungi Super Admin via WhatsApp.
                    </p>
                    
                    <a
                        href={`https://wa.me/${superAdminWa || '6281234567890'}?text=${encodeURIComponent(
                            `Halo Super Admin, saya baru saja mendaftar sebagai Owner di POS App.\n\nDetail Akun:\n- Nama: ${user.name}\n- Email: ${user.email}\n\nMohon bantuannya untuk menyetujui dan mengaktifkan akun saya. Terima kasih!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.485 5.407 1.486 5.417 0 9.824-4.38 9.828-9.742.002-2.599-1.01-5.042-2.85-6.885C17.194 2.17 14.757 1.157 12.16 1.157c-5.43 0-9.85 4.394-9.854 9.757-.001 1.942.508 3.84 1.477 5.513l-.973 3.555 3.647-.957zm12.012-7.067c-.3-.15-1.77-.872-2.046-.975-.276-.102-.477-.153-.677.15-.2.3-.777.975-.951 1.178-.175.203-.35.228-.65.077-.3-.15-1.264-.467-2.409-1.485-.89-.79-1.49-1.77-1.665-2.07-.175-.3-.019-.463.13-.613.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.677-1.63-.927-2.23-.243-.587-.492-.507-.677-.517-.174-.01-.375-.012-.576-.012-.2 0-.525.075-.8.375-.276.3-1.052 1.025-1.052 2.5 0 1.475 1.077 2.9 1.227 3.1.15.2 2.118 3.23 5.132 4.533.716.31 1.275.495 1.71.635.72.23 1.375.197 1.892.12.576-.086 1.77-.723 2.02-.14.25-.58.25-1.076.175-1.176-.075-.1-.275-.15-.575-.3z"/>
                        </svg>
                        Hubungi Super Admin via WhatsApp
                    </a>
                </div>

                <div className="pt-4 border-t border-surface-container-high flex flex-col gap-2">
                    <TextLink
                        href="/logout"
                        method="post"
                        as="button"
                        className="mx-auto block text-sm text-primary hover:underline transition-colors no-underline font-semibold cursor-pointer"
                    >
                        Keluar & Log In dengan Akun Lain
                    </TextLink>
                </div>
            </div>
        </>
    );
}

PendingApproval.layout = {
    title: 'Menunggu Persetujuan',
    description: 'Pendaftaran akun Anda sedang menunggu persetujuan dari Super Admin.',
};
