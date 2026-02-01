import { MenuItem, CategoryItem, FooterData } from '../types';

const STORAGE_KEY = 'restaurant_menu_items';
const CAT_STORAGE_KEY = 'restaurant_categories';
const LOGO_STORAGE_KEY = 'restaurant_logo';
const FOOTER_STORAGE_KEY = 'restaurant_footer_data';
const AUTH_STORAGE_KEY = 'restaurant_auth_hash';

const INITIAL_DATA: MenuItem[] = [
  {
    id: '1',
    name: 'برجر كلاسيك',
    description: 'شريحة لحم مشوي على اللهب مع الجبن الشيدر والخس الطازج والصوص الخاص.',
    price: 35,
    image: 'https://picsum.photos/id/163/800/600',
    category: 'meals',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'بيتزا مارغريتا',
    description: 'عجينة إيطالية رقيقة مع صلصة الطماطم وجبنة الموزاريلا والريحان.',
    price: 45,
    image: 'https://picsum.photos/id/305/800/600',
    category: 'meals',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'عصير برتقال',
    description: 'عصير برتقال طازج معصور يومياً بدون سكر مضاف.',
    price: 15,
    image: 'https://picsum.photos/id/433/800/600',
    category: 'drinks',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'سلطة سيزر',
    description: 'خس طازج مع قطع الدجاج المشوي وجبنة البارميزان.',
    price: 28,
    image: 'https://picsum.photos/id/292/800/600',
    category: 'appetizers',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'تشيز كيك',
    description: 'قطعة تشيز كيك غنية بطبقة من الفراولة الطازجة.',
    price: 22,
    image: 'https://picsum.photos/id/1080/800/600',
    category: 'desserts',
    isAvailable: false,
  }
];

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'meals', label: 'وجبات رئيسية' },
  { id: 'appetizers', label: 'مقبلات' },
  { id: 'drinks', label: 'مشروبات' },
  { id: 'desserts', label: 'حلى' },
];

const INITIAL_FOOTER_DATA: FooterData = {
  address: 'الرياض - حي الوادي - شارع الأمير',
  workingHours: 'يومياً من 1:00 ظهراً حتى 2:00 بعد منتصف الليل',
  phoneNumbers: ['0500000000'],
  deliveryNumbers: ['0555555555', '0544444444'],
  whatsapp: {
    number: '966500000000',
    message: 'مرحباً، أود طلب طعام من المنيو',
  },
  socialLinks: {
    facebook: '',
    instagram: '',
    tiktok: '',
    googleMaps: 'https://maps.google.com',
  },
};

// --- Helper Functions ---

export const getMenuHelper = (): MenuItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(stored);
};

export const saveMenuHelper = (items: MenuItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const getCategoriesHelper = (): CategoryItem[] => {
  const stored = localStorage.getItem(CAT_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  return JSON.parse(stored);
};

export const saveCategoriesHelper = (categories: CategoryItem[]) => {
  localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(categories));
};

export const getLogoHelper = (): string => {
  return localStorage.getItem(LOGO_STORAGE_KEY) || '/logo.png';
};

export const saveLogoHelper = (url: string) => {
  localStorage.setItem(LOGO_STORAGE_KEY, url);
};

export const getFooterHelper = (): FooterData => {
  const stored = localStorage.getItem(FOOTER_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(INITIAL_FOOTER_DATA));
    return INITIAL_FOOTER_DATA;
  }
  return JSON.parse(stored);
};

export const saveFooterHelper = (data: FooterData) => {
  localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(data));
};

// --- Auth Security Helpers ---

/**
 * Creates a SHA-256 hash of the password.
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Initializes authentication. If no password exists, sets default 'admin123'.
 */
export const initAuth = async () => {
  const currentHash = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!currentHash) {
    // Default password: admin123
    const defaultHash = await hashPassword('admin123');
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      hash: defaultHash,
      updatedAt: Date.now()
    }));
  }
};

/**
 * Verifies if the provided password matches the stored hash.
 */
export const verifyPassword = async (inputPassword: string): Promise<boolean> => {
  await initAuth(); // Ensure auth is initialized
  const storedData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}');
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedData.hash;
};

/**
 * Updates the password securely.
 */
export const changePassword = async (newPassword: string): Promise<void> => {
  const newHash = await hashPassword(newPassword);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    hash: newHash,
    updatedAt: Date.now()
  }));
};
