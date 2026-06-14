import { useState, useMemo, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Login from './components/Login';
import ProductGrid from './components/ProductGrid';
import OrderPanel from './components/OrderPanel';
import ModifierModal from './components/ModifierModal';
import ReceiptModal from './components/ReceiptModal';
import Dashboard from './components/Dashboard';
import AdminViews from './components/AdminViews';
import LandingPage from './components/LandingPage';
import { supabase, checkTableExists } from './utils/supabaseClient';
import { MenuItem, OrderItem, menuItems, categoryConfig, Category } from './data';
import { showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmDialog } from './utils/swal';

interface PendingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  tableNumber: string;
  discountPercent: number;
  items: OrderItem[];
}

let nextOrderId = 100;

function generateOrderNumber(): string {
  return String(Math.floor(2800 + Math.random() * 200));
}

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('isLoggedIn') === 'true');
  const [viewLanding, setViewLanding] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<string>(() => localStorage.getItem('currentUser') || 'Marcus W.');
  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('userRole') || 'kasir');

  // Active View State
  const [activeView, setActiveView] = useState<string>(() => {
    const role = localStorage.getItem('userRole') || 'kasir';
    return role === 'owner' ? 'dashboard' : 'pos';
  });

  // Lifted CRUD States
  const [products, setProducts] = useState<MenuItem[]>(menuItems);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([
    { id: 'coffee', name: 'Kopi', icon: 'coffee' },
    { id: 'tea', name: 'Teh', icon: 'emoji_food_beverage' },
    { id: 'food', name: 'Makanan', icon: 'restaurant' },
  ]);
  const [transactions, setTransactions] = useState<any[]>([
    { id: 'INV-2841', customer: 'Marcus W.', time: 'Hari ini, 18:15', total: 72900, method: 'Tunai', status: 'Lunas', items: [] },
    { id: 'INV-2840', customer: 'Pelanggan Umum', time: 'Hari ini, 17:42', total: 55000, method: 'QRIS', status: 'Lunas', items: [] },
    { id: 'INV-2839', customer: 'Ani', time: 'Hari ini, 16:30', total: 67000, method: 'Kartu', status: 'Lunas', items: [] },
    { id: 'INV-2838', customer: 'Alex T.', time: 'Kemarin, 20:10', total: 112000, method: 'Tunai', status: 'Lunas', items: [] },
    { id: 'INV-2837', customer: 'Sarah K.', time: 'Kemarin, 19:05', total: 48000, method: 'QRIS', status: 'Lunas', items: [] },
    { id: 'INV-2836', customer: 'Rian', time: '12 Juni 2026, 15:40', total: 95000, method: 'Kartu', status: 'Lunas', items: [] },
    { id: 'INV-2835', customer: 'Dina', time: '12 Juni 2026, 12:15', total: 32000, method: 'Tunai', status: 'Lunas', items: [] },
  ]);
  const [staffMembers, setStaffMembers] = useState<any[]>([
    { id: 'STF-01', name: 'Marcus W.', role: 'Kasir Utama', shift: 'Pagi', status: 'Aktif' },
    { id: 'STF-02', name: 'Sarah K.', role: 'Barista', shift: 'Pagi', status: 'Aktif' },
    { id: 'STF-03', name: 'Alex T.', role: 'Barista', shift: 'Sore', status: 'Aktif' },
    { id: 'STF-04', name: 'Rian', role: 'Kasir', shift: 'Sore', status: 'Aktif' },
    { id: 'STF-05', name: 'Ani Store Manager', role: 'Supervisor', shift: 'Full', status: 'Off' },
  ]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([
    { date: '14 Juni 2026', name: 'Marcus W.', checkIn: '06:55', checkOut: '15:05', status: 'Tepat Waktu' },
    { date: '14 Juni 2026', name: 'Sarah K.', checkIn: '06:50', checkOut: '15:00', status: 'Tepat Waktu' },
    { date: '14 Juni 2026', name: 'Alex T.', checkIn: '15:10', checkOut: '--:--', status: 'Terlambat (10m)' },
    { date: '14 Juni 2026', name: 'Rian', checkIn: '14:55', checkOut: '--:--', status: 'Tepat Waktu' },
    { date: '13 Juni 2026', name: 'Marcus W.', checkIn: '06:58', checkOut: '15:02', status: 'Tepat Waktu' },
    { date: '13 Juni 2026', name: 'Alex T.', checkIn: '14:52', checkOut: '23:05', status: 'Tepat Waktu' },
  ]);
  const [shiftSchedules, setShiftSchedules] = useState<any[]>([
    { name: 'Shift Pagi (07:00 - 15:00)', staff: ['Marcus W. (Kasir)', 'Sarah K. (Barista)'] },
    { name: 'Shift Sore (15:00 - 23:00)', staff: ['Rian (Kasir)', 'Alex T. (Barista)'] },
    { name: 'Full Time (07:00 - 18:00)', staff: ['Ani (Supervisor / Manager)'] },
  ]);
  const [settings, setSettings] = useState({
    storeName: 'M-Coffee Cafe',
    storeAddress: 'Jl. Kopi Presisi No. 12, Jakarta',
    storePhone: '0812-3456-7890',
    printerIP: '192.168.1.250',
    taxRate: '8',
  });

  // Navigation & Search
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  
  // Order details
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderNumber, setOrderNumber] = useState('2841');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  
  // Calculator & checkout states
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qris'>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [discountPercent, setDiscountPercent] = useState('0');
  
  // Toggles / Dialogs
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Meja Aktif (Pending Orders) - Initial mock orders for beautiful demonstration
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([
    {
      id: 'pending-1',
      orderNumber: '2804',
      customerName: 'Rian',
      tableNumber: '03',
      discountPercent: 10,
      items: [
        {
          id: 'init-1',
          menuItem: menuItems.find((m) => m.id === 'latte')!,
          quantity: 2,
          modifiers: ['Susu Gandum'],
          notes: 'Kurang Gula',
        },
        {
          id: 'init-2',
          menuItem: menuItems.find((m) => m.id === 'almond-croissant')!,
          quantity: 1,
          modifiers: ['Hangatkan'],
        },
      ],
    },
    {
      id: 'pending-2',
      orderNumber: '2815',
      customerName: 'Ani',
      tableNumber: '05',
      discountPercent: 0,
      items: [
        {
          id: 'init-3',
          menuItem: menuItems.find((m) => m.id === 'espresso')!,
          quantity: 1,
          modifiers: [],
        },
        {
          id: 'init-4',
          menuItem: menuItems.find((m) => m.id === 'avocado-toast')!,
          quantity: 1,
          modifiers: ['Tambah Telur'],
        },
      ],
    },
  ]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Supabase Data Load & Sync
  useEffect(() => {
    async function loadData() {
      const tables = ['categories', 'products', 'staff_members', 'attendance_logs', 'shift_schedules', 'settings', 'pending_orders', 'transactions'];
      const missingTables = [];
      for (const t of tables) {
        const exists = await checkTableExists(t);
        if (!exists) {
          missingTables.push(t);
        }
      }

      if (missingTables.length > 0) {
        showWarningAlert(
          'Database Belum Siap',
          `Tabel berikut belum dibuat di Supabase: ${missingTables.join(', ')}. Harap jalankan script di schema.sql pada SQL Editor Supabase Anda.`
        );
        return;
      }

      // Load & Seed Categories
      const { data: catData, error: catErr } = await supabase.from('categories').select('*');
      if (!catErr) {
        if (catData.length === 0) {
          const initialCats = [
            { id: 'coffee', name: 'Kopi', icon: 'coffee' },
            { id: 'tea', name: 'Teh', icon: 'emoji_food_beverage' },
            { id: 'food', name: 'Makanan', icon: 'restaurant' },
          ];
          await supabase.from('categories').insert(initialCats);
          setCategories(initialCats);
        } else {
          setCategories(catData);
        }
      }

      // Load & Seed Products
      const { data: prodData, error: prodErr } = await supabase.from('products').select('*');
      if (!prodErr) {
        if (prodData.length === 0) {
          const seedProds = menuItems.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image,
            modifiers: p.modifiers || [],
            sku: p.sku || '',
            description: p.description || ''
          }));
          await supabase.from('products').insert(seedProds);
          setProducts(menuItems);
        } else {
          const mappedProds = prodData.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            category: p.category,
            image: p.image || '',
            modifiers: p.modifiers || [],
            sku: p.sku || '',
            description: p.description || ''
          }));
          setProducts(mappedProds);
        }
      }

      // Load & Seed Staff Members
      const { data: staffData, error: staffErr } = await supabase.from('staff_members').select('*');
      if (!staffErr) {
        if (staffData.length === 0) {
          const initialStaff = [
            { id: 'STF-01', name: 'Marcus W.', role: 'Kasir Utama', shift: 'Pagi', status: 'Aktif' },
            { id: 'STF-02', name: 'Sarah K.', role: 'Barista', shift: 'Pagi', status: 'Aktif' },
            { id: 'STF-03', name: 'Alex T.', role: 'Barista', shift: 'Sore', status: 'Aktif' },
            { id: 'STF-04', name: 'Rian', role: 'Kasir', shift: 'Sore', status: 'Aktif' },
            { id: 'STF-05', name: 'Ani Store Manager', role: 'Supervisor', shift: 'Full', status: 'Off' },
          ];
          await supabase.from('staff_members').insert(initialStaff);
          setStaffMembers(initialStaff);
        } else {
          setStaffMembers(staffData);
        }
      }

      // Load & Seed Shift Schedules
      const { data: shiftData, error: shiftErr } = await supabase.from('shift_schedules').select('*');
      if (!shiftErr) {
        if (shiftData.length === 0) {
          const initialShifts = [
            { name: 'Shift Pagi (07:00 - 15:00)', staff: ['Marcus W. (Kasir)', 'Sarah K. (Barista)'] },
            { name: 'Shift Sore (15:00 - 23:00)', staff: ['Rian (Kasir)', 'Alex T. (Barista)'] },
            { name: 'Full Time (07:00 - 18:00)', staff: ['Ani (Supervisor / Manager)'] },
          ];
          await supabase.from('shift_schedules').insert(initialShifts);
          setShiftSchedules(initialShifts);
        } else {
          setShiftSchedules(shiftData);
        }
      }

      // Load & Seed Attendance Logs
      const { data: attData, error: attErr } = await supabase.from('attendance_logs').select('*');
      if (!attErr) {
        if (attData.length === 0) {
          const initialAtt = [
            { date: '14 Juni 2026', name: 'Marcus W.', check_in: '06:55', check_out: '15:05', status: 'Tepat Waktu' },
            { date: '14 Juni 2026', name: 'Sarah K.', check_in: '06:50', check_out: '15:00', status: 'Tepat Waktu' },
            { date: '14 Juni 2026', name: 'Alex T.', check_in: '15:10', check_out: '--:--', status: 'Terlambat (10m)' },
            { date: '14 Juni 2026', name: 'Rian', check_in: '14:55', check_out: '--:--', status: 'Tepat Waktu' },
            { date: '13 Juni 2026', name: 'Marcus W.', check_in: '06:58', check_out: '15:02', status: 'Tepat Waktu' },
            { date: '13 Juni 2026', name: 'Alex T.', check_in: '14:52', check_out: '23:05', status: 'Tepat Waktu' },
          ];
          await supabase.from('attendance_logs').insert(initialAtt);
          setAttendanceLogs(initialAtt.map(a => ({ date: a.date, name: a.name, checkIn: a.check_in, checkOut: a.check_out, status: a.status })));
        } else {
          setAttendanceLogs(attData.map(a => ({
            id: a.id,
            date: a.date,
            name: a.name,
            checkIn: a.check_in || '--:--',
            checkOut: a.check_out || '--:--',
            status: a.status
          })));
        }
      }

      // Load Settings
      const { data: settingsData, error: settingsErr } = await supabase.from('settings').select('*').eq('id', 'main');
      if (!settingsErr && settingsData && settingsData.length > 0) {
        const s = settingsData[0];
        setSettings({
          storeName: s.store_name || 'M-Coffee Cafe',
          storeAddress: s.store_address || '',
          storePhone: s.store_phone || '',
          printerIP: s.printer_ip || '',
          taxRate: s.tax_rate || '8',
        });
      }

      // Load Pending Orders
      const { data: pendingData, error: pendingErr } = await supabase.from('pending_orders').select('*');
      if (!pendingErr) {
        if (pendingData.length > 0) {
          const mappedPending = pendingData.map(p => ({
            id: p.id,
            orderNumber: p.order_number,
            customerName: p.customer_name || '',
            tableNumber: p.table_number || '',
            discountPercent: Number(p.discount_percent) || 0,
            items: typeof p.items === 'string' ? JSON.parse(p.items) : p.items
          }));
          setPendingOrders(mappedPending);

          const ids = pendingData.map(p => {
            const num = parseInt(p.id.replace('pending-', ''));
            return isNaN(num) ? 0 : num;
          });
          const maxId = Math.max(...ids, 100);
          nextOrderId = maxId + 1;
        }
      }

      // Load Transactions
      const { data: txData, error: txErr } = await supabase.from('transactions').select('*');
      if (!txErr) {
        if (txData.length > 0) {
          const mappedTx = txData.map(t => ({
            id: t.id,
            customer: t.customer,
            time: t.time,
            total: Number(t.total),
            method: t.method,
            status: t.status,
            items: typeof t.items === 'string' ? JSON.parse(t.items) : t.items
          }));
          setTransactions(mappedTx);
        }
      }
    }

    loadData();
  }, []);

  // Format IDR for simple display
  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  // Filter items by category and search (matching name and SKU)
  const filteredItems = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Handle product click - directly add to cart bypassing variant modal
  const handleItemClick = useCallback((item: MenuItem) => {
    setSelectedItemId(item.id);
    setOrderItems((prev) => {
      const existingItem = prev.find(
        (oi) =>
          oi.menuItem.id === item.id &&
          oi.modifiers.length === 0 &&
          !oi.notes
      );

      if (existingItem) {
        return prev.map((oi) =>
          oi.id === existingItem.id ? { ...oi, quantity: oi.quantity + 1 } : oi
        );
      } else {
        const newItem: OrderItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          menuItem: item,
          quantity: 1,
          modifiers: [],
        };
        return [...prev, newItem];
      }
    });
  }, []);

  // Add custom item
  const handleAddToOrder = useCallback(
    (modifiers: string[], notes: string) => {
      if (!modalItem) return;

      const existingItem = orderItems.find(
        (oi) =>
          oi.menuItem.id === modalItem.id &&
          JSON.stringify(oi.modifiers.sort()) === JSON.stringify(modifiers.sort()) &&
          oi.notes === (notes || undefined)
      );

      if (existingItem) {
        setOrderItems((prev) =>
          prev.map((oi) =>
            oi.id === existingItem.id ? { ...oi, quantity: oi.quantity + 1 } : oi
          )
        );
      } else {
        const newItem: OrderItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          menuItem: modalItem,
          quantity: 1,
          modifiers,
          notes: notes || undefined,
        };
        setOrderItems((prev) => [...prev, newItem]);
      }

      setModalItem(null);
    },
    [modalItem, orderItems]
  );

  // Remove item
  const handleRemoveItem = useCallback((itemId: string) => {
    setOrderItems((prev) => prev.filter((oi) => oi.id !== itemId));
  }, []);

  // Update quantity
  const handleUpdateQuantity = useCallback((itemId: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((oi) => {
          if (oi.id !== itemId) return oi;
          const newQty = oi.quantity + delta;
          if (newQty <= 0) return null;
          return { ...oi, quantity: newQty };
        })
        .filter(Boolean) as OrderItem[]
    );
  }, []);

  // Clear order
  const handleClearOrder = useCallback(() => {
    setOrderItems([]);
    setSelectedItemId(null);
    setAmountPaid('');
    setDiscountPercent('0');
  }, []);

  // Safe view change wrapper enforcing role boundaries
  const handleViewChange = useCallback((view: string) => {
    if (userRole === 'owner') {
      if (view === 'pos') return;
    } else {
      if (view !== 'pos' && view !== 'absensi' && view !== 'transaksi') return;
    }
    setActiveView(view);
  }, [userRole]);

  // Authentication callbacks
  const handleLogin = (name: string, role: string) => {
    setIsLoggedIn(true);
    setCurrentUser(name);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', name);
    localStorage.setItem('userRole', role);
    if (role === 'owner') {
      setActiveView('dashboard');
    } else {
      setActiveView('pos');
    }
  };

  const handleLogout = useCallback(() => {
    showConfirmDialog(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari sistem?'
    ).then((result) => {
      if (result.isConfirmed) {
        setIsLoggedIn(false);
        setCurrentUser('Marcus W.');
        setUserRole('kasir');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        setViewLanding(true);
        setOrderItems([]);
        setSelectedItemId(null);
        setAmountPaid('');
        setDiscountPercent('0');
        setCustomerName('');
        setTableNumber('');
        setEditingOrderId(null);
        setActiveView('pos');
      }
    });
  }, []);

  // New order session
  const handleNewOrder = useCallback(() => {
    handleClearOrder();
    setOrderNumber(generateOrderNumber());
    setCustomerName('');
    setTableNumber('');
    setEditingOrderId(null);
  }, [handleClearOrder]);

  // Load a pending order
  const loadPendingOrder = (order: PendingOrder) => {
    setEditingOrderId(order.id);
    setOrderNumber(order.orderNumber);
    setCustomerName(order.customerName);
    setTableNumber(order.tableNumber);
    setDiscountPercent(order.discountPercent.toString());
    setOrderItems(order.items);
    setAmountPaid('');
    setIsMobileCartOpen(true); // Auto open cart popup on mobile
  };

  // Save/Suspend order (Simpan Pesanan)
  const handleSaveOrderPending = () => {
    if (orderItems.length === 0) {
      showWarningAlert('Keranjang Kosong', 'Keranjang belanja Anda masih kosong.');
      return;
    }

    if (!customerName && !tableNumber) {
      showWarningAlert('Data Belum Lengkap', 'Nama pelanggan atau Nomor meja harus diisi salah satunya!');
      return;
    }

    if (editingOrderId) {
      // Update existing pending order
      const updatedOrder = {
        customer_name: customerName,
        table_number: tableNumber,
        discount_percent: parseFloat(discountPercent) || 0,
        items: orderItems,
      };
      supabase.from('pending_orders').update(updatedOrder).eq('id', editingOrderId).then(({ error }) => {
        if (error) console.error('Error updating pending order in Supabase:', error);
      });
      setPendingOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrderId
            ? {
                ...o,
                customerName,
                tableNumber,
                discountPercent: parseFloat(discountPercent) || 0,
                items: orderItems,
              }
            : o
        )
      );
      showSuccessAlert('Pesanan Diperbarui', `Pesanan Meja ${tableNumber || customerName} berhasil diperbarui.`);
    } else {
      // Save as new pending order
      const newId = `pending-${nextOrderId++}`;
      const newPending = {
        id: newId,
        order_number: orderNumber,
        customer_name: customerName || 'Pelanggan',
        table_number: tableNumber,
        discount_percent: parseFloat(discountPercent) || 0,
        items: orderItems,
      };
      supabase.from('pending_orders').insert([newPending]).then(({ error }) => {
        if (error) console.error('Error inserting pending order to Supabase:', error);
      });
      setPendingOrders((prev) => [...prev, {
        id: newId,
        orderNumber,
        customerName: customerName || 'Pelanggan',
        tableNumber: tableNumber,
        discountPercent: parseFloat(discountPercent) || 0,
        items: orderItems,
      }]);
      showSuccessAlert('Pesanan Disimpan', `Pesanan Meja ${tableNumber || customerName} disimpan ke daftar aktif.`);
    }

    // Reset checkout states
    handleNewOrder();
    setIsMobileCartOpen(false);
  };

  // Void pending order (Hapus Meja Aktif)
  const handleVoidPendingOrder = () => {
    if (!editingOrderId) return;
    showConfirmDialog(
      'Batalkan Pesanan',
      'Apakah Anda yakin ingin membatalkan dan menghapus pesanan meja ini?'
    ).then((result) => {
      if (result.isConfirmed) {
        supabase.from('pending_orders').delete().eq('id', editingOrderId).then(({ error }) => {
          if (error) console.error('Error deleting pending order from Supabase:', error);
        });
        setPendingOrders((prev) => prev.filter((o) => o.id !== editingOrderId));
        handleNewOrder();
        setIsMobileCartOpen(false);
        showSuccessAlert('Pesanan Dibatalkan', 'Pesanan berhasil dibatalkan dan dihapus.');
      }
    });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    handleNewOrder();
    setIsMobileCartOpen(false);
  };

  // Process checkout submission (Bayar Sekarang)
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) return;

    const subtotal = orderItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const discountAmt = (subtotal * (parseFloat(discountPercent) || 0)) / 100;
    const totalVal = Math.max(0, subtotal - discountAmt);
    const paidVal = parseFloat(amountPaid) || totalVal;

    if (paymentMethod === 'cash' && paidVal < totalVal) {
      showErrorAlert('Pembayaran Kurang', 'Jumlah bayar kurang dari total transaksi!');
      return;
    }

    setIsProcessing(true);

    // Simulate database post and checkout completion
    setTimeout(() => {
      setIsProcessing(false);

      // Setup receipt data
      setReceiptData({
        orderNumber,
        customerName: customerName || 'Pelanggan Umum',
        tableNumber,
        items: orderItems,
        subtotal,
        discountPercent: parseFloat(discountPercent) || 0,
        discountAmount: discountAmt,
        total: totalVal,
        paymentMethod,
        amountPaid: paidVal,
        changeAmount: paymentMethod === 'cash' ? Math.max(0, paidVal - totalVal) : 0,
      });

      setShowReceipt(true);

      // Add to transactions history state
      const now = new Date();
      const timeStr = `Hari ini, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newTx = {
        id: `INV-${orderNumber}`,
        customer: customerName || 'Pelanggan Umum',
        time: timeStr,
        total: totalVal,
        method: paymentMethod === 'cash' ? 'Tunai' : paymentMethod === 'card' ? 'Kartu' : 'QRIS',
        status: 'Lunas',
        items: orderItems,
      };
      supabase.from('transactions').insert([newTx]).then(({ error }) => {
        if (error) console.error('Error inserting transaction to Supabase:', error);
      });
      setTransactions((prev) => [newTx, ...prev]);

      // Remove from pending orders list if it was a loaded pending order
      if (editingOrderId) {
        supabase.from('pending_orders').delete().eq('id', editingOrderId).then(({ error }) => {
          if (error) console.error('Error deleting pending order from Supabase:', error);
        });
        setPendingOrders((prev) => prev.filter((o) => o.id !== editingOrderId));
      }

      // Reset cart
      handleNewOrder();
      setIsMobileCartOpen(false);
    }, 800);
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const discountAmt = (subtotal * (parseFloat(discountPercent) || 0)) / 100;
  const total = Math.max(0, subtotal - discountAmt);

  if (!isLoggedIn) {
    if (viewLanding) {
      return <LandingPage onEnter={() => setViewLanding(false)} />;
    }
    return <Login onLogin={handleLogin} onBackToLanding={() => setViewLanding(true)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface font-sans">
      {/* Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className={`fixed inset-0 bg-black/45 z-45 ${activeView === 'pos' ? '' : 'md:hidden'} transition-opacity duration-300`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onViewChange={handleViewChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        userRole={userRole}
      />

      {/* Main Content Workspace */}
      <main className={`ml-0 ${activeView === 'pos' ? 'md:ml-0' : 'md:ml-72'} flex-grow flex flex-col min-w-0 h-screen overflow-hidden`}>
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setIsSidebarOpen(true)}
          onCartClick={() => setIsMobileCartOpen(true)}
          cartItemCount={orderItems.reduce((sum, item) => sum + item.quantity, 0)}
          activeView={activeView}
        />

        {activeView === 'pos' ? (
          /* Content Canvas */
          <div className="flex-1 overflow-y-auto flex flex-col min-h-0 bg-surface-container-low/40 pb-20 lg:pb-0">
            
            {/* Meja Aktif (Pending Orders) Shelf */}
            {pendingOrders.length > 0 && (
              <div className="bg-white border border-outline-variant/35 p-2 rounded-xl shadow-sm shrink-0 m-3 md:m-4 mb-1.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                  <h3 className="font-bold text-[9px] text-on-surface uppercase tracking-wider">
                    🍽️ Meja Aktif (Pesanan Tertunda)
                  </h3>
                  <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    {pendingOrders.length}
                  </span>
                </div>
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0.5">
                  {pendingOrders.map((order) => {
                    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    const orderSubtotal = order.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
                    const orderDiscount = (orderSubtotal * order.discountPercent) / 100;
                    const orderTotal = Math.max(0, orderSubtotal - orderDiscount);

                    const displayName = order.tableNumber
                      ? `Meja ${order.tableNumber}`
                      : order.customerName;
                    const subLabel = order.tableNumber && order.customerName
                      ? order.customerName
                      : `INV-${order.orderNumber}`;
                    const isCurrent = editingOrderId === order.id;

                    return (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => loadPendingOrder(order)}
                        className={`flex flex-col text-left p-2 rounded-xl border transition-all cursor-pointer min-w-[95px] shrink-0 active:scale-95 ${
                          isCurrent
                            ? 'bg-primary/5 border-primary shadow-sm'
                            : 'bg-surface-container-low/40 border-outline-variant/30 hover:border-amber-300 hover:bg-white'
                        }`}
                      >
                        <span className={`font-bold text-[10px] truncate max-w-[80px] ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                          {displayName}
                        </span>
                        <span className="text-[8px] text-on-surface-variant/60 truncate max-w-[80px] font-mono mt-0.5">
                          {subLabel}
                        </span>
                        <div className="flex justify-between items-center mt-1 pt-1 border-t border-outline-variant/20 text-[8px] font-semibold text-on-surface-variant/80 font-mono">
                          <span>{totalQty} Pcs</span>
                          <span className="text-primary font-bold">{formatPrice(orderTotal)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Selector pills */}
            <div className="bg-white border border-outline-variant/35 p-2 rounded-xl shadow-sm shrink-0 mx-3 md:mx-4 mb-2 mt-0 flex gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 active:scale-95 cursor-pointer border ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white border-primary font-bold shadow-sm'
                    : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 active:scale-95 cursor-pointer border ${
                      isActive
                        ? 'bg-primary text-white border-primary font-bold shadow-sm'
                        : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Products Section */}
            <ProductGrid
              items={filteredItems}
              selectedItemId={selectedItemId}
              onItemClick={handleItemClick}
            />
          </div>
        ) : activeView === 'dashboard' ? (
          <Dashboard
            onOpenPos={() => handleViewChange('pos')}
            username={currentUser}
            userRole={userRole}
            onViewChange={handleViewChange}
          />
        ) : (
          <AdminViews
            view={activeView}
            onOpenPos={() => handleViewChange('pos')}
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            transactions={transactions}
            setTransactions={setTransactions}
            staffMembers={staffMembers}
            setStaffMembers={setStaffMembers}
            attendanceLogs={attendanceLogs}
            setAttendanceLogs={setAttendanceLogs}
            shiftSchedules={shiftSchedules}
            setShiftSchedules={setShiftSchedules}
            settings={settings}
            setSettings={setSettings}
            onReprint={(txData: any) => {
              const hasItems = txData.items && txData.items.length > 0;
              const formattedItems = hasItems ? txData.items : [
                {
                  id: 'dummy',
                  menuItem: {
                    id: 'dummy-prod',
                    name: 'Penjualan Kopi/Makanan',
                    price: txData.total,
                    category: 'coffee',
                    image: '',
                  },
                  quantity: 1,
                  modifiers: [],
                }
              ];
              setReceiptData({
                orderNumber: txData.id.replace('INV-', ''),
                customerName: txData.customer,
                tableNumber: '', 
                items: formattedItems,
                subtotal: txData.total,
                discountPercent: 0,
                discountAmount: 0,
                total: txData.total,
                paymentMethod: txData.method === 'Tunai' ? 'cash' : txData.method === 'Kartu' ? 'card' : 'qris',
                amountPaid: txData.total,
                changeAmount: 0,
              });
              setShowReceipt(true);
            }}
            userRole={userRole}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Right Order Panel (Checkout) */}
      {activeView === 'pos' && (
        <OrderPanel
          orderNumber={orderNumber}
          customerName={customerName}
          onCustomerNameChange={setCustomerName}
          tableNumber={tableNumber}
          onTableNumberChange={setTableNumber}
          items={orderItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
          onClearOrder={handleClearOrder}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          amountPaid={amountPaid}
          onAmountPaidChange={setAmountPaid}
          discountPercent={discountPercent}
          onDiscountPercentChange={setDiscountPercent}
          editingOrderId={editingOrderId}
          onSaveOrderPending={handleSaveOrderPending}
          onVoidPendingOrder={handleVoidPendingOrder}
          onCancelEdit={handleCancelEdit}
          onSubmitCheckout={handleCheckoutSubmit}
          isProcessing={isProcessing}
          isOpen={isMobileCartOpen}
          onClose={() => setIsMobileCartOpen(false)}
        />
      )}

      {/* Mobile Floating Cart Summary Button */}
      {activeView === 'pos' && orderItems.length > 0 && !isMobileCartOpen && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full bg-primary text-white py-3.5 px-5 rounded-full font-bold flex items-center justify-between shadow-[0_8px_30px_rgba(36,107,0,0.25)] hover:bg-primary/95 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              <span className="bg-white text-primary text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Lihat Keranjang</span>
            <span className="font-mono font-bold text-xs">{formatPrice(total)}</span>
          </button>
        </div>
      )}

      {/* Modifier Customize Modal */}
      {modalItem && (
        <ModifierModal
          item={modalItem}
          onConfirm={handleAddToOrder}
          onCancel={() => setModalItem(null)}
        />
      )}

      {/* Checkout Success Receipt Modal */}
      {showReceipt && receiptData && (
        <ReceiptModal
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setReceiptData(null);
          }}
          orderNumber={receiptData.orderNumber}
          customerName={receiptData.customerName}
          tableNumber={receiptData.tableNumber}
          items={receiptData.items}
          subtotal={receiptData.subtotal}
          discountPercent={receiptData.discountPercent}
          discountAmount={receiptData.discountAmount}
          total={receiptData.total}
          paymentMethod={receiptData.paymentMethod}
          amountPaid={receiptData.amountPaid}
          changeAmount={receiptData.changeAmount}
          storeName={settings.storeName}
          storeAddress={settings.storeAddress}
          storePhone={settings.storePhone}
        />
      )}
    </div>
  );
}
