import React, { useState, useEffect } from 'react';
import { MenuItem, CategoryItem } from '../types';
import { X, Sparkles, Loader2, Save } from 'lucide-react';
import { generateDescription } from '../services/gemini';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
  initialData?: MenuItem;
  categories: CategoryItem[];
  defaultCategory?: string;
}

export const AdminForm: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, categories, defaultCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0]?.id || '',
    description: '',
    image: '',
    isAvailable: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        category: initialData.category,
        description: initialData.description,
        image: initialData.image,
        isAvailable: initialData.isAvailable
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: defaultCategory || categories[0]?.id || '',
        description: '',
        image: `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/800/600`,
        isAvailable: true
      });
    }
  }, [initialData, isOpen, categories, defaultCategory]);

  if (!isOpen) return null;

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      alert('الرجاء كتابة اسم الصنف أولاً');
      return;
    }
    
    setIsGenerating(true);
    const categoryLabel = categories.find(c => c.id === formData.category)?.label || 'طعام';
    const desc = await generateDescription(formData.name, categoryLabel);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      id: initialData?.id || '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#630F0F]/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 shadow-2xl border border-[#C5A02F]/20">
        <div className="sticky top-0 bg-white border-b border-[#C5A02F]/10 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-[#630F0F]">
            {initialData ? 'تعديل الصنف' : 'إضافة صنف جديد'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#FFFBF5] rounded-full text-[#630F0F]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Preview */}
          <div className="relative h-48 rounded-xl overflow-hidden bg-[#FFFBF5] border-2 border-dashed border-[#C5A02F]/30 group">
             <img 
               src={formData.image} 
               alt="Preview" 
               className="w-full h-full object-cover"
               onError={(e) => (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300'} 
             />
             <div className="absolute inset-0 bg-[#630F0F]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <p className="text-[#C5A02F] text-sm font-medium">رابط الصورة (URL)</p>
             </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#630F0F] mb-1">رابط الصورة</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
              className="w-full p-3 rounded-lg border border-[#C5A02F]/20 focus:ring-2 focus:ring-[#C5A02F]/20 focus:border-[#630F0F] outline-none transition-all text-[#630F0F]"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#630F0F] mb-1">اسم الصنف</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-lg border border-[#C5A02F]/20 focus:ring-2 focus:ring-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F]"
                placeholder="مثال: برجر..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#630F0F] mb-1">السعر (ر.س)</label>
              <input
                type="number"
                required
                min="0"
                step="0.5"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full p-3 rounded-lg border border-[#C5A02F]/20 focus:ring-2 focus:ring-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#630F0F] mb-1">التصنيف</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, category: cat.id})}
                  className={`p-2 rounded-lg text-sm border transition-all ${
                    formData.category === cat.id 
                    ? 'bg-[#630F0F] border-[#630F0F] text-[#C5A02F] font-bold' 
                    : 'border-[#C5A02F]/20 text-[#630F0F]/70 hover:bg-[#FFFBF5]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-[#630F0F]">الوصف</label>
                <button 
                  type="button" 
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="text-xs flex items-center gap-1 text-[#C5A02F] font-medium hover:text-[#b48e25] disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  توليد بالذكاء الاصطناعي
                </button>
             </div>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-lg border border-[#C5A02F]/20 focus:ring-2 focus:ring-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F]"
              placeholder="وصف مكونات الطبق..."
            />
          </div>

          <div className="flex items-center gap-2 pb-2">
            <input 
              type="checkbox" 
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
              className="w-5 h-5 accent-[#630F0F]"
            />
            <label htmlFor="isAvailable" className="text-[#630F0F]">متاح للطلب حالياً</label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#630F0F] text-[#C5A02F] py-4 rounded-xl font-bold text-lg hover:bg-[#4a0b0b] transition-colors shadow-lg shadow-[#630F0F]/20 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            حفظ التغييرات
          </button>
        </form>
      </div>
    </div>
  );
};