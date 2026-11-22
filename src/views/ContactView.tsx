import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getStoreHoursStatus, STORE_HOURS } from '../lib/businessHours';

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/S+V+COPIERS%2F+XEROX/@23.1093821,72.6711518,20z/data=!4m10!1m2!2m1!1sShop+10,+Siddhivinayak+Height,+Above+Ratnaraj+Green,+Nana+Chiloda,+New+Shahibaug,+Ahmedabad,+Gujarat+382330,+India.!3m6!1s0x395e81657ba57e8f:0x4463c30efb2313cb!8m2!3d23.1092725!4d72.6717867!15sCnNTaG9wIDEwLCBTaWRkaGl2aW5heWFrIEhlaWdodCwgQWJvdmUgUmF0bmFyYWogR3JlZW4sIE5hbmEgQ2hpbG9kYSwgTmV3IFNoYWhpYmF1ZywgQWhtZWRhYmFkLCBHdWphcmF0IDM4MjMzMCwgSW5kaWEukgEJY29weV9zaG9w4AEA!16s%2Fg%2F11vkkvj6yp';

export const ContactView: React.FC = () => {
  const { storeConfig, addInquiry } = useStore();
  const [clock, setClock] = useState(() => new Date());

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bulk Stationery Purchase');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const hoursStatus = getStoreHoursStatus(clock);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await addInquiry({
      clientName: name,
      clientContact: phone,
      itemOrService: subject,
      skuOrCode: 'CONTACT-FORM',
      volume: 'Consultation Inquiry',
      notes: message,
    });
    if (!saved) return;

    const text = encodeURIComponent(
      `Hello S V Copiers / Xerox,\nMy name is ${name} (${phone}).\nRegarding: ${subject}\nMessage: ${message}`
    );
    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${text}`, '_blank');

    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full py-8 bg-[#f8f9ff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
        {/* Masthead */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#fea619]"></span>
            <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
              Direct Contact & Counter Access
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#0b1c30] tracking-tight uppercase">
            Contact S V COPIERS / XEROX
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#45464d] max-w-2xl mt-1 leading-relaxed">
            Need pricing on bulk register reams, thesis binding rush deadlines, or large CAD plotters? Reach out directly via WhatsApp, call our counter, or walk into our Nana Chiloda shop.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Map */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${storeConfig.phone.replace(/[^0-9+]/g, '')}`}
                className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col gap-2 hover:border-[#131b2e] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[10px] uppercase text-[#76777d] font-bold">
                  Direct Phone
                </span>
                <span className="font-['Space_Grotesk'] text-xs font-bold text-[#0b1c30]">
                  {storeConfig.phone}
                </span>
              </a>

              <a
                href={`https://wa.me/${storeConfig.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col gap-2 hover:border-[#131b2e] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#855300]">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[10px] uppercase text-[#76777d] font-bold">
                  WhatsApp Router
                </span>
                <span className="font-['Space_Grotesk'] text-xs font-bold text-[#0b1c30]">
                  {storeConfig.phone}
                </span>
              </a>

              <a
                href={`mailto:${storeConfig.email}`}
                className="bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff] flex flex-col gap-2 hover:border-[#131b2e] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[10px] uppercase text-[#76777d] font-bold">
                  Email Desk
                </span>
                <span className="font-['Space_Grotesk'] text-xs font-bold text-[#0b1c30] truncate">
                  {storeConfig.email}
                </span>
              </a>
            </div>

            {/* Address Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dce9ff] flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[22px]">pin_drop</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-xs uppercase text-[#76777d] font-bold">
                    Physical Store Address
                  </span>
                  <p className="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#0b1c30] mt-0.5">
                    {storeConfig.address}
                  </p>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] mt-1">
                    Landmark: {storeConfig.landmark}
                  </p>
                </div>
              </div>

              <div
                className={`rounded-xl border p-3 flex items-center gap-2 text-sm font-['Space_Grotesk'] ${
                  hoursStatus.isOpen
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    : 'bg-red-50 border-red-100 text-red-700'
                }`}
                aria-live="polite"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${hoursStatus.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="font-bold">{hoursStatus.message}</span>
                <span className="ml-auto text-xs text-[#45464d]">India time</span>
              </div>
            </div>

            <section className="bg-white rounded-2xl shadow-sm border border-[#dce9ff] overflow-hidden" aria-labelledby="store-hours-heading">
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 id="store-hours-heading" className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30]">
                    Opening hours
                  </h2>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#76777d]">Asia/Kolkata (IST)</span>
                </div>
                <div className="flex flex-col">
                  {STORE_HOURS.map(hours => {
                    const isToday = hours.day === hoursStatus.day;
                    return (
                      <div
                        key={hours.day}
                        className={`grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 py-3 border-b last:border-b-0 border-[#eff1f4] font-['Plus_Jakarta_Sans'] text-sm ${
                          isToday ? 'font-bold text-[#202124]' : 'text-[#3c4043]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {hours.day}
                          {isToday && <span className="text-[10px] uppercase tracking-wide text-[#76777d]">Today</span>}
                        </span>
                        <span className="text-right">{hours.display}</span>
                        {hours.day === 'Tuesday' && (
                          <span className="col-start-2 text-right text-xs font-normal text-[#76777d]">
                            Hours might differ on Guru Nanak Gurpurab
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs font-['Plus_Jakarta_Sans'] text-[#76777d]">
                  Holiday hours may vary. Please call ahead to confirm.
                </p>
              </div>
            </section>

            {/* Map image with navigation target */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[#dce9ff] bg-white">
              <iframe
                title="Map to S V Copiers / Xerox"
                src="https://maps.google.com/maps?q=23.1092725,72.6717867&z=17&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-['Space_Grotesk'] text-xs font-bold text-[#0b1c30] block">
                    {storeConfig.storeName}
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#45464d]">
                    Shop 10, Siddhivinayak Height, Nana Chiloda, Ahmedabad
                  </span>
                </div>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-3.5 py-2 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-bold rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message & Consultation Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#dce9ff] flex flex-col gap-4">
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#0b1c30]">
              Direct In-Shop Inquiry Form
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
              Submit your project specifications. Our desk will receive the inquiry in our operational terminal and open a direct WhatsApp channel.
            </p>

            {submitted ? (
              <div className="bg-[#eff4ff] p-5 rounded-xl border border-[#dce9ff] flex flex-col items-center text-center gap-2 my-4">
                <span className="material-symbols-outlined text-[32px] text-[#fea619]">
                  check_circle
                </span>
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30]">
                  Inquiry Dispatched to Counter Desk
                </h4>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                  We have logged your request. WhatsApp chat has been initiated for immediate operator response.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-['Space_Grotesk'] font-bold text-[#855300] hover:underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parth Patel"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-[#dce9ff] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Phone Contact (WhatsApp enabled) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9825X XXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-[#dce9ff] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Subject / Department
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-[#dce9ff] focus:bg-white focus:outline-none"
                  >
                    <option value="Bulk Stationery Purchase">Bulk Stationery Purchase</option>
                    <option value="Photocopying & B&W High-Speed">Photocopying & B&W High-Speed</option>
                    <option value="Colour Laser Printing">Colour Laser Printing</option>
                    <option value="Thesis Hardbound Golden Emboss">Thesis Hardbound Golden Emboss</option>
                    <option value="CAD Blueprint Plotter Rolls">CAD Blueprint Plotter Rolls</option>
                    <option value="Thermal Lamination / Spiral Binding">Thermal Lamination / Spiral Binding</option>
                    <option value="Institutional Quotation (Schools/Offices)">Institutional Quotation (Schools/Offices)</option>
                  </select>
                </div>

                <div>
                  <label className="font-['Space_Grotesk'] text-[11px] text-[#45464d] uppercase font-bold block mb-1">
                    Requirements & Quantity Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specify ream counts, GSM preference, binding requirements, or arrival time at Nana Chiloda..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-xs rounded-lg border border-[#dce9ff] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-bold rounded-lg hover:bg-[#fea619] hover:text-[#684000] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-1"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Transmit Inquiry to Store WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
