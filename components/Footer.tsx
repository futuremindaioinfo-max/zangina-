import React from 'react';
import { FooterData } from '../types';
import { Phone, MapPin, Clock, Facebook, Instagram, Send, Bike, Map, MessageCircle } from 'lucide-react';

interface Props {
  data: FooterData;
}

export const Footer: React.FC<Props> = ({ data }) => {
  return (
    <footer className="bg-[#630F0F] text-[#FFFBF5] pt-12 pb-24 sm:pb-8 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(99,15,15,0.3)] mt-10">
      <div className="max-w-md mx-auto px-6">
        
        {/* Top Section: Quick Actions */}
        <div className="flex justify-center gap-6 mb-10">
           {data.whatsapp.number && (
             <a 
               href={`https://wa.me/${data.whatsapp.number}?text=${encodeURIComponent(data.whatsapp.message)}`}
               target="_blank"
               rel="noreferrer"
               className="flex flex-col items-center gap-2 group"
             >
                <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                   <MessageCircle size={28} fill="white" />
                </div>
                <span className="text-xs font-bold text-[#C5A02F]">واتساب</span>
             </a>
           )}
           
           {data.socialLinks.googleMaps && (
              <a 
               href={data.socialLinks.googleMaps}
               target="_blank"
               rel="noreferrer"
               className="flex flex-col items-center gap-2 group"
             >
                <div className="w-14 h-14 bg-[#FFFBF5] rounded-full flex items-center justify-center text-[#630F0F] shadow-lg group-hover:scale-110 transition-transform">
                   <Map size={28} />
                </div>
                <span className="text-xs font-bold text-[#C5A02F]">الموقع</span>
             </a>
           )}
        </div>

        <div className="grid grid-cols-1 gap-8 text-center sm:text-right">
          
          {/* Working Hours & Address */}
          <div className="bg-[#4a0b0b]/50 p-6 rounded-2xl border border-[#C5A02F]/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Clock className="text-[#C5A02F]" size={24} />
              <div>
                <h3 className="font-bold text-[#C5A02F] mb-1">أوقات العمل</h3>
                <p className="text-sm opacity-90 leading-relaxed">{data.workingHours}</p>
              </div>
            </div>
            
            <div className="w-full h-px bg-[#C5A02F]/10"></div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <MapPin className="text-[#C5A02F]" size={24} />
              <div>
                 <h3 className="font-bold text-[#C5A02F] mb-1">العنوان</h3>
                 <p className="text-sm opacity-90 leading-relaxed">{data.address}</p>
              </div>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="space-y-4">
            {(data.phoneNumbers.length > 0 || data.deliveryNumbers.length > 0) && (
              <h3 className="text-xl font-bold text-center text-[#C5A02F]">تواصل معنا</h3>
            )}
            
            <div className="grid grid-cols-1 gap-3">
              {data.deliveryNumbers.map((num, idx) => (
                <a 
                  key={`del-${idx}`}
                  href={`tel:${num}`}
                  className="flex items-center justify-center gap-3 bg-[#FFFBF5] text-[#630F0F] py-3.5 rounded-xl font-bold hover:bg-[#C5A02F] transition-colors shadow-sm"
                >
                  <Bike size={20} />
                  <span>توصيل: {num}</span>
                </a>
              ))}
              
              {data.phoneNumbers.map((num, idx) => (
                <a 
                  key={`ph-${idx}`}
                  href={`tel:${num}`}
                  className="flex items-center justify-center gap-3 bg-[#630F0F] border border-[#C5A02F]/30 text-[#FFFBF5] py-3.5 rounded-xl font-bold hover:bg-[#4a0b0b] transition-colors"
                >
                  <Phone size={20} />
                  <span>إدارة: {num}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-center gap-6 pt-4 border-t border-[#C5A02F]/20">
            {data.socialLinks.instagram && (
              <a href={data.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-[#C5A02F] hover:text-white transition-colors">
                <Instagram size={28} />
              </a>
            )}
            {data.socialLinks.facebook && (
              <a href={data.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-[#C5A02F] hover:text-white transition-colors">
                <Facebook size={28} />
              </a>
            )}
            {data.socialLinks.tiktok && (
               <a href={data.socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-[#C5A02F] hover:text-white transition-colors">
                 {/* Lucide doesn't have TikTok, using Send as generic share icon or similar style */}
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music-2"><circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4"/></svg>
               </a>
            )}
          </div>
          
          <div className="text-center text-xs text-[#C5A02F]/40 pt-4">
            &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
          </div>
        </div>
      </div>
    </footer>
  );
};