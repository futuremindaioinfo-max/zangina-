export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface CategoryItem {
  id: string;
  label: string;
}

export interface UserSession {
  isAdmin: boolean;
}

export interface FooterData {
  address: string;
  workingHours: string;
  phoneNumbers: string[];
  deliveryNumbers: string[];
  whatsapp: {
    number: string;
    message: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    googleMaps: string;
  };
}