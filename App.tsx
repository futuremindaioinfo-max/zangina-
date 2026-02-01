import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Lock, LogOut, Plus, Search, Menu as MenuIcon, Settings, LayoutList, LayoutTemplate, Loader2 } from 'lucide-react';
import { MenuItem, CategoryItem, FooterData } from './types';
import { getMenuHelper, saveMenuHelper, getCategoriesHelper, saveCategoriesHelper, getLogoHelper, saveLogoHelper, getFooterHelper, saveFooterHelper, verifyPassword, initAuth } from './services/storage';
import { MenuItemCard } from './components/MenuItemCard';
import { AdminForm } from './components/AdminForm';
import { CategoryManager } from './components/CategoryManager';
import { RestaurantSettings } from './components/RestaurantSettings';
import { Footer } from './components/Footer';
import { FooterSettings } from './components/FooterSettings';

// --- Components defined inline for single-file conceptual simplicity ---

const Header = ({ 
  isAdmin, 
  logoUrl,
  onLogout, 
  onAdminClick,
  onManageCategories,
  onOpenSettings,
  onOpenFooterSettings
}: { 
  isAdmin: boolean, 
  logoUrl: string,
  onLogout: () => void, 
  onAdminClick: () => void,
  onManageCategories?: () => void,
  onOpenSettings?: () => void,
  onOpenFooterSettings?: () => void
}) => (
  <header className="sticky top-0 z-40 bg-[#FFFBF5]/95 backdrop-blur-md shadow-sm border-b border-[#C5A02F]/20 transition-all">
    <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border border-[#C5A02F]/30 bg-white shadow-sm flex items-center justify-center shrink-0">
            <img 
              src={logoUrl} 
              alt="شعار هاي زنغنا" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback Icon if image missing */}
            <div className="hidden text-[#630F0F]">
               <UtensilsCrossed size={20} />
            </div>
        </div>
        <div className="flex flex-col justify-center">
           <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-[#630F0F] leading-none mb-0.5">هاي زنغِنا</h1>
           <p className="text-[10px] sm:text-xs text-[#C5A02F] font-bold tracking-wide">قائمة الطعام</p>
        </div>
      </div>
      
      {isAdmin ? (
        <div className="flex gap-2">
           <button 
            onClick={onManageCategories}
            className="flex items-center gap-1 text-[#630F0F] hover:text-[#C5A02F] bg-white border border-[#C5A02F]/20 p-2 rounded-full transition-colors"
            title="إدارة التصنيفات"
          >
            <LayoutList size={18} />
          </button>
           <button 
            onClick={onOpenFooterSettings}
            className="flex items-center gap-1 text-[#630F0F] hover:text-[#C5A02F] bg-white border border-[#C5A02F]/20 p-2 rounded-full transition-colors"
            title="إعدادات الفوتر"
          >
            <LayoutTemplate size={18} />
          </button>
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-1 text-[#630F0F] hover:text-[#C5A02F] bg-white border border-[#C5A02F]/20 p-2 rounded-full transition-colors"
            title="الإعدادات العامة"
          >
            <Settings size={18} />
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-1 text-[#630F0F]/80 hover:text-red-600 transition-colors text-sm font-medium bg-white border border-[#C5A02F]/20 px-3 py-1.5 rounded-full"
          >
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <button 
          onClick={onAdminClick}
          className="p-2 text-[#C5A02F] hover:text-[#630F0F] transition-colors rounded-full hover:bg-[#C5A02F]/10"
        >
          <Lock size={20} />
        </button>
      )}
    </div>
  </header>
);

const CategoryFilter = ({ categories, active, onSelect }: { categories: CategoryItem[], active: string, onSelect: (c: string) => void }) => {
  const allCategories = [{ id: 'all', label: 'الكل' }, ...categories];
  
  return (
    <div className="sticky top-[73px] z-30 bg-[#FFFBF5]/95 border-b border-[#C5A02F]/10 py-3 mb-4 shadow-[0_4px_20px_-10px_rgba(99,15,15,0.05)]">
      <div className="max-w-md mx-auto overflow-x-auto no-scrollbar px-4 flex gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              active === cat.id
                ? 'bg-[#630F0F] text-[#C5A02F] border-[#630F0F] shadow-lg shadow-[#630F0F]/20 scale-105'
                : 'bg-white text-[#630F0F] border-[#C5A02F]/20 hover:border-[#C5A02F] hover:bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const AdminLogin = ({ onLogin, onCancel }: { onLogin: (pass: string) => void, onCancel: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize auth just in case (e.g. create default password if not exists)
  useEffect(() => {
    initAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Slight delay to simulate security check and prevent timing attacks (theoretical)
    await new Promise(r => setTimeout(r, 500));
    
    const isValid = await verifyPassword(password);
    
    setLoading(false);
    
    if (isValid) {
      onLogin(password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FFFBF5] z-50 flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-10">
      <div className="w-full max-w-sm text-center">
        <div className="bg-white border-2 border-[#C5A02F]/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <Lock size={40} className="text-[#C5A02F]" />
        </div>
        <h2 className="text-3xl font-bold text-[#630F0F] mb-2">تسجيل دخول المدير</h2>
        <p className="text-[#630F0F]/60 mb-10 text-lg">أدخل كلمة المرور للوصول للوحة التحكم</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
             <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-5 rounded-2xl bg-white border-2 outline-none text-center text-xl tracking-widest transition-colors shadow-sm ${error ? 'border-red-500 bg-red-50' : 'border-[#C5A02F]/30 focus:border-[#630F0F] text-[#630F0F]'}`}
              placeholder="******"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium animate-pulse">كلمة المرور غير صحيحة</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#630F0F] text-[#C5A02F] py-5 rounded-2xl font-bold text-xl hover:bg-[#4a0b0b] transition-colors shadow-xl shadow-[#630F0F]/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'دخول'}
          </button>
          
          <button 
            type="button" 
            onClick={onCancel}
            className="w-full py-4 text-[#630F0F]/60 font-medium hover:text-[#630F0F]"
          >
            رجوع للقائمة
          </button>
        </form>
        <p className="mt-10 text-sm text-[#C5A02F]/80">كلمة المرور الافتراضية: admin123</p>
      </div>
    </div>
  );
};

export default function App() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [logo, setLogo] = useState<string>('/logo.png');
  // Load initial footer data safely in case getFooterHelper returns default
  const [footerData, setFooterData] = useState<FooterData>(getFooterHelper()); 
  
  const [view, setView] = useState<'public' | 'admin_login' | 'admin_dashboard'>('public');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFooterSettingsOpen, setIsFooterSettingsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(undefined);
  const [defaultCategoryForForm, setDefaultCategoryForForm] = useState<string | undefined>(undefined);

  // Load Data
  useEffect(() => {
    setItems(getMenuHelper());
    setCategories(getCategoriesHelper());
    setLogo(getLogoHelper());
    setFooterData(getFooterHelper());
    initAuth(); // Initialize auth system
  }, []);

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If admin, show all (availability is handled visually). If public, show only available.
    const matchesAvailability = view === 'admin_dashboard' ? true : item.isAvailable;
    
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  // Actions
  const handleAddItem = (item: Omit<MenuItem, 'id'> | MenuItem) => {
    let newItems;
    if ('id' in item && item.id) {
      // Edit
      newItems = items.map(i => i.id === item.id ? item as MenuItem : i);
    } else {
      // Add
      const newItem = { ...item, id: Date.now().toString() } as MenuItem;
      newItems = [newItem, ...items];
    }
    setItems(newItems);
    saveMenuHelper(newItems);
  };

  const handleDelete = (id: string) => {
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    saveMenuHelper(newItems);
  };

  const handleToggleStatus = (id: string, current: boolean) => {
    const newItems = items.map(i => i.id === id ? { ...i, isAvailable: !current } : i);
    setItems(newItems);
    saveMenuHelper(newItems);
  };
  
  const handleSaveCategories = (newCategories: CategoryItem[]) => {
    setCategories(newCategories);
    saveCategoriesHelper(newCategories);
  };

  const handleSaveLogo = (newUrl: string) => {
    setLogo(newUrl);
    saveLogoHelper(newUrl);
  };

  const handleSaveFooter = (newData: FooterData) => {
    setFooterData(newData);
    saveFooterHelper(newData);
  };

  const handleAddProductFromCategory = (catId: string) => {
    setDefaultCategoryForForm(catId);
    setEditingItem(undefined);
    setIsCatManagerOpen(false);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-0 flex flex-col">
      {/* Auth Screen */}
      {view === 'admin_login' && (
        <AdminLogin 
          onLogin={() => setView('admin_dashboard')} 
          onCancel={() => setView('public')} 
        />
      )}

      {/* Main Layout */}
      <Header 
        isAdmin={view === 'admin_dashboard'} 
        logoUrl={logo}
        onLogout={() => setView('public')}
        onAdminClick={() => setView('admin_login')}
        onManageCategories={() => setIsCatManagerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFooterSettings={() => setIsFooterSettingsOpen(true)}
      />

      <div className="max-w-md mx-auto w-full flex-grow">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center pt-8 pb-6 text-center animate-in fade-in slide-in-from-top-4 duration-700 px-4">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#C5A02F]/20 shadow-2xl overflow-hidden bg-white mb-4 transform hover:scale-105 transition-transform duration-500">
            <img 
              src={logo} 
              alt="Restaurant Logo" 
              className="w-full h-full object-cover"
              onError={(e) => (e.target as HTMLImageElement).src = '/logo.png'}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#630F0F] mb-3 drop-shadow-sm">هاي زنغِنا</h1>
          <div className="inline-flex items-center gap-2 bg-[#FFFBF5] px-4 py-1.5 rounded-full border border-[#C5A02F]/30 shadow-sm">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-[#C5A02F] font-bold text-sm">فرع الوادي</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 mt-2 mb-2">
          <div className="relative group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C5A02F] group-focus-within:text-[#630F0F] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن طبقك المفضل..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#C5A02F]/20 rounded-xl py-3.5 pr-10 pl-4 focus:ring-2 focus:ring-[#C5A02F]/20 focus:border-[#630F0F] outline-none transition-all shadow-sm placeholder-[#630F0F]/30 text-[#630F0F]"
            />
          </div>
        </div>

        <CategoryFilter categories={categories} active={selectedCategory} onSelect={setSelectedCategory} />

        {/* Content Grid */}
        <main className="px-4 grid grid-cols-1 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                isAdmin={view === 'admin_dashboard'}
                onEdit={(item) => {
                  setEditingItem(item);
                  setIsFormOpen(true);
                }}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))
          ) : (
            <div className="text-center py-20 text-[#630F0F]/30">
              <MenuIcon size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">لا توجد أصناف في هذه القائمة حالياً</p>
            </div>
          )}
        </main>
      </div>

      <Footer data={footerData} />

      {/* Admin Floating Action Button */}
      {view === 'admin_dashboard' && (
        <button
          onClick={() => {
            setEditingItem(undefined);
            setDefaultCategoryForForm(selectedCategory !== 'all' ? selectedCategory : undefined);
            setIsFormOpen(true);
          }}
          className="fixed bottom-6 left-6 w-16 h-16 bg-[#630F0F] text-[#C5A02F] rounded-full shadow-2xl shadow-[#630F0F]/30 flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-40 border border-[#C5A02F]/20"
        >
          <Plus size={32} />
        </button>
      )}

      {/* Admin Modals */}
      <AdminForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddItem}
        initialData={editingItem}
        categories={categories}
        defaultCategory={defaultCategoryForForm}
      />
      
      <CategoryManager 
        isOpen={isCatManagerOpen}
        onClose={() => setIsCatManagerOpen(false)}
        categories={categories}
        onSave={handleSaveCategories}
        onAddProduct={handleAddProductFromCategory}
      />

      <RestaurantSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLogo={logo}
        onSaveLogo={handleSaveLogo}
      />
      
      <FooterSettings
        isOpen={isFooterSettingsOpen}
        onClose={() => setIsFooterSettingsOpen(false)}
        data={footerData}
        onSave={handleSaveFooter}
      />
    </div>
  );
}