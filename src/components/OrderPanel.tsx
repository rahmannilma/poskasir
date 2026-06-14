import React, { useMemo } from 'react';
import { OrderItem } from '../data';

interface OrderPanelProps {
  orderNumber: string;
  customerName: string;
  onCustomerNameChange: (val: string) => void;
  tableNumber: string;
  onTableNumberChange: (val: string) => void;
  items: OrderItem[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearOrder: () => void;

  // Checkout states
  paymentMethod: 'cash' | 'card' | 'qris';
  onPaymentMethodChange: (method: 'cash' | 'card' | 'qris') => void;
  amountPaid: string;
  onAmountPaidChange: (val: string) => void;
  discountPercent: string;
  onDiscountPercentChange: (val: string) => void;

  // Edit / Pending order states
  editingOrderId: string | null;
  onSaveOrderPending: () => void;
  onVoidPendingOrder: () => void;
  onCancelEdit: () => void;
  onSubmitCheckout: (e: React.FormEvent) => void;
  isProcessing: boolean;

  // Drawer states
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderPanel({
  orderNumber,
  customerName,
  onCustomerNameChange,
  tableNumber,
  onTableNumberChange,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearOrder,
  paymentMethod,
  onPaymentMethodChange,
  amountPaid,
  onAmountPaidChange,
  discountPercent,
  onDiscountPercentChange,
  editingOrderId,
  onSaveOrderPending,
  onVoidPendingOrder,
  onCancelEdit,
  onSubmitCheckout,
  isProcessing,
  isOpen,
  onClose,
}: OrderPanelProps) {
  
  // Formatter IDR
  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    const pct = parseFloat(discountPercent) || 0;
    return (subtotal * pct) / 100;
  }, [subtotal, discountPercent]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const changeAmount = useMemo(() => {
    const paid = parseFloat(amountPaid) || 0;
    return Math.max(0, paid - total);
  }, [amountPaid, total]);

  const underpaidAmount = useMemo(() => {
    const paid = parseFloat(amountPaid) || 0;
    return Math.max(0, total - paid);
  }, [amountPaid, total]);

  // Uang cepat suggestions
  const quickCashAmounts = useMemo(() => {
    if (total <= 0) return [];
    const base = [10000, 20000, 50000, 100000];
    const suggestions = new Set<number>();
    
    // hitung bulatan terdekat di atas total
    suggestions.add(Math.ceil(total / 10000) * 10000);
    suggestions.add(Math.ceil(total / 50000) * 50000);
    suggestions.add(Math.ceil(total / 100000) * 100000);
    base.forEach(amt => {
      if (amt >= total) suggestions.add(amt);
    });
    return Array.from(suggestions).sort((a, b) => a - b).slice(0, 4);
  }, [total]);

  const hasItems = items.length > 0;

  return (
    <aside
      className={`bg-surface border-l border-outline-variant flex flex-col h-full max-h-screen overflow-hidden shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-40 lg:z-10
        fixed lg:static inset-y-0 right-0 w-full sm:max-w-[420px] lg:max-w-none lg:w-[380px] lg:min-w-[380px]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${isOpen ? 'flex' : 'hidden lg:flex'}`}
    >
      {/* Header Panel */}
      <div className="p-4 md:p-5 border-b border-outline-variant bg-surface shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">shopping_cart</span>
            <h2 className="text-body-md font-bold text-on-surface">Keranjang Belanja</h2>
          </div>
        </div>
        <span className="bg-primary text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          {editingOrderId ? 'EDIT' : `#${orderNumber}`}
        </span>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-grow overflow-y-auto flex flex-col order-scrollbar bg-surface-container-lowest/50">
        {/* Cart Items List */}
        <div className={`p-4 space-y-3 ${
          !hasItems ? 'flex-grow flex flex-col items-center justify-center text-on-surface-variant/50' : ''
        }`}>
        {!hasItems ? (
          <>
            <span className="material-symbols-outlined text-[48px] mb-2 text-primary opacity-30">
              shopping_cart
            </span>
            <p className="text-xs font-bold">Keranjang masih kosong</p>
            <p className="text-[10px] opacity-75">Tekan menu produk untuk menambahkan</p>
          </>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl border border-outline-variant/35 shadow-sm group hover:border-outline-variant/80 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-sm text-primary">{item.quantity}x</span>
                    <span className="text-sm font-bold text-on-surface truncate block">
                      {item.menuItem.name}
                    </span>
                  </div>
                  {item.modifiers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {item.modifiers.map((mod) => (
                        <span
                          key={mod}
                          className="inline-block bg-primary/5 text-primary text-[10px] px-1.5 py-0.2 rounded-full font-semibold"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-xs text-on-surface-variant/60 italic truncate">
                      Catatan: {item.notes}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0 flex flex-col items-end">
                  <span className="text-sm font-bold text-on-surface font-mono">
                    {formatPrice(item.menuItem.price * item.quantity)}
                  </span>
                  
                  {/* Quantity adjustments */}
                  <div className="mt-2 flex gap-1.5 opacity-80 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-5 h-5 rounded-full border border-outline-variant hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant text-[14px]"
                    >
                      -
                    </button>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-5 h-5 rounded-full border border-outline-variant hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant text-[14px]"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-5 h-5 rounded-full border border-error-container text-error hover:bg-error/5 flex items-center justify-center text-[14px] material-symbols-outlined"
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Form */}
      {hasItems && (
        <form
          onSubmit={onSubmitCheckout}
          className="bg-surface border-t border-outline-variant p-4 space-y-3 shrink-0"
        >
          {/* Diskon (%) */}
          <div className="flex flex-col gap-1 shrink-0">
            <label className="text-xs font-bold text-on-surface-variant/70 uppercase">
              Diskon (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={discountPercent}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 100)) {
                  onDiscountPercentChange(val);
                }
              }}
              className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-sm outline-none focus:bg-white focus:border-primary/40 font-mono text-on-surface"
            />
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col gap-1 text-xs border-t border-b border-outline-variant/30 py-2 shrink-0">
            <div className="flex justify-between text-on-surface-variant/80">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            {parseFloat(discountPercent) > 0 && (
              <div className="flex justify-between text-error font-bold">
                <span>Diskon ({discountPercent}%)</span>
                <span className="font-mono">- {formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-on-surface text-sm pt-1.5 border-t border-outline-variant/30">
              <span>Total</span>
              <span className="text-primary font-mono text-base">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-1 shrink-0">
            <label className="text-xs font-bold text-on-surface-variant/70 uppercase">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onPaymentMethodChange('cash');
                  onAmountPaidChange('');
                }}
                className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-primary text-white font-bold border-primary shadow-sm'
                    : 'bg-white border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] mb-0.5" style={{ fontVariationSettings: paymentMethod === 'cash' ? "'FILL' 1" : undefined }}>payments</span>
                <span>Tunai</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onPaymentMethodChange('card');
                  onAmountPaidChange(total.toString());
                }}
                className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-primary text-white font-bold border-primary shadow-sm'
                    : 'bg-white border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] mb-0.5" style={{ fontVariationSettings: paymentMethod === 'card' ? "'FILL' 1" : undefined }}>credit_card</span>
                <span>Kartu</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onPaymentMethodChange('qris');
                  onAmountPaidChange(total.toString());
                }}
                className={`flex flex-col items-center justify-center py-2 rounded-lg border text-[10px] transition-all cursor-pointer ${
                  paymentMethod === 'qris'
                    ? 'bg-primary text-white font-bold border-primary shadow-sm'
                    : 'bg-white border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] mb-0.5" style={{ fontVariationSettings: paymentMethod === 'qris' ? "'FILL' 1" : undefined }}>qr_code_2</span>
                <span>QRIS</span>
              </button>
            </div>
          </div>

          {/* Cash calculator suggestions */}
          {paymentMethod === 'cash' && (
            <div className="flex flex-col gap-1.5 bg-surface-container-low/40 p-2 rounded-xl border border-outline-variant/30 shrink-0">
              <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant/70 uppercase">
                <span>Uang Diterima</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-xs font-bold text-on-surface-variant/50">Rp</span>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={amountPaid}
                  onChange={(e) => onAmountPaidChange(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-outline-variant/40 rounded-lg text-sm font-mono text-right outline-none focus:border-primary/40 text-on-surface font-bold"
                />
              </div>

              {/* Suggestions grid */}
              <div className="grid grid-cols-2 gap-1 mt-0.5">
                {quickCashAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => onAmountPaidChange(amt.toString())}
                    className="py-1 rounded bg-white border border-outline-variant/30 text-xs text-on-surface font-mono hover:bg-surface-container-low transition-colors cursor-pointer text-center font-bold"
                  >
                    +{amt.toLocaleString('id-ID')}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onAmountPaidChange(total.toString())}
                  className="col-span-2 py-1.5 rounded bg-primary/10 border border-primary/20 text-xs text-primary font-bold hover:bg-primary/20 transition-colors cursor-pointer text-center"
                >
                  ✨ Uang Pas (UPPT)
                </button>
              </div>
            </div>
          )}

          {/* Change or error messages */}
          {paymentMethod === 'cash' && (
            <div className="text-xs font-mono font-bold shrink-0">
              {parseFloat(amountPaid) >= total ? (
                <div className="flex justify-between items-center p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-xs">
                  <span>Kembalian:</span>
                  <span>{formatPrice(changeAmount)}</span>
                </div>
              ) : parseFloat(amountPaid) > 0 ? (
                <div className="flex justify-between items-center p-2 bg-red-50 text-error rounded-lg border border-red-200 text-xs">
                  <span>Uang Kurang:</span>
                  <span>{formatPrice(underpaidAmount)}</span>
                </div>
              ) : (
                <div className="p-2 bg-surface-container-low text-on-surface-variant/60 text-center rounded-lg border border-outline-variant/20 text-xs">
                  Masukkan uang diterima
                </div>
              )}
            </div>
          )}

          {/* Customer & Table details */}
          <div className="grid grid-cols-2 gap-2 mt-1 shrink-0">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-on-surface-variant/70 uppercase">Pelanggan</label>
              <input
                type="text"
                placeholder="Nama..."
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                className="px-2.5 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-sm outline-none focus:bg-white focus:border-primary/40 text-on-surface"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-on-surface-variant/70 uppercase">No. Meja</label>
              <input
                type="text"
                placeholder="Meja..."
                value={tableNumber}
                onChange={(e) => onTableNumberChange(e.target.value)}
                className="px-2.5 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-sm outline-none focus:bg-white focus:border-primary/40 text-on-surface"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-outline-variant/30 font-bold text-sm shrink-0">
            {editingOrderId !== null ? (
              <>
                <button
                  type="submit"
                  disabled={
                    isProcessing || (paymentMethod === 'cash' && (parseFloat(amountPaid) || 0) < total)
                  }
                  className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>{isProcessing ? 'Memproses...' : 'Bayar & Selesaikan'}</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={onSaveOrderPending}
                  className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Simpan Perubahan</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={onVoidPendingOrder}
                    className="bg-error text-white font-semibold py-1.5 rounded-lg hover:bg-error/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    <span>Hapus Meja</span>
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={onCancelEdit}
                    className="border border-outline-variant text-on-surface-variant font-medium py-1.5 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    <span>Batal Edit</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={
                    isProcessing || (paymentMethod === 'cash' && (parseFloat(amountPaid) || 0) < total)
                  }
                  className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>{isProcessing ? 'Memproses...' : 'Bayar Sekarang'}</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={onSaveOrderPending}
                  className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">bookmark</span>
                  <span>Simpan Pesanan</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={onClearOrder}
                  className="w-full border border-outline-variant text-on-surface-variant font-semibold py-2 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  <span>Kosongkan</span>
                </button>
              </>
            )}
          </div>
        </form>
      )}
      </div>
    </aside>
  );
}
