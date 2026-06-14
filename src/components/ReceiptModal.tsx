import { OrderItem } from '../data';
import { showSuccessAlert } from '../utils/swal';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'qris';
  amountPaid: number;
  changeAmount: number;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  orderNumber,
  customerName,
  tableNumber,
  items,
  subtotal,
  discountPercent,
  discountAmount,
  total,
  paymentMethod,
  amountPaid,
  changeAmount,
  storeName,
  storeAddress,
  storePhone,
}: ReceiptModalProps) {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  const getPaymentLabel = (method: 'cash' | 'card' | 'qris') => {
    switch (method) {
      case 'cash':
        return 'Tunai';
      case 'card':
        return 'Kartu Kredit/Debit';
      case 'qris':
        return 'QRIS';
      default:
        return '-';
    }
  };

  const handlePrint = () => {
    showSuccessAlert('Mencetak Struk', 'Mock Printing: Struk dikirim ke printer kasir...');
  };

  const currentDate = new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Receipt Paper Card */}
        <div className="p-6 overflow-y-auto flex-grow bg-white text-black font-mono text-sm leading-relaxed order-scrollbar select-none">
          {/* Header */}
          <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
            <h3 className="text-lg font-black tracking-widest uppercase">{storeName || 'M-COFFEE CAFE'}</h3>
            <p className="text-xs text-gray-500">{storeAddress || 'Jl. Kopi Presisi No. 12, Jakarta'}</p>
            <p className="text-[10px] text-gray-400 mt-1">Telp: {storePhone || '0812-3456-7890'}</p>
          </div>

          {/* Metadata */}
          <div className="space-y-1 mb-4 border-b border-dashed border-gray-300 pb-4 text-xs">
            <div className="flex justify-between">
              <span>No. Invoice:</span>
              <span className="font-bold">#INV-{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{currentDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>Kasir Utama</span>
            </div>
            {customerName && (
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="truncate max-w-[150px]">{customerName}</span>
              </div>
            )}
            {tableNumber && (
              <div className="flex justify-between">
                <span>No. Meja:</span>
                <span>Meja {tableNumber}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
            <div className="grid grid-cols-12 gap-1 font-bold text-xs mb-2 text-gray-500">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-4 text-right">Total</span>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="text-xs">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-6 font-semibold text-gray-800">{item.menuItem.name}</span>
                    <span className="col-span-2 text-center text-gray-600">{item.quantity}</span>
                    <span className="col-span-4 text-right text-gray-800 font-bold">
                      {formatPrice(item.menuItem.price * item.quantity)}
                    </span>
                  </div>
                  {item.modifiers.length > 0 && (
                    <div className="text-[10px] text-gray-400 pl-2">
                      + {item.modifiers.join(', ')}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[10px] text-gray-400 italic pl-2">
                      Catatan: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1.5 border-b border-dashed border-gray-300 pb-4 mb-4 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Diskon ({discountPercent}%):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm pt-1.5 text-gray-900 border-t border-gray-100">
              <span>TOTAL:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Payments details */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Metode:</span>
              <span>{getPaymentLabel(paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bayar:</span>
              <span>{formatPrice(amountPaid || total)}</span>
            </div>
            {paymentMethod === 'cash' && (
              <div className="flex justify-between font-bold text-gray-800">
                <span>Kembalian:</span>
                <span>{formatPrice(changeAmount)}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t border-dashed border-gray-300 text-xs text-gray-400">
            <p>Terima Kasih</p>
            <p className="mt-1">Atas Kunjungan Anda!</p>
          </div>
        </div>

        {/* Buttons Actions */}
        <div className="bg-surface-container-low p-4 border-t border-outline-variant flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-secondary text-on-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Cetak Struk
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
