import { MenuItem } from '../data';

interface ProductGridProps {
  items: MenuItem[];
  selectedItemId: string | null;
  onItemClick: (item: MenuItem) => void;
}

export default function ProductGrid({ items, selectedItemId, onItemClick }: ProductGridProps) {
  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-on-surface-variant p-8 font-sans">
        <div className="text-center">
          <span className="material-symbols-outlined text-[64px] mb-3 block opacity-30 text-primary animate-pulse">
            inventory_2
          </span>
          <p className="text-title-sm font-bold text-on-surface">Tidak ada produk ditemukan</p>
          <p className="text-xs opacity-75 mt-1">Coba sesuaikan pencarian atau kategori Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 pt-1 md:pt-1 overflow-y-auto flex-grow order-scrollbar">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 md:gap-3">
        {items.map((item) => {
          const isSelected = selectedItemId === item.id;
          const mockStock = Math.floor(12 + (item.name.length % 5) * 4); // generate realistic mock stock
          
          return (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className={`product-card group bg-surface-container-lowest p-2 rounded-xl border transition-all duration-150 flex flex-col justify-between shadow-sm cursor-pointer select-none active:scale-[0.98] ${
                isSelected
                  ? 'border-primary shadow-md shadow-primary/5'
                  : 'border-outline-variant/40 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <div>
                {/* Product Image */}
                <div className="h-16 sm:h-20 w-full rounded-lg mb-1.5 overflow-hidden bg-surface-variant relative shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-on-primary text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                      AKTIF
                    </div>
                  )}
                </div>
 
                {/* SKU & Stock */}
                <div className="flex justify-between items-center gap-1 mb-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/60 font-mono font-bold">
                    {item.sku || 'KPP-VAR'}
                  </span>
                  <span className="text-[8px] px-1 py-0.2 rounded font-semibold font-mono bg-surface-container-low text-on-surface-variant/85">
                    Stok: {mockStock}
                  </span>
                </div>
 
                {/* Title */}
                <h3 className="text-[11px] sm:text-xs font-bold text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h3>
              </div>
 
              {/* Price & Add button */}
              <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-surface-container-low">
                <span className="text-[11px] sm:text-xs font-bold font-mono text-primary">
                  {formatPrice(item.price)}
                </span>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white ${
                    isSelected ? 'bg-primary text-white' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[10px] font-bold">add</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
