import { baristaAvatar } from '../data';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuClick: () => void;
  onCartClick: () => void;
  cartItemCount: number;
  activeView: string;
}

export default function TopBar({
  searchQuery,
  onSearchChange,
  onMenuClick,
  onCartClick,
  cartItemCount,
  activeView,
}: TopBarProps) {
  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 h-20 bg-white/85 backdrop-blur-md border-b border-outline-variant shrink-0 z-20 gap-2 md:gap-4">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button
          onClick={onMenuClick}
          className={`${activeView === 'pos' ? '' : 'md:hidden'} p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center cursor-pointer`}
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h2 className="text-sm md:text-lg font-bold text-on-surface tracking-tight whitespace-nowrap hidden sm:block">
          Point of Sale (POS)
        </h2>
      </div>

      {/* Middle section: Search bar */}
      <div className="flex-grow max-w-md mx-2 md:mx-4">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 text-[18px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 rounded-full text-xs md:text-sm transition-all outline-none text-on-surface"
            placeholder="Cari produk atau SKU..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Right section: Calendar, Cart, Avatar */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button className="hidden md:flex p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined text-[22px]">calendar_today</span>
        </button>

        {/* Mobile Cart Toggle button */}
        <button
          onClick={onCartClick}
          className="lg:hidden relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
          {cartItemCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {cartItemCount}
            </span>
          )}
        </button>

        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant/30 shrink-0">
          <img
            alt="Profil Barista"
            className="w-full h-full object-cover"
            src={baristaAvatar}
          />
        </div>
      </div>
    </header>
  );
}
