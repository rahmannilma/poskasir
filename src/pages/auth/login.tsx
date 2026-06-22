import { useState, useEffect } from 'react';
import { Form, Head, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { superAdminWa } = usePage<any>().props;
    const [activatedOutlet, setActivatedOutlet] = useState<string | null>(null);

    useEffect(() => {
        const outlet = localStorage.getItem('attendance_outlet_name');
        if (outlet) {
            setActivatedOutlet(outlet);
        }
    }, []);

    return (
        <>
            <Head title="Log in" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ data, processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold text-secondary">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="bg-surface-container-lowest border-surface-container-high focus-visible:ring-primary/20 focus-visible:border-primary"
                                />
                                <InputError message={errors.email} />
                                {errors.email && errors.email.includes('menunggu persetujuan') && (
                                    <div className="mt-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col items-center gap-3 animate-fade-in shadow-soft">
                                        <p className="text-[13px] text-emerald-800 text-center font-medium leading-relaxed">
                                            Minta persetujuan instan? Klik tombol di bawah untuk menghubungi Super Admin via WhatsApp.
                                        </p>
                                        <a
                                            href={`https://wa.me/${superAdminWa || '6281234567890'}?text=${encodeURIComponent(
                                                `Halo Super Admin, saya baru saja mendaftar sebagai Owner di POS App.\n\nDetail Akun:\n- Email: ${data.email || ''}\n\nMohon bantuannya untuk memberikan persetujuan akun saya. Terima kasih!`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-emerald-500/10 cursor-pointer w-full"
                                        >
                                            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.485 5.407 1.486 5.417 0 9.824-4.38 9.828-9.742.002-2.599-1.01-5.042-2.85-6.885C17.194 2.17 14.757 1.157 12.16 1.157c-5.43 0-9.85 4.394-9.854 9.757-.001 1.942.508 3.84 1.477 5.513l-.973 3.555 3.647-.957zm12.012-7.067c-.3-.15-1.77-.872-2.046-.975-.276-.102-.477-.153-.677.15-.2.3-.777.975-.951 1.178-.175.203-.35.228-.65.077-.3-.15-1.264-.467-2.409-1.485-.89-.79-1.49-1.77-1.665-2.07-.175-.3-.019-.463.13-.613.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.677-1.63-.927-2.23-.243-.587-.492-.507-.677-.517-.174-.01-.375-.012-.576-.012-.2 0-.525.075-.8.375-.276.3-1.052 1.025-1.052 2.5 0 1.475 1.077 2.9 1.227 3.1.15.2 2.118 3.23 5.132 4.533.716.31 1.275.495 1.71.635.72.23 1.375.197 1.892.12.576-.086 1.77-.723 2.02-.14.25-.58.25-1.076.175-1.176-.075-.1-.275-.15-.575-.3z"/>
                                            </svg>
                                            Hubungi Super Admin via WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="font-semibold text-secondary">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-primary hover:underline transition-colors no-underline font-semibold"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="bg-surface-container-lowest border-surface-container-high focus-visible:ring-primary/20 focus-visible:border-primary"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-surface-container-highest data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label htmlFor="remember" className="text-secondary select-none font-medium cursor-pointer">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        {activatedOutlet && (
                            <div className="pt-4 border-t border-surface-container-high flex flex-col gap-2">
                                <p className="text-[10px] text-center text-secondary/60 font-bold uppercase tracking-wider font-label-mono">
                                    Terminal Absensi Aktif
                                </p>
                                <a
                                    href="/absensi/terminal"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-xl shadow-md shadow-secondary/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                                    Buka Terminal: {activatedOutlet}
                                </a>
                            </div>
                        )}

                        <div className="text-center text-xs text-secondary/60 font-medium flex flex-col gap-2">
                            <span>Silakan masuk menggunakan kredensial Owner atau Kasir yang telah ditentukan.</span>
                            <span className="flex justify-center gap-1">
                                Belum memiliki akun?
                                <TextLink
                                    href="/register"
                                    className="text-primary hover:underline transition-colors no-underline font-semibold"
                                >
                                    Daftar sebagai Owner
                                </TextLink>
                            </span>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-emerald-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
