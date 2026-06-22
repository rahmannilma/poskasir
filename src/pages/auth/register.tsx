import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';
import { login } from '@/routes';

export default function Register() {
    return (
        <>
            <Head title="Daftar Owner Baru" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ data, setData, processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* Nama Lengkap */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="font-semibold text-secondary">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    placeholder="Masukkan nama lengkap..."
                                    className="bg-surface-container-lowest border-surface-container-high focus-visible:ring-primary/20 focus-visible:border-primary"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Nama Outlet */}
                            <div className="grid gap-2">
                                <Label htmlFor="outlet_name" className="font-semibold text-secondary">Nama Outlet (Cafe/Restoran)</Label>
                                <Input
                                    id="outlet_name"
                                    type="text"
                                    name="outlet_name"
                                    required
                                    tabIndex={2}
                                    placeholder="Masukkan nama outlet Anda..."
                                    className="bg-surface-container-lowest border-surface-container-high focus-visible:ring-primary/20 focus-visible:border-primary"
                                />
                                <InputError message={errors.outlet_name} />
                            </div>

                            {/* Metode Absensi */}
                            <div className="grid gap-2">
                                <Label htmlFor="attendance_method" className="font-semibold text-secondary">Metode Absensi Awal Staf</Label>
                                <select
                                    id="attendance_method"
                                    name="attendance_method"
                                    required
                                    tabIndex={3}
                                    className="flex h-9 w-full rounded-md border border-surface-container-high bg-surface-container-lowest focus:bg-white px-3 py-2 text-xs font-semibold shadow-sm transition-colors outline-none cursor-pointer text-on-surface"
                                    defaultValue="manual"
                                >
                                    <option value="manual">Absensi Manual (Input Catatan + Tombol)</option>
                                    <option value="qr">Absensi QR Code (Pindai QR Code Toko)</option>
                                </select>
                                <InputError message={errors.attendance_method} />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold text-secondary">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    tabIndex={4}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="bg-surface-container-lowest border-surface-container-high focus-visible:ring-primary/20 focus-visible:border-primary"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Kata Sandi */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-semibold text-secondary">Kata Sandi (Min 8 Karakter)</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={5}
                                    placeholder="Password"
                                    className="bg-surface-container-lowest border-surface-container-high focus-visible:ring-primary/20 focus-visible:border-primary"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Konfirmasi Kata Sandi */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="font-semibold text-secondary">Konfirmasi Kata Sandi</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    tabIndex={6}
                                    placeholder="Konfirmasi Password"
                                    className="bg-surface-container-lowest border-surface-container-high focus-visible:ring-primary/20 focus-visible:border-primary"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Tombol Submit */}
                            <Button
                                type="submit"
                                className="mt-4 w-full py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                                tabIndex={7}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Daftar sebagai Owner
                            </Button>
                        </div>

                        {/* Back to Login */}
                        <div className="text-center text-xs text-secondary/60 font-medium flex justify-center gap-1">
                            Sudah memiliki akun?
                            <TextLink
                                href={login.url()}
                                className="text-primary hover:underline transition-colors no-underline font-semibold"
                            >
                                Log in disini
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Daftar Akun Owner Baru',
    description: 'Buat akun Owner baru untuk memulai mengelola toko/cafe Anda sendiri',
};
