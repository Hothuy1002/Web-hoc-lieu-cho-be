import React, { useState } from 'react';
import { 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Eye, 
  LogOut, 
  ShoppingBag,
  TrendingUp,
  FileMinus,
  Database
} from 'lucide-react';
import { DigitalContent, Product } from '../types';

interface AdminCMSProps {
  digitalContent: DigitalContent[];
  onAddContent: (item: DigitalContent) => void;
  onDeleteContent: (id: string) => void;
  onUpdateContent: (updatedItem: DigitalContent) => void;
  shopProducts: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  playBeep: (freq: number, dur: number) => void;
  showToast: (msg: string, type?: 'success' | 'points' | 'error') => void;
  onNavigateToRepo: () => void;
  supabaseConnected: boolean | null;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  digitalContent,
  onAddContent,
  onDeleteContent,
  onUpdateContent,
  shopProducts,
  onAddProduct,
  onDeleteProduct,
  playBeep,
  showToast,
  onNavigateToRepo,
  supabaseConnected
}) => {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form State for Adding Content
  const [cmsTitle, setCmsTitle] = useState('');
  const [cmsSubject, setCmsSubject] = useState<'toan' | 'tieng_viet' | 'tieng_anh' | 'ky_nang'>('toan');
  const [cmsFormat, setCmsFormat] = useState<'pdf' | 'flashcards' | 'video'>('pdf');
  const [cmsAge, setCmsAge] = useState<'mam_non' | 'lop_1' | 'lop_2' | 'lop_3'>('mam_non');
  const [cmsIsPremium, setCmsIsPremium] = useState(false);
  const [cmsDesc, setCmsDesc] = useState('');

  // Form State for Adding Product
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(150000);
  const [prodOldPrice, setProdOldPrice] = useState(300000);
  const [prodEmoji, setProdEmoji] = useState('🧩');
  const [prodDesc, setProdDesc] = useState('');

  // Editing State for Content
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Supabase SQL Viewer States
  const [showSqlCopied, setShowSqlCopied] = useState(false);
  const [showSqlDetails, setShowSqlDetails] = useState(false);

  const sqlSchemaCode = `-- 1. Bảng hồ sơ học tập của bé
CREATE TABLE IF NOT EXISTS kid_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class_key TEXT NOT NULL,
  class_name TEXT NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL,
  streak INTEGER DEFAULT 1 NOT NULL,
  emoji TEXT NOT NULL,
  avatar_bg TEXT NOT NULL,
  avatar_color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bảng học liệu thông minh
CREATE TABLE IF NOT EXISTS digital_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  format TEXT NOT NULL,
  age TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false NOT NULL,
  downloads INTEGER DEFAULT 0 NOT NULL,
  desc_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bảng sản phẩm giáo cụ cửa hàng
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price BIGINT NOT NULL,
  old_price BIGINT NOT NULL,
  image TEXT NOT NULL,
  rating NUMERIC DEFAULT 5.0 NOT NULL,
  downloads INTEGER DEFAULT 0 NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bảng ghi nhận đơn đặt hàng
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT,
  items JSONB NOT NULL,
  total_price BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tắt chính sách bảo mật RLS để test nhanh, hoặc bật phân quyền tùy ý
ALTER TABLE kid_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE digital_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setShowSqlCopied(true);
    playBeep(650, 150);
    showToast("Đã sao chép mã SQL thiết lập Supabase!", "success");
    setTimeout(() => {
      setShowSqlCopied(false);
    }, 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setLoginError('');
      playBeep(650, 150);
      showToast('Đăng nhập ban quản trị thành công! Chào Admin nhé.', 'success');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác (gợi ý: admin/admin).');
      playBeep(250, 250);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    playBeep(450, 150);
    showToast('Đã đăng xuất tài khoản quản trị viên.', 'success');
  };

  const handleAddContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmsTitle.trim()) {
      showToast('Vui lòng cung cấp tên học liệu', 'error');
      return;
    }

    const newItem: DigitalContent = {
      id: `custom_${Date.now()}`,
      title: cmsTitle,
      subject: cmsSubject,
      format: cmsFormat,
      age: cmsAge,
      isPremium: cmsIsPremium,
      downloads: 0,
      desc: cmsDesc || 'Học liệu bổ ích thiết kế chuẩn rèn luyện trí lực cho con yêu.'
    };

    onAddContent(newItem);
    setCmsTitle('');
    setCmsDesc('');
    playBeep(600, 150);
    showToast(`Đã thêm học liệu mới: "${newItem.title}" thành công!`, 'success');
    
    // Redirect elegantly to repository immediately
    setTimeout(() => {
      onNavigateToRepo();
    }, 1000);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      showToast('Vui lòng cung cấp tên giáo cụ', 'error');
      return;
    }

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: prodName,
      price: Number(prodPrice),
      oldPrice: Number(prodOldPrice),
      image: prodEmoji,
      rating: 5.0,
      downloads: 10,
      desc: prodDesc || 'Món đồ chơi an toàn, phát triển toàn diện tư duy của trẻ em.'
    };

    onAddProduct(newProd);
    setProdName('');
    setProdDesc('');
    setProdEmoji('🧩');
    setProdPrice(150000);
    setProdOldPrice(300000);
    playBeep(600, 150);
    showToast(`Đã nạp giáo cụ đồ chơi "${newProd.name}" lên hệ thống cửa hàng!`, 'success');
  };

  const startEditContent = (item: DigitalContent) => {
    setEditingContentId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.desc);
    playBeep(480, 100);
  };

  const saveEditContent = (id: string) => {
    const originalItem = digitalContent.find(c => c.id === id);
    if (!originalItem) return;

    const updatedItem: DigitalContent = {
      ...originalItem,
      title: editTitle,
      desc: editDesc
    };

    onUpdateContent(updatedItem);
    setEditingContentId(null);
    playBeep(600, 100);
    showToast('Đã lưu chỉnh sửa học liệu thông thái!', 'success');
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-700">
            <Lock size={30} className="text-orange-500 animate-pulse" />
          </div>
          <h3 className="font-brand font-bold text-2xl text-slate-800">Đăng Nhập Quản Trị</h3>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">CỔNG BẢO MẬT CMS TIGER KIDS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tên đăng nhập</label>
            <input 
              type="text" 
              required
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mật khẩu bảo an</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            />
          </div>

          {loginError && (
            <p className="text-xs text-red-500 font-semibold">{loginError}</p>
          )}

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-all focus:outline-none"
          >
            Đăng Nhập Khóa Quản Trị
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 font-semibold">
          Giao diện quản lý nội dung số hóa bản quyền Tiger Kids.
        </p>
      </div>
    );
  }

  // Live Admin view
  return (
    <div className="space-y-8">
      {/* Header bar within Admin view */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-brand font-bold text-lg md:text-xl">Bảng Làm Việc Của Ban Điều Hành</h4>
          <p className="text-xs text-slate-400 font-medium">Cập nhật, hiệu chỉnh kho tài nguyên học liệu & đồ chơi gỗ thông thái cho bé.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 hover:bg-white/10 text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition-all text-orange-400 hover:text-orange-300"
        >
          <LogOut size={14} /> Đăng xuất Admin
        </button>
      </div>

      {/* Grid Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-teal-50 rounded-xl text-teal-600 flex items-center justify-center text-xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase leading-none mb-1">Học Liệu Khả Dụng</p>
            <h5 className="text-xl font-bold text-slate-800 leading-none">{digitalContent.length} bộ giáo trình</h5>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-xl text-amber-600 flex items-center justify-center text-xl">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase leading-none mb-1">Giáo Cụ Cửa Hàng</p>
            <h5 className="text-xl font-bold text-slate-800 leading-none">{shopProducts.length} sản phẩm gỗ/stem</h5>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl text-indigo-600 flex items-center justify-center text-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase leading-none mb-1">Doanh Thu Đăng Ký Gói</p>
            <h5 className="text-xl font-bold text-slate-800 leading-none">16.850.000đ / Tháng</h5>
          </div>
        </div>
      </div>

      {/* SUPABASE CONNECTION STATUS AND INITIALIZATION PANEL */}
      <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${supabaseConnected ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-rose-50 text-rose-600'}`}>
              <Database size={24} />
            </div>
            <div>
              <h4 className="font-brand font-bold text-base text-slate-800 flex items-center gap-2">
                Kết Nối Cơ Sở Dữ Liệu Supabase
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${supabaseConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {supabaseConnected ? 'Đang Hoạt Động' : 'Chạy dự phòng'}
                </span>
              </h4>
              <p className="text-xs text-slate-400 font-medium">
                {supabaseConnected 
                  ? "Đã liên kết toàn bộ website với cơ sở dữ liệu Supabase phục vụ đồng bộ & Deploy." 
                  : "Hệ thống đang chạy chế độ dự phòng bộ nhớ. Hãy chạy đoạn mã SQL dưới đây trong Supabase SQL Editor."}
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                setShowSqlDetails(!showSqlDetails);
                playBeep(450, 100);
              }}
              className="px-4 py-2 hover:bg-slate-50 text-xs font-bold rounded-xl border border-slate-200 transition-all text-slate-600 cursor-pointer"
            >
              {showSqlDetails ? 'Thu gọn SQL Schema' : 'Xem SQL Schema thiết lập'}
            </button>
          </div>
        </div>

        {showSqlDetails && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex justify-between items-center bg-slate-800 text-slate-100 px-3 py-1.5 rounded-t-xl">
              <span className="text-[10px] uppercase font-mono tracking-wider">Mã Thiết Lập Supabase SQL Query</span>
              <button
                onClick={copyToClipboard}
                className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded cursor-pointer"
              >
                {showSqlCopied ? 'Đã sao chép! ✓' : 'Sao chép đoạn mã SQL'}
              </button>
            </div>
            <pre className="p-4 bg-slate-930 text-emerald-400 rounded-b-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-60 select-all no-scrollbar border border-slate-800 bg-slate-900">
              {sqlSchemaCode}
            </pre>
            <p className="text-[10px] text-slate-400 italic">
              Hướng dẫn nhanh: Hãy truy cập trang quản trị dự án Supabase ➔ chọn SQL Editor ➔ tạo Query mới ➔ dán đoạn mã trên vào rồi bấm RUN. Toàn bộ hệ thống sẽ lập tức đồng bộ thời gian thực!
            </p>
          </div>
        )}
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ADD CONTENT FORM */}
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <h4 className="font-brand font-bold text-lg text-slate-800 flex items-center gap-2 border-b pb-2">
            <Plus size={18} className="text-orange-500" /> Thêm Học Liệu Số Mới
          </h4>

          <form onSubmit={handleAddContentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên học liệu</label>
              <input 
                type="text"
                required
                placeholder="Ví dụ: Tập Tô Nét Đứt Động Vật Đáng Yêu"
                value={cmsTitle}
                onChange={(e) => setCmsTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Môn học</label>
                <select 
                  value={cmsSubject}
                  onChange={(e) => setCmsSubject(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="toan">Toán Tư Duy</option>
                  <option value="tieng_viet">Tiếng Việt Tập Đọc</option>
                  <option value="tieng_anh">Tiếng Anh Chuẩn</option>
                  <option value="ky_nang">Kỹ Năng & Tinh Tay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Định dạng</label>
                <select 
                  value={cmsFormat}
                  onChange={(e) => setCmsFormat(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="pdf">Tải file PDF/Tập vẽ</option>
                  <option value="flashcards">Bộ Flashcards lật</option>
                  <option value="video">Phát Video học tập</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Độ tuổi đề xuất</label>
                <select 
                  value={cmsAge}
                  onChange={(e) => setCmsAge(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="mam_non">Mầm Non (5 tuổi)</option>
                  <option value="lop_1">Chặng Lớp 1 (6 tuổi)</option>
                  <option value="lop_2">Chặng Lớp 2 (7 tuổi)</option>
                  <option value="lop_3">Chặng Lớp 3 (8 tuổi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gói bản quyền</label>
                <select 
                  value={cmsIsPremium ? 'true' : 'false'}
                  onChange={(e) => setCmsIsPremium(e.target.value === 'true')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="false">Mọi thành viên (Miễn phí)</option>
                  <option value="true">Chỉ cho VIP Premium</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả sư phạm ngắt câu</label>
              <textarea 
                placeholder="Giúp bé học thạo nét vẽ và nhận diện mặt con vật đáng yêu..."
                value={cmsDesc}
                onChange={(e) => setCmsDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 h-20 outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 focus:outline-none shadow-md"
            >
              <Plus size={14} /> Thêm Học Liệu Cho Bé
            </button>
          </form>
        </div>

        {/* ADD PRODUCT FORM */}
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <h4 className="font-brand font-bold text-lg text-slate-800 flex items-center gap-2 border-b pb-2">
            <Plus size={18} className="text-amber-500" /> Đăng Bán Giáo Cụ / Đồ Chơi
          </h4>

          <form onSubmit={handleAddProductSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên giáo cụ đồ chơi</label>
              <input 
                type="text"
                required
                placeholder="Ví dụ: Đất sét sinh học Montessori 24 màu"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Giá bán lẻ (đ)</label>
                <input 
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Giá cũ gốc (đ)</label>
                <input 
                  type="number"
                  required
                  value={prodOldPrice}
                  onChange={(e) => setProdOldPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Emoji đại diện</label>
                <select 
                  value={prodEmoji}
                  onChange={(e) => setProdEmoji(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="🧩">Ghép hình 🧩</option>
                  <option value="🤖">Robot 🤖</option>
                  <option value="📚">Bộ Sách 📚</option>
                  <option value="🎨">Đất Sét/Cọ 🎨</option>
                  <option value="📝">Bảng Vẽ LCD 📝</option>
                  <option value="👑">Cờ Vua 👑</option>
                  <option value="🔬">Kính Hiển Vi 🔬</option>
                  <option value="🏎️">Xe Mô Hình 🏎️</option>
                  <option value="🧸">Gấu Bông 🧸</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả sản phẩm</label>
              <textarea 
                placeholder="Bộ đồ chơi cao cấp từ gỗ tự nhiên hỗ trợ bé ghép vần học hỏi siêu nhanh..."
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 h-20 outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 focus:outline-none shadow-md"
            >
              <Plus size={14} /> Bay Sản Phẩm Lên Cửa Hàng
            </button>
          </form>
        </div>
      </div>

      {/* DETAILED CONTENT & SYSTEM MANAGEMENT LISTS (Crucial completed dynamic features) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* MANAGE DIGITAL CONTENT LIST */}
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <h4 className="font-brand font-bold text-lg text-slate-800 flex items-center gap-2 border-b pb-2">
            <FileText size={18} className="text-teal-600" /> Quản Lý Danh Sách Học Liệu ({digitalContent.length})
          </h4>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
            {digitalContent.map((item) => {
              const isEditing = editingContentId === item.id;
              
              return (
                <div 
                  key={item.id} 
                  className="p-4 border border-slate-100 bg-slate-50 rounded-2xl flex flex-col justify-between gap-3 hover:border-teal-100 transition-all"
                >
                  {isEditing ? (
                    // Editing Interface inline
                    <div className="space-y-3 w-full">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Tên chỉnh sửa</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Mô tả chỉnh sửa</label>
                        <textarea
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 h-16 outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingContentId(null)}
                          className="px-2.5 py-1 text-[10px] font-bold bg-slate-200 text-slate-600 rounded-md"
                        >
                          Huỷ
                        </button>
                        <button 
                          onClick={() => saveEditContent(item.id)}
                          className="px-2.5 py-1 text-[10px] font-bold bg-green-500 text-white rounded-md flex items-center gap-1"
                        >
                          <Check size={10} /> Lưu lại
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal display state
                    <div className="flex justify-between items-start gap-3 w-full">
                      <div className="space-y-1 flex-grow">
                        <div className="flex gap-2 items-center">
                          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                            {item.format}
                          </span>
                          {item.isPremium && (
                            <span className="text-[9px] font-extrabold text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded-full uppercase">
                              VIP
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-slate-800 line-clamp-1">{item.title}</h5>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          onClick={() => startEditContent(item)}
                          className="p-1 px-2 text-slate-500 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
                          title="Sửa học liệu"
                        >
                          <Edit3 size={11} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Bạn muốn xóa học liệu "${item.title}" khỏi hệ thống?`)) {
                              onDeleteContent(item.id);
                              playBeep(250, 200);
                              showToast('Đã xóa học liệu thành công!', 'success');
                            }
                          }}
                          className="p-1 px-2 text-red-500 bg-white hover:bg-red-50 border border-red-100 rounded-lg transition-all"
                          title="Xóa học liệu"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MANAGE SHOP GIAO CU LIST */}
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <h4 className="font-brand font-bold text-lg text-slate-800 flex items-center gap-2 border-b pb-2">
            <ShoppingBag size={18} className="text-amber-600" /> Quản Lý Sản Phẩm Đồ Chơi Gỗ ({shopProducts.length})
          </h4>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
            {shopProducts.map((p) => {
              return (
                <div 
                  key={p.id} 
                  className="p-4 border border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between gap-3 hover:border-amber-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3.5xl p-2 bg-white rounded-xl shadow-sm border border-slate-100 inline-block shrink-0">{p.image}</span>
                    <div className="space-y-1">
                      <h5 className="font-bold text-sm text-slate-800 line-clamp-1">{p.name}</h5>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-orange-600">{p.price.toLocaleString('vi-VN')}đ</span>
                        <span className="text-[10px] text-slate-400 line-through">{p.oldPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (window.confirm(`Bạn muốn gỡ bán giáo cụ "${p.name}"?`)) {
                        onDeleteProduct(p.id);
                        playBeep(250, 200);
                        showToast('Đã gỡ bán sản phẩm đồ chơi thành công!', 'success');
                      }
                    }}
                    className="p-1 px-2 text-red-500 bg-white hover:bg-red-50 border border-red-100 rounded-lg transition-all"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
