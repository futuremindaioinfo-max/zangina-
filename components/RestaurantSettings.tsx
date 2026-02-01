import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Save, Store, Shield, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { verifyPassword, changePassword } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string;
  onSaveLogo: (url: string) => void;
}

export const RestaurantSettings: React.FC<Props> = ({ isOpen, onClose, currentLogo, onSaveLogo }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [logoUrl, setLogoUrl] = useState(currentLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  // Sync internal state when prop changes or modal opens
  React.useEffect(() => {
    setLogoUrl(currentLogo);
    // Reset form on open
    if (isOpen) {
      setPassStatus({ type: null, msg: '' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setActiveTab('general');
    }
  }, [currentLogo, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGeneral = () => {
    onSaveLogo(logoUrl);
    onClose();
  };

  const handleRemoveLogo = () => {
    if (window.confirm('هل أنت متأكد من حذف الشعار والعودة للافتراضي؟')) {
      setLogoUrl('/logo.png');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassStatus({ type: null, msg: '' });

    // Validation
    if (newPass.length < 6) {
      setPassStatus({ type: 'error', msg: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
      return;
    }
    if (newPass !== confirmPass) {
      setPassStatus({ type: 'error', msg: 'كلمة المرور الجديدة غير متطابقة' });
      return;
    }

    // Verify Old Password
    const isValid = await verifyPassword(currentPass);
    if (!isValid) {
      setPassStatus({ type: 'error', msg: 'كلمة المرور الحالية غير صحيحة' });
      return;
    }

    // Update Password
    await changePassword(newPass);
    setPassStatus({ type: 'success', msg: 'تم تغيير كلمة المرور بنجاح' });
    
    // Clear fields
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="fixed inset-0 bg-[#630F0F]/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 border border-[#C5A02F]/20 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#C5A02F]/10 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Store className="text-[#630F0F]" size={20} />
            <h2 className="font-bold text-lg text-[#630F0F]">إعدادات المطعم</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#FFFBF5] rounded-full text-[#630F0F]">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-[#FFFBF5] gap-2 mx-4 mt-4 rounded-xl">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'general' ? 'bg-[#630F0F] text-[#C5A02F] shadow-sm' : 'text-[#630F0F] hover:bg-black/5'}`}
          >
            <ImageIcon size={16} />
            عام
          </button>
          <button 
             onClick={() => setActiveTab('security')}
             className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'security' ? 'bg-[#630F0F] text-[#C5A02F] shadow-sm' : 'text-[#630F0F] hover:bg-black/5'}`}
          >
            <Shield size={16} />
            الأمان
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {activeTab === 'general' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-[#630F0F]">شعار المطعم</label>
                
                {/* Logo Preview */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-32 h-32 rounded-full border-4 border-[#C5A02F]/20 overflow-hidden bg-[#FFFBF5] shadow-inner group">
                    <img 
                      src={logoUrl} 
                      alt="Logo Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target as HTMLImageElement).src = '/logo.png'}
                    />
                  </div>

                  <div className="flex gap-2 w-full">
                    {/* Upload Button */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#FFFBF5] text-[#630F0F] border border-[#C5A02F]/30 py-2.5 rounded-xl text-sm font-bold hover:bg-[#C5A02F]/10 transition-colors"
                    >
                      <Upload size={16} />
                      رفع صورة
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    {/* Remove Button */}
                    <button 
                      onClick={handleRemoveLogo}
                      className="px-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                      title="حذف الشعار"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#C5A02F]">
                      <ImageIcon size={16} />
                    </div>
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="أو ضع رابط الصورة هنا..."
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-[#C5A02F]/20 text-sm focus:ring-2 focus:ring-[#C5A02F]/20 focus:border-[#630F0F] outline-none text-[#630F0F] bg-[#FFFBF5]"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleSaveGeneral}
                className="w-full bg-[#630F0F] text-[#C5A02F] py-3.5 rounded-xl font-bold text-lg hover:bg-[#4a0b0b] transition-colors shadow-lg shadow-[#630F0F]/10 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                حفظ التغييرات
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-5 animate-in fade-in slide-in-from-left-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-[#FFFBF5] rounded-full flex items-center justify-center mx-auto mb-2 text-[#630F0F] border border-[#C5A02F]/20">
                   <Key size={32} />
                </div>
                <h3 className="font-bold text-[#630F0F]">تغيير كلمة المرور</h3>
                <p className="text-xs text-gray-500">قم بتحديث كلمة المرور الخاصة بحساب المدير</p>
              </div>

              {passStatus.msg && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                   {passStatus.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                   {passStatus.msg}
                </div>
              )}

              <div>
                 <label className="block text-xs font-bold text-[#630F0F] mb-1">كلمة المرور الحالية</label>
                 <input 
                   type="password" 
                   value={currentPass}
                   onChange={(e) => setCurrentPass(e.target.value)}
                   className="w-full p-2.5 rounded-xl border border-[#C5A02F]/20 text-[#630F0F] focus:border-[#630F0F] outline-none"
                   placeholder="••••••"
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-[#630F0F] mb-1">كلمة المرور الجديدة</label>
                 <input 
                   type="password" 
                   value={newPass}
                   onChange={(e) => setNewPass(e.target.value)}
                   className="w-full p-2.5 rounded-xl border border-[#C5A02F]/20 text-[#630F0F] focus:border-[#630F0F] outline-none"
                   placeholder="••••••"
                 />
                 <p className="text-[10px] text-gray-400 mt-1">يجب أن تكون 6 أحرف على الأقل</p>
              </div>

              <div>
                 <label className="block text-xs font-bold text-[#630F0F] mb-1">تأكيد كلمة المرور الجديدة</label>
                 <input 
                   type="password" 
                   value={confirmPass}
                   onChange={(e) => setConfirmPass(e.target.value)}
                   className="w-full p-2.5 rounded-xl border border-[#C5A02F]/20 text-[#630F0F] focus:border-[#630F0F] outline-none"
                   placeholder="••••••"
                 />
              </div>

              <button 
                type="submit"
                disabled={!currentPass || !newPass || !confirmPass}
                className="w-full bg-[#630F0F] text-[#C5A02F] py-3.5 rounded-xl font-bold text-lg hover:bg-[#4a0b0b] transition-colors shadow-lg shadow-[#630F0F]/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                تحديث كلمة المرور
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};