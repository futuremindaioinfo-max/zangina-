import React, { useState, useEffect } from 'react';
import { FooterData } from '../types';
import { X, Save, Plus, Trash2, LayoutTemplate } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: FooterData;
  onSave: (data: FooterData) => void;
}

export const FooterSettings: React.FC<Props> = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState<FooterData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const updateSocial = (key: keyof FooterData['socialLinks'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value }
    }));
  };

  const updateWhatsapp = (key: keyof FooterData['whatsapp'], value: string) => {
    setFormData(prev => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, [key]: value }
    }));
  };

  // Array helpers
  const addPhone = () => setFormData(prev => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ''] }));
  const updatePhone = (idx: number, val: string) => {
    const newArr = [...formData.phoneNumbers];
    newArr[idx] = val;
    setFormData(prev => ({ ...prev, phoneNumbers: newArr }));
  };
  const removePhone = (idx: number) => {
    setFormData(prev => ({ ...prev, phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== idx) }));
  };

  const addDelivery = () => setFormData(prev => ({ ...prev, deliveryNumbers: [...prev.deliveryNumbers, ''] }));
  const updateDelivery = (idx: number, val: string) => {
    const newArr = [...formData.deliveryNumbers];
    newArr[idx] = val;
    setFormData(prev => ({ ...prev, deliveryNumbers: newArr }));
  };
  const removeDelivery = (idx: number) => {
    setFormData(prev => ({ ...prev, deliveryNumbers: prev.deliveryNumbers.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="fixed inset-0 bg-[#630F0F]/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 shadow-2xl border border-[#C5A02F]/20">
        
        <div className="sticky top-0 bg-white border-b border-[#C5A02F]/10 px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
             <LayoutTemplate className="text-[#630F0F]" size={20} />
             <h2 className="text-xl font-bold text-[#630F0F]">إعدادات أسفل الصفحة</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#FFFBF5] rounded-full text-[#630F0F]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Section: General Info */}
          <section className="space-y-4">
             <h3 className="text-[#C5A02F] font-bold border-b border-[#C5A02F]/20 pb-2">المعلومات الأساسية</h3>
             <div>
               <label className="block text-sm font-bold text-[#630F0F] mb-1">العنوان</label>
               <input 
                 type="text" 
                 value={formData.address}
                 onChange={e => setFormData({...formData, address: e.target.value})}
                 className="w-full p-3 rounded-lg border border-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F]"
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-[#630F0F] mb-1">أوقات العمل</label>
               <textarea 
                 rows={2}
                 value={formData.workingHours}
                 onChange={e => setFormData({...formData, workingHours: e.target.value})}
                 className="w-full p-3 rounded-lg border border-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F]"
               />
             </div>
          </section>

          {/* Section: Phones */}
          <section className="space-y-4">
            <h3 className="text-[#C5A02F] font-bold border-b border-[#C5A02F]/20 pb-2 flex justify-between items-center">
              <span>أرقام التوصيل</span>
              <button type="button" onClick={addDelivery} className="text-xs bg-[#630F0F] text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-[#4a0b0b]">
                <Plus size={12} /> إضافة
              </button>
            </h3>
            {formData.deliveryNumbers.map((num, idx) => (
              <div key={idx} className="flex gap-2">
                 <input 
                   type="tel"
                   value={num}
                   onChange={e => updateDelivery(idx, e.target.value)}
                   placeholder="05xxxxxxxx"
                   className="flex-1 p-2 rounded-lg border border-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F]"
                 />
                 <button type="button" onClick={() => removeDelivery(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                   <Trash2 size={18} />
                 </button>
              </div>
            ))}
            {formData.deliveryNumbers.length === 0 && <p className="text-sm text-gray-400">لا يوجد أرقام توصيل</p>}
          </section>

          <section className="space-y-4">
            <h3 className="text-[#C5A02F] font-bold border-b border-[#C5A02F]/20 pb-2 flex justify-between items-center">
              <span>أرقام الإدارة / أخرى</span>
              <button type="button" onClick={addPhone} className="text-xs bg-[#630F0F] text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-[#4a0b0b]">
                <Plus size={12} /> إضافة
              </button>
            </h3>
            {formData.phoneNumbers.map((num, idx) => (
              <div key={idx} className="flex gap-2">
                 <input 
                   type="tel"
                   value={num}
                   onChange={e => updatePhone(idx, e.target.value)}
                   placeholder="05xxxxxxxx"
                   className="flex-1 p-2 rounded-lg border border-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F]"
                 />
                 <button type="button" onClick={() => removePhone(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                   <Trash2 size={18} />
                 </button>
              </div>
            ))}
          </section>

          {/* Section: WhatsApp */}
          <section className="space-y-4">
             <h3 className="text-[#C5A02F] font-bold border-b border-[#C5A02F]/20 pb-2">إعدادات واتساب</h3>
             <div className="grid grid-cols-1 gap-3">
               <div>
                  <label className="block text-xs font-bold text-[#630F0F] mb-1">رقم الواتساب (مع مفتاح الدولة)</label>
                  <input 
                    type="text" 
                    value={formData.whatsapp.number}
                    onChange={e => updateWhatsapp('number', e.target.value)}
                    placeholder="966xxxxxxxxx"
                    className="w-full p-2 rounded-lg border border-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F] dir-ltr text-right"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-[#630F0F] mb-1">الرسالة التلقائية</label>
                  <input 
                    type="text" 
                    value={formData.whatsapp.message}
                    onChange={e => updateWhatsapp('message', e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F]"
                  />
               </div>
             </div>
          </section>

          {/* Section: Social Links */}
          <section className="space-y-4">
             <h3 className="text-[#C5A02F] font-bold border-b border-[#C5A02F]/20 pb-2">روابط التواصل الاجتماعي</h3>
             <div className="space-y-3">
               <div>
                  <label className="block text-xs text-[#630F0F]">Google Maps Link</label>
                  <input type="url" value={formData.socialLinks.googleMaps} onChange={e => updateSocial('googleMaps', e.target.value)} className="w-full p-2 rounded border border-[#C5A02F]/20 text-[#630F0F]" placeholder="https://..." />
               </div>
               <div>
                  <label className="block text-xs text-[#630F0F]">Instagram Link</label>
                  <input type="url" value={formData.socialLinks.instagram} onChange={e => updateSocial('instagram', e.target.value)} className="w-full p-2 rounded border border-[#C5A02F]/20 text-[#630F0F]" placeholder="https://..." />
               </div>
               <div>
                  <label className="block text-xs text-[#630F0F]">Facebook Link</label>
                  <input type="url" value={formData.socialLinks.facebook} onChange={e => updateSocial('facebook', e.target.value)} className="w-full p-2 rounded border border-[#C5A02F]/20 text-[#630F0F]" placeholder="https://..." />
               </div>
               <div>
                  <label className="block text-xs text-[#630F0F]">TikTok Link</label>
                  <input type="url" value={formData.socialLinks.tiktok} onChange={e => updateSocial('tiktok', e.target.value)} className="w-full p-2 rounded border border-[#C5A02F]/20 text-[#630F0F]" placeholder="https://..." />
               </div>
             </div>
          </section>

          <button
            type="submit"
            className="w-full bg-[#630F0F] text-[#C5A02F] py-4 rounded-xl font-bold text-lg hover:bg-[#4a0b0b] transition-colors shadow-lg flex items-center justify-center gap-2 sticky bottom-0"
          >
            <Save size={20} />
            حفظ التغييرات
          </button>
        </form>
      </div>
    </div>
  );
};