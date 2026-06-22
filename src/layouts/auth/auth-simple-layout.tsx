import { Head, Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage<any>().props;
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 relative">
            {/* Custom Styles Injector to strictly match Luminous Clarity theme */}
            <style dangerouslySetInnerHTML={{__html: `
                body, html {
                    background-color: #f7f9fb !important;
                    color: #191c1e !important;
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    -webkit-font-smoothing: antialiased;
                    overflow: auto !important;
                    height: auto !important;
                }
                #app, main {
                    background-color: #f7f9fb !important;
                    color: #191c1e !important;
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    -webkit-font-smoothing: antialiased;
                }
                :root, .dark, body, html, #app, main {
                    --background: #f7f9fb !important;
                    --foreground: #191c1e !important;
                    --font-sans: 'Plus Jakarta Sans', sans-serif !important;
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
                    --ring: #0d9488 !important;
                }
                .font-display {
                    font-family: 'Outfit', sans-serif !important;
                }
                .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined';
                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
                    display: inline-block;
                    line-height: 1;
                }
                .shadow-soft {
                    box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05);
                }
                .font-label-mono {
                    font-family: 'JetBrains Mono', monospace;
                }
            `}} />
            
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
            </Head>

            <div className="w-full max-w-md bg-white rounded-2xl border border-surface-container-high p-8 shadow-soft flex flex-col gap-6">
                <div className="flex flex-col items-center gap-6">
                    <Link
                        href={home()}
                        className="flex items-center gap-3 font-medium cursor-pointer group"
                    >
                        <img 
                            src="/logo.png?v=2" 
                            alt="NexaPOS Logo" 
                            className="w-12 h-12 rounded-xl object-contain shadow-md border border-slate-200/80 transform group-hover:scale-105 transition duration-300"
                        />
                        <div className="text-left">
                            <h1 className="text-xl font-black font-display tracking-wide text-on-surface">
                                Nexa<span className="text-teal-600">POS</span>
                            </h1>
                        </div>
                    </Link>

                    <div className="space-y-1.5 text-center mt-2">
                        <h2 className="text-2xl font-bold text-on-surface tracking-tight">{title}</h2>
                        <p className="text-center text-sm text-secondary/70">
                            {description}
                        </p>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}

