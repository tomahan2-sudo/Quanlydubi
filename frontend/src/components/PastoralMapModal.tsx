import React, { useState } from 'react';
import { X, MapPin, Church, Users, Compass, ExternalLink } from 'lucide-react';
import { PastoralAssignment } from '../types';

interface PastoralMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastorals: PastoralAssignment[];
}

export const PastoralMapModal: React.FC<PastoralMapModalProps> = ({
  isOpen,
  onClose,
  pastorals,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<PastoralAssignment>(pastorals[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#e0e3e5] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f1f4f6] border-b border-[#e0e3e5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#002045]" />
            <h3 className="font-bold text-[18px] text-[#002045]">
              Bản đồ Phân bổ Thực tập Mục vụ (15 Giáo xứ)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#e0e3e5] text-[#74777f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Parish List */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold text-[#74777f] uppercase tracking-wider">
              Danh sách Điểm Mục vụ
            </h4>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {pastorals.map((p) => {
                const isSelected = selectedLocation?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedLocation(p)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#d6e3ff]/40 border-[#002045] shadow-xs'
                        : 'bg-[#f7fafc] border-[#e0e3e5] hover:border-[#adc7f7]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="font-bold text-[14px] text-[#002045]">
                        {p.locationName}
                      </h5>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#ffddba] text-[#875200]">
                        {p.count} Thầy
                      </span>
                    </div>
                    <p className="text-[12px] text-[#74777f]">{p.pastor}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Map Canvas / Simulated Interactive Map */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#f1f4f6] rounded-2xl h-80 relative overflow-hidden border border-[#e0e3e5] flex items-center justify-center p-6 text-center">
              {/* Simulated Map Visual Grid */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#002045_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Pin markers */}
              {pastorals.map((p, idx) => {
                const positions = [
                  { top: '30%', left: '45%' },
                  { top: '55%', left: '35%' },
                  { top: '40%', left: '70%' },
                  { top: '65%', left: '60%' },
                  { top: '25%', left: '65%' },
                ];
                const pos = positions[idx % positions.length];
                const isSel = selectedLocation?.id === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedLocation(p)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform ${
                      isSel ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                        isSel
                          ? 'bg-[#002045] text-white'
                          : 'bg-[#875200] text-white'
                      }`}
                    >
                      <Church className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-xs whitespace-nowrap ${
                        isSel
                          ? 'bg-[#002045] text-white'
                          : 'bg-white text-[#181c1e] border border-[#e0e3e5]'
                      }`}
                    >
                      {p.locationName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Location Summary Card */}
            {selectedLocation && (
              <div className="p-4 bg-white rounded-2xl border border-[#e0e3e5] shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[16px] font-bold text-[#002045]">
                      {selectedLocation.locationName}
                    </h4>
                    <p className="text-[13px] text-[#74777f] mt-0.5">
                      {selectedLocation.pastor}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#d6e3ff] text-[#002045] text-[12px] font-bold rounded-full">
                    {selectedLocation.category}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#e0e3e5] flex items-center justify-between text-[13px] text-[#43474e]">
                  <span>
                    Chủng sinh phân bổ:{' '}
                    <strong className="text-[#002045]">
                      {selectedLocation.count} thầy
                    </strong>
                  </span>
                  <span>
                    Loại địa bàn:{' '}
                    <strong>
                      {selectedLocation.type === 'church' ? 'Giáo xứ' : 'Trung tâm'}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f7fafc] border-t border-[#e0e3e5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#002045] text-white rounded-xl text-[13px] font-bold hover:bg-[#1a365d]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
