import { Form, Head, usePage, useForm, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';
import { toast } from 'sonner';

type PageProps = {
    auth: Auth & { user: { qris_path?: string | null } };
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    const qrisForm = useForm({
        qris_image: null as File | null,
    });

    const handleQrisSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        qrisForm.post('/settings/profile/qris', {
            forceFormData: true,
            onSuccess: () => {
                qrisForm.reset();
                toast.success('QRIS merchant berhasil diperbarui!');
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || 'Gagal memperbarui QRIS.';
                toast.error(firstErr);
            }
        });
    };

    const handleDeleteQris = () => {
        if (!confirm('Apakah Anda yakin ingin menghapus gambar QRIS?')) return;
        router.delete('/settings/profile/qris', {
            onSuccess: () => {
                toast.success('QRIS merchant berhasil dihapus.');
            },
            onError: (err) => {
                const firstErr = Object.values(err)[0] || 'Gagal menghapus QRIS.';
                toast.error(firstErr);
            }
        });
    };

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            {['owner', 'super_admin'].includes(auth.user.role) && (
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="outlet_name">Outlet Name (Cafe/Restoran)</Label>

                                        <Input
                                            id="outlet_name"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.outlet_name}
                                            name="outlet_name"
                                            required
                                            placeholder="Outlet name"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.outlet_name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="allowed_attendance_ip">IP Address Wi-Fi Toko (Whitelisting Absensi)</Label>

                                        <Input
                                            id="allowed_attendance_ip"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.allowed_attendance_ip}
                                            name="allowed_attendance_ip"
                                            placeholder="Contoh: 182.253.140.23 (Kosongkan jika absensi bebas dari jaringan mana saja)"
                                        />

                                        <p className="text-[10px] text-muted-foreground/60 leading-normal">
                                            Masukkan IP Publik koneksi Wi-Fi toko Anda. Jika diisi, staf hanya bisa melakukan scan absensi masuk/pulang saat terhubung ke Wi-Fi ini.
                                        </p>

                                        <InputError
                                            className="mt-2"
                                            message={errors.allowed_attendance_ip}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {['owner', 'super_admin'].includes(auth.user.role) && (
                    <div className="space-y-6 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                        <Heading
                            variant="small"
                            title="QRIS Pemesanan Mandiri (Self-Ordering)"
                            description="Unggah kode QRIS outlet Anda untuk menerima pembayaran digital secara mandiri dari meja pelanggan."
                        />

                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                            <div className="shrink-0 flex flex-col items-center gap-2">
                                {auth.user.qris_path ? (
                                    <div className="w-40 h-40 bg-white border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 flex items-center justify-center shadow-sm overflow-hidden relative group">
                                        <img 
                                            src={auth.user.qris_path} 
                                            alt="QRIS Merchant" 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-muted-foreground text-[10px] text-center p-4">
                                        <span className="material-symbols-outlined text-3xl mb-1 text-primary">qr_code_2</span>
                                        <span>QRIS Belum Diunggah</span>
                                    </div>
                                )}
                                
                                {auth.user.qris_path && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteQris}
                                        className="text-[10px] font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 mt-1 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[12px]">delete</span>
                                        Hapus Gambar QRIS
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleQrisSubmit} className="flex-grow space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="qris-image-input" className="text-xs font-semibold text-muted-foreground uppercase">Pilih Gambar QRIS Baru</Label>
                                    <input 
                                        type="file"
                                        id="qris-image-input"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            qrisForm.setData('qris_image', file);
                                        }}
                                        className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    />
                                    <span className="text-[10px] text-muted-foreground/60">
                                        Format file: JPG, JPEG, atau PNG (Maks. 2MB). Pastikan QRIS Anda jelas untuk dipindai.
                                    </span>
                                    {qrisForm.errors.qris_image && (
                                        <span className="text-xs text-red-600 font-medium">{qrisForm.errors.qris_image}</span>
                                    )}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={qrisForm.processing || !qrisForm.data.qris_image}
                                    className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-5 py-2.5 rounded-lg active:scale-95 transition-all shadow-md cursor-pointer"
                                >
                                    {qrisForm.processing ? 'Mengunggah...' : 'Unggah & Simpan QRIS'}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
