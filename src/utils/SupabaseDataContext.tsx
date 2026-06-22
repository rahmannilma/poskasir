import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { menuItems } from '../data';

interface SupabaseDataContextType {
    isLoading: boolean;
    user: any;
    products: any[];
    categories: any[];
    materials: any[];
    diningTables: any[];
    transactions: any[];
    shifts: any[];
    activeShift: any | null;
    pendingOrders: any[];
    customers: any[];
    attendances: any[];
    attendanceMethodRequests: any[];
    profiles: any[];
    metrics: {
        today_revenue: number;
        monthly_revenue: number;
        today_sales_count: number;
        total_products_count: number;
        total_cashiers_count: number;
    };
    refreshData: () => Promise<void>;
    setUser: (user: any) => void;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined);

export function SupabaseDataProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [diningTables, setDiningTables] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [shifts, setShifts] = useState<any[]>([]);
    const [activeShift, setActiveShift] = useState<any | null>(null);
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [attendances, setAttendances] = useState<any[]>([]);
    const [attendanceMethodRequests, setAttendanceMethodRequests] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);

    // Load auth user on mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // Fetch profile
                supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle().then(async ({ data }) => {
                    if (data) {
                        let finalUser = { ...session.user, ...data };
                        if (data.role !== 'owner') {
                            const { data: ownerProf } = await supabase
                                .from('profiles')
                                .select('outlet_name')
                                .eq('role', 'owner')
                                .limit(1)
                                .maybeSingle();
                            if (ownerProf && ownerProf.outlet_name) {
                                finalUser.outlet_name = ownerProf.outlet_name;
                            }
                        }
                        setUser(finalUser);
                    } else {
                        // Fallback/Mock profile
                        const fallbackUser = {
                            id: session.user.id,
                            name: session.user.email?.split('@')[0] || 'User',
                            email: session.user.email || '',
                            role: 'owner',
                            outlet_name: 'Precision Cafe',
                        };
                        setUser(fallbackUser);
                    }
                });
            } else {
                // Check if demo user logged in
                const demoUser = localStorage.getItem('demoUser');
                if (demoUser) {
                    setUser(JSON.parse(demoUser));
                }
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
                if (data) {
                    let finalUser = { ...session.user, ...data };
                    if (data.role !== 'owner') {
                        const { data: ownerProf } = await supabase
                            .from('profiles')
                            .select('outlet_name')
                            .eq('role', 'owner')
                            .limit(1)
                            .maybeSingle();
                        if (ownerProf && ownerProf.outlet_name) {
                            finalUser.outlet_name = ownerProf.outlet_name;
                        }
                    }
                    setUser(finalUser);
                } else {
                    const fallbackUser = {
                        id: session.user.id,
                        name: session.user.email?.split('@')[0] || 'User',
                        email: session.user.email || '',
                        role: 'owner',
                        outlet_name: 'Precision Cafe',
                    };
                    setUser(fallbackUser);
                }
            } else {
                const demoUser = localStorage.getItem('demoUser');
                if (demoUser) {
                    setUser(JSON.parse(demoUser));
                } else {
                    setUser(null);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Load Categories
            const { data: catData } = await supabase.from('categories').select('*');
            let finalCats = catData || [];
            if (finalCats.length === 0) {
                // Seed category mock defaults locally
                finalCats = [
                    { id: 'coffee', name: 'Kopi', icon: 'coffee' },
                    { id: 'tea', name: 'Teh', icon: 'emoji_food_beverage' },
                    { id: 'food', name: 'Makanan', icon: 'restaurant' },
                ];
                setCategories(finalCats);
            } else {
                setCategories(finalCats);
            }

            // Load Products
            const { data: prodData } = await supabase.from('products').select('*');
            let finalProds = prodData || [];
            if (finalProds.length === 0) {
                // Seed fallback product defaults
                finalProds = menuItems.map(p => ({
                    id: String(p.id),
                    name: p.name,
                    price: p.price,
                    category: p.category,
                    image: p.image || '',
                    sku: p.sku || '',
                    stock: 50,
                    min_stock: 10,
                    description: p.description || '',
                    is_active: true
                }));
                setProducts(finalProds);
            } else {
                setProducts(finalProds.map(p => ({
                    ...p,
                    id: String(p.id),
                    price: Number(p.price),
                    stock: Number(p.stock),
                    min_stock: Number(p.min_stock)
                })));
            }

            // Load Dining Tables
            const { data: dtData } = await supabase.from('dining_tables').select('*');
            setDiningTables(dtData || []);

            // Load Materials
            const { data: matData } = await supabase.from('materials').select('*');
            setMaterials(matData || []);

            // Load Customers
            const { data: custData } = await supabase.from('customers').select('*');
            setCustomers(custData || []);

            // Load Pending Orders
            const { data: poData } = await supabase.from('pending_orders').select('*');
            setPendingOrders((poData || []).map(p => ({
                id: p.id,
                order_number: p.order_number,
                customer_name: p.customer_name || '',
                table_number: p.table_number || '',
                discount_percent: Number(p.discount_percent) || 0,
                items: typeof p.items === 'string' ? JSON.parse(p.items) : p.items
            })));

            // Load Transactions
            const { data: txData } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
            const finalTx = (txData || []).map(t => ({
                ...t,
                id: String(t.id),
                total: Number(t.total),
                items: typeof t.items === 'string' ? JSON.parse(t.items) : t.items
            }));
            setTransactions(finalTx);

            // Load Shifts
            const { data: shData } = await supabase.from('shifts').select('*').order('created_at', { ascending: false });
            const finalSh = shData || [];
            setShifts(finalSh);
            const openShift = finalSh.find(s => s.status === 'open');
            setActiveShift(openShift || null);

            // Load Attendances
            const { data: attData } = await supabase.from('attendances').select('*');
            setAttendances(attData || []);

            // Load Profiles
            const { data: profData } = await supabase.from('profiles').select('*');
            setProfiles(profData || []);

        } catch (error) {
            console.error('Error loading Supabase data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Calculate metrics
    const metrics = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().slice(0, 7);

        const todayTx = transactions.filter(t => t.created_at?.startsWith(today));
        const monthTx = transactions.filter(t => t.created_at?.startsWith(thisMonth));

        const today_revenue = todayTx.reduce((sum, t) => sum + Number(t.total), 0);
        const monthly_revenue = monthTx.reduce((sum, t) => sum + Number(t.total), 0);
        const today_sales_count = todayTx.length;
        const total_products_count = products.length;
        
        // Count staff with role = cashier or barista
        const total_cashiers_count = profiles.filter(p => p.role === 'cashier' || p.role === 'barista').length || 2;

        return {
            today_revenue,
            monthly_revenue,
            today_sales_count,
            total_products_count,
            total_cashiers_count
        };
    }, [transactions, products, profiles]);

    return (
        <SupabaseDataContext.Provider value={{
            isLoading,
            user,
            products,
            categories,
            materials,
            diningTables,
            transactions,
            shifts,
            activeShift,
            pendingOrders,
            customers,
            attendances,
            attendanceMethodRequests,
            profiles,
            metrics,
            refreshData,
            setUser
        }}>
            {children}
        </SupabaseDataContext.Provider>
    );
}

export function useSupabaseData() {
    const context = useContext(SupabaseDataContext);
    if (!context) {
        throw new Error('useSupabaseData must be used within a SupabaseDataProvider');
    }
    return context;
}
