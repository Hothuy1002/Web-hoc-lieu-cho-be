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
  AlertCircle,
  CreditCard,
  Truck,
  QrCode,
  Clipboard,
  Check,
  MapPin,
  User,
  Phone,
  FileText
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
  onBuyNow?: (id: string) => void;
  playBeep: (freq: number, dur: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  productId,
  shopProducts,
  onAddToCart,
  onBuyNow,
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
    if (onBuyNow) {
      onBuyNow(product.id);
    } else {
      onAddToCart(product.id);
    }
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


// ================== 6. PRODUCT CHECKOUT & PAYMENT MODAL ==================
interface CheckoutPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onCompletePayment: (info: {
    name: string;
    phone: string;
    address: string;
    notes: string;
    method: 'banking' | 'cod';
    totalPrice: number;
    orderCode: string;
  }) => void;
  playBeep: (freq: number, dur: number) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  isOpen,
  onClose,
  cart,
  onCompletePayment,
  playBeep,
  showToast
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'banking' | 'cod'>('banking');
  const [isCopiedSTK, setIsCopiedSTK] = useState(false);
  const [isCopiedContent, setIsCopiedContent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Keep a stable Order Code
  const [orderCode] = useState(() => {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `TK-${num}`;
  });

  if (!isOpen) return null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCopy = (text: string, type: 'stk' | 'content') => {
    navigator.clipboard.writeText(text);
    playBeep(700, 80);
    if (type === 'stk') {
      setIsCopiedSTK(true);
      showToast("Đã sao chép Số tài khoản!", "success");
      setTimeout(() => setIsCopiedSTK(false), 2000);
    } else {
      setIsCopiedContent(true);
      showToast("Đã sao chép Nội dung chuyển khoản!", "success");
      setTimeout(() => setIsCopiedContent(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      playBeep(350, 150);
      showToast("Mẹ vui lòng điền đủ Họ tên, Số điện thoại và Địa chỉ nhé!", "error");
      return;
    }

    playBeep(650, 250);
    onCompletePayment({
      name: fullName,
      phone: phone,
      address: address,
      notes: notes,
      method: paymentMethod,
      totalPrice,
      orderCode
    });
    setIsSuccess(true);
  };

  const handleModalClose = () => {
    // Reset states
    setFullName('');
    setPhone('');
    setAddress('');
    setNotes('');
    setPaymentMethod('banking');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={handleModalClose}></div>
      
      <div className="bg-white rounded-[2rem] max-w-4xl w-full p-5 sm:p-7 shadow-2xl relative z-10 border border-slate-100 overflow-hidden animate-in scale-in">
        
        {/* Confetti effect background on success */}
        {isSuccess && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-white pointer-events-none z-0">
            <div className="absolute top-10 left-10 text-orange-200 text-3xl animate-bounce">🎈</div>
            <div className="absolute top-20 right-20 text-yellow-200 text-3xl animate-bounce delay-100">🎉</div>
            <div className="absolute bottom-10 left-1/4 text-orange-200 text-4xl animate-bounce delay-300">🧸</div>
            <div className="absolute bottom-20 right-10 text-amber-200 text-3xl animate-bounce delay-200">🚀</div>
          </div>
        )}

        <div className="relative z-10">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div>
                  <h3 className="font-vietnam font-black text-xl text-slate-800 flex items-center gap-2">
                    <CreditCard className="text-orange-500" size={24} />
                    HỌC LIỆU CHO BÉ - THANH TOÁN
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Vui lòng hoàn thành thông tin giao hàng & chọn phương thức để kích hoạt hộp giáo cụ</p>
                </div>
                <button 
                  onClick={handleModalClose} 
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all focus:outline-none shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Multi-step progress tracker */}
              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                <div className="bg-orange-50 text-orange-600 rounded-xl p-2 border border-orange-100 text-[10px] font-black uppercase tracking-wider">
                  🛒 1. Giỏ hàng
                </div>
                <div className="bg-orange-500 text-white rounded-xl p-2 shadow-sm text-[10px] font-black uppercase tracking-wider animate-pulse">
                  💳 2. Thanh toán
                </div>
                <div className="bg-slate-50 text-slate-400 rounded-xl p-2 border border-slate-100 text-[10px] font-extrabold uppercase tracking-wider">
                  🎉 3. Hoàn tất
                </div>
              </div>

              {/* Form Layout */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left side: Information form */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl space-y-3.5">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Truck size={14} className="text-orange-500" />
                      Thông tin người nhận học liệu
                    </h4>

                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-500 flex items-center gap-1">
                        Họ và tên Phụ huynh <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                          <User size={14} />
                        </span>
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nhập tên của bố hoặc mẹ..."
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Phone input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-500 flex items-center gap-1">
                        Số điện thoại liên hệ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                          <Phone size={14} />
                        </span>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Nhập số điện thoại nhận hàng..."
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Address Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-500 flex items-center gap-1">
                        Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                          <MapPin size={14} />
                        </span>
                        <input 
                          type="text" 
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh thành..."
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Notes Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-500 flex items-center gap-1">
                        Ghi chú cho shipper (Không bắt buộc)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                          <FileText size={14} />
                        </span>
                        <input 
                          type="text" 
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Giao giờ hành chính, gọi trước khi giao..."
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Selection */}
                  <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl space-y-3">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <CreditCard size={14} className="text-orange-500" />
                      Chọn phương thức thanh toán
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Banking QR Box */}
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('banking'); playBeep(600, 60); }}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between selection:bg-transparent cursor-pointer ${
                          paymentMethod === 'banking'
                            ? 'bg-orange-50/70 border-orange-400 shadow-3xs ring-1 ring-orange-400'
                            : 'bg-white border-slate-150 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="p-1 px-2.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg uppercase">
                            Chuyển Khoản QR
                          </span>
                          {paymentMethod === 'banking' && (
                            <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                          )}
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-bold text-slate-800">Quét mã VietQR nhanh 24/7</p>
                          <p className="text-[10px] text-slate-400 mt-1">Hệ thống kích hoạt tài liệu tự động ngay sau khi chuyển khoản</p>
                        </div>
                      </button>

                      {/* COD Box */}
                      <button
                        type="button"
                        onClick={() => { setPaymentMethod('cod'); playBeep(520, 60); }}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between selection:bg-transparent cursor-pointer ${
                          paymentMethod === 'cod'
                            ? 'bg-orange-50/70 border-orange-400 shadow-3xs ring-1 ring-orange-400'
                            : 'bg-white border-slate-150 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="p-1 px-2.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase">
                            Tiền mặt COD
                          </span>
                          {paymentMethod === 'cod' && (
                            <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                          )}
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-bold text-slate-800">Nhận hàng trả tiền sau</p>
                          <p className="text-[10px] text-slate-400 mt-1">Bố mẹ kiểm tra hộp giáo cụ xinh xắn rồi mới trả tiền</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side: Summary & QR Display */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Cart Details Box */}
                  <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-3 border-2 border-slate-900 shadow-lg">
                    <h4 className="text-[10px] font-black text-orange-400 tracking-widest uppercase">
                      Đơn hàng của mẹ ({totalQuantity} bộ cụ)
                    </h4>

                    <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar border-b border-white/10 pb-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl bg-white/10 p-0.5 rounded shrink-0 leading-none">{item.image}</span>
                            <span className="font-bold truncate text-slate-200">{item.name}</span>
                          </div>
                          <span className="font-bold shrink-0 text-amber-300">
                            x{item.quantity} - {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                        <span>Phí vận chuyển bưu điện:</span>
                        <span className="line-through">30.000đ</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-orange-400 font-bold">
                        <span>Mã quà tặng miễn phí ship:</span>
                        <span>Freeship 0đ</span>
                      </div>
                      <div className="flex justify-between text-base font-black border-t border-dashed border-white/20 pt-2 text-white">
                        <span>Mẹ cần thanh toán:</span>
                        <span className="text-orange-400">
                          {totalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code payment display for Banking Transfer */}
                  {paymentMethod === 'banking' ? (
                    <div className="border border-orange-100 rounded-2xl p-4 bg-orange-50/40 text-center space-y-3.5">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-black text-indigo-700">
                        <QrCode size={14} /> QUÉT SMART VIETQR ĐỂ LẤY PHÁT ÂM TIẾNG ANH
                      </div>
                      
                      {/* Beautiful simulated VietQR Code box */}
                      <div className="bg-white rounded-xl p-3 border border-orange-100/50 relative max-w-[170px] mx-auto shadow-sm select-none">
                        <svg className="w-full h-auto aspect-square text-indigo-900" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Outer QR alignment blocks */}
                          <path d="M5 5h20v20H5V5zm2 2v16h16V7H7zM5 75h20v20H5V75zm2 2v16h16V77H7zM75 5h20v20H75V5zm2 2v16h16V7H77z" fill="currentColor" />
                          <path d="M9 9h12v12H9V9zm0 70h12v12H9V79zm70-70h12v12H79V9z" fill="currentColor" />
                          {/* Dot Matrix simulation */}
                          <path d="M35 10h5v5h-5v-5zm10 0h5v5h-5v-5zm15 0h5v5h-5v-5zm15 15h5v5h-5v-5zm-35 5h5v5h-5v-5zm10 0h5v5h-5v-5zm10 0h5v5h-5v-5zm15 0h5v5h-5v-5zm-50 10h5v5h-5v-5zm10 0h5v5h-5v-5zm30 0h5v5h-5v-5zm30 0h5v5h-5v-5zm-65 10h5v5h-5v-5zm15 0h5v5h-5v-5zm15 0h5v5h-5v-5zm15 0h5v5h-5v-5zm15 0h5v5h-5v-5zm-35 15h5v5h-5v-5zm10 0h5v5h-5v-5zm20 0h5v5h-5v-5zm-55 10h5v5h-5v-5zm15 0h5v5h-5v-5zm15 0h5v5h-5v-5zm15 0h5v5h-5v-5zm25 0h5v5h-5v-5zm-60 10h5v5h-5v-5zm10 0h5v5h-5v-5zm10 0h5v5h-5v-5zm15 0h5v5h-5v-5zm15 0h5v5h-5v-5z" fill="currentColor" />
                          {/* Brand logo mask in center */}
                          <circle cx="50" cy="50" r="14" fill="white" className="stroke-orange-500 stroke-2" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold select-none text-orange-500 animate-pulse">🐯</span>
                      </div>

                      {/* Banking textual detail copy guides */}
                      <div className="text-left text-[11px] space-y-1.5 text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center gap-1 pb-1 border-b">
                          <span>Ngân hàng:</span>
                          <strong className="text-slate-800">MB BANK (Ngân hàng Quân Đội)</strong>
                        </div>
                        <div className="flex justify-between items-center gap-1">
                          <span>Số tài khoản:</span>
                          <div className="flex items-center gap-1 text-slate-800">
                            <strong>2026 8888 9999</strong>
                            <button 
                              type="button" 
                              onClick={() => handleCopy("202688889999", "stk")}
                              className="text-orange-500 hover:text-orange-600 font-extrabold cursor-pointer p-0.5 hover:bg-orange-50 rounded"
                            >
                              {isCopiedSTK ? <Check size={11} className="text-emerald-500" /> : <Clipboard size={11} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center gap-1">
                          <span>Chủ tài khoản:</span>
                          <strong className="text-slate-800 uppercase text-right">CONG TY CP TIGER KIDS</strong>
                        </div>
                        <div className="flex justify-between items-center gap-1">
                          <span>Nội dung CK:</span>
                          <div className="flex items-center gap-1 text-slate-800">
                            <strong className="text-orange-600">{orderCode} {phone || "SDT"}</strong>
                            <button 
                              type="button" 
                              onClick={() => handleCopy(`${orderCode} ${phone || 'SDT'}`, "content")}
                              className="text-orange-500 hover:text-orange-600 font-extrabold cursor-pointer p-0.5 hover:bg-orange-50 rounded"
                            >
                              {isCopiedContent ? <Check size={11} className="text-emerald-500" /> : <Clipboard size={11} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-teal-100 rounded-2xl p-4 bg-teal-50/40 text-center space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -mr-10 -mt-10"></div>
                      <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto text-xl font-bold select-none">
                        🚚
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-teal-800 uppercase tracking-wide">Nhận hàng thanh toán (COD)</h5>
                        <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm mx-auto px-1">
                          Mẹ sẽ trả <span className="font-extrabold text-orange-600">{totalPrice.toLocaleString('vi-VN')}đ</span> cho nhân viên bưu tá giao hàng khi nhận được giáo cụ đóng hộp chắc chắn từ bưu điện Việt Nam.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submission triggers */}
                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      type="button"
                      onClick={handleModalClose}
                      className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 border rounded-xl transition-all cursor-pointer text-center"
                    >
                      Quay lại giỏ hàng
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-xl text-xs transition-transform transform active:scale-98 shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      ✓ Xác nhận đặt học cụ
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            /* Success confirmation step screen */
            <div className="text-center py-6 sm:py-10 space-y-7 max-w-md mx-auto">
              {/* Tiger/Success mascot celebration visual container */}
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-100 via-amber-100 to-orange-200 border-4 border-white shadow-md flex items-center justify-center text-5xl leading-none select-none animate-bounce-soft">
                  🎁
                </div>
                <span className="absolute -bottom-1 -right-1 text-3xl">🐯</span>
              </div>

              <div className="space-y-3">
                <div className="bg-emerald-500/10 text-emerald-700 p-1 px-3.5 rounded-full inline-block text-[10px] font-black uppercase tracking-widest border border-emerald-150">
                  ĐẶT HÀNG THÀNH CÔNG 🎉
                </div>
                
                <h4 className="font-vietnam font-black text-2xl text-slate-800 leading-tight">
                  Cảm ơn bố mẹ cực kỳ nhiều!
                </h4>
                
                <p className="text-slate-500 text-xs leading-relaxed">
                  Hệ thống đã tạo hóa đơn đặt hàng <span className="font-extrabold text-slate-800">{orderCode}</span> dành riêng cho phụ huynh <strong className="text-slate-800">{fullName}</strong>.
                </p>
              </div>

              {/* Receipt details */}
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 text-[11px] space-y-2 text-slate-600">
                <div className="flex justify-between items-center font-bold">
                  <span>Mã số đơn hàng:</span>
                  <span className="text-orange-600 font-extrabold text-xs">{orderCode}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                  <span>Khách hàng nhận:</span>
                  <span className="text-slate-800 font-semibold">{fullName} - {phone}</span>
                </div>
                <div className="flex justify-between items-start gap-1 pb-2 border-b">
                  <span>Địa chỉ giao:</span>
                  <span className="text-slate-800 font-semibold text-right max-w-[200px] truncate-3-lines">{address}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black text-slate-800">
                  <span>Số tiền:</span>
                  <span className="text-orange-500 font-black">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Thanh toán:</span>
                  <span className="p-0.5 px-2 bg-slate-200 rounded text-[9px] font-bold uppercase text-slate-700">
                    {paymentMethod === 'banking' ? 'Chuyển khoản QR' : 'Tiền mặt COD'}
                  </span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 text-left border border-orange-100/50 text-[11px] text-orange-850 space-y-1">
                <div className="font-black flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  💡 Bước tiếp theo dành cho bố mẹ:
                </div>
                <p className="leading-relaxed">
                  {paymentMethod === 'banking' 
                    ? 'Nếu chưa chuyển khoản, vui lòng quét mã ngân hàng hoàn tất. Đội ngũ kỹ thuật Tiger Kids sẽ thông báo và gửi tặng kèm file PDF tải tài liệu thông minh in màu tại nhà ngay qua Zalo.' 
                    : 'Nhân viên shipper bưu tá sẽ mang giáo cụ đến địa chỉ của mẹ trong từ 2 - 3 ngày tới.'}
                </p>
              </div>

              <div>
                <button 
                  onClick={handleModalClose}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-2xl text-xs tracking-wider transition-all cursor-pointer focus:outline-none shadow-md"
                >
                  XONG & TIẾP TỤC KHÁM PHÁ 🐯
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

