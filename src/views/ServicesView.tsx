import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { EQUIPMENT_SPECS } from '../data/initialData';

export const ServicesView: React.FC = () => {
  const { rateCards, storeConfig, openInquiryModal } = useStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'xerox' | 'color' | 'finishing' | 'thesis'>('all');

  const filteredCards = useMemo(() => {
    if (activeFilter === 'all') return rateCards;
    return rateCards.filter(r => r.category === activeFilter);
  }, [rateCards, activeFilter]);

  const handleWhatsAppForService = (serviceTitle: string, rate: number, rateDisplay?: string) => {
    const rateText = rateDisplay ? rateDisplay : `₹${rate}`;
    const text = encodeURIComponent(
      `Hello S V Copiers / Xerox (Nana Chiloda, Ahmedabad),\nI am inquiring about the printing service: "${serviceTitle}" (Standard Rate: ${rateText}). I'd like to bring in my files for printing/binding.`
    );
    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Technical Status & Assurance Header */}
      <section className="w-full bg-[#eff4ff] py-2.5 border-b border-[#dce9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-[#855300] font-['Space_Grotesk'] text-xs font-bold shadow-sm border border-[#dce9ff]">
              <span className="w-2 h-2 rounded-full bg-[#fea619] animate-pulse"></span>
              WALK-IN SERVICE DESK OPEN TODAY
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] hidden sm:inline">
              Nana Chiloda, Ahmedabad • High-Duty Commercial Production Floor
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#45464d] font-['Space_Grotesk'] text-xs font-semibold">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#855300]">
                verified_user
              </span>
              In-Store Pickup Only
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#855300]">speed</span>
              Instant Turnaround
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#855300]">
                receipt_long
              </span>
              GST Tax Invoices
            </span>
          </div>
        </div>
      </section>

      {/* Editorial Masthead Section */}
      <section className="w-full bg-white py-10 border-b border-[#e5eeff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 bg-[#eff4ff] text-[#0b1c30] w-fit px-3 py-1 rounded-full border border-[#dce9ff]">
                <span className="material-symbols-outlined text-[16px] text-[#fea619]">
                  precision_manufacturing
                </span>
                <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider font-bold">
                  High-Volume Xerox & Commercial Printing
                </span>
              </div>

              <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0b1c30] uppercase tracking-tight leading-tight">
                Professional Photocopying & Digital Printing Services
              </h1>

              <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#45464d] max-w-3xl leading-relaxed">
                Walk in to our shop in Nana Chiloda, Ahmedabad for crisp black-and-white photocopying, full-color presentation prints, document lamination, spiral binding, and studio-grade photo printing. Built for students, drafting engineers, legal professionals, and commercial businesses.
              </p>
            </div>

            <div className="lg:col-span-4 bg-[#eff4ff] p-5 sm:p-6 rounded-2xl shadow-sm border border-[#dce9ff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-[#dce9ff]">
                <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-[#45464d] font-bold">
                  Store Working Mode
                </span>
                <span className="bg-[#fea619] text-[#684000] font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded-full font-bold">
                  NO CHECKOUT / DIRECT VISIT
                </span>
              </div>

              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#0b1c30] leading-relaxed">
                We operate as an on-demand, in-person reprographic hub. Verify your technical requirements below, load your files to a flash drive or mail them on arrival, and receive instant precision prints over the counter.
              </p>

              <div className="pt-2 flex items-center gap-4 font-['Space_Grotesk'] text-xs text-[#855300] font-bold">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">alarm</span>
                  Mon – Sat: Closes {storeConfig.closeTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Filter & Gauge Ribbon */}
      <section className="w-full bg-[#eff4ff] py-4 border-b border-[#dce9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: `All Capabilities (${rateCards.length})` },
              { id: 'xerox', label: 'Photocopying' },
              { id: 'color', label: 'Colour Laser' },
              { id: 'finishing', label: 'Lamination & Binding' },
              { id: 'thesis', label: 'Thesis & Golden Emboss' },
            ].map(f => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg font-['Space_Grotesk'] text-xs uppercase font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#131b2e] text-white shadow-sm'
                      : 'bg-white text-[#45464d] hover:text-[#0b1c30] border border-[#dce9ff]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 font-['Space_Grotesk'] text-xs text-[#45464d]">
            <span className="material-symbols-outlined text-[18px] text-[#855300]">
              check_circle
            </span>
            <span>Standard ISO Page Specs: A4, A3, Legal, Executive & Plotter Roll</span>
          </div>
        </div>
      </section>

      {/* Service Grid & Live Synced Rates */}
      <section className="w-full py-10 bg-[#f8f9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-[#fea619]"></span>
              <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
                Catalogued Service Specifications
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#0b1c30] uppercase">
              On-Counter Production Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map(service => (
              <article
                key={service.id}
                className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#dce9ff]"
              >
                {/* Image Header with Badges */}
                <div className="relative h-48 w-full bg-[#eff4ff] overflow-hidden">
                  <img
                    alt={service.title}
                    className="w-full h-full object-cover"
                    src={service.image}
                  />
                  <div className="absolute top-3 left-3 bg-[#131b2e] text-white font-['Space_Grotesk'] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {service.category === 'xerox'
                      ? 'Heavy Duty Xerox'
                      : service.category === 'color'
                      ? 'Laser Vivid Color'
                      : service.category === 'finishing'
                      ? 'Mechanical & Thermal'
                      : 'GTU & GU Approved'}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#0b1c30] font-['Space_Grotesk'] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#dce9ff]">
                    {service.paperStock}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#0b1c30] leading-snug">
                      {service.title}
                    </h3>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.badges.map(b => (
                      <span
                        key={b}
                        className="bg-[#eff4ff] text-[#45464d] font-['Space_Grotesk'] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#dce9ff]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Box (Live Synced!) */}
                  <div className="bg-[#eff4ff] p-3.5 rounded-xl flex flex-col gap-1 border border-[#dce9ff]">
                    <div className="flex items-baseline justify-between">
                      <span className="font-['Space_Grotesk'] text-[10px] text-[#45464d] uppercase font-bold">
                        Admin Confirmed Rate
                      </span>
                      <span className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30]">
                        {service.rateDisplay ? (
                          service.rateDisplay
                        ) : (
                          <>
                            ₹{service.rate.toFixed(2)}{' '}
                            <span className="font-['Plus_Jakarta_Sans'] text-xs font-normal text-[#45464d]">
                              {service.rateUnit}
                            </span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-['Plus_Jakarta_Sans'] text-[11px] text-[#855300] font-medium">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      <span>{service.volumeNote}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleWhatsAppForService(service.title, service.rate, service.rateDisplay)}
                    className="inline-flex items-center justify-center gap-2 bg-[#131b2e] text-white py-2.5 px-4 rounded-lg font-['Space_Grotesk'] text-xs font-bold hover:bg-[#fea619] hover:text-[#684000] transition-all cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Inquire In-Store Job on WhatsApp</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Spec Comparison Matrix */}
      <section className="w-full bg-[#eff4ff] py-10 border-t border-b border-[#dce9ff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
              Comprehensive Parameter Matrix
            </span>
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#0b1c30] uppercase">
              Commercial Equipment Specifications
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto border border-[#dce9ff]">
            <table className="w-full text-left font-['Plus_Jakarta_Sans'] text-xs">
              <thead>
                <tr className="bg-[#dce9ff] text-[#0b1c30] font-['Space_Grotesk'] text-xs uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4 sm:px-6">Service Capability</th>
                  <th className="py-3.5 px-4">Paper Weights (GSM)</th>
                  <th className="py-3.5 px-4">Max Dimensions</th>
                  <th className="py-3.5 px-4">Standard Turnaround</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Published Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eff4ff] text-[#45464d]">
                {EQUIPMENT_SPECS.map((spec, i) => (
                  <tr
                    key={spec.service}
                    className={`hover:bg-[#f8f9ff] transition-colors ${
                      i % 2 === 1 ? 'bg-[#eff4ff]/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#0b1c30] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#0b1c30]">
                        {spec.icon}
                      </span>
                      <span>{spec.service}</span>
                    </td>
                    <td className="py-3.5 px-4">{spec.paperWeights}</td>
                    <td className="py-3.5 px-4">{spec.maxDimensions}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#eff4ff] text-[#0b1c30] px-2 py-0.5 rounded font-['Space_Grotesk'] text-[11px] font-semibold border border-[#dce9ff]">
                        {spec.turnaround}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-['Space_Grotesk'] font-bold text-[#0b1c30]">
                      {spec.publishedRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Walk-In & File Preparation Guide */}
      <section className="w-full py-10 bg-white border-b border-[#e5eeff]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-[#eff4ff] p-6 lg:p-8 rounded-2xl shadow-sm border border-[#dce9ff]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-[#dce9ff] text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[24px]">folder_zip</span>
                  </span>
                  <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
                    Preparation Standard
                  </span>
                </div>

                <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#0b1c30] uppercase">
                  Walk-In & File Preparation Guide
                </h2>

                <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#45464d] leading-relaxed">
                  To avoid formatting shifts between software versions and ensure color calibration accuracy, please review our intake guidelines prior to walking in.
                </p>

                <div className="bg-white p-4 rounded-xl flex items-start gap-3 border border-[#dce9ff]">
                  <span className="material-symbols-outlined text-[#fea619] text-[24px] shrink-0 mt-0.5">
                    info
                  </span>
                  <div className="flex flex-col">
                    <span className="font-['Space_Grotesk'] text-xs font-bold text-[#0b1c30]">
                      How to bring your files
                    </span>
                    <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] mt-0.5">
                      Bring via USB Pen Drive, SD Card, or email directly to our shop terminal on arrival at Nana Chiloda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl flex flex-col gap-2 border border-[#dce9ff]">
                  <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#855300] shadow-sm border border-[#dce9ff]">
                    <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30]">
                    Supported Formats
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
                    <strong>PDF (Strongly Preferred)</strong> ensures font embedding and fixed page margins. Also accepted: DOCX (Word), PPTX, JPG, PNG, and TIFF.
                  </p>
                  <div className="mt-auto pt-2 font-['Space_Grotesk'] text-[11px] text-[#855300] font-bold">
                    ✓ 300+ DPI recommended for prints
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl flex flex-col gap-2 border border-[#dce9ff]">
                  <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#855300] shadow-sm border border-[#dce9ff]">
                    <span className="material-symbols-outlined text-[22px]">usb</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30]">
                    Physical Storage Media
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
                    FAT32, NTFS, or exFAT formatted USB pen drives, external SSDs, SD/MicroSD cards, and secure OTG drives scanned on dedicated clean terminals.
                  </p>
                  <div className="mt-auto pt-2 font-['Space_Grotesk'] text-[11px] text-[#855300] font-bold">
                    ✓ High-speed USB 3.0 transfers
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl flex flex-col gap-2 border border-[#dce9ff]">
                  <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#855300] shadow-sm border border-[#dce9ff]">
                    <span className="material-symbols-outlined text-[22px]">mail</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30]">
                    Email on Arrival
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
                    Don't carry a flash drive? Our counter monitors display our dedicated high-bandwidth shop printing inbox for instant email attachments.
                  </p>
                  <div className="mt-auto pt-2 font-['Space_Grotesk'] text-[11px] text-[#855300] font-bold">
                    ✓ Immediate counter download
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl flex flex-col gap-2 border border-[#dce9ff]">
                  <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#855300] shadow-sm border border-[#dce9ff]">
                    <span className="material-symbols-outlined text-[22px]">spellcheck</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#0b1c30]">
                    Pre-Flight Print Review
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
                    Operators preview your layouts, inspect margins, verify page counts, and print a sample test leaf for color approval before running bulk batches.
                  </p>
                  <div className="mt-auto pt-2 font-['Space_Grotesk'] text-[11px] text-[#855300] font-bold">
                    ✓ Zero misprint guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Location & Map Strip */}
      <section className="w-full bg-[#f8f9ff] py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
                  Ahmedabad Reprographics Center
                </span>
                <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#0b1c30] uppercase">
                  Visit Our Workshop
                </h2>
                <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#45464d] leading-relaxed">
                  Located directly above Ratnaraj Green in Nana Chiloda with open parking space. Equipped with heavy-volume multi-function production copiers and rapid bindery fixtures.
                </p>
              </div>

              <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-sm border border-[#dce9ff]">
                <div className="flex items-center gap-2 text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[#fea619] text-[22px]">
                    location_on
                  </span>
                  <span className="font-['Space_Grotesk'] text-sm font-bold">
                    {storeConfig.storeName}
                  </span>
                </div>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] pl-7">
                  {storeConfig.address}
                </p>
                <div className="flex items-center gap-2 pl-7 pt-1 text-[#855300] font-['Space_Grotesk'] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#fea619]"></span>
                  <span>Open Monday – Saturday until {storeConfig.closeTime} IST</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 bg-[#131b2e] text-white font-['Space_Grotesk'] text-xs font-bold px-5 py-3 rounded-xl hover:bg-[#fea619] hover:text-[#684000] transition-all"
                  href={`https://maps.google.com/?q=${storeConfig.googleMapsQuery}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  <span>Get Store Directions</span>
                </a>
                <a
                  className="inline-flex items-center gap-2 bg-white text-[#0b1c30] font-['Space_Grotesk'] text-xs font-bold px-5 py-3 rounded-xl hover:bg-[#eff4ff] transition-all shadow-sm border border-[#dce9ff]"
                  href={`tel:${storeConfig.phone.replace(/[^0-9+]/g, '')}`}
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Call Counter Operator</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div
                className="w-full h-80 lg:h-full min-h-[320px] bg-cover bg-center rounded-2xl shadow-sm relative overflow-hidden border border-[#dce9ff]"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbg9iN26yslOaABXzNxg0xG0E7iKBHZdC_ko_0lzSZA1Qn26jwQqSbo1jb-MPkbttY3ThD3uPmfGwe04acyFJ-P5Z7A4aHvQfW3enpNsu8Lfmu7p7hFfezU_YvNucZuT63IAcK4K2Wxz9_qgc-BPtvEjMq9cgDCOp6Ym2Vea5icYWBNloR6uAhCFf0cFZWsD4A-uZXakTZ5ZHNH6g18O-3nDtwTNBUjLo5hn_i1cp9E4DEryRcAEbX')",
                }}
              >
                <div className="absolute inset-0 bg-[#131b2e]/20 pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-md flex items-center gap-3 border border-[#dce9ff]">
                  <span className="material-symbols-outlined text-[#fea619] text-[24px]">
                    storefront
                  </span>
                  <div className="flex flex-col">
                    <span className="font-['Space_Grotesk'] text-xs text-[#0b1c30] font-bold">
                      {storeConfig.storeName}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#45464d]">
                      Nana Chiloda, Ahmedabad Desk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Print CTA Banner */}
      <section className="w-full py-10 bg-[#131b2e] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#fea619] text-[#684000] font-['Space_Grotesk'] text-[11px] px-3 py-1 rounded-full uppercase font-bold w-fit mx-auto lg:mx-0">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                <span>Commercial Volume Reprographics</span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                Have a bulk printing job?
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#dce9ff] max-w-xl">
                Visit Shop 10, Siddhivinayak Height, Nana Chiloda, Ahmedabad (Closes at {storeConfig.closeTime}) or call for immediate availability and custom per-ream or per-book institutional pricing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => openInquiryModal('Commercial Bulk Printing Job')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#fea619] text-[#684000] font-['Space_Grotesk'] text-xs font-bold px-6 py-3.5 rounded-xl hover:bg-white transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Contact Shop for Enquiry</span>
              </button>
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#0b1c30] font-['Space_Grotesk'] text-xs font-bold px-6 py-3.5 rounded-xl hover:bg-[#dce9ff] transition-all shadow-md"
                href={`https://maps.google.com/?q=${storeConfig.googleMapsQuery}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-[18px]">near_me</span>
                <span>Get Store Directions</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
