import { useMemo, useState } from 'react';
import { menuItems } from '../data';
import { showSuccessAlert } from '../utils/swal';

interface DashboardProps {
  onOpenPos: () => void;
  username: string;
  userRole?: string;
  onViewChange?: (view: string) => void;
}

interface ChartItem {
  label: string;
  revenue: number;
  salesCount: number;
}

export default function Dashboard({ onOpenPos, username, userRole, onViewChange }: DashboardProps) {
  const [days, setDays] = useState<7 | 30>(7);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Format IDR currency helper
  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  // Mock revenue chart data
  const revenueChartData: ChartItem[] = useMemo(() => {
    if (days === 7) {
      return [
        { label: 'Sen', revenue: 1200000, salesCount: 22 },
        { label: 'Sel', revenue: 1850000, salesCount: 31 },
        { label: 'Rab', revenue: 1450000, salesCount: 25 },
        { label: 'Kam', revenue: 2100000, salesCount: 38 },
        { label: 'Jum', revenue: 2800000, salesCount: 45 },
        { label: 'Sab', revenue: 3500000, salesCount: 58 },
        { label: 'Min', revenue: 3200000, salesCount: 52 },
      ];
    } else {
      return Array.from({ length: 30 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dayString = date.getDate().toString();
        const baseRev = 1000000 + Math.floor(Math.random() * 2000000);
        // Weekend boost
        const boost = date.getDay() === 0 || date.getDay() === 6 ? 1.4 : 1.0;
        return {
          label: dayString,
          revenue: Math.round(baseRev * boost),
          salesCount: Math.round((baseRev * boost) / 55000),
        };
      });
    }
  }, [days]);

  // Metrics
  const metrics = useMemo(() => {
    const today_revenue = 3200000;
    const today_sales_count = 52;
    const total_products_count = menuItems.length;
    const lowStockCount = 3;

    return {
      today_revenue,
      today_sales_count,
      total_products_count,
      lowStockCount,
      averageOrder: today_sales_count > 0 ? today_revenue / today_sales_count : 0,
    };
  }, []);

  // Top products
  const topSellingProducts = useMemo(() => {
    return [
      {
        name: 'Latte',
        sold: 142,
        revenue: 3976000,
        image: 'https://images.pexels.com/photos/15800988/pexels-photo-15800988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      },
      {
        name: 'Roti Panggang Alpukat',
        sold: 98,
        revenue: 4410000,
        image: 'https://images.pexels.com/photos/27590337/pexels-photo-27590337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      },
      {
        name: 'Cold Brew',
        sold: 84,
        revenue: 2520000,
        image: 'https://images.pexels.com/photos/38028988/pexels-photo-38028988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      },
    ];
  }, []);

  // Recent Invoices
  const recentTransactions = useMemo(() => {
    return [
      { id: 1, invoice: 'INV-2841', name: 'Marcus W.', time: 'Hari ini, 18:15', total: 72900 },
      { id: 2, invoice: 'INV-2840', name: 'Pelanggan Umum', time: 'Hari ini, 17:42', total: 55000 },
      { id: 3, invoice: 'INV-2839', name: 'Ani', time: 'Hari ini, 16:30', total: 67000 },
      { id: 4, invoice: 'INV-2838', name: 'Alex T.', time: 'Kemarin, 20:10', total: 112000 },
      { id: 5, invoice: 'INV-2837', name: 'Sarah K.', time: 'Kemarin, 19:05', total: 48000 },
    ];
  }, []);

  // Chart coordinate calculations
  const maxRevenue = useMemo(() => {
    const max = Math.max(...revenueChartData.map((d) => d.revenue), 100000);
    return max;
  }, [revenueChartData]);

  const points = useMemo(() => {
    if (revenueChartData.length === 0) return [];
    return revenueChartData.map((d, i) => {
      const x = (i / (revenueChartData.length - 1)) * 100;
      const y = maxRevenue > 0 ? 80 - (d.revenue / maxRevenue) * 60 : 80;
      return { x, y, revenue: d.revenue, label: d.label };
    });
  }, [revenueChartData, maxRevenue]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  }, [points]);

  const handleExport = () => {
    showSuccessAlert('Unduh Laporan', 'Ekspor laporan penjualan dalam format CSV berhasil diunduh.');
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-surface-container-low/40">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-on-surface tracking-tight">
            Selamat datang kembali, {username}
          </h2>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Berikut adalah laporan ringkasan gerai Anda hari ini.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-white border border-outline-variant/40 text-on-surface-variant font-bold text-xs rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            EKSPOR DATA
          </button>
          {userRole !== 'owner' && (
            <button
              onClick={onOpenPos}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/15 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              BUKA KASIR POS
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/35 shadow-sm border-l-4 border-l-primary hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-3">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              12.5%
            </div>
          </div>
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase">Total Penjualan</p>
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-mono mt-1">
            {formatPrice(metrics.today_revenue)}
          </h3>
          <p className="text-[9px] text-on-surface-variant/40 mt-1">vs hari kemarin</p>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/35 shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-3">
            <div className="p-2 bg-blue-500/5 rounded-lg text-blue-600">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              8.2%
            </div>
          </div>
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase">Total Pesanan</p>
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-mono mt-1">
            {metrics.today_sales_count}
          </h3>
          <p className="text-[9px] text-on-surface-variant/40 mt-1">vs hari kemarin</p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/35 shadow-sm border-l-4 border-l-amber-500 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-3">
            <div className="p-2 bg-amber-500/5 rounded-lg text-amber-600">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
            </div>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-error rounded text-[10px] font-bold">
              <span className="material-symbols-outlined text-[12px]">trending_down</span>
              2.1%
            </div>
          </div>
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase">Rerata Pesanan</p>
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-mono mt-1">
            {formatPrice(metrics.averageOrder)}
          </h3>
          <p className="text-[9px] text-on-surface-variant/40 mt-1">vs hari kemarin</p>
        </div>

        {/* Total Products */}
        <div className="bg-teal-50/30 rounded-2xl p-5 border border-outline-variant/35 shadow-sm border-l-4 border-l-teal-500 hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-3">
            <div className="p-2 bg-teal-500/5 rounded-lg text-teal-600">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
            <div className="px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded text-[9px] font-bold uppercase">
              Aktif
            </div>
          </div>
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase">Menu Produk</p>
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-mono mt-1">
            {metrics.total_products_count}
          </h3>
          <p className="text-[9px] text-on-surface-variant/40 mt-1">Menu terdaftar di kasir</p>
        </div>
      </div>

      {/* Charts & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant/35 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-sm md:text-base font-bold text-on-surface">Ikhtisar Penjualan</h3>
              <p className="text-[10px] md:text-xs text-on-surface-variant/60 mt-0.5">
                {days === 30 ? 'Laporan Bulanan (30 Hari Terakhir)' : 'Laporan Mingguan (7 Hari Terakhir)'}
              </p>
            </div>
            <div className="flex p-0.5 bg-surface-container-low rounded-lg shrink-0">
              <button
                onClick={() => setDays(7)}
                className={`px-3.5 py-1 text-[10px] md:text-xs font-bold transition-all rounded-md cursor-pointer ${
                  days === 7 ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                7 Hari
              </button>
              <button
                onClick={() => setDays(30)}
                className={`px-3.5 py-1 text-[10px] md:text-xs font-bold transition-all rounded-md cursor-pointer ${
                  days === 30 ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                30 Hari
              </button>
            </div>
          </div>

          {/* SVG Graph Drawing */}
          <div className="p-6 h-64 md:h-72 relative select-none">
            {/* Gridlines */}
            <div className="absolute inset-x-6 bottom-10 top-6 chart-grid"></div>

            {/* SVG elements wrapper */}
            <div className="absolute inset-x-6 bottom-10 top-6">
              {points.length > 0 && (
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#246b00" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#246b00" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>

                  {/* Guideline on hover */}
                  {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                    <line
                      x1={points[hoveredPointIndex].x}
                      y1={0}
                      x2={points[hoveredPointIndex].x}
                      y2={100}
                      stroke="#246b00"
                      strokeWidth="1.2"
                      strokeDasharray="4,4"
                      opacity="0.4"
                    />
                  )}

                  {/* Gradient Area Fill */}
                  <path
                    d={`${linePath} L${points[points.length - 1].x},100 L${points[0].x},100 Z`}
                    fill="url(#chartGradient)"
                  />

                  {/* Draw Line Curve */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#246b00"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Draw points */}
                  {points.map((p, i) => {
                    const isHovered = hoveredPointIndex === i;
                    return (
                      <g key={i}>
                        {isHovered && (
                          <circle cx={p.x} cy={p.y} r="3" fill="#246b00" opacity="0.25" className="animate-ping" />
                        )}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? '2.5' : '1.2'}
                          fill={isHovered ? '#246b00' : 'white'}
                          stroke="#246b00"
                          strokeWidth={isHovered ? '1.5' : '1.2'}
                          className="transition-all duration-100 cursor-pointer"
                        />
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Hover grid mapping */}
              <div className="absolute inset-0 flex">
                {points.map((p, i) => (
                  <div
                    key={i}
                    className="flex-grow cursor-pointer h-full"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                ))}
              </div>

              {/* Tooltip Popup */}
              {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                <div
                  className="absolute bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-xl border border-outline-variant/30 flex flex-col pointer-events-none transition-all duration-75 z-10"
                  style={{
                    left: `${points[hoveredPointIndex].x}%`,
                    top: `${points[hoveredPointIndex].y}%`,
                    transform: 'translate(-50%, -120%)',
                  }}
                >
                  <span className="text-[9px] opacity-75 uppercase leading-none mb-1">
                    {days === 7
                      ? points[hoveredPointIndex].label
                      : `Tanggal ${points[hoveredPointIndex].label}`}
                  </span>
                  <span className="text-xs font-black text-primary leading-none">
                    {formatPrice(points[hoveredPointIndex].revenue)}
                  </span>
                  {/* Tooltip arrow tail */}
                  <div className="w-1.5 h-1.5 bg-inverse-surface absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
                </div>
              )}
            </div>
          </div>

          {/* X-Axis labels */}
          <div className="px-6 pb-4 flex justify-between font-mono text-[9px] text-on-surface-variant/60 uppercase shrink-0">
            {revenueChartData.map((d, i) => {
              const shouldShow = days === 7 || i % 5 === 0 || i === revenueChartData.length - 1;
              return (
                <span key={i} className="flex-1 text-center truncate">
                  {shouldShow ? d.label : ''}
                </span>
              );
            })}
          </div>
        </div>

        {/* Top selling products */}
        <div className="bg-white rounded-2xl border border-outline-variant/35 shadow-sm flex flex-col h-[384px]">
          <div className="p-5 border-b border-outline-variant/30 shrink-0">
            <h3 className="text-sm md:text-base font-bold text-on-surface">Produk Terlaris</h3>
          </div>
          <div className="p-5 space-y-4 flex-grow overflow-y-auto order-scrollbar">
            {topSellingProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/20 overflow-hidden shrink-0">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    src={product.image}
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant/60 font-medium mt-0.5">
                    {product.sold} Terjual
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-primary font-mono">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 border-t border-outline-variant/25 bg-surface-container-lowest shrink-0">
            {userRole === 'owner' ? (
              <button
                onClick={() => onViewChange?.('transaksi')}
                className="w-full py-2.5 bg-surface-container-low hover:bg-surface-container-high text-[10px] font-bold text-on-surface-variant hover:text-on-surface rounded-xl transition-all uppercase tracking-widest text-center active:scale-[0.98] cursor-pointer"
              >
                Lihat Semua Transaksi
              </button>
            ) : (
              <button
                onClick={onOpenPos}
                className="w-full py-2.5 bg-surface-container-low hover:bg-surface-container-high text-[10px] font-bold text-on-surface-variant hover:text-on-surface rounded-xl transition-all uppercase tracking-widest text-center active:scale-[0.98] cursor-pointer"
              >
                Lihat Menu Kasir
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-outline-variant/35 shadow-sm overflow-hidden mb-4 shrink-0">
        <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
          <h3 className="text-sm md:text-base font-bold text-on-surface">Transaksi Terbaru</h3>
          <button
            onClick={() => {
              if (userRole === 'owner') {
                onViewChange?.('transaksi');
              } else {
                onOpenPos();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline transition-all cursor-pointer font-sans"
          >
            LIHAT HISTORI
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-surface-container-low/50 font-mono text-[9px] text-on-surface-variant/60 uppercase border-b border-outline-variant/25">
                <th className="px-6 py-3 font-bold">ID Invoice</th>
                <th className="px-6 py-3 font-bold">Kasir</th>
                <th className="px-6 py-3 font-bold">Waktu</th>
                <th className="px-6 py-3 font-bold text-right">Total</th>
                <th className="px-6 py-3 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-low/20 transition-colors">
                  <td className="px-6 py-3 font-bold font-mono text-primary">{tx.invoice}</td>
                  <td className="px-6 py-3 font-bold text-on-surface-variant/85">{tx.name}</td>
                  <td className="px-6 py-3 text-on-surface-variant/60">{tx.time}</td>
                  <td className="px-6 py-3 text-right font-bold font-mono">{formatPrice(tx.total)}</td>
                  <td className="px-6 py-3 text-center">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase rounded-full">
                      Lunas
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
