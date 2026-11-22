import React from 'react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const { detailProduct, setDetailProduct, storeConfig, openInquiryModal } = useStore();

  if (!detailProduct) return null;

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello S V Copiers / Xerox Ahmedabad, I am inquiring about the product: "${detailProduct.name}" (SKU: ${detailProduct.sku}) listed at ₹${detailProduct.price}/${detailProduct.unit}. Is this available for immediate counter pickup at your Nana Chiloda store?`
    );
    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/60 backdrop-blur-sm transition-all animate-fadeIn"
      onClick={() => setDetailProduct(null)}
    >
      <div
        className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#dce9ff]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#eff4ff] border-b border-[#dce9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fea619] text-[20px]">
              inventory_2
            </span>
            <span className="font-['Space_Grotesk'] text-xs uppercase tracking-wider text-[#45464d] font-bold">
              {detailProduct.brand} • SKU: {detailProduct.sku}
            </span>
          </div>
          <button
            onClick={() => setDetailProduct(null)}
            className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] hover:bg-[#131b2e] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Image & Stock Badge */}
          <div className="relative bg-[#eff4ff] rounded-xl p-4 flex items-center justify-center aspect-square overflow-hidden border border-[#dce9ff]">
            <img
              alt={detailProduct.name}
              className="object-contain w-full h-full max-h-56"
              src={detailProduct.image}
            />
            <span
              className={`absolute top-3 left-3 font-['Space_Grotesk'] text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-sm ${
                detailProduct.stockStatus.includes('In Stock')
                  ? 'bg-[#fea619] text-[#684000]'
                  : detailProduct.stockStatus.includes('Low')
                  ? 'bg-[#ffddb8] text-[#855300]'
                  : 'bg-[#dce9ff] text-[#0b1c30]'
              }`}
            >
              {detailProduct.stockStatus}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2.5">
            <span className="font-['Space_Grotesk'] text-xs uppercase text-[#855300] font-bold tracking-wide">
              {detailProduct.category}
            </span>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#0b1c30] leading-snug">
              {detailProduct.name}
            </h3>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#0b1c30]">
                ₹{detailProduct.price}
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                / {detailProduct.unit} (MRP incl. GST)
              </span>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-lg flex flex-col gap-1.5 my-1 border border-[#dce9ff]">
              <div className="flex items-center gap-2 text-[#45464d]">
                <span className="material-symbols-outlined text-[16px] text-[#fea619]">
                  verified
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs">
                  Authentic Manufacturer Stock
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#45464d]">
                <span className="material-symbols-outlined text-[16px] text-[#fea619]">
                  store
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-xs">
                  Pickup at Nana Chiloda Counter, Ahmedabad
                </span>
              </div>
            </div>

            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
              {detailProduct.specDetails || detailProduct.description}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full flex items-center justify-center gap-2 bg-[#131b2e] text-white py-2.5 rounded-lg font-['Space_Grotesk'] text-xs font-semibold hover:bg-[#fea619] hover:text-[#684000] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Inquire Stock on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setDetailProduct(null);
                  openInquiryModal(detailProduct.name, detailProduct.sku, detailProduct.price);
                }}
                className="w-full py-1.5 text-center font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] hover:text-[#0b1c30] transition-colors"
              >
                Log Store Consultation Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
