import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSupabaseData } from './SupabaseDataContext';
import { supabase } from './supabaseClient';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// 1. Mock <Head> Component
export function Head({ children }: any) {
    useEffect(() => {
        if (!children) return;
        const titleEl = React.Children.toArray(children).find(
            (child: any) => child && child.type === 'title'
        ) as any;
        if (titleEl && titleEl.props && titleEl.props.children) {
            document.title = String(titleEl.props.children);
        }
    }, [children]);
    return null;
}

// 2. Mock <Link> Component
export function Link({ href, children, className, method, as, ...props }: any) {
    const navigate = useNavigate();

    const urlPath = typeof href === 'object' && href !== null ? href.url : href;

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (method && method.toLowerCase() === 'post') {
            if (urlPath === '/logout') {
                // Handle Logout
                await supabase.auth.signOut();
                localStorage.removeItem('demoUser');
                window.location.href = '/login';
            }
        } else {
            navigate(urlPath);
        }
    };

    return (
        <a href={urlPath} className={className} onClick={handleClick} {...props}>
            {children}
        </a>
    );
}

// 3. Mock usePage() Hook
export function usePage<T = any>(): { props: any } {
    const data = useSupabaseData();
    
    // Group variables in format matching Laravel Inertia page props
    const props = {
        auth: {
            user: data.user
        },
        products: data.products,
        categories: window.location.pathname.startsWith('/categories')
            ? data.categories.map((c: any) => {
                const count = data.products.filter((p: any) => p.category === c.name || p.category === c.id).length;
                return {
                    id: c.id,
                    name: c.name,
                    products_count: count,
                    created_at: c.created_at || new Date().toISOString()
                };
              })
            : data.categories.map(c => c.name), // Laravel app uses category names array
        rawCategories: data.categories,
        materials: data.materials,
        dining_tables: data.diningTables,
        transactions: data.transactions,
        shifts: {
            data: data.shifts,
            prev_page_url: null,
            next_page_url: null
        },
        active_shift: data.activeShift,
        pending_orders: data.pendingOrders,
        customers: data.customers,
        attendance_logs: data.attendances,
        profiles: data.profiles,
        staff: data.profiles,
        metrics: data.metrics,
        recentTransactions: data.transactions.slice(0, 10),
        topSellingProducts: data.products.slice(0, 3).map(p => ({
            product_name: p.name,
            total_sold: 5,
            total_revenue: p.price * 5
        })), // Fallback top selling
        lowStockProducts: data.products.filter(p => p.stock <= p.min_stock),
        flash: {
            success: null,
            error: null,
            invoice: null
        }
    };

    return { props };
}

// 4. Mock useForm() Hook
export function useForm(initialValues: any = {}) {
    const [data, setDataState] = useState(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const setData = useCallback((keyOrData: any, value?: any) => {
        if (typeof keyOrData === 'object' && keyOrData !== null) {
            setDataState((prev: any) => ({ ...prev, ...keyOrData }));
        } else if (typeof keyOrData === 'string') {
            setDataState((prev: any) => ({ ...prev, [keyOrData]: value }));
        }
    }, []);

    const reset = useCallback(() => {
        setDataState(initialValues);
        setErrors({});
    }, [initialValues]);

    const submit = async (method: string, url: string, options: any = {}) => {
        setProcessing(true);
        try {
            await router.visit(url, {
                method,
                data,
                ...options
            });
        } catch (err: any) {
            if (options.onError) {
                options.onError(err);
            }
        } finally {
            setProcessing(false);
        }
    };

    return {
        data,
        setData,
        errors,
        processing,
        post: (url: string, options: any) => submit('post', url, options),
        put: (url: string, options: any) => submit('put', url, options),
        delete: (url: string, options: any) => submit('delete', url, options),
        reset,
    };
}

const listeners: Record<string, Set<Function>> = {};

// 5. Mock router Object
export const router = {
    on: (event: string, callback: Function) => {
        if (!listeners[event]) {
            listeners[event] = new Set();
        }
        listeners[event].add(callback);
        return () => {
            const list = listeners[event];
            if (list) {
                list.delete(callback);
            }
        };
    },
    visit: async (url: string, options: any = {}) => {
        const method = (options.method || 'get').toLowerCase();
        const data = options.data || {};
        
        console.log(`Mocking Inertia request: ${method.toUpperCase()} ${url}`, data);

        // Get Global Refresh handler
        const refreshElement = document.getElementById('supabase-data-refresher');
        const triggerRefresh = () => {
            if (refreshElement) {
                refreshElement.click();
            }
        };
        const getLoggedInUserProfile = async () => {
            const demoUserStr = localStorage.getItem('demoUser');
            if (demoUserStr) {
                return JSON.parse(demoUserStr);
            }
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
                return profile;
            }
            return null;
        };
        const currentUserProfile = await getLoggedInUserProfile();

        try {
            // Check auth state trigger
            if (url === '/login' && method === 'post') {
                const emailVal = data.email || data.username || '';
                const password = data.password;
                
                // Demo logic matching original
                const lowerUser = emailVal.toLowerCase();
                const isOwner = (lowerUser === 'owner' || lowerUser === 'owner@pos.id') && password === 'owner123';
                const isKasir = (lowerUser === 'kasir' || lowerUser === 'kasir@pos.id') && password === 'kasir123';
                const isAdmin = (lowerUser === 'admin' || lowerUser === 'admin@pos.id') && password === 'admin123';

                if (isOwner || isKasir || isAdmin) {
                    const mockUser = {
                        id: isOwner ? 'owner-id' : 'cashier-id',
                        name: isOwner ? 'Owner NexaPOS' : (isAdmin ? 'Marcus W.' : 'Kasir NexaPOS'),
                        email: emailVal,
                        role: isOwner ? 'owner' : 'cashier',
                        outlet_name: 'Precision Cafe',
                        allowed_attendance_ip: null
                    };
                    localStorage.setItem('demoUser', JSON.stringify(mockUser));
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    if (options.onSuccess) {
                        options.onSuccess({ props: { auth: { user: mockUser } } });
                    }
                    window.location.href = isOwner ? '/dashboard' : '/pos';
                    return;
                }

                // Supabase login fallback
                try {
                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                        email: emailVal,
                        password: password
                    });

                    if (authError) {
                        throw authError;
                    }

                    if (authData?.user) {
                        localStorage.removeItem('demoUser');
                        
                        const { data: profile, error: profError } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', authData.user.id)
                            .maybeSingle();

                        if (profile) {
                            if (options.onSuccess) {
                                options.onSuccess({ props: { auth: { user: { ...authData.user, ...profile } } } });
                            }
                            window.location.href = ['owner', 'super_admin', 'manager'].includes(profile.role) ? '/dashboard' : '/pos';
                        } else {
                            throw new Error('Profil pengguna tidak ditemukan.');
                        }
                    }
                } catch (err: any) {
                    console.error('Supabase Login Error:', err);
                    throw { error: err.message || 'Email atau Password salah!', email: err.message || 'Email atau Password salah!' };
                }
                return;
            }

            // Register route mock handler
            if (url === '/register' && method === 'post') {
                const { name, email, password, outlet_name, attendance_method } = data;
                
                try {
                    // Sign up user via Supabase Auth
                    const { data: authData, error: signUpError } = await supabase.auth.signUp({
                        email,
                        password
                    });

                    if (signUpError) {
                        throw signUpError;
                    }

                    if (authData?.user) {
                        // Insert profile row linking auth user
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .insert([
                                {
                                    id: authData.user.id,
                                    name,
                                    email,
                                    role: 'owner', // Registering is always as Owner
                                    outlet_name: outlet_name || 'Cafe Resto',
                                    attendance_method: attendance_method || 'manual'
                                }
                            ]);

                        if (profileError) {
                            throw profileError;
                        }

                        toast.success('Pendaftaran berhasil! Silakan masuk.');
                        
                        if (options.onSuccess) {
                            options.onSuccess({});
                        }
                        
                        window.location.href = '/login';
                    }
                } catch (err: any) {
                    console.error('Supabase Registration Error:', err);
                    throw { error: err.message || 'Pendaftaran gagal.', email: err.message || 'Pendaftaran gagal.' };
                }
                return;
            }

            // Route checkout handler
            if (url === '/checkout' && method === 'post') {
                const orderNumber = String(Math.floor(2800 + Math.random() * 200));
                const invoiceNumber = `INV-${orderNumber}`;
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                
                // If checking out direct
                if (data.status === 'completed') {
                    const txPayload = {
                        id: invoiceNumber,
                        customer: data.customer_name || 'Pelanggan Umum',
                        time: `Hari ini, ${timeStr}`,
                        total: data.amount_paid,
                        method: data.payment_method === 'cash' ? 'Tunai' : data.payment_method === 'card' ? 'Kartu' : 'QRIS',
                        status: 'Lunas',
                        items: data.items
                    };
                    
                    const { error: txErr } = await supabase.from('transactions').insert([txPayload]);
                    if (txErr) throw txErr;

                    // Subtract product stocks
                    for (const item of data.items) {
                        // Fetch current product
                        const { data: p } = await supabase.from('products').select('stock').eq('id', String(item.product_id)).single();
                        if (p) {
                            const newStock = Math.max(0, p.stock - item.quantity);
                            await supabase.from('products').update({ stock: newStock }).eq('id', String(item.product_id));
                        }
                    }

                    // Remove from pending if applicable
                    if (data.pending_order_id) {
                        await supabase.from('pending_orders').delete().eq('id', data.pending_order_id);
                    }

                    triggerRefresh();
                    
                    if (options.onSuccess) {
                        const fakePage = {
                            props: {
                                flash: {
                                    invoice: {
                                        invoice_number: invoiceNumber,
                                        customer_name: data.customer_name || 'Pelanggan Umum',
                                        table_number: data.table_number,
                                        payment_method: txPayload.method,
                                        amount_paid: data.amount_paid,
                                        total: data.amount_paid,
                                        changeAmount: 0,
                                        created_at: now.toISOString(),
                                        items: data.items
                                    }
                                }
                            }
                        };
                        options.onSuccess(fakePage);
                    }
                } else if (data.status === 'pending') {
                    // Pending order
                    const pendingPayload = {
                        id: data.pending_order_id || `pending-${Date.now()}`,
                        order_number: orderNumber,
                        customer_name: data.customer_name || 'Pelanggan',
                        table_number: data.table_number || '',
                        discount_percent: data.discount_percent || 0,
                        items: data.items
                    };
                    
                    const { error: poErr } = await supabase.from('pending_orders').upsert([pendingPayload]);
                    if (poErr) throw poErr;

                    triggerRefresh();
                    if (options.onSuccess) options.onSuccess({});
                }
                return;
            }

            // Void pending order
            if (url.startsWith('/checkout/void/') && method === 'post') {
                const orderId = url.split('/').pop();
                const { error } = await supabase.from('pending_orders').delete().eq('id', orderId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Open Shift
            if (url === '/shifts/open' && method === 'post') {
                const shiftPayload = {
                    initial_cash: data.initial_cash,
                    expected_cash: data.initial_cash,
                    status: 'open'
                };
                const { error } = await supabase.from('shifts').insert([shiftPayload]);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Close Shift
            if (url === '/shifts/close' && method === 'post') {
                // Find open shift
                const { data: openShifts } = await supabase.from('shifts').select('*').eq('status', 'open');
                if (openShifts && openShifts.length > 0) {
                    const active = openShifts[0];
                    const { error } = await supabase.from('shifts').update({
                        status: 'closed',
                        actual_cash: data.actual_cash,
                        discrepancy: data.actual_cash - active.expected_cash,
                        notes: data.notes,
                        end_date: new Date().toISOString()
                    }).eq('id', active.id);
                    if (error) throw error;
                }
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Products CRUD
            if (url === '/products' && method === 'post') {
                // Insert product
                const sku = data.sku || `PROD-${Math.floor(1000 + Math.random() * 9000)}`;
                const prodPayload = {
                    name: data.name,
                    sku: sku,
                    category: data.category,
                    price: parseFloat(data.selling_price),
                    stock: parseFloat(data.stock),
                    min_stock: parseFloat(data.min_stock),
                    description: data.description,
                    is_active: data.is_active
                };
                const { error } = await supabase.from('products').insert([prodPayload]);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            if (url.startsWith('/products/') && method === 'post') {
                const prodId = url.split('/').pop();
                const prodPayload = {
                    name: data.name,
                    sku: data.sku,
                    category: data.category,
                    price: parseFloat(data.selling_price),
                    stock: parseFloat(data.stock),
                    min_stock: parseFloat(data.min_stock),
                    description: data.description,
                    is_active: data.is_active
                };
                const { error } = await supabase.from('products').update(prodPayload).eq('id', prodId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            if (url.startsWith('/products/') && method === 'delete') {
                const prodId = url.split('/').pop();
                const { error } = await supabase.from('products').delete().eq('id', prodId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Categories CRUD
            if (url === '/categories' && method === 'post') {
                const catId = data.name.toLowerCase().trim().replace(/\s+/g, '-');
                const { error } = await supabase.from('categories').insert([{ id: catId, name: data.name }]);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            if (url.startsWith('/categories/') && method === 'put') {
                const catId = url.split('/').pop();
                const { error } = await supabase.from('categories').update({ name: data.name }).eq('id', catId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            if (url.startsWith('/categories/') && method === 'delete') {
                const catId = url.split('/').pop();
                const { error } = await supabase.from('categories').delete().eq('id', catId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Dining Tables CRUD
            if (url.startsWith('/tables/') && method === 'delete') {
                const tableId = url.split('/').pop();
                const { error } = await supabase.from('dining_tables').delete().eq('id', tableId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Materials CRUD
            if (url.startsWith('/materials/items/') && method === 'delete') {
                const itemId = url.split('/').pop();
                const { error } = await supabase.from('materials').delete().eq('id', itemId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Staff CRUD
            if (url === '/staff' && method === 'post') {
                const { name, email, password, role } = data;
                
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
                
                const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false,
                        detectSessionInUrl: false
                    }
                });

                const { data: authData, error: signUpError } = await tempClient.auth.signUp({
                    email,
                    password
                });

                if (signUpError) throw signUpError;

                if (authData?.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: authData.user.id,
                                name,
                                email,
                                role: role || 'cashier',
                                outlet_name: currentUserProfile?.outlet_name || 'Cafe Resto',
                                attendance_method: 'pin'
                            }
                        ]);

                    if (profileError) throw profileError;
                }

                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            if (url.startsWith('/staff/') && method === 'put') {
                const staffId = url.split('/').pop();
                const { name, email, role } = data;
                
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        name,
                        email,
                        role
                    })
                    .eq('id', staffId);

                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            if (url.startsWith('/staff/') && method === 'delete') {
                const staffId = url.split('/').pop();
                const { error } = await supabase.from('profiles').delete().eq('id', staffId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Profile Settings Update
            if (url.startsWith('/settings/profile') && method === 'post' && !url.includes('/qris')) {
                const { name, email, outlet_name, allowed_attendance_ip } = data;
                
                const demoUserStr = localStorage.getItem('demoUser');
                if (demoUserStr) {
                    const demoUser = JSON.parse(demoUserStr);
                    const updatedUser = {
                        ...demoUser,
                        name: name || demoUser.name,
                        email: email || demoUser.email,
                        outlet_name: outlet_name !== undefined ? outlet_name : demoUser.outlet_name,
                        allowed_attendance_ip: allowed_attendance_ip !== undefined ? allowed_attendance_ip : demoUser.allowed_attendance_ip
                    };
                    localStorage.setItem('demoUser', JSON.stringify(updatedUser));
                    toast.success('Profil demo berhasil diperbarui!');
                    triggerRefresh();
                    if (options.onSuccess) {
                        options.onSuccess({ props: { auth: { user: updatedUser } } });
                    }
                    return;
                }

                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const updatePayload: any = {
                        name,
                        email,
                    };
                    if (outlet_name !== undefined) {
                        updatePayload.outlet_name = outlet_name;
                    }
                    if (allowed_attendance_ip !== undefined) {
                        updatePayload.allowed_attendance_ip = allowed_attendance_ip;
                    }

                    const { error } = await supabase
                        .from('profiles')
                        .update(updatePayload)
                        .eq('id', authUser.id);

                    if (error) throw error;

                    // Sync outlet name to all other profiles
                    if (outlet_name) {
                        const { error: syncError } = await supabase
                            .from('profiles')
                            .update({ outlet_name })
                            .neq('id', authUser.id);
                        if (syncError) {
                            console.error('Error syncing staff outlet names:', syncError);
                        }
                    }

                    toast.success('Profil berhasil diperbarui!');
                    triggerRefresh();
                    if (options.onSuccess) {
                        const { data: updatedProfile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', authUser.id)
                            .maybeSingle();
                        options.onSuccess({ props: { auth: { user: { ...authUser, ...updatedProfile } } } });
                    }
                }
                return;
            }

            // QRIS Upload
            if (url === '/settings/profile/qris' && method === 'post') {
                const { qris_image } = data;
                let qrisPath = '';
                if (qris_image instanceof File) {
                    qrisPath = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(qris_image);
                    });
                } else if (typeof qris_image === 'string') {
                    qrisPath = qris_image;
                }

                const demoUserStr = localStorage.getItem('demoUser');
                if (demoUserStr) {
                    const demoUser = JSON.parse(demoUserStr);
                    const updatedUser = {
                        ...demoUser,
                        qris_path: qrisPath
                    };
                    localStorage.setItem('demoUser', JSON.stringify(updatedUser));
                    toast.success('QRIS demo berhasil diperbarui!');
                    triggerRefresh();
                    if (options.onSuccess) {
                        options.onSuccess({ props: { auth: { user: updatedUser } } });
                    }
                    return;
                }

                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const { error } = await supabase
                        .from('profiles')
                        .update({ qris_path: qrisPath })
                        .eq('id', authUser.id);

                    if (error) throw error;

                    toast.success('QRIS merchant berhasil diperbarui!');
                    triggerRefresh();
                    if (options.onSuccess) {
                        const { data: updatedProfile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', authUser.id)
                            .maybeSingle();
                        options.onSuccess({ props: { auth: { user: { ...authUser, ...updatedProfile } } } });
                    }
                }
                return;
            }

            // QRIS Delete
            if (url === '/settings/profile/qris' && method === 'delete') {
                const demoUserStr = localStorage.getItem('demoUser');
                if (demoUserStr) {
                    const demoUser = JSON.parse(demoUserStr);
                    const updatedUser = {
                        ...demoUser,
                        qris_path: null
                    };
                    localStorage.setItem('demoUser', JSON.stringify(updatedUser));
                    toast.success('QRIS demo berhasil dihapus!');
                    triggerRefresh();
                    if (options.onSuccess) {
                        options.onSuccess({ props: { auth: { user: updatedUser } } });
                    }
                    return;
                }

                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const { error } = await supabase
                        .from('profiles')
                        .update({ qris_path: null })
                        .eq('id', authUser.id);

                    if (error) throw error;

                    toast.success('QRIS merchant berhasil dihapus!');
                    triggerRefresh();
                    if (options.onSuccess) {
                        const { data: updatedProfile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', authUser.id)
                            .maybeSingle();
                        options.onSuccess({ props: { auth: { user: { ...authUser, ...updatedProfile } } } });
                    }
                }
                return;
            }

            // Customers CRUD
            if (url.startsWith('/customers/') && method === 'delete') {
                const custId = url.split('/').pop();
                const { error } = await supabase.from('customers').delete().eq('id', custId);
                if (error) throw error;
                triggerRefresh();
                if (options.onSuccess) options.onSuccess({});
                return;
            }

            // Fallback navigate
            if (method === 'get') {
                window.location.href = url;
            }

        } catch (err: any) {
            console.error('Inertia mock handler error:', err);
            toast.error(err.error || err.message || 'Operation failed');
            if (options.onError) {
                options.onError(err);
            }
        }
    },
    get: (url: string, data?: any, options?: any) => router.visit(url, { method: 'get', data, ...options }),
    post: (url: string, data?: any, options?: any) => router.visit(url, { method: 'post', data, ...options }),
    put: (url: string, data?: any, options?: any) => router.visit(url, { method: 'put', data, ...options }),
    delete: (url: string, options?: any) => router.visit(url, { method: 'delete', ...options }),
};

// Form component mock
export function Form({ children, action, method, onSubmit, ...props }: any) {
    // Determine initial values based on action/URL
    const getInitialValues = (act: string) => {
        const path = (act || '').toLowerCase();
        if (path.includes('login')) {
            return { email: '', password: '', remember: false };
        }
        if (path.includes('register')) {
            return { name: '', email: '', password: '', password_confirmation: '', terms: false };
        }
        if (path.includes('forgot-password')) {
            return { email: '' };
        }
        if (path.includes('reset-password')) {
            return { token: '', email: '', password: '', password_confirmation: '' };
        }
        if (path.includes('profile')) {
            return { name: '', email: '', current_password: '', password: '', password_confirmation: '' };
        }
        return {};
    };

    const initialValues = getInitialValues(action);
    const formHelpers = useForm(initialValues);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Collect form input data automatically from DOM
        const formData = new FormData(e.currentTarget);
        const dataObject: any = {};
        formData.forEach((value, key) => {
            if (value === 'on' || value === 'true') {
                dataObject[key] = true;
            } else if (value === 'false') {
                dataObject[key] = false;
            } else {
                dataObject[key] = value;
            }
        });

        // Merge collected data with current form state
        const mergedData = { ...formHelpers.data, ...dataObject };

        if (onSubmit) {
            onSubmit(e);
        } else {
            router.visit(action, {
                method: method || 'post',
                data: mergedData
            });
        }
    };

    // If children is a function, call it with form state helpers
    const renderedChildren = typeof children === 'function'
        ? children({
            data: formHelpers.data,
            setData: formHelpers.setData,
            errors: formHelpers.errors,
            processing: formHelpers.processing,
            reset: formHelpers.reset,
            post: formHelpers.post,
            put: formHelpers.put,
            delete: formHelpers.delete,
          })
        : children;

    return (
        <form onSubmit={handleSubmit} {...props}>
            {renderedChildren}
        </form>
    );
}

// Extra hooks often used
export function useHttp() {
    return {
        post: (url: string, data: any) => Promise.resolve({ data }),
        get: (url: string) => Promise.resolve({ data: {} }),
        delete: (url: string) => Promise.resolve({ data: {} })
    };
}

export function usePoll(ms: number, options: any = {}) {
    useEffect(() => {
        const interval = setInterval(() => {
            const refreshElement = document.getElementById('supabase-data-refresher');
            if (refreshElement) refreshElement.click();
        }, ms);
        return () => clearInterval(interval);
    }, [ms]);
}

export function setLayoutProps() {
    return {};
}

// Core types alias helper
export type UrlMethodPair = [string, string];
export type AppVariant = 'sidebar' | 'header';
export type NavItem = {
    title: string;
    href: string;
    icon: any;
};
export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    outlet_name?: string;
    allowed_attendance_ip?: string;
};

export type InertiaLinkProps = {
    href: string | { url: string };
};

