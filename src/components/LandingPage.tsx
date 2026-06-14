import logoImg from './logo.jpg';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const features = [
    {
      icon: 'point_of_sale',
      title: 'POS Kasir Pintar',
      desc: 'Transaksi cepat, manajemen meja aktif, kustomisasi modifier menu, dan pencetakan struk instan.',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400'
    },
    {
      icon: 'monitoring',
      title: 'Dashboard Analitik',
      desc: 'Pantau grafik penjualan, ringkasan pendapatan, pengeluaran, profit, serta produk terlaris secara real-time.',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400'
    },
    {
      icon: 'inventory_2',
      title: 'Manajemen Data Master',
      desc: 'Kelola database produk dengan SKU unik, kategori menu teratur, data staff, dan konfigurasi gerai.',
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400'
    },
    {
      icon: 'fingerprint',
      title: 'Absensi Mandiri Staff',
      desc: 'Sistem pencatatan kehadiran (check-in & check-out) kasir mandiri yang aman dan transparan.',
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400'
    }
  ];

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col justify-between bg-[#0d1607] overflow-y-auto select-none font-sans text-white order-scrollbar">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-800/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            className="w-10 h-10 rounded-full object-cover shadow-lg border border-primary/20"
            alt="M-Coffee Logo"
          />
          <span className="text-lg font-black tracking-widest uppercase">
            M-<span className="text-primary">COFFEE</span>
          </span>
        </div>
        <div>
          <button
            onClick={onEnter}
            className="px-5 py-2 border border-white/10 hover:border-primary/45 rounded-full text-xs font-bold uppercase tracking-wider bg-white/[0.03] hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
          >
            Masuk
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-6xl mx-auto px-6 py-8 flex flex-col items-center justify-center flex-grow z-10 text-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider mb-6 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Sistem Point-of-Sale (POS) v2.5
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase mb-6">
            Sistem Kasir Modern &amp; <br className="hidden sm:inline" />
            Efisien untuk Bisnis <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">M-COFFEE</span>
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Optimalkan operasional kedai kopi Anda dengan layanan pemrosesan pesanan yang cepat, pelacakan meja aktif, pengelolaan data produk yang ringkas, serta laporan performa keuangan real-time dalam satu aplikasi terintegrasi.
          </p>

          {/* Call to Action Button */}
          <div className="flex justify-center mb-16">
            <button
              onClick={onEnter}
              className="group flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-[0_8px_30px_rgba(36,107,0,0.3)] hover:shadow-[0_12px_40px_rgba(36,107,0,0.45)] hover:bg-primary/95 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Mulai Masuk Aplikasi</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
          {features.map((feat, index) => (
            <div
              key={index}
              className="bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/[0.05] hover:border-primary/25 rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-[24px]">
                    {feat.icon}
                  </span>
                </div>
                <h3 className="text-sm font-bold tracking-wide mb-2 text-white">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-white/[0.04] z-10 shrink-0">
        <p className="text-[10px] text-white/45 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} M-COFFEE. Hak Cipta Dilindungi.
        </p>
      </footer>
    </div>
  );
}
