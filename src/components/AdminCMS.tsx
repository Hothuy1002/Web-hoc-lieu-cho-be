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
import { DigitalContent, Product, Milestone } from '../types';

interface AdminCMSProps {
  digitalContent: DigitalContent[];
  onAddContent: (item: DigitalContent) => void;
  onDeleteContent: (id: string) => void;
  onUpdateContent: (updatedItem: DigitalContent) => void;
  shopProducts: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  playBeep: (freq: number, dur: number) => void;
  showToast: (msg: string, type?: 'success' | 'points' | 'error') => void;
  onNavigateToRepo: () => void;
  supabaseConnected: boolean | null;
  milestones: Milestone[];
  onAddMilestone: (item: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
  onUpdateMilestone: (updated: Milestone) => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  digitalContent,
  onAddContent,
  onDeleteContent,
  onUpdateContent,
  shopProducts,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  playBeep,
  showToast,
  onNavigateToRepo,
  supabaseConnected,
  milestones,
  onAddMilestone,
  onDeleteMilestone,
  onUpdateMilestone
}) => {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registered credentials (stored in localStorage)
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('admin_username') || 'admin');
  const [adminPass, setAdminPass] = useState(() => localStorage.getItem('admin_password') || 'admin');

  // Change credentials form state
  const [updateUserForm, setUpdateUserForm] = useState(() => localStorage.getItem('admin_username') || 'admin');
  const [updatePassForm, setUpdatePassForm] = useState(() => localStorage.getItem('admin_password') || 'admin');

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

  // Editing State for Product
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProdNameReg, setEditProdNameReg] = useState('');
  const [editProdPriceReg, setEditProdPriceReg] = useState(0);
  const [editProdOldPriceReg, setEditProdOldPriceReg] = useState(0);
  const [editProdEmojiReg, setEditProdEmojiReg] = useState('');
  const [editProdDescReg, setEditProdDescReg] = useState('');

  // Form State for Adding Milestone
  const [mileTitle, setMileTitle] = useState('');
  const [mileDetail, setMileDetail] = useState('');
  const [mileLevel, setMileLevel] = useState<'mam_non' | 'lop_1' | 'lop_2' | 'lop_3'>('mam_non');
  const [mileSubject, setMileSubject] = useState<'toan' | 'tieng_viet' | 'tieng_anh' | 'ky_nang'>('tieng_anh');

  // Editing State for Milestone
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editMileTitle, setEditMileTitle] = useState('');
  const [editMileDetail, setEditMileDetail] = useState('');

  // Filter States for Admin Milestone Manager
  const [adminMileLevelFilter, setAdminMileLevelFilter] = useState<string>('all');
  const [adminMileSubjectFilter, setAdminMileSubjectFilter] = useState<string>('all');

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
    if (username === adminUser && password === adminPass) {
      setIsLoggedIn(true);
      setLoginError('');
      playBeep(650, 150);
      showToast('Đăng nhập ban quản trị thành công! Chào Admin nhé.', 'success');
    } else {
      const hint = adminUser === 'admin' && adminPass === 'admin' 
        ? '(Tên đăng nhập & mật khẩu mặc định là admin/admin)' 
        : '(Thông tin đăng nhập đã được thay đổi từ mặc định)';
      setLoginError(`Tài khoản hoặc mật khẩu không chính xác. ${hint}`);
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

  const startEditProduct = (item: Product) => {
    setEditingProductId(item.id);
    setEditProdNameReg(item.name);
    setEditProdPriceReg(item.price);
    setEditProdOldPriceReg(item.oldPrice);
    setEditProdEmojiReg(item.image);
    setEditProdDescReg(item.desc || '');
    playBeep(480, 100);
  };

  const saveEditProduct = (id: string) => {
    const originalItem = shopProducts.find(p => p.id === id);
    if (!originalItem) return;

    const updatedItem: Product = {
      ...originalItem,
      name: editProdNameReg,
      price: editProdPriceReg,
      oldPrice: editProdOldPriceReg,
      image: editProdEmojiReg,
      desc: editProdDescReg
    };

    onUpdateProduct(updatedItem);
    setEditingProductId(null);
    playBeep(600, 100);
    showToast('Đã lưu chỉnh sửa giáo cụ đồ chơi!', 'success');
  };

  const handleUpdateCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateUserForm.trim()) {
      showToast('Tên đăng nhập không được để trống!', 'error');
      return;
    }
    if (!updatePassForm.trim()) {
      showToast('Mật khẩu không được để trống!', 'error');
      return;
    }
    localStorage.setItem('admin_username', updateUserForm.trim());
    localStorage.setItem('admin_password', updatePassForm.trim());
    setAdminUser(updateUserForm.trim());
    setAdminPass(updatePassForm.trim());
    playBeep(650, 150);
    showToast('Đã thay đổi thông tin đăng nhập Admin thành công!', 'success');
  };

  const handleResetCredentials = () => {
    localStorage.setItem('admin_username', 'admin');
    localStorage.setItem('admin_password', 'admin');
    setAdminUser('admin');
    setAdminPass('admin');
    setUpdateUserForm('admin');
    setUpdatePassForm('admin');
    playBeep(450, 150);
    showToast('Đã khôi phục thông tin đăng nhập về mặc định!', 'success');
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mileTitle.trim() || !mileDetail.trim()) {
      showToast('Vui lòng điền đầy đủ tiêu đề và chi tiết chặng lộ trình.', 'error');
      return;
    }

    const newMilestone: Milestone = {
      id: `mile_${Date.now()}`,
      level: mileLevel,
      subject: mileSubject,
      milestone: mileTitle,
      detail: mileDetail
    };

    onAddMilestone(newMilestone);
    setMileTitle('');
    setMileDetail('');
    playBeep(600, 150);
    showToast(`Đã thêm chặng học "${newMilestone.milestone}" vào Lộ trình thành công!`, 'success');
  };

  const startEditMilestone = (m: Milestone) => {
    setEditingMilestoneId(m.id);
    setEditMileTitle(m.milestone);
    setEditMileDetail(m.detail);
    playBeep(480, 100);
  };

  const saveEditMilestone = (id: string) => {
    const original = milestones.find(m => m.id === id);
    if (!original) return;

    const updated: Milestone = {
      ...original,
      milestone: editMileTitle,
      detail: editMileDetail
    };

    onUpdateMilestone(updated);
    setEditingMilestoneId(null);
    playBeep(600, 100);
    showToast('Đã lưu chỉnh sửa chặng lộ trình học!', 'success');
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

      {/* Admin credentials change tool */}
      <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
        <h4 className="font-brand font-bold text-base text-slate-800 flex items-center gap-2 border-b pb-3">
          <span className="text-xl">🛡️</span> Quản Lý Bảo Mật & Thay Đổi Thông Tin Đăng Nhập CMS
        </h4>
        
        <form onSubmit={handleUpdateCredentialsSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
              Tên đăng nhập mới
            </label>
            <input 
              type="text"
              required
              placeholder="Nhập tên đăng nhập mới"
              value={updateUserForm}
              onChange={(e) => setUpdateUserForm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
              Mật khẩu quản trị mới
            </label>
            <input 
              type="text"
              required
              placeholder="Nhập mật khẩu mới"
              value={updatePassForm}
              onChange={(e) => setUpdatePassForm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none"
            />
          </div>

          <div className="md:col-span-4 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all focus:outline-none cursor-pointer h-[38px] flex items-center justify-center gap-1"
            >
              Cập nhật tài khoản
            </button>
            <button
              type="button"
              onClick={handleResetCredentials}
              className="px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-2 rounded-xl text-xs transition-all focus:outline-none cursor-pointer h-[38px] flex items-center justify-center"
              title="Khôi phục đăng nhập mặc định (admin/admin)"
            >
              Reset
            </button>
          </div>
        </form>
        <p className="text-[10px] text-slate-400 font-medium">
          * Đổi thông tin đăng nhập và mật khẩu bạn muốn sử dụng cho những lần đăng nhập sau. Thông tin này sẽ được lưu trữ cục bộ trong trình duyệt thiết bị của bạn.
        </p>
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

      {/* SECTION: QUẢN LÝ LỘ TRÌNH HỌC CHO BÉ */}
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h3 className="font-brand font-bold text-xl text-slate-800 flex items-center gap-2">
              <span className="text-2xl">🌱</span> Quản Lý Lộ Trình Học & Chặng Học Tập
            </h3>
            <p className="text-xs text-slate-400 font-medium">Xây dựng, hiệu chỉnh các bài học Tiếng Anh & các môn khoa học phụ trợ tương ứng từng cấp học của bé.</p>
          </div>
          <span className="bg-sky-50 text-sky-700 px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
            {milestones.length} Chặng Học Hiện Có
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT FORM: THÊM CHẶNG MỚI */}
          <div className="lg:col-span-5 space-y-4 border-r border-slate-100 pr-0 lg:pr-8">
            <h4 className="font-brand font-bold text-sm text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Plus size={14} className="text-emerald-500" /> Thêm Chặng Học Tập Mới
            </h4>

            <form onSubmit={handleAddMilestoneSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cấp học đề xuất</label>
                <select 
                  value={mileLevel}
                  onChange={(e) => setMileLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="mam_non">Mầm Non (3-5 tuổi)</option>
                  <option value="lop_1">Chặng Lớp 1 (6-7 tuổi)</option>
                  <option value="lop_2">Chặng Lớp 2 (7-8 tuổi)</option>
                  <option value="lop_3">Chặng Lớp 3 (8-9 tuổi)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Môn học bộ môn</label>
                <select 
                  value={mileSubject}
                  onChange={(e) => setMileSubject(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="tieng_anh">🇬🇧 Tiếng Anh chuẩn Cambridge</option>
                  <option value="toan">➕ Toán duy tư logic</option>
                  <option value="tieng_viet">📖 Tiếng Việt tập đọc trơn</option>
                  <option value="ky_nang">🎨 Kỹ năng vận động tinh</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tên chặng / Bài học</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: English Basic Colors (Mầm Non)"
                  value={mileTitle}
                  onChange={(e) => setMileTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Chi tiết rèn luyện sư phạm</label>
                <textarea 
                  required
                  placeholder="Miêu tả chi tiết kỹ năng đạt được: Bé phát âm chuẩn, trò chơi nhận biết..."
                  value={mileDetail}
                  onChange={(e) => setMileDetail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 h-24 outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 focus:outline-none shadow-md cursor-pointer"
              >
                <Plus size={12} /> Cập Nhật Trực Tiếp Vào Lộ Trình
              </button>
            </form>
          </div>

          {/* CỘT LIST: DANH SÁCH & BỘ LỌC ĐỂ EDIT/DELETE */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h4 className="font-brand font-bold text-sm text-slate-700 uppercase tracking-wide">
                Danh sách bài học lộ trình ({milestones.length})
              </h4>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select 
                  value={adminMileLevelFilter}
                  onChange={(e) => setAdminMileLevelFilter(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 focus:outline-none"
                >
                  <option value="all">Tất cả cấp</option>
                  <option value="mam_non">Mầm Non</option>
                  <option value="lop_1">Lớp 1</option>
                  <option value="lop_2">Lớp 2</option>
                  <option value="lop_3">Lớp 3</option>
                </select>

                <select 
                  value={adminMileSubjectFilter}
                  onChange={(e) => setAdminMileSubjectFilter(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 focus:outline-none"
                >
                  <option value="all">Tất cả môn</option>
                  <option value="tieng_anh">Tiếng Anh</option>
                  <option value="toan">Toán</option>
                  <option value="tieng_viet">Tiếng Việt</option>
                  <option value="ky_nang">Kỹ năng</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 no-scrollbar border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
              {(() => {
                const filtered = milestones.filter(m => {
                  const matchLevel = adminMileLevelFilter === 'all' || m.level === adminMileLevelFilter;
                  const matchSub = adminMileSubjectFilter === 'all' || m.subject === adminMileSubjectFilter;
                  return matchLevel && matchSub;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center text-slate-400 text-xs font-bold bg-white rounded-xl border">
                      Không tìm thấy chặng học tập nào khớp với bộ lọc.
                    </div>
                  );
                }

                return filtered.map((m) => {
                  const isEditing = editingMilestoneId === m.id;
                  const tagColors: Record<string, string> = {
                    tieng_anh: 'bg-blue-50 text-blue-600 border border-blue-100',
                    toan: 'bg-orange-50 text-orange-600 border border-orange-100',
                    tieng_viet: 'bg-teal-50 text-teal-600 border border-teal-100',
                    ky_nang: 'bg-purple-50 text-purple-600 border border-purple-100'
                  };
                  const labels: Record<string, string> = {
                    tieng_anh: 'Tiếng Anh',
                    toan: 'Toán',
                    tieng_viet: 'Tiếng Việt',
                    ky_nang: 'Kỹ năng'
                  };
                  const classLabels: Record<string, string> = {
                    mam_non: 'Mầm Non',
                    lop_1: 'Lớp 1',
                    lop_2: 'Lớp 2',
                    lop_3: 'Lớp 3'
                  };

                  return (
                    <div 
                      key={m.id} 
                      className="p-3 bg-white border border-slate-150 rounded-xl hover:border-slate-350 transition-all space-y-2 shadow-3xs"
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 capitalize">Chỉnh sửa tên chặng</label>
                            <input 
                              type="text"
                              value={editMileTitle}
                              onChange={(e) => setEditMileTitle(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 capitalize">Chỉnh sửa chi tiết sư phạm</label>
                            <textarea 
                              value={editMileDetail}
                              onChange={(e) => setEditMileDetail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 h-16 outline-none resize-none"
                            />
                          </div>
                          <div className="flex justify-end gap-1.5 pt-1">
                            <button 
                              onClick={() => setEditingMilestoneId(null)}
                              className="px-2 py-0.5 text-[9px] font-bold bg-slate-200 text-slate-600 rounded cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button 
                              onClick={() => saveEditMilestone(m.id)}
                              className="px-2 py-0.5 text-[9px] font-bold bg-green-500 text-white rounded flex items-center gap-1 cursor-pointer"
                            >
                              <Check size={8} /> Lưu lại
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${tagColors[m.subject] || 'bg-slate-100 text-slate-600'}`}>
                                {labels[m.subject] || 'Chung'}
                              </span>
                              <span className="text-[8px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">
                                {classLabels[m.level] || 'Lớp'}
                              </span>
                            </div>
                            
                            <h5 className="font-bold text-xs text-slate-800 line-clamp-1">{m.milestone}</h5>
                            <p className="text-[11px] text-slate-500 leading-normal font-bold">{m.detail}</p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={() => startEditMilestone(m)}
                              className="p-1 text-slate-500 hover:text-slate-700 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                              title="Sửa chặng"
                            >
                              <Edit3 size={10} />
                            </button>
                            <button 
                              onClick={() => {
                                onDeleteMilestone(m.id);
                                playBeep(250, 200);
                                showToast('Đã xóa chặng khỏi lộ trình học!', 'success');
                              }}
                              className="p-1 text-red-500 hover:text-red-700 bg-red-50 rounded border border-red-100 hover:bg-red-100 transition-all cursor-pointer"
                              title="Xóa chặng"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
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
                            onDeleteContent(item.id);
                            playBeep(250, 200);
                            showToast('Đã xóa học liệu thành công!', 'success');
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
              const isEditing = editingProductId === p.id;
              return (
                <div 
                  key={p.id} 
                  className={`p-4 border rounded-2xl transition-all ${
                    isEditing 
                      ? 'border-amber-400 bg-amber-50/20' 
                      : 'border-slate-100 bg-slate-50 hover:border-amber-100'
                  }`}
                >
                  {isEditing ? (
                    <div className="w-full space-y-3">
                      <div className="flex gap-2 items-center border-b pb-1.5">
                        <span className="text-amber-600 text-lg">💡</span>
                        <h5 className="font-bold text-xs text-slate-800">Chỉnh sửa thông số giáo cụ đồ chơi</h5>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Emoji đại diện</label>
                          <input 
                            type="text"
                            value={editProdEmojiReg}
                            onChange={(e) => setEditProdEmojiReg(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none text-center"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Tên giáo cụ đồ chơi</label>
                          <input 
                            type="text"
                            value={editProdNameReg}
                            onChange={(e) => setEditProdNameReg(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Giá bán mới (đ)</label>
                          <input 
                            type="number"
                            value={editProdPriceReg}
                            onChange={(e) => setEditProdPriceReg(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Giá gốc ban đầu (đ)</label>
                          <input 
                            type="number"
                            value={editProdOldPriceReg}
                            onChange={(e) => setEditProdOldPriceReg(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Mô tả chi tiết giáo cụ</label>
                        <textarea 
                          value={editProdDescReg}
                          onChange={(e) => setEditProdDescReg(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 h-16 outline-none resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-1.5 pt-1">
                        <button 
                          onClick={() => setEditingProductId(null)}
                          className="px-2.5 py-1 text-[10px] font-bold bg-slate-200 text-slate-600 rounded cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button 
                          onClick={() => saveEditProduct(p.id)}
                          className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={10} /> Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-3.5xl p-2 bg-white rounded-xl shadow-sm border border-slate-100 inline-block shrink-0">{p.image}</span>
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-slate-800 line-clamp-1">{p.name}</h5>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-bold text-orange-600">{p.price.toLocaleString('vi-VN')}đ</span>
                            <span className="text-[10px] text-slate-400 line-through">{p.oldPrice.toLocaleString('vi-VN')}đ</span>
                          </div>
                          {p.desc && <p className="text-[11px] text-slate-400 line-clamp-1">{p.desc}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => startEditProduct(p)}
                          className="p-1 px-2 text-slate-500 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer"
                          title="Sửa sản phẩm"
                        >
                          <Edit3 size={11} />
                        </button>
                        <button 
                          onClick={() => {
                            onDeleteProduct(p.id);
                            playBeep(250, 200);
                            showToast('Đã gỡ bán sản phẩm đồ chơi thành công!', 'success');
                          }}
                          className="p-1 px-2 text-red-500 bg-white hover:bg-red-50 border border-red-100 rounded-lg transition-all cursor-pointer"
                          title="Xóa sản phẩm"
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

      </div>
    </div>
  );
};
