import React, { useMemo, useState } from 'react';
import { showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmDialog } from '../utils/swal';
import { supabase } from '../utils/supabaseClient';

interface AdminViewsProps {
  view: string;
  onOpenPos: () => void;
  products: any[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  transactions: any[];
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  staffMembers: any[];
  setStaffMembers: React.Dispatch<React.SetStateAction<any[]>>;
  attendanceLogs: any[];
  setAttendanceLogs: React.Dispatch<React.SetStateAction<any[]>>;
  shiftSchedules: any[];
  setShiftSchedules: React.Dispatch<React.SetStateAction<any[]>>;
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onReprint: (txData: any) => void;
  userRole?: string;
  currentUser?: string;
}

const defaultImages: Record<string, string> = {
  coffee: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
  tea: 'https://images.pexels.com/photos/14415014/pexels-photo-14415014.jpeg?auto=compress&cs=tinysrgb&w=600',
  food: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600',
};

const popularIcons = [
  { value: 'coffee', label: '☕ Kopi' },
  { value: 'emoji_food_beverage', label: '🍵 Teh' },
  { value: 'restaurant', label: '🍔 Makanan' },
  { value: 'cake', label: '🍰 Roti/Kue' },
  { value: 'cookie', label: '🍪 Camilan' },
  { value: 'local_pizza', label: '🍕 Pizza' },
  { value: 'local_bar', label: '🍹 Minuman Dingin' },
  { value: 'soup_kitchen', label: '🍲 Sup' },
];

export default function AdminViews({
  view,
  onOpenPos,
  products,
  setProducts,
  categories,
  setCategories,
  transactions,
  setTransactions,
  staffMembers,
  setStaffMembers,
  attendanceLogs,
  setAttendanceLogs,
  shiftSchedules,
  setShiftSchedules,
  settings,
  setSettings,
  onReprint,
  userRole,
  currentUser,
}: AdminViewsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Settings Local states (initialized from props)
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress);
  const [storePhone, setStorePhone] = useState(settings.storePhone);
  const [printerIP, setPrinterIP] = useState(settings.printerIP);
  const [taxRate, setTaxRate] = useState(settings.taxRate);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>({});

  // Helper formatting currency
  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  // Searching / Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx =>
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);


  const filteredStaffMembers = useMemo(() => {
    return staffMembers.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffMembers, searchTerm]);

  const filteredAttendanceLogs = useMemo(() => {
    return attendanceLogs.filter(log =>
      log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendanceLogs, searchTerm]);

  const filteredShiftSchedules = useMemo(() => {
    return shiftSchedules.filter(sch =>
      sch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.staff.some((st: string) => st.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [shiftSchedules, searchTerm]);


  // Delete handlers
  const handleDelete = (item: any) => {
    showConfirmDialog(
      'Hapus Data',
      'Apakah Anda yakin ingin menghapus data ini?'
    ).then((result) => {
      if (result.isConfirmed) {
        if (view === 'produk') {
          supabase.from('products').delete().eq('id', item.id).then();
          setProducts(prev => prev.filter(p => p.id !== item.id));
        } else if (view === 'kategori') {
          supabase.from('categories').delete().eq('id', item.id).then();
          setCategories(prev => prev.filter(c => c.id !== item.id));
        } else if (view === 'staff') {
          supabase.from('staff_members').delete().eq('id', item.id).then();
          setStaffMembers(prev => prev.filter(s => s.id !== item.id));
        } else if (view === 'absensi') {
          if (item.id) {
            supabase.from('attendance_logs').delete().eq('id', item.id).then();
          }
          setAttendanceLogs(prev => prev.filter((_, idx) => idx !== item.index));
        } else if (view === 'shift kerja') {
          if (item.id) {
            supabase.from('shift_schedules').delete().eq('id', item.id).then();
          }
          setShiftSchedules(prev => prev.filter((_, idx) => idx !== item.index));
        } else if (view === 'transaksi') {
          supabase.from('transactions').delete().eq('id', item.id).then();
          setTransactions(prev => prev.filter(t => t.id !== item.id));
        }
        showSuccessAlert('Terhapus', 'Data berhasil dihapus.');
      }
    });
  };

  // Trigger Open Form for Add / Edit
  const openForm = (mode: 'add' | 'edit', item?: any) => {
    setModalMode(mode);
    if (view === 'produk') {
      if (mode === 'add') {
        setFormData({
          sku: '',
          name: '',
          category: categories[0]?.id || 'coffee',
          price: '',
          costPrice: '',
          description: '',
          image: '',
        });
      } else {
        setFormData({
          id: item.id,
          sku: item.sku || '',
          name: item.name,
          category: item.category,
          price: item.price.toString(),
          costPrice: item.costPrice ? item.costPrice.toString() : '',
          description: item.description || '',
          image: item.image || '',
        });
      }
    } else if (view === 'kategori') {
      if (mode === 'add') {
        setFormData({ id: '', name: '', icon: 'coffee' });
      } else {
        setFormData({ oldId: item.id, id: item.id, name: item.name, icon: item.icon });
      }

    } else if (view === 'staff') {
      if (mode === 'add') {
        setFormData({ id: '', name: '', role: '', shift: 'Pagi', status: 'Aktif' });
      } else {
        setFormData({ id: item.id, name: item.name, role: item.role, shift: item.shift, status: item.status });
      }
    } else if (view === 'absensi') {
      if (mode === 'add') {
        setFormData({
          name: staffMembers[0]?.name || '',
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          checkIn: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          checkOut: '--:--',
          status: 'Tepat Waktu',
        });
      } else {
        setFormData({
          index: item.index,
          name: item.name,
          date: item.date,
          checkIn: item.checkIn,
          checkOut: item.checkOut || '--:--',
          status: item.status,
        });
      }
    } else if (view === 'shift kerja') {
      if (mode === 'add') {
        setFormData({ name: '', staff: '' });
      } else {
        setFormData({ index: item.index, name: item.name, staff: item.staff.join(', ') });
      }
    }
    setIsModalOpen(true);
  };

  // Submit Form Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (view === 'produk') {
      const price = parseFloat(formData.price) || 0;
      const costPrice = parseFloat(formData.costPrice) || 0;
      let imageUrl = formData.image;
      if (!imageUrl) {
        imageUrl = defaultImages[formData.category] || defaultImages.coffee;
      }

      if (modalMode === 'add') {
        if (products.some(p => p.sku && p.sku.toLowerCase() === formData.sku.toLowerCase())) {
          showErrorAlert('SKU Terdaftar', 'SKU Produk sudah terdaftar! Harap gunakan SKU lain.');
          return;
        }
        const newId = `prod-${Date.now()}`;
        const newSku = formData.sku.toUpperCase() || `PROD-${Math.floor(1000 + Math.random() * 9000)}`;
        const dbProd = {
          id: newId,
          sku: newSku,
          name: formData.name,
          category: formData.category,
          price,
          image: imageUrl,
          modifiers: [],
          description: formData.description
        };
        supabase.from('products').insert([dbProd]).then();
        setProducts(prev => [...prev, { ...dbProd, costPrice }]);
      } else {
        const dbProd = {
          sku: formData.sku.toUpperCase(),
          name: formData.name,
          category: formData.category,
          price,
          image: imageUrl,
          description: formData.description
        };
        supabase.from('products').update(dbProd).eq('id', formData.id).then();
        setProducts(prev =>
          prev.map(p =>
            p.id === formData.id
              ? {
                  ...p,
                  ...dbProd,
                  costPrice,
                }
              : p
          )
        );
      }
    } else if (view === 'kategori') {
      const cleanId = formData.id.toLowerCase().replace(/\s+/g, '-');
      if (modalMode === 'add') {
        if (categories.some(c => c.id === cleanId)) {
          showErrorAlert('Kategori Terdaftar', 'Kode Kategori sudah digunakan!');
          return;
        }
        const newCat = { id: cleanId, name: formData.name, icon: formData.icon };
        supabase.from('categories').insert([newCat]).then();
        setCategories(prev => [...prev, newCat]);
      } else {
        const updatedCat = { id: cleanId, name: formData.name, icon: formData.icon };
        supabase.from('categories').update(updatedCat).eq('id', formData.oldId).then();
        setCategories(prev =>
          prev.map(c => (c.id === formData.oldId ? updatedCat : c))
        );
        if (formData.oldId !== cleanId) {
          supabase.from('products').update({ category: cleanId }).eq('category', formData.oldId).then();
          setProducts(prev =>
            prev.map(p => (p.category === formData.oldId ? { ...p, category: cleanId } : p))
          );
        }
      }

    } else if (view === 'staff') {
      if (modalMode === 'add') {
        if (staffMembers.some(s => s.id.toUpperCase() === formData.id.toUpperCase())) {
          showErrorAlert('ID Staff Terdaftar', 'ID Staff sudah terdaftar!');
          return;
        }
        const newStf = {
          id: formData.id.toUpperCase(),
          name: formData.name,
          role: formData.role,
          shift: formData.shift,
          status: formData.status,
        };
        supabase.from('staff_members').insert([newStf]).then();
        setStaffMembers(prev => [...prev, newStf]);
      } else {
        const updatedStf = {
          name: formData.name,
          role: formData.role,
          shift: formData.shift,
          status: formData.status,
        };
        supabase.from('staff_members').update(updatedStf).eq('id', formData.id).then();
        setStaffMembers(prev =>
          prev.map(s =>
            s.id === formData.id
              ? { ...s, ...updatedStf }
              : s
          )
        );
      }
    } else if (view === 'absensi') {
      if (modalMode === 'add') {
        const newAtt = {
          date: formData.date,
          name: formData.name,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          status: formData.status,
        };
        supabase.from('attendance_logs').insert([newAtt]).then();
        setAttendanceLogs(prev => [{ ...newAtt, checkIn: formData.checkIn, checkOut: formData.checkOut }, ...prev]);
      } else {
        const itemToUpdate = attendanceLogs[formData.index];
        const updatedAtt = {
          date: formData.date,
          name: formData.name,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          status: formData.status,
        };
        if (itemToUpdate && itemToUpdate.id) {
          supabase.from('attendance_logs').update(updatedAtt).eq('id', itemToUpdate.id).then();
        }
        setAttendanceLogs(prev =>
          prev.map((log, idx) =>
            idx === formData.index
              ? {
                  ...log,
                  date: formData.date,
                  name: formData.name,
                  checkIn: formData.checkIn,
                  checkOut: formData.checkOut,
                  status: formData.status,
                }
              : log
          )
        );
      }
    } else if (view === 'shift kerja') {
      const staffArr = formData.staff
        ? formData.staff.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      if (modalMode === 'add') {
        const newSch = { name: formData.name, staff: staffArr };
        supabase.from('shift_schedules').insert([newSch]).then();
        setShiftSchedules(prev => [...prev, newSch]);
      } else {
        const itemToUpdate = shiftSchedules[formData.index];
        const updatedSch = { name: formData.name, staff: staffArr };
        if (itemToUpdate && itemToUpdate.id) {
          supabase.from('shift_schedules').update(updatedSch).eq('id', itemToUpdate.id).then();
        }
        setShiftSchedules(prev =>
          prev.map((s, idx) => (idx === formData.index ? { ...s, ...updatedSch } : s))
        );
      }
    }

    setIsModalOpen(false);
    setFormData({});
    showSuccessAlert('Data Disimpan', 'Data berhasil disimpan!');
  };

  // Save settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      id: 'main',
      store_name: storeName,
      store_address: storeAddress,
      store_phone: storePhone,
      printer_ip: printerIP,
      tax_rate: taxRate,
    };
    supabase.from('settings').upsert(updatedSettings).then(({ error }) => {
      if (error) console.error('Error saving settings to Supabase:', error);
    });
    setSettings({
      storeName,
      storeAddress,
      storePhone,
      printerIP,
      taxRate,
    });
    showSuccessAlert('Pengaturan Disimpan', 'Pengaturan gerai berhasil disimpan!');
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-surface-container-low/40">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-on-surface tracking-tight uppercase">
            Kelola {view}
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Manajemen operasional toko - Halaman data dan konfigurasi.
          </p>
        </div>
        {userRole !== 'owner' && (
          <div>
            <button
              onClick={onOpenPos}
              className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/15 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              BUKA KASIR POS
            </button>
          </div>
        )}
      </div>

      {/* Main Content Pane */}
      <div className="bg-white rounded-2xl border border-outline-variant/35 shadow-sm overflow-hidden p-4 md:p-6">
        {/* Search Header for Tables (Except settings & Kasir Attendance) */}
        {view !== 'settings' && !(userRole === 'kasir' && view === 'absensi') && (
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="relative max-w-xs w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 text-[18px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 rounded-xl text-xs outline-none text-on-surface"
                placeholder={`Cari ${view}...`}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {view === 'produk' && (
              <button
                onClick={() => openForm('add')}
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Tambah Produk
              </button>
            )}
            {view === 'kategori' && (
              <button
                onClick={() => openForm('add')}
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Tambah Kategori
              </button>
            )}

            {view === 'staff' && (
              <button
                onClick={() => openForm('add')}
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                Tambah Staff
              </button>
            )}
            {view === 'absensi' && (
              <button
                onClick={() => openForm('add')}
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                Check-in Staf
              </button>
            )}
            {view === 'shift kerja' && (
              <button
                onClick={() => openForm('add')}
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Tambah Shift
              </button>
            )}
          </div>
        )}

        {/* 1. View Transaksi */}
        {view === 'transaksi' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 font-mono text-[10px] text-on-surface-variant/60 uppercase border-b border-outline-variant/25">
                  <th className="px-6 py-3 font-bold">No. Invoice</th>
                  <th className="px-6 py-3 font-bold">Pelanggan</th>
                  <th className="px-6 py-3 font-bold">Waktu Transaksi</th>
                  <th className="px-6 py-3 font-bold">Metode</th>
                  <th className="px-6 py-3 font-bold text-right">Total Transaksi</th>
                  <th className="px-6 py-3 font-bold text-center">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-on-surface-variant/50 font-mono">
                      Tidak ada transaksi ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-6 py-3.5 font-bold font-mono text-primary">{tx.id}</td>
                      <td className="px-6 py-3.5 font-bold">{tx.customer}</td>
                      <td className="px-6 py-3.5 text-on-surface-variant/65">{tx.time}</td>
                      <td className="px-6 py-3.5">
                      <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant">
                        {tx.method}
                      </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold font-mono">{formatPrice(tx.total)}</td>
                      <td className="px-6 py-3.5 text-center">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full uppercase">
                        {tx.status}
                      </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onReprint(tx)}
                            className="px-2.5 py-1.5 text-[10px] font-bold border border-outline-variant/40 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
                          >
                            Cetak Ulang
                          </button>
                          <button
                            onClick={() => handleDelete(tx)}
                            className="p-1 hover:bg-surface-container-low text-error rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                            title="Batal / Void Transaksi"
                          >
                            delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. View Produk */}
        {view === 'produk' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 font-mono text-[10px] text-on-surface-variant/60 uppercase border-b border-outline-variant/25">
                  <th className="px-6 py-3 font-bold">SKU</th>
                  <th className="px-6 py-3 font-bold">Nama Produk</th>
                  <th className="px-6 py-3 font-bold">Kategori</th>
                  <th className="px-6 py-3 font-bold text-right">Harga Modal</th>
                  <th className="px-6 py-3 font-bold text-right">Harga Jual</th>
                  <th className="px-6 py-3 font-bold text-center">Stok Toko</th>
                  <th className="px-6 py-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-on-surface-variant/50 font-mono">
                      Tidak ada produk ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(item => {
                    const mockStock = Math.floor(12 + (item.name.length % 5) * 4);
                    const catObj = categories.find(c => c.id === item.category);
                    return (
                      <tr key={item.id} className="hover:bg-surface-container-low/20 transition-colors">
                        <td className="px-6 py-3.5 font-bold font-mono text-on-surface-variant/70">{item.sku || 'N/A'}</td>
                        <td className="px-6 py-3.5 font-bold text-primary">{item.name}</td>
                        <td className="px-6 py-3.5 uppercase font-bold text-[10px] text-on-surface-variant/80">
                          {catObj ? catObj.name : item.category}
                        </td>
                        <td className="px-6 py-3.5 text-right font-bold font-mono text-on-surface-variant/65">
                          {formatPrice(item.costPrice || 0)}
                        </td>
                        <td className="px-6 py-3.5 text-right font-bold font-mono text-primary">{formatPrice(item.price)}</td>
                        <td className="px-6 py-3.5 text-center font-bold font-mono text-on-surface-variant/80">
                          {mockStock}
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openForm('edit', item)}
                              className="p-1 hover:bg-surface-container-low text-primary rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                            >
                              edit
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1 hover:bg-surface-container-low text-error rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                            >
                              delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. View Kategori */}
        {view === 'kategori' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 font-mono text-[10px] text-on-surface-variant/60 uppercase border-b border-outline-variant/25">
                  <th className="px-6 py-3 font-bold">Ikon</th>
                  <th className="px-6 py-3 font-bold">Nama Kategori</th>
                  <th className="px-6 py-3 font-bold text-center">Jumlah Item Produk</th>
                  <th className="px-6 py-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-on-surface-variant/50 font-mono">
                      Tidak ada kategori ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map(cat => {
                    const count = products.filter(p => p.category === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-surface-container-low/20 transition-colors">
                        <td className="px-6 py-4">
                          <span className="material-symbols-outlined text-primary text-[20px]">{cat.icon}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm text-on-surface">{cat.name}</td>
                        <td className="px-6 py-4 text-center font-bold font-mono text-on-surface-variant/80">
                          {count} Item
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openForm('edit', cat)}
                              className="p-1 hover:bg-surface-container-low text-primary rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                            >
                              edit
                            </button>
                            <button
                              onClick={() => handleDelete(cat)}
                              className="p-1 hover:bg-surface-container-low text-error rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                            >
                              delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}



        {/* 5. View Staff */}
        {view === 'staff' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 font-mono text-[10px] text-on-surface-variant/60 uppercase border-b border-outline-variant/25">
                  <th className="px-6 py-3 font-bold">ID Staff</th>
                  <th className="px-6 py-3 font-bold">Nama Lengkap</th>
                  <th className="px-6 py-3 font-bold">Jabatan</th>
                  <th className="px-6 py-3 font-bold text-center">Shift Kerja</th>
                  <th className="px-6 py-3 font-bold text-center">Status</th>
                  <th className="px-6 py-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface">
                {filteredStaffMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-on-surface-variant/50 font-mono">
                      Tidak ada staff ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredStaffMembers.map(s => (
                    <tr key={s.id} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-6 py-3.5 font-bold font-mono text-on-surface-variant/60">{s.id}</td>
                      <td className="px-6 py-3.5 font-bold text-primary">{s.name}</td>
                      <td className="px-6 py-3.5 font-medium">{s.role}</td>
                      <td className="px-6 py-3.5 text-center font-bold text-on-surface-variant/75">{s.shift}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                            s.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-outline-variant/30 text-on-surface-variant/70'
                          }`}
                        >
                          {s.status === 'Aktif' ? 'Aktif' : 'Libur'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openForm('edit', s)}
                            className="p-1 hover:bg-surface-container-low text-primary rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => handleDelete(s)}
                            className="p-1 hover:bg-surface-container-low text-error rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                          >
                            delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. View Absensi */}
        {view === 'absensi' && userRole === 'kasir' ? (
          <div className="max-w-md mx-auto py-6 flex flex-col gap-6">
            {/* Today's Attendance Card */}
            {(() => {
              const todayDateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
              const todayLogIndex = attendanceLogs.findIndex(log => log.name === currentUser && log.date === todayDateStr);
              const todayLog = todayLogIndex !== -1 ? attendanceLogs[todayLogIndex] : null;

              const handleCheckInSelf = () => {
                const now = new Date();
                const checkInTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                // Check if late (e.g. after 07:00 is late)
                const isLate = now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 0);
                const dbLog = {
                  date: todayDateStr,
                  name: currentUser || 'Kasir',
                  check_in: checkInTime,
                  check_out: '--:--',
                  status: isLate ? `Terlambat` : 'Tepat Waktu'
                };
                supabase.from('attendance_logs').insert([dbLog]).then(({ error }) => {
                  if (error) console.error('Error inserting check-in to Supabase:', error);
                });
                const newLog = {
                  date: todayDateStr,
                  name: currentUser || 'Kasir',
                  checkIn: checkInTime,
                  checkOut: '--:--',
                  status: isLate ? `Terlambat` : 'Tepat Waktu'
                };
                setAttendanceLogs(prev => [newLog, ...prev]);
                showSuccessAlert('Check-in Berhasil', 'Check-in kehadiran hari ini berhasil dilakukan!');
              };

              const handleCheckOutSelf = () => {
                if (todayLogIndex === -1) return;
                showConfirmDialog(
                  'Konfirmasi Check-out',
                  'Apakah Anda yakin ingin melakukan Check-out Pulang?'
                ).then((result) => {
                  if (result.isConfirmed) {
                    const checkOutTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    const logToUpdate = attendanceLogs[todayLogIndex];
                    if (logToUpdate && logToUpdate.id) {
                      supabase.from('attendance_logs').update({
                        check_out: checkOutTime
                      }).eq('id', logToUpdate.id).then(({ error }) => {
                        if (error) console.error('Error check-out in Supabase:', error);
                      });
                    }
                    setAttendanceLogs(prev => prev.map((log, idx) => 
                      idx === todayLogIndex ? { ...log, checkOut: checkOutTime } : log
                    ));
                    showSuccessAlert('Check-out Berhasil', 'Check-out kepulangan hari ini berhasil dilakukan!');
                  }
                });
              };

              return (
                <div className="bg-surface-container-low border border-outline-variant/35 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">Absensi Mandiri</h3>
                  <p className="text-xs text-on-surface-variant/75 mt-1">{todayDateStr}</p>
                  <div className="w-full border-t border-outline-variant/20 my-4"></div>

                  {!todayLog ? (
                    // Not checked in yet
                    <div className="w-full space-y-3">
                      <p className="text-xs text-on-surface-variant/60">
                        Anda belum melakukan check-in kehadiran untuk shift hari ini.
                      </p>
                      <button
                        onClick={handleCheckInSelf}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20 active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">login</span>
                        Check-in Kedatangan
                      </button>
                    </div>
                  ) : (
                    // Checked in
                    <div className="w-full space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="bg-white p-3 rounded-xl border border-outline-variant/25">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant/50 block">Jam Masuk</span>
                          <span className="text-sm font-bold font-mono text-primary">{todayLog.checkIn}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-outline-variant/25">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant/50 block">Jam Pulang</span>
                          <span className="text-sm font-bold font-mono text-on-surface-variant">
                            {todayLog.checkOut === '--:--' ? 'Aktif' : todayLog.checkOut}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-outline-variant/25 text-left text-xs font-semibold text-on-surface-variant">
                        <span>Status Kehadiran</span>
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                          todayLog.status.includes('Tepat') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {todayLog.status}
                        </span>
                      </div>

                      {todayLog.checkOut === '--:--' && (
                        <button
                          onClick={handleCheckOutSelf}
                          className="w-full py-3 bg-error text-white rounded-xl font-bold hover:bg-error/95 transition-all shadow-md shadow-error/20 active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">logout</span>
                          Check-out Pulang
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Past Logs for Self */}
            <div className="bg-white rounded-2xl border border-outline-variant/35 shadow-sm p-4 overflow-hidden">
              <h4 className="font-bold text-xs text-on-surface mb-3 uppercase tracking-wider">Riwayat Absensi Saya</h4>
              <div className="overflow-x-auto max-h-[220px] order-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50 font-mono text-[8px] text-on-surface-variant/50 uppercase border-b border-outline-variant/20">
                      <th className="px-3 py-2">Tanggal</th>
                      <th className="px-3 py-2 text-center">Masuk</th>
                      <th className="px-3 py-2 text-center">Pulang</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 text-[10px] text-on-surface">
                    {(() => {
                      const myAttendance = attendanceLogs.filter(log => log.name === currentUser);
                      return myAttendance.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-on-surface-variant/50 font-mono">
                            Belum ada riwayat absensi.
                          </td>
                        </tr>
                      ) : (
                        myAttendance.map((log, i) => (
                          <tr key={i} className="hover:bg-surface-container-low/20 transition-colors">
                            <td className="px-3 py-2.5 font-medium">{log.date}</td>
                            <td className="px-3 py-2.5 text-center font-mono font-bold text-primary">{log.checkIn}</td>
                            <td className="px-3 py-2.5 text-center font-mono">{log.checkOut}</td>
                            <td className="px-3 py-2.5 text-right font-bold">
                              <span className={log.status.includes('Tepat') ? 'text-emerald-600' : 'text-error'}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : view === 'absensi' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 font-mono text-[10px] text-on-surface-variant/60 uppercase border-b border-outline-variant/25">
                  <th className="px-6 py-3 font-bold">Tanggal</th>
                  <th className="px-6 py-3 font-bold">Nama Karyawan</th>
                  <th className="px-6 py-3 font-bold text-center">Jam Masuk</th>
                  <th className="px-6 py-3 font-bold text-center">Jam Pulang</th>
                  <th className="px-6 py-3 font-bold text-center">Keterangan</th>
                  <th className="px-6 py-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface">
                {filteredAttendanceLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-on-surface-variant/50 font-mono">
                      Tidak ada catatan absensi ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredAttendanceLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-6 py-3.5 text-on-surface-variant/70">{log.date}</td>
                      <td className="px-6 py-3.5 font-bold">{log.name}</td>
                      <td className="px-6 py-3.5 text-center font-mono font-bold text-primary">{log.checkIn}</td>
                      <td className="px-6 py-3.5 text-center font-mono">{log.checkOut}</td>
                      <td className="px-6 py-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                            log.status === 'Tepat Waktu'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openForm('edit', { ...log, index: i })}
                            className="p-1 hover:bg-surface-container-low text-primary rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => handleDelete({ index: i })}
                            className="p-1 hover:bg-surface-container-low text-error rounded transition-colors cursor-pointer material-symbols-outlined text-[18px]"
                          >
                            delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* 7. View Shift Kerja */}
        {view === 'shift kerja' && (
          <div className="space-y-4">
            <p className="text-xs text-on-surface-variant/70">
              Berikut adalah daftar pembagian shift kerja karyawan M-Coffee hari ini:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredShiftSchedules.length === 0 ? (
                <div className="col-span-3 text-center py-6 text-on-surface-variant/50 font-mono text-xs">
                  Tidak ada jadwal shift ditemukan.
                </div>
              ) : (
                filteredShiftSchedules.map((sch, i) => (
                  <div key={i} className="bg-surface-container-low border border-outline-variant/40 p-4 rounded-xl relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface-container-low p-1 rounded-lg">
                      <button
                        onClick={() => openForm('edit', { ...sch, index: i })}
                        className="p-1 text-primary hover:bg-white rounded transition-colors cursor-pointer material-symbols-outlined text-[16px]"
                      >
                        edit
                      </button>
                      <button
                        onClick={() => handleDelete({ index: i })}
                        className="p-1 text-error hover:bg-white rounded transition-colors cursor-pointer material-symbols-outlined text-[16px]"
                      >
                        delete
                      </button>
                    </div>
                    <h4 className="font-bold text-xs text-primary mb-3 uppercase tracking-wider font-mono">
                      {sch.name}
                    </h4>
                    <ul className="space-y-2">
                      {sch.staff.map((st: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-xs font-semibold text-on-surface flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-outline-variant/20 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/75">
                            person
                          </span>
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 8. View Pengaturan (Settings) */}
        {view === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface-variant/80 uppercase">Nama Toko / Cafe</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface-variant/80 uppercase">Nomor Telepon</label>
                <input
                  type="text"
                  required
                  value={storePhone}
                  onChange={e => setStorePhone(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-on-surface-variant/80 uppercase">Alamat Toko</label>
              <textarea
                required
                rows={2}
                value={storeAddress}
                onChange={e => setStoreAddress(e.target.value)}
                className="px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface-variant/80 uppercase">IP Printer Kasir</label>
                <input
                  type="text"
                  required
                  value={printerIP}
                  onChange={e => setPrinterIP(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:bg-white focus:border-primary/45 font-mono text-on-surface"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-on-surface-variant/80 uppercase">Tarif Pajak PPN (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={e => setTaxRate(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 active:scale-[0.98] cursor-pointer"
              >
                Simpan Pengaturan
              </button>
            </div>
          </form>
        )}
      </div>

      {/* CRUD Modal Form Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-black text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  {modalMode === 'add' ? 'add_box' : 'edit_square'}
                </span>
                {modalMode === 'add' ? 'Tambah Data Baru' : 'Ubah Data'} ({view})
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-4 select-none">
              {/* Product Modal Inputs */}
              {view === 'produk' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                        SKU Kopi/Makanan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: MKN-MFF"
                        value={formData.sku || ''}
                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-mono text-on-surface"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                        Kategori *
                      </label>
                      <select
                        value={formData.category || 'coffee'}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="px-3 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Nama Produk *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama menu..."
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                        Harga Beli / Modal (Rp) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="Harga Beli..."
                        value={formData.costPrice || ''}
                        onChange={e => setFormData({ ...formData, costPrice: e.target.value })}
                        className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-bold text-on-surface"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                        Harga Jual (Rp) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="Harga Jual..."
                        value={formData.price || ''}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-bold text-on-surface"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Deskripsi Menu
                    </label>
                    <textarea
                      placeholder="Tulis detail deskripsi bahan / cara penyajian..."
                      rows={2}
                      value={formData.description || ''}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-medium text-on-surface resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      URL Gambar Produk (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Kosongkan untuk memakai gambar default..."
                      value={formData.image || ''}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 text-on-surface font-mono"
                    />
                  </div>
                </>
              )}

              {/* Category Modal Inputs */}
              {view === 'kategori' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Kode Kategori (Unique ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: coffee, tea, snack"
                      value={formData.id || ''}
                      disabled={modalMode === 'edit'}
                      onChange={e => setFormData({ ...formData, id: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-mono text-on-surface disabled:opacity-60"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Nama Kategori *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Roti & Kue"
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Ikon Kategori (Material Symbol) *
                    </label>
                    <select
                      value={formData.icon || 'coffee'}
                      onChange={e => setFormData({ ...formData, icon: e.target.value })}
                      className="px-3 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                    >
                      {popularIcons.map(icon => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label} (code: {icon.value})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}



              {/* Staff Modal Inputs */}
              {view === 'staff' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      ID Karyawan / Staff *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: STF-06"
                      value={formData.id || ''}
                      disabled={modalMode === 'edit'}
                      onChange={e => setFormData({ ...formData, id: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-mono text-on-surface disabled:opacity-60"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Nama Lengkap Staff *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama staf..."
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Jabatan Pekerjaan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Barista Junior"
                      value={formData.role || ''}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 text-on-surface"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                        Shift Utama *
                      </label>
                      <select
                        value={formData.shift || 'Pagi'}
                        onChange={e => setFormData({ ...formData, shift: e.target.value })}
                        className="px-3 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                      >
                        <option value="Pagi">Pagi (07:00 - 15:00)</option>
                        <option value="Sore">Sore (15:00 - 23:00)</option>
                        <option value="Full">Full Time (07:00 - 18:00)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                        Status Keaktifan *
                      </label>
                      <select
                        value={formData.status || 'Aktif'}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="px-3 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Off">Libur / Off</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Attendance Modal Inputs */}
              {view === 'absensi' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Karyawan *
                    </label>
                    <select
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="px-3 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                    >
                      {staffMembers.map(s => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Tanggal Absen *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.date || ''}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                        Jam Masuk (Check-In) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.checkIn || ''}
                        onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                        className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-mono text-center font-bold text-on-surface"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                        Jam Pulang (Check-Out) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.checkOut || ''}
                        onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                        className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-mono text-center font-bold text-on-surface"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Keterangan *
                    </label>
                    <select
                      value={formData.status || 'Tepat Waktu'}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="px-3 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                    >
                      <option value="Tepat Waktu">Tepat Waktu</option>
                      <option value="Terlambat (10m)">Terlambat (10m)</option>
                      <option value="Terlambat (20m)">Terlambat (20m)</option>
                      <option value="Terlambat (30m)">Terlambat (30m+)</option>
                      <option value="Izin / Sakit">Izin / Sakit</option>
                    </select>
                  </div>
                </>
              )}

              {/* Shift Kerja Modal Inputs */}
              {view === 'shift kerja' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Nama Shift Kerja *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Shift Pagi (07:00 - 15:00)"
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 font-semibold text-on-surface"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant/85 uppercase font-mono">
                      Karyawan Bertugas (Pisahkan dengan koma) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Marcus W. (Kasir), Sarah K. (Barista)"
                      value={formData.staff || ''}
                      onChange={e => setFormData({ ...formData, staff: e.target.value })}
                      className="px-3.5 py-2 bg-surface-container-low border border-outline-variant/45 rounded-xl text-xs outline-none focus:bg-white focus:border-primary/45 text-on-surface"
                    />
                  </div>
                </>
              )}

              {/* Form Buttons */}
              <div className="pt-4 border-t border-outline-variant/30 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant/45 text-on-surface hover:bg-surface-container-low rounded-xl font-bold transition-all text-[11px] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white hover:bg-primary/95 rounded-xl font-bold transition-all text-[11px] cursor-pointer active:scale-95"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
