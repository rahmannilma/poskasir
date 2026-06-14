import { useState } from 'react';
import { MenuItem } from '../data';

interface ModifierModalProps {
  item: MenuItem;
  onConfirm: (modifiers: string[], notes: string) => void;
  onCancel: () => void;
}

export default function ModifierModal({ item, onConfirm, onCancel }: ModifierModalProps) {
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleModifier = (mod: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in">
        {/* Header */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold">{item.name}</h3>
            <p className="text-lg font-semibold opacity-90">${item.price.toFixed(2)}</p>
          </div>
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modifiers */}
        {item.modifiers && item.modifiers.length > 0 && (
          <div className="p-6">
            <h4 className="text-label-md font-semibold text-on-surface-variant mb-3">
              Kustomisasi Menu
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.modifiers.map((mod) => {
                const isSelected = selectedModifiers.includes(mod);
                return (
                  <button
                    key={mod}
                    onClick={() => toggleModifier(mod)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container border-primary'
                        : 'bg-surface-variant text-on-surface-variant border-outline-variant hover:border-primary'
                    }`}
                  >
                    {mod}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="px-6 pb-4">
          <h4 className="text-label-md font-semibold text-on-surface-variant mb-2">
            Catatan Khusus
          </h4>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 px-3 text-body-md focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Tambahkan catatan khusus..."
          />
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-on-surface-variant border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer text-xs"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(selectedModifiers, notes)}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Tambah ke Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}
