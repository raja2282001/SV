import React from 'react';
import { useStore } from '../context/StoreContext';

export const AboutView: React.FC = () => {
  const { storeConfig, setActiveView, openInquiryModal } = useStore();

  return (
    <div className="flex flex-col w-full py-8 bg-[#f8f9ff]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
        {/* Masthead */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-[#dce9ff] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#fea619]"></span>
            <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#855300] font-bold">
              Engineering & Reprographic Hub
            </span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-bold text-[#0b1c30] tracking-tight uppercase leading-tight">
            About S V COPIERS / XEROX Ahmedabad
          </h1>

          <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#45464d] max-w-3xl leading-relaxed">
            Founded to provide high-precision reprographic and commercial stationery support in Nana Chiloda and New Shahibaug, S V Copiers / Xerox operates as an on-demand, in-person production facility. We bridge the gap between quick neighbourhood photocopying and heavy industrial blueprint plotting.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#eff4ff]">
            <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff]">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-[#0b1c30] block">
                100% Genuine
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                Paper & Stationery Brands
              </span>
            </div>
            <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff]">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-[#0b1c30] block">
                36" CAD Plotting
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                HP DesignJet Precision
              </span>
            </div>
            <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff]">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-[#0b1c30] block">
                University Format
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                Golden Foil Thesis Binding
              </span>
            </div>
            <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff]">
              <span className="font-['Space_Grotesk'] text-xl font-bold text-[#0b1c30] block">
                GST Compliant
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d]">
                Official Invoicing Provided
              </span>
            </div>
          </div>
        </div>

        {/* Studio Equipment & Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dce9ff] flex flex-col gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[24px]">architecture</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30]">
              Large Format Plotter Infrastructure
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
              Equipped with our active HP DesignJet wide-format engineering plotter running 80 GSM bond rolls up to 36 inches wide. We output CAD architectural blueprints, municipal drawings, structural layouts, and HVAC schematics with razor-sharp vector line accuracy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#dce9ff] flex flex-col gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#0b1c30]">
              Academic Thesis & Dissertation Bindery
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#45464d] leading-relaxed">
              Specially formatted for Gujarat Technological University (GTU), Gujarat University, Nirma University, and PDPU submissions. We provide gold-embossed rexine hardbound covers with university emblems, colored section dividers, and archival book ribbons.
            </p>
          </div>
        </div>

        {/* Operating Principles / Why No Online Payments */}
        <div className="bg-[#131b2e] text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="bg-[#fea619] text-[#684000] font-['Space_Grotesk'] text-[10px] font-bold px-3 py-1 rounded-full uppercase w-fit">
              Customer First Guarantee
            </span>
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold uppercase">
              Zero Prepayment • In-Store Pre-Flight Approval
            </h3>
            <p className="font-['Plus_Jakarta_Sans'] text-xs sm:text-sm text-[#dce9ff] leading-relaxed">
              We do not accept blind online payments because print files often suffer from margin clipping, font substitution, and color calibration differences. Our operators preview your documents on counter screens and print test leaves before running full volume batches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => openInquiryModal('Store Tour & Equipment Inquiries')}
              className="px-5 py-3 bg-[#fea619] text-[#684000] font-['Space_Grotesk'] text-xs font-bold rounded-lg hover:bg-white transition-all cursor-pointer"
            >
              Inquire with Desk
            </button>
            <button
              onClick={() => setActiveView('printing-and-services')}
              className="px-5 py-3 bg-white text-[#0b1c30] font-['Space_Grotesk'] text-xs font-bold rounded-lg hover:bg-[#dce9ff] transition-all cursor-pointer"
            >
              View Service Tariffs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
