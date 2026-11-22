import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const QuickInquiryModal: React.FC = () => {
  const { inquiryModal, closeInquiryModal, storeConfig, addInquiry } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [volume, setVolume] = useState('1 unit / Walk-in');
  const [note, setNote] = useState('');

  if (!inquiryModal.isOpen) return null;

  const itemTitle = inquiryModal.itemOrService || 'Reprographic / Stationery Inquiry';

  const handleWhatsAppSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalNote = note ? ` Note: ${note}` : '';
    const text = encodeURIComponent(
      `Hello S V Copiers / Xerox (Nana Chiloda, Ahmedabad),\n\nName: ${name || 'Customer'}\nContact: ${phone || 'N/A'}\nRegarding: ${itemTitle} ${inquiryModal.skuOrCode ? `(SKU/Code: ${inquiryModal.skuOrCode})` : ''}\nEstimated Volume: ${volume}\n${finalNote}`
    );

    // Also record in internal system
    const saved = await addInquiry({
      clientName: name || 'Online Visitor',
      clientContact: phone || '+91 Direct WhatsApp',
      itemOrService: itemTitle,
      skuOrCode: inquiryModal.skuOrCode || 'WALK-IN',
      volume: volume || '1 Unit',
      notes: note || 'Customer initiated WhatsApp direct chat.',
    });
    if (!saved) return;

    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${text}`, '_blank');
    closeInquiryModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/60 backdrop-blur-sm transition-all"
      onClick={closeInquiryModal}
    >
      <div
        className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#dce9ff]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#eff4ff] border-b border-[#dce9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fea619] text-[22px]">
              chat
            </span>
            <span className="font-['Space_Grotesk'] text-sm uppercase tracking-wider text-[#0b1c30] font-bold">
              Shop Consultation & Inquiry Desk
            </span>
          </div>
          <button
            onClick={closeInquiryModal}
            className="w-7 h-7 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] hover:bg-[#131b2e] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <form onSubmit={handleWhatsAppSend} className="p-6 flex flex-col gap-4">
          <div className="bg-[#eff4ff] p-3 rounded-lg border border-[#dce9ff]">
            <span className="font-['Space_Grotesk'] text-[11px] text-[#855300] font-bold uppercase block">
              Inquiring Item / Service
            </span>
            <p className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30] mt-0.5">
              {itemTitle}
            </p>
            {inquiryModal.price && (
              <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] block mt-0.5">
                Tariff: ₹{inquiryModal.price}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-['Space_Grotesk'] text-xs text-[#45464d] uppercase font-bold block mb-1">
                Your Name / Organization
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Parth Patel"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-transparent focus:border-[#0b1c30] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-['Space_Grotesk'] text-xs text-[#45464d] uppercase font-bold block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="+91 9825X XXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-transparent focus:border-[#0b1c30] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-['Space_Grotesk'] text-xs text-[#45464d] uppercase font-bold block mb-1">
              Estimated Quantity / Volume
            </label>
            <input
              type="text"
              placeholder="e.g. 5 Reams / 200 Pages B&W Xerox / 2 Hardbound Theses"
              value={volume}
              onChange={e => setVolume(e.target.value)}
              className="w-full p-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-transparent focus:border-[#0b1c30] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="font-['Space_Grotesk'] text-xs text-[#45464d] uppercase font-bold block mb-1">
              Specifications Note (Paper GSM, Binding, Finishing)
            </label>
            <textarea
              rows={2}
              placeholder="Any specific requirement like double-sided, golden foil thesis, urgent walk-in pickup timing..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full p-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-transparent focus:border-[#0b1c30] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#45464d]">
              Shop Open Today until <strong>{storeConfig.closeTime}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeInquiryModal}
                className="px-3 py-2 text-xs font-['Space_Grotesk'] text-[#45464d] hover:text-[#0b1c30]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-bold rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
