import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, ShoppingCart, ShoppingBag, History, Users, Layers, Clock, ChefHat, UserCheck } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth.user;

    const mainNavItems: NavItem[] = [];

    if (user) {
        if (user.role === 'super_admin') {
            mainNavItems.push(
                {
                    title: 'Pantau Owner',
                    href: '/owners',
                    icon: Users,
                },
                {
                    title: 'Persetujuan Absen',
                    href: '/superadmin/absensi-approval',
                    icon: Clock,
                }
            );
        } else if (user.role === 'owner') {
            mainNavItems.push(
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'Dapur (KDS)',
                    href: '/kitchen',
                    icon: ChefHat,
                },
                {
                    title: 'Kelola Produk',
                    href: '/products',
                    icon: ShoppingBag,
                },
                {
                    title: 'Bahan Baku',
                    href: '/materials',
                    icon: Layers,
                },
                {
                    title: 'Pelanggan',
                    href: '/customers',
                    icon: UserCheck,
                },
                {
                    title: 'Riwayat Transaksi',
                    href: '/transactions',
                    icon: History,
                },
                {
                    title: 'Absensi',
                    href: '/absensi',
                    icon: Clock,
                },
                {
                    title: 'Kelola Staf',
                    href: '/staff',
                    icon: Users,
                }
            );
        } else if (user.role === 'manager') {
            mainNavItems.push(
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'POS Penjualan',
                    href: '/pos',
                    icon: ShoppingCart,
                },
                {
                    title: 'Dapur (KDS)',
                    href: '/kitchen',
                    icon: ChefHat,
                },
                {
                    title: 'Kelola Produk',
                    href: '/products',
                    icon: ShoppingBag,
                },
                {
                    title: 'Bahan Baku',
                    href: '/materials',
                    icon: Layers,
                },
                {
                    title: 'Pelanggan',
                    href: '/customers',
                    icon: UserCheck,
                },
                {
                    title: 'Riwayat Transaksi',
                    href: '/transactions',
                    icon: History,
                },
                {
                    title: 'Absensi',
                    href: '/absensi',
                    icon: Clock,
                }
            );
        } else if (user.role === 'cashier') {
            mainNavItems.push(
                {
                    title: 'POS Penjualan',
                    href: '/kasir',
                    icon: ShoppingCart,
                },
                {
                    title: 'Dapur (KDS)',
                    href: '/kitchen',
                    icon: ChefHat,
                },
                {
                    title: 'Riwayat Transaksi',
                    href: '/transactions',
                    icon: History,
                },
                {
                    title: 'Absensi',
                    href: '/absensi',
                    icon: Clock,
                }
            );
        }
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
