import { baristaAvatar } from '../data';
import logoImg from './logo.jpg';
import { showWarningAlert } from '../utils/swal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  currentUser: string;
  onLogout: () => void;
  userRole: string;
}

interface MenuItem {
  icon: string;
  label: string;
  view?: string;
}

const menuItems: MenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', view: 'dashboard' },
  { icon: 'receipt_long', label: 'Transaksi', view: 'transaksi' },
  { icon: 'inventory_2', label: 'Produk', view: 'produk' },
  { icon: 'category', label: 'Kategori', view: 'kategori' },
  { icon: 'groups', label: 'Staff', view: 'staff' },
  { icon: 'fingerprint', label: 'Absensi', view: 'absensi' },
  { icon: 'schedule', label: 'Shift Kerja', view: 'shift kerja' },
  { icon: 'shopping_cart', label: 'POS Kasir', view: 'pos' },
  { icon: 'settings', label: 'Pengaturan', view: 'settings' },
];

export default function Sidebar({
  isOpen,
  onClose,
  activeView,
  onViewChange,
  currentUser,
  onLogout,
  userRole,
}: SidebarProps) {
  const filteredMenuItems = menuItems.filter((item) => {
    if (userRole === 'owner') {
      return item.view !== 'pos';
    } else {
      return item.view === 'pos' || item.view === 'absensi' || item.view === 'transaksi';
    }
  });

  return (
    <aside
      className={`fixed left-0 top-0 h-full flex flex-col bg-surface border-r border-outline-variant w-72 z-50 transition-transform duration-300 ease-in-out ${
        activeView === 'pos' ? '' : 'md:translate-x-0'
      } ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header Logo */}
      <div className="p-6 flex items-center justify-between border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            className="w-10 h-10 rounded-full object-cover shadow-lg shadow-primary/20 shrink-0"
            alt="M-Coffee Logo"
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-on-surface">
              M-<span className="text-primary">COFFEE</span>
            </h1>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden flex items-center justify-center p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-grow px-4 mt-6 flex flex-col gap-1.5 overflow-y-auto order-scrollbar">
        {filteredMenuItems.map((item) => {
          const isActive = item.view ? activeView === item.view : false;
          return (
            <a
              key={item.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (item.view) {
                  onViewChange(item.view);
                } else {
                  showWarningAlert('Fitur Demo', `Fitur demo ${item.label} belum diaktifkan.`);
                }
                onClose();
              }}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all group ${
                isActive
                  ? 'bg-primary/5 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'
                }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
              >
                {item.icon}
              </span>
              <span className="text-body-sm font-sans">{item.label}</span>
            </a>
          );
        })}
      </div>

      {/* Footer Profile */}
      <div className="p-5 mt-auto border-t border-outline-variant/40 bg-surface-container-lowest">
        <div className="flex items-center gap-3 bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/35">
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-primary text-xs overflow-hidden">
            <img
              alt="Profil Kasir"
              className="w-full h-full object-cover"
              src={baristaAvatar}
            />
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-xs font-bold text-on-surface truncate">{currentUser}</p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              {userRole === 'owner' ? 'Owner' : 'Shift Aktif'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-on-surface-variant hover:text-error transition-colors flex items-center p-1 rounded-full hover:bg-surface-container-high cursor-pointer"
            title="Keluar / Logout"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
