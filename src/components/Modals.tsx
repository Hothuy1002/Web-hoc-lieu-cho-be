import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShoppingBag, 
  Trash2, 
  Sparkles, 
  Gift, 
  Star, 
  Plus, 
  Minus,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Product, CartItem, DigitalContent } from '../types';

// ================== 1. WORKSHEET / PDF PREVIEW MODAL ==================
interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContentId: string | null;
  digitalContent: DigitalContent[];
  playBeep: (freq: number, dur: number) => void;
  showToast: (msg: string) => void;
}

export const WorksheetModal: React.FC<WorksheetModalProps> = ({
  isOpen,
  onClose,
  selectedContentId,
  digitalContent,
  playBeep,
  showToast
}) => {
  if (!isOpen) return null;

  const item = digitalContent.find(c => c.id === selectedContentId) || digitalContent[0];

  const triggerPrint = () => {
    playBeep(600, 150);
    window.print();
  };

  const renderWorksheetBody = () => {
    if (!item) return null;

    if (item.subject === 'toan') {
      if (item.id === 'pdf_math_grade2') {
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h5 className="text-xl font-brand font-bold text-slate-900 border-b pb-2">CHỦ ĐỀ: BÀI TẬP TOÁN TƯ DUY CỘNG TRỪ CÓ NHỚ (LỚP 2)</h5>
              <p className="text-xs text-slate-500 font-semibold uppercase">Lời khuyên: Bé vẽ sơ đồ tư duy Mindmap và tính nhẩm nhanh các bài tập dưới đây nhé!</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 py-2">
              <div className="border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <span className="font-extrabold text-sm text-indigo-600 mb-2">Thử thách 1: Cộng có nhớ</span>
                <div className="space-y-2 font-mono text-base text-slate-800">
                  <p>25 + 16 = [ &nbsp; &nbsp; ]</p>
                  <p>38 + 27 = [ &nbsp; &nbsp; ]</p>
                  <p>49 + 13 = [ &nbsp; &nbsp; ]</p>
                </div>
              </div>
              <div className="border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <span className="font-extrabold text-sm text-orange-600 mb-2">Thử thách 2: Trừ có nhớ</span>
                <div className="space-y-2 font-mono text-base text-slate-800">
                  <p>52 - 18 = [ &nbsp; &nbsp; ]</p>
                  <p>64 - 27 = [ &nbsp; &nbsp; ]</p>
                  <p>81 - 39 = [ &nbsp; &nbsp; ]</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
              <span className="text-xs font-bold text-teal-600">Sơ đồ Mindmap toán học:</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Bé hãy vẽ một vòng tròn trung tâm ghi "SỐ 100", sau đó vẽ các nhánh phụ tỏa ra xung quanh tạo thành các tổng bằng 100 nhé!
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h5 className="text-xl font-brand font-bold text-slate-900 border-b pb-2">CHỦ ĐỀ: BÉ TẬP ĐẾM & LÀM TOÁN TƯ DUY</h5>
            <p className="text-xs text-slate-500 font-semibold uppercase">Lời khuyên: Phụ huynh đồng hành và chấm sao cho bé khi bé hoàn chỉnh nhé!</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 py-2">
            <div className="border-2 border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-4xl">🍎 🍎 🍎</span>
              <div className="w-10 h-10 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center font-bold text-slate-300">...</div>
            </div>
            <div className="border-2 border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-4xl">🦖 🦖 🦖 🦖</span>
              <div className="w-10 h-10 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center font-bold text-slate-300">...</div>
            </div>
            <div className="border-2 border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-4xl">⭐ ⭐</span>
              <div className="w-10 h-10 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center font-bold text-slate-300">...</div>
            </div>
            <div className="border-2 border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-4xl">🦁 🦁 🦁 🦁 🦁</span>
              <div className="w-10 h-10 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center font-bold text-slate-300">...</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200 text-center">
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              * Thử thách tô màu: Sau khi điền thạo số chấm đếm, bé hãy sắm cọ tô các chú sư tử, rèm kiki theo ý thích!
            </p>
          </div>
        </div>
      );
    }

    if (item.subject === 'tieng_viet') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h5 className="text-xl font-brand font-bold text-slate-900 border-b pb-2">CHỦ ĐỀ: LUYỆN ĐI NÉT & TẬP ĐỌC TIẾNG VIỆT</h5>
            <p className="text-xs text-slate-500 font-semibold uppercase">Lời khuyên: Rèn tư thế ngồi thẳng lưng và phát âm tròn vành rõ chữ cái.</p>
          </div>

          <div className="space-y-4 py-2 font-mono">
            <div className="flex items-center gap-6 border-b border-dashed pb-2">
              <span className="text-3xl font-extrabold text-slate-900 w-10">A</span>
              <span className="text-2xl text-slate-300 tracking-wider font-light">a - a - a - a - a - a - a - a</span>
            </div>
            <div className="flex items-center gap-6 border-b border-dashed pb-2">
              <span className="text-3xl font-extrabold text-slate-900 w-10">B</span>
              <span className="text-2xl text-slate-300 tracking-wider font-light">b - b - b - b - b - b - b - b</span>
            </div>
            <div className="flex items-center gap-6 border-b border-dashed pb-2">
              <span className="text-3xl font-extrabold text-slate-900 w-10">C</span>
              <span className="text-2xl text-slate-300 tracking-wider font-light">c - c - c - c - c - c - c - c</span>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-400 font-semibold bg-indigo-50 text-indigo-700 py-1.5 rounded-lg">
            * Tư vấn: Đọc to các truyện cổ tích sẽ giúp bé rèn luyện trí nhớ ngôn từ cực tốt.
          </p>
        </div>
      );
    }

    if (item.subject === 'tieng_anh') {
      if (item.id === 'pdf_english_grammar') {
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h5 className="text-xl font-brand font-bold text-slate-900 border-b pb-2">CHỦ ĐỀ: ENGLISH VOCABULARY - SCHOOL (LỚP 3)</h5>
              <p className="text-xs text-slate-500 font-semibold uppercase">Hãy tập viết và hoàn thành các ô chữ tiếng Anh chủ đề trường học.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 bg-slate-50/50">
                <span className="text-5xl block">✏️</span>
                <p className="font-extrabold text-lg text-slate-800 leading-none">Pencil</p>
                <p className="text-xs text-slate-400 font-bold">Bút chì</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 bg-slate-50/50">
                <span className="text-5xl block">📖</span>
                <p className="font-extrabold text-lg text-slate-800 leading-none">Book</p>
                <p className="text-xs text-slate-400 font-bold">Quyển sách</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 bg-slate-50/50">
                <span className="text-5xl block">🏫</span>
                <p className="font-extrabold text-lg text-slate-800 leading-none">School</p>
                <p className="text-xs text-slate-400 font-bold">Trường học</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 bg-slate-50/50">
                <span className="text-5xl block">🧑‍🏫</span>
                <p className="font-extrabold text-lg text-slate-800 leading-none">Teacher</p>
                <p className="text-xs text-slate-400 font-bold">Giáo viên</p>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h5 className="text-xl font-brand font-bold text-slate-900 border-b pb-2">CHỦ ĐỀ: GẮP GƯƠNG TRANH FLASHCARD TIẾNG ANH</h5>
            <p className="text-xs text-slate-500 font-semibold uppercase">Hãy cắt theo các đường nét đứt để xếp thành bộ thẻ bỏ túi hữu dụng.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 bg-slate-50/50">
              <span className="text-5xl block">🍎</span>
              <p className="font-extrabold text-lg text-slate-800 leading-none">Apple</p>
              <p className="text-xs text-slate-400 font-bold">Quả Táo</p>
            </div>

            <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 bg-slate-50/50">
              <span className="text-5xl block">🦁</span>
              <p className="font-extrabold text-lg text-slate-800 leading-none">Lion</p>
              <p className="text-xs text-slate-400 font-bold">Sư Tử</p>
            </div>
          </div>
        </div>
      );
    }

    // Default or 'ky_nang' subject
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h5 className="text-xl font-brand font-bold text-slate-900 border-b pb-2">CHỦ ĐỀ: KỸ NĂNG VẬN ĐỘNG TINH & TẠO HÌNH</h5>
          <p className="text-xs text-slate-500 font-semibold uppercase">Rèn luyện vận động của các ngón tay búp măng để đôi tay bé thật khéo léo.</p>
        </div>

        <div className="border-2 border-dashed border-slate-350 p-6 rounded-2xl text-center space-y-4 bg-slate-50/50">
          <div className="mx-auto w-32 h-32 border-4 border-slate-200 rounded-full flex items-center justify-center text-5xl">
            🎨
          </div>
          <div className="space-y-1">
            <p className="font-extrabold text-lg text-slate-800">Hoạt động: Tô Màu Đen Trắng & Ghép Giấy</p>
            <p className="text-xs text-slate-500">Bé hãy tự tay tô dải màu của cầu vồng và tập gấp máy bay thông minh nhé!</p>
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-500 font-bold">
            <span>✓ Phát triển trí não</span>
            <span>✓ Kích hoạt sáng tạo</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose}></div>
      
      <div className="bg-white rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 container mx-auto animate-in scale-in">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-brand font-bold text-xl text-slate-800">
            Phiếu Học Tập PDF: <span className="text-orange-500">{item?.title}</span>
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all focus:outline-none">
            <X size={16} />
          </button>
        </div>

        {/* Printable Area */}
        <div id="worksheetPrintArea" className="bg-white border-4 border-dashed border-slate-300 p-6 rounded-2xl font-sans text-slate-800 space-y-6">
          <div className="flex justify-between items-start border-b-2 border-slate-200 pb-3">
            <div>
              <h4 className="font-brand font-bold text-xl text-slate-900 leading-none">Tiger Kids - Học Liệu Cho Bé</h4>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">HỌC MÀ CHƠI - CHƠI MÀ HỌC</p>
            </div>
            <div className="text-right text-xs font-semibold text-slate-500 space-y-0.5">
              <p>Họ tên Bé: .......................................</p>
              <p>Ngày học bài: ...............................</p>
            </div>
          </div>

          <div id="worksheetInnerContent">
            {renderWorksheetBody()}
          </div>

          <div className="border-t border-dashed border-slate-200 pt-3 text-center text-[10px] text-slate-400 font-bold">
            Tài liệu chất lượng cao bản quyền độc quyền tại www.hoclieuchobe.vn
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
          >
            Đóng Lại
          </button>
          
          <button 
            onClick={triggerPrint} 
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md"
          >
            <Printer size={14} /> Tải Về & In File PDF Này
          </button>
        </div>
      </div>
    </div>
  );
};


// ================== 2. SHOPPING CART MODAL ==================
interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAddQuantity: (id: string) => void;
  onSubtractQuantity: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onAddQuantity,
  onSubtractQuantity,
  onRemoveItem,
  onCheckout
}) => {
  if (!isOpen) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose}></div>
      
      <div className="bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative z-10 space-y-5 animate-in scale-in">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-brand font-bold text-xl text-slate-800 flex items-center gap-1.5">
            <ShoppingBag className="text-orange-500" size={20} /> Giỏ Hàng Giáo Cụ Cho Bé
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all focus:outline-none">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 max-h-64 overflow-y-auto pr-1 no-scrollbar">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShoppingBag size={40} className="mx-auto text-slate-300 animate-bounce" />
              <p className="font-bold text-sm">Giỏ hàng rỗng! Sắm bộ học cụ thông minh ngay cho con.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-slate-50 pb-3 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl p-1 bg-slate-50 rounded-lg inline-block select-none shrink-0">{item.image}</span>
                  <div className="min-w-0">
                    <h6 className="font-bold text-sm text-slate-800 truncate">{item.name}</h6>
                    <p className="text-xs text-slate-400 font-bold">Đơn giá: {item.price.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    <button 
                      onClick={() => onSubtractQuantity(item.id)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-bold px-2 text-slate-700 select-none">{item.quantity}</span>
                    <button 
                      onClick={() => onAddQuantity(item.id)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Plus size={10} />
                    </button>
                  </div>

                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && <hr className="border-slate-100" />}

        <div className="space-y-2.5">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Tổng số lượng giáo cụ chọn mua:</span>
            <span>{totalQuantity} sản phẩm</span>
          </div>
          <div className="flex justify-between text-base sm:text-lg font-extrabold text-slate-850">
            <span>Tổng số tiền thanh toán ưu đãi:</span>
            <span className="text-orange-600">{totalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button 
            onClick={onClose} 
            className="px-5 py-2 hover:bg-slate-50 border rounded-xl text-xs font-bold transition-all"
          >
            Sắm tiếp đồ
          </button>
          <button 
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition-shadow shadow-md focus:outline-none"
          >
            Xác Nhận Đặt Mua Ngay
          </button>
        </div>
      </div>
    </div>
  );
};


// ================== 3. PROFILE SELECTION / ADD MODAL ==================
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfile: (name: string, classKey: 'mam_non' | 'lop_1' | 'lop_2' | 'lop_3', emoji: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onAddProfile
}) => {
  const [profileName, setProfileName] = useState('');
  const [classKey, setClassKey] = useState<'mam_non' | 'lop_1' | 'lop_2' | 'lop_3'>('mam_non');
  const [emoji, setEmoji] = useState('👧');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    onAddProfile(profileName, classKey, emoji);
    setProfileName('');
    setClassKey('mam_non');
    setEmoji('👧');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose}></div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-8 shadow-2xl relative z-10 space-y-5 animate-in scale-in">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-brand font-bold text-xl text-slate-800">Thêm Hồ Sơ Khóa Học Bé Mới</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all focus:outline-none">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Biệt danh bé yêu</label>
            <input 
              required
              type="text" 
              placeholder="Bé Na, Bin, Kiki, Sâu..."
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-green-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Khối lớp / Độ tuổi</label>
            <select 
              value={classKey}
              onChange={(e) => setClassKey(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none"
            >
              <option value="mam_non">Mầm Non (3-5 tuổi)</option>
              <option value="lop_1">Tiểu Học Lớp 1 (6-7 tuổi)</option>
              <option value="lop_2">Tiểu Học Lớp 2 (7-8 tuổi)</option>
              <option value="lop_3">Tiểu Học Lớp 3 (8-9 tuổi)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Emoji biểu trưng mầm non</label>
            <select 
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none"
            >
              <option value="👧">👧 Cô bé thông minh</option>
              <option value="👦">👦 Cậu bé hiếu động</option>
              <option value="🦖">🦖 Chú khủng long tò mò</option>
              <option value="🦄">🦄 Kỳ lân nhiệm màu</option>
              <option value="🦁">🦁 Chú sư tử dũng cảm</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
          >
            Hủy Bỏ
          </button>
          <button 
            type="submit"
            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs transition-all shadow-md focus:outline-none"
          >
            Tạo Hồ Sơ Bé Ngay
          </button>
        </div>
      </form>
    </div>
  );
};


// ================== 4. PRODUCT DETAIL POPUP MODAL ==================
interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  shopProducts: Product[];
  onAddToCart: (id: string) => void;
  playBeep: (freq: number, dur: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  productId,
  shopProducts,
  onAddToCart,
  playBeep
}) => {
  if (!isOpen) return null;

  const product = shopProducts.find(p => p.id === productId);
  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product.id);
    onClose();
  };

  const handleBuyNow = () => {
    onAddToCart(product.id);
    onClose();
    playBeep(600, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose}></div>
      
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative z-10 overflow-hidden border border-amber-100 container mx-auto animate-in scale-in">
        <div className="flex justify-between items-start border-b pb-3.5">
          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase flex items-center gap-1.5 leading-none">
            <Gift size={12} className="text-orange-500" /> Giáo cụ nổi bật trong ngày
          </span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all focus:outline-none">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Visual Frame */}
          <div className="bg-gradient-to-tr from-amber-50 to-orange-50 rounded-2xl p-6 flex items-center justify-center text-8xl shadow-inner h-64 md:h-auto select-none border border-amber-100/50">
            <span className="animate-bounce-soft">{product.image}</span>
          </div>

          {/* specifications side */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-brand font-bold text-xl text-slate-800 leading-snug">{product.name}</h4>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'} />
                  ))}
                </div>
                <span>|</span>
                <span className="text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Lượt sắm: {product.downloads.toLocaleString('vi-VN')} mua
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed min-h-[4rem]">
                {product.desc}
              </p>
            </div>

            <div className="space-y-3 bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-extrabold text-orange-600 leading-none">{product.price.toLocaleString('vi-VN')}đ</span>
                <span className="text-xs text-slate-400 line-through leading-none">{product.oldPrice.toLocaleString('vi-VN')}đ</span>
                <span className="text-[9px] font-extrabold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full uppercase leading-none">
                  GIẢM 50%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleAdd}
                  className="py-2.5 px-3 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm focus:outline-none"
                >
                  <ShoppingBag size={12} /> Thêm Giỏ Hàng
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="py-2.5 px-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md focus:outline-none"
                >
                  Mua Ngay Lập Tức
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ================== 5. AUTO PROMOTIONAL POPUP MODAL ==================
interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClickPromo: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  isOpen,
  onClose,
  onClickPromo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose}></div>
      
      <div className="bg-gradient-to-tr from-orange-400 via-amber-400 to-orange-500 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative z-10 border-4 border-white overflow-hidden text-white text-center animate-in scale-in">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all focus:outline-none">
          <X size={16} />
        </button>

        <div className="space-y-6 relative z-10">
          <div className="w-16 h-16 bg-white rounded-full mx-auto p-3 shadow-lg flex items-center justify-center text-5xl animate-bounce-soft leading-none">
            🎁
          </div>
          
          <div className="space-y-2">
            <span className="bg-red-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
              ƯU ĐÃI ĐẶC BIỆT HÔM NAY
            </span>
            <h4 className="font-sans font-bold text-2xl leading-snug tracking-wide text-white drop-shadow-sm">
              ĐẠI TIỆC KHUYẾN MÃI
              <br />
              SIÊU GIẢM GIÁ 50%
            </h4>
            <p className="font-sans text-xs text-orange-50 font-medium leading-relaxed">
              Cơ hội vàng cho bố mẹ sắm sửa học cụ in ấn chuẩn bản quyền thương hiệu, kèm các bộ đồ chơi xếp hình Montessori của Tiger Kids cho con yêu!
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={onClickPromo}
              className="w-full bg-white hover:bg-orange-50 text-orange-600 hover:scale-[1.03] text-sm font-sans font-extrabold py-3 rounded-2xl transition-all shadow-xl tracking-wider focus:outline-none"
            >
              XEM SHOP GIÁO CỤ NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
