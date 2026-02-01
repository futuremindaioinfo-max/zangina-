import React, { useState } from 'react';
import { CategoryItem } from '../types';
import { X, Plus, Trash2, Edit, Check, Utensils, LayoutList } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onSave: (categories: CategoryItem[]) => void;
  onAddProduct?: (categoryId: string) => void;
}

export const CategoryManager: React.FC<Props> = ({ isOpen, onClose, categories, onSave, onAddProduct }) => {
  const [items, setItems] = useState<CategoryItem[]>(categories);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Sync internal state when prop changes
  React.useEffect(() => {
    setItems(categories);
  }, [categories, isOpen]);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    
    // Check for duplicates
    if (items.some(i => i.label === name)) {
      alert('هذا التصنيف موجود بالفعل');
      return;
    }

    const newCat: CategoryItem = {
      id: Date.now().toString(),
      label: name
    };
    
    const updated = [...items, newCat];
    setItems(updated);
    onSave(updated);
    setNewCatName('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد؟ سيتم إزالة هذا التصنيف من القائمة.')) {
      const updated = items.filter(c => c.id !== id);
      setItems(updated);
      onSave(updated);
    }
  };

  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.label);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = items.map(c => c.id === id ? { ...c, label: editName.trim() } : c);
    setItems(updated);
    onSave(updated);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 bg-[#630F0F]/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 border border-[#C5A02F]/20">
        <div className="flex justify-between items-center p-4 border-b border-[#C5A02F]/10">
          <div className="flex items-center gap-2">
            <LayoutList className="text-[#630F0F]" size={20} />
            <h2 className="font-bold text-lg text-[#630F0F]">إدارة التصنيفات</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#FFFBF5] rounded-full text-[#630F0F]">
            <X size={20} />
          </button>
        </div>

        {/* Add New Category Section */}
        <div className="p-5 bg-[#FFFBF5] border-b border-[#C5A02F]/10">
          <h3 className="text-sm font-bold text-[#630F0F] mb-3 flex items-center gap-2">
            <div className="bg-[#630F0F]/10 p-1 rounded text-[#630F0F]">
              <Plus size={14} />
            </div>
            إضافة تصنيف جديد
          </h3>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="مثال: مشويات، مقبلات..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#C5A02F]/20 text-sm focus:ring-2 focus:ring-[#C5A02F]/20 focus:border-[#630F0F] outline-none transition-all bg-white shadow-sm text-[#630F0F]"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!newCatName.trim()}
              className="bg-[#630F0F] text-[#C5A02F] px-4 rounded-xl disabled:opacity-50 hover:bg-[#4a0b0b] transition-colors font-medium text-sm shadow-sm"
            >
              إضافة
            </button>
          </form>
        </div>

        {/* List of Categories */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {items.length === 0 ? (
            <div className="text-center py-8 text-[#630F0F]/40">
              <p className="text-sm">لا توجد تصنيفات حالياً</p>
              <p className="text-xs mt-1">أضف تصنيفك الأول من الأعلى</p>
            </div>
          ) : (
            items.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 bg-white border border-[#C5A02F]/10 p-3 rounded-xl group hover:border-[#C5A02F]/50 hover:shadow-sm transition-all">
                {editingId === cat.id ? (
                  <>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#C5A02F]/30 rounded-lg focus:outline-none focus:border-[#630F0F] bg-[#FFFBF5] text-[#630F0F]"
                      autoFocus
                    />
                    <button onClick={() => saveEdit(cat.id)} className="text-white bg-green-600 p-1.5 rounded-lg hover:bg-green-700 transition-colors">
                      <Check size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-bold text-[#630F0F]">{cat.label}</span>
                    
                    <div className="flex items-center gap-1">
                      {onAddProduct && (
                        <button 
                          onClick={() => onAddProduct(cat.id)}
                          className="text-[#C5A02F] hover:text-[#630F0F] hover:bg-[#FFFBF5] p-2 rounded-lg transition-colors"
                          title="إضافة صنف لهذا التصنيف"
                        >
                          <Utensils size={16} />
                        </button>
                      )}
                      
                      <div className="w-px h-5 bg-[#C5A02F]/20 mx-1"></div>

                      <button onClick={() => startEdit(cat)} className="text-[#C5A02F] hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-[#C5A02F] hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};