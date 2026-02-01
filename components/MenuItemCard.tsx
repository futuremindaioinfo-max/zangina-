import React from 'react';
import { MenuItem } from '../types';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Props {
  item: MenuItem;
  isAdmin?: boolean;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
}

export const MenuItemCard: React.FC<Props> = ({ 
  item, 
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-[#C5A02F]/20 overflow-hidden flex flex-col h-full ${!item.isAvailable && !isAdmin ? 'opacity-50 grayscale' : ''}`}>
      <div className="relative h-40 w-full bg-[#FFFBF5] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?grayscale';
          }}
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-[#630F0F]/60 flex items-center justify-center">
            <span className="text-white font-bold border-2 border-white px-4 py-1 rounded-full text-sm">
              غير متوفر
            </span>
          </div>
        )}
        
        {isAdmin && (
           <div className="absolute top-2 left-2 flex gap-2">
             <button 
                onClick={() => onToggleStatus?.(item.id, item.isAvailable)}
                className={`p-2 rounded-full backdrop-blur-md ${item.isAvailable ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}
             >
                {item.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
             </button>
           </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-[#630F0F] line-clamp-1">{item.name}</h3>
          <span className="font-bold text-[#C5A02F] bg-[#630F0F] px-2 py-0.5 rounded text-sm shrink-0 shadow-sm">
            {item.price} ر.س
          </span>
        </div>
        
        <p className="text-[#630F0F]/70 text-sm line-clamp-2 leading-relaxed mb-4 flex-grow">
          {item.description}
        </p>

        {isAdmin && (
          <div className="flex gap-2 mt-auto pt-3 border-t border-[#C5A02F]/10">
            <button 
              onClick={() => onEdit?.(item)}
              className="flex-1 flex items-center justify-center gap-1 bg-[#FFFBF5] text-[#630F0F] border border-[#C5A02F]/20 py-2 rounded-lg text-sm font-medium hover:bg-[#C5A02F]/10"
            >
              <Edit size={16} />
              تعديل
            </button>
            <button 
              onClick={() => {
                if(window.confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
                  onDelete?.(item.id);
                }
              }}
              className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 border border-red-100 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
            >
              <Trash2 size={16} />
              حذف
            </button>
          </div>
        )}
      </div>
    </div>
  );
};