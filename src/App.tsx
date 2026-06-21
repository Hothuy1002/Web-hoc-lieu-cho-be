import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Map, 
  FolderOpen, 
  ShoppingBag, 
  Sliders, 
  PlusCircle, 
  ChevronDown, 
  Star, 
  Flame, 
  BookOpen, 
  ShieldCheck,
  Award,
  ChevronRight,
  Sparkles,
  Printer,
  Heart,
  MessageCircle,
  TrendingUp,
  BrainCircuit,
  FileText,
  Check
} from 'lucide-react';

import { KidProfile, DigitalContent, Product, CartItem, Milestone } from './types';
import { MascotTigerSVG } from './components/MascotTigerSVG';
import { AIChatWidget } from './components/AIChatWidget';
import { MathQuest } from './components/MathQuest';
import { FlashcardDeck } from './components/FlashcardDeck';
import { AdminCMS } from './components/AdminCMS';

import { 
  WorksheetModal, 
  CartModal, 
  ProfileModal, 
  ProductDetailModal, 
  PromoModal,
  CheckoutPaymentModal
} from './components/Modals';

import { supabase } from './supabaseClient';

// ================== INITIAL STATIC DATABASE ==================
const initialProfiles: KidProfile[] = [
  { id: "be_minh", name: "Bé Minh", classKey: "mam_non", className: "Mầm Non (5 tuổi)", points: 120, streak: 5, emoji: "👧", avatarBg: "fbcfe8", avatarColor: "be185d" },
  { id: "be_vy", name: "Bé Vy", classKey: "lop_2", className: "Tiểu Học Lớp 2 (7 tuổi)", points: 340, streak: 12, emoji: "🦄", avatarBg: "ddd6fe", avatarColor: "6d28d9" }
];

const initialContent: DigitalContent[] = [
  { id: "pdf_counting", title: "Bộ tập tô tập đếm số từ 1-10", subject: "toan", format: "pdf", age: "mam_non", isPremium: false, downloads: 1420, desc: "Giúp trẻ mầm non nhận dạng nhanh mặt số thông qua hình vẽ con vật ngộ nghĩnh và các chấm tròn tương đương." },
  { id: "pdf_alphabet", title: "Luyện viết 29 chữ cái tiếng Việt", subject: "tieng_viet", format: "pdf", age: "mam_non", isPremium: false, downloads: 2310, desc: "File nét đứt chuẩn mực để bé tập viết chính xác tỷ lệ, độ cao của các nhóm chữ đơn giản." },
  { id: "fc_animals", title: "Flashcard các con vật thông dụng", subject: "tieng_anh", format: "flashcards", age: "mam_non", isPremium: false, downloads: 820, desc: "Nội dung học thử bộ flashcards tiếng Anh chuẩn Cambridge, lật từ vựng mượt mà kèm phiên âm chuẩn quốc tế." },
  { id: "video_fairytale", title: "Hoạt hình truyện cổ tích Tấm Cám", subject: "tieng_viet", format: "video", age: "lop_1", isPremium: true, downloads: 950, desc: "Video hoạt hình 2D sinh động giúp bé lớp 1 học tập rút ra bài học đạo đức, nâng cao vốn từ vựng nói viết." },
  { id: "pdf_math_grade2", title: "Bài tập toán tư duy cộng trừ có nhớ", subject: "toan", format: "pdf", age: "lop_2", isPremium: true, downloads: 670, desc: "Phiếu học tập tăng tốc tư duy phân tích toán học phạm vi 100 với sơ đồ tư duy Mindmap." },
  { id: "pdf_english_grammar", title: "Từ vựng tiếng Anh chủ đề trường học", subject: "tieng_anh", format: "pdf", age: "lop_3", isPremium: true, downloads: 1100, desc: "Tổng hợp các danh từ và cấu trúc giao tiếp cơ bản tại lớp học cho học sinh lớp 3." },
  { id: "pdf_coloring_skills", title: "Bộ tập tô vẽ tạo hình rèn luyện tinh tay búp măng", subject: "ky_nang", format: "pdf", age: "mam_non", isPremium: false, downloads: 1250, desc: "Tuyển chọn 50 tranh tô màu sinh động giúp bé phát triển vận động tinh, kiểm soát linh hoạt các đầu ngón tay khéo léo." },
  { id: "video_origami_basic", title: "Video rèn luyện kĩ năng khéo tay gấp giấy Origami", subject: "ky_nang", format: "video", age: "lop_1", isPremium: true, downloads: 780, desc: "Hướng dẫn từng bước cách gấp các mô hình con vật bằng giấy màu tuyệt đẹp giúp tăng cường khả năng căn chỉnh hình học." }
];

const initialProducts: Product[] = [
  { id: "stem_robot", name: "Đồ chơi robot lắp trình gỗ thông minh STEM", price: 350000, oldPrice: 700000, image: "🤖", rating: 5, downloads: 1420, desc: "Bộ mô hình lắp ráp giúp trẻ rèn luyện tư duy thuật toán và logic sắp xếp thứ tự bước đi khoa học." },
  { id: "wood_puzzle", name: "Bộ đồ chơi ghép hình chữ cái Montessori", price: 180000, oldPrice: 360000, image: "🧩", rating: 4.8, downloads: 2310, desc: "Gỗ sồi thiên nhiên cao cấp hỗ trợ bé nhận biết mặt chữ, kết hợp màu sắc và ghi nhớ từ vựng hiệu quả." },
  { id: "combo_premium_kit", name: "Trọn bộ Combo Giáo cụ rèn chữ & luyện toán", price: 420000, oldPrice: 840000, image: "📚", rating: 5, downloads: 3560, desc: "Bao gồm 3 quyển tập vẽ, 1 bộ học cụ gỗ giúp nhận diện số đếm kèm 50 trang in chất lượng cao." },
  { id: "flashcard_box", name: "Hộp thẻ từ vựng song ngữ Anh-Việt thông thái", price: 120000, oldPrice: 240000, image: "🃏", rating: 4.9, downloads: 1890, desc: "100 thẻ cứng ép bóng chống nước, sử dụng phương pháp Flashcards của Glenn Doman giúp bé nhớ lâu." },
  { id: "clay_set", name: "Đất sét tạo hình hữu cơ sinh học 24 màu siêu nhẹ", price: 195000, oldPrice: 390000, image: "🎨", rating: 4.7, downloads: 920, desc: "Đất sét tự nhiên không dính tay, an toàn tuyệt đối giúp phát triển vận động tinh và cơ tay của bé." },
  { id: "chess_logic", name: "Bộ cờ vua tư duy Nam Cực bằng gỗ ép tự nhiên", price: 280000, oldPrice: 560000, image: "👑", rating: 5, downloads: 670, desc: "Trò chơi chiến thuật cổ điển phiên bản hoạt hình dễ thương giúp bé rèn luyện phản xạ và tư duy logic." },
  { id: "draw_tablet", name: "Bảng vẽ tự xóa thông minh màn hình LCD 10 inch", price: 150000, oldPrice: 300000, image: "📝", rating: 4.8, downloads: 4120, desc: "Xóa sạch chỉ bằng 1 nút nhấn, bảo vệ đôi mắt của bé khỏi bụi phấn viết bảng truyền thống." },
  { id: "micro_nature", name: "Kính hiển vi mini bỏ túi khám phá thế giới tự nhiên", price: 230000, oldPrice: 460000, image: "🔬", rating: 4.9, downloads: 1530, desc: "Độ phóng đại cao, tích hợp đèn LED tiện lợi giúp bé thỏa sức tò mò soi rõ từng chiếc lá, sợi vải xung quanh." }
];

const initialMilestones: Milestone[] = [
  // MẦM NON
  { id: "mn_ta_1", level: "mam_non", subject: "tieng_anh", milestone: "English ABC Wordplay (Mầm Non)", detail: "Bé ghi nhớ 10 bảng chữ cái đầu tiên (A-J), làm quen phát âm chuẩn cùng các từ vựng đồ dùng gia đình đơn giản." },
  { id: "mn_ta_2", level: "mam_non", subject: "tieng_anh", milestone: "English Animals & Fruits (Mầm Non)", detail: "Học nhận diện 20 từ vựng tiếng Anh chủ đề động vật nuôi và trái cây quen thuộc qua tranh ảnh sinh động." },
  { id: "mn_ta_3", level: "mam_non", subject: "tieng_anh", milestone: "English Basic Colors (Mầm Non)", detail: "Nhận diện và nói chuẩn tên các màu sắc cơ bản bằng tiếng Anh (Red, Yellow, Blue, Green) qua bài hát trực quan." },
  { id: "mn_toan_1", level: "mam_non", subject: "toan", milestone: "Nền tảng số đếm", detail: "Nhận biết khối tròn, vuông, hình học cơ bản kết hợp tập đếm thạo các số từ 1 đến 10." },
  { id: "mn_tv_1", level: "mam_non", subject: "tieng_viet", milestone: "Làm quen bảng chữ cái tiếng Việt", detail: "Nhận biết nguyên âm đơn giản và làm quen 29 âm sắc cơ bản tiếng mẹ đẻ." },

  // LỚP 1
  { id: "l1_ta_1", level: "lop_1", subject: "tieng_anh", milestone: "English Welcome & Hello (Lớp 1)", detail: "Bé tự giới thiệu bản thân cơ bản, biết cách chào hỏi và nói trạng thái sức khỏe đơn giản." },
  { id: "l1_ta_2", level: "lop_1", subject: "tieng_anh", milestone: "English Classroom Objects (Lớp 1)", detail: "Làm thạo 10 từ vựng tiếng Anh về đồ dùng học tập hàng ngày (Book, Pen, Bag, Ruler...) kèm trò chơi lật hình." },
  { id: "l1_ta_3", level: "lop_1", subject: "tieng_anh", milestone: "English My Family Members (Lớp 1)", detail: "Nhận biết và gọi tên tiếng Anh chuẩn cho mẹ, cha, anh chị em và thú cưng yêu quý của bé." },
  { id: "l1_toan_1", level: "lop_1", subject: "toan", milestone: "Toán học phạm vi 20", detail: "Thực hiện thành thạo các phép cộng, trừ phạm vi 20 không nhớ và làm quen toán đố đơn giản." },

  // LỚP 2
  { id: "l2_ta_1", level: "lop_2", subject: "tieng_anh", milestone: "English Interactive Action Verbs (Lớp 2)", detail: "Sử dụng linh hoạt các động từ hành động phổ biến (Run, Sing, Read, Draw, Play) để tương tác giao tiếp." },
  { id: "l2_ta_2", level: "lop_2", subject: "tieng_anh", milestone: "English My Sweet Home (Lớp 2)", detail: "Đặt tên chuẩn cho các phòng ngủ, bếp, khách và dùng trôi chảy vị trí giới từ đơn (In, On, Under)." },
  { id: "l2_ta_3", level: "lop_2", subject: "tieng_anh", milestone: "English Cambridge Starters Vocabulary (Lớp 2)", detail: "Củng cố mở rộng từ vựng chuẩn khung Cambridge Starters, tập ghi cụm từ đúng ngữ pháp cơ bản." },
  { id: "l2_toan_1", level: "lop_2", subject: "toan", milestone: "Phép nhân & Chia nền tảng", detail: "Học thuộc bảng cửu chương nhân từ 2 đến 5 và rèn luyện thuật toán chia số dư cơ bản." },

  // LỚP 3
  { id: "l3_ta_1", level: "lop_3", subject: "tieng_anh", milestone: "English Weather & Activities (Lớp 3)", detail: "Hỏi và mô tả chính xác kiểu thời tiết (It's sunny/rainy/cloudy) và nói về hoạt động dã ngoại ngoài trời." },
  { id: "l3_ta_2", level: "lop_3", subject: "tieng_anh", milestone: "English Telling Time & Schedule (Lớp 3)", detail: "Nắm vững kỹ năng hỏi và trả lời thông tin giờ giấc cụ thể (What time is it?) trong sinh hoạt hàng ngày." },
  { id: "l3_ta_3", level: "lop_3", subject: "tieng_anh", milestone: "English Dream Jobs & Presentation (Lớp 3)", detail: "Tự tin thuyết trình 2 phút giới thiệu về ước mơ nghề nghiệp tương lai (Doctor, Teacher, Astronaut...)." },
  { id: "l3_toan_1", level: "lop_3", subject: "toan", milestone: "Hình học và Nhân chia phức tạp", detail: "Tính chu vi diện tích hình chữ nhật, hình vuông, làm quen nhân chia ngoài bảng cửu chương." }
];

export default function App() {
  // Navigation / Navigation Tab
  const [activeTab, setActiveTab] = useState<'home' | 'learningPaths' | 'contentRepository' | 'shop' | 'parentZone' | 'adminCMS'>('home');

  // Supabase states
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  // Database States
  const [profiles, setProfiles] = useState<KidProfile[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>('be_minh');
  const [digitalContent, setDigitalContent] = useState<DigitalContent[]>(initialContent);
  const [shopProducts, setShopProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Filtering States for Repository
  const [subFilter, setSubFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');

  // Interactive Milestones Tab
  const [activePathLevel, setActivePathLevel] = useState<string>('mam_non');
  const [activePathSubject, setActivePathSubject] = useState<string>('all'); // 'all' or dynamic subjects
  
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('tiger_kids_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const handleAddMilestone = (m: Milestone) => {
    setMilestones(prev => {
      const updated = [m, ...prev];
      localStorage.setItem('tiger_kids_milestones', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('tiger_kids_milestones', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateMilestone = (updatedItem: Milestone) => {
    setMilestones(prev => {
      const updated = prev.map(m => m.id === updatedItem.id ? updatedItem : m);
      localStorage.setItem('tiger_kids_milestones', JSON.stringify(updated));
      return updated;
    });
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'points' | 'error'>('success');
  const [showToastBar, setShowToastBar] = useState(false);

  // Dropdowns opens
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // MODALS OPENS
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);
  const [selectedWorksheetId, setSelectedWorksheetId] = useState<string | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  // Current selected kid profile mapping
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Sync active Profile age configuration with milestones map initially
  useEffect(() => {
    if (activeProfile) {
      setActivePathLevel(activeProfile.classKey);
    }
  }, [activeProfileId, activeProfile]);

  // Load and sync data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const { data: dbProfiles, error: pError } = await supabase
          .from("kid_profiles")
          .select("*")
          .order("created_at", { ascending: true });

        if (pError) {
          console.warn("Supabase kid_profiles table could not be fetched (likely not created yet):", pError.message);
          setSupabaseConnected(false);
          return;
        }

        setSupabaseConnected(true);

        if (dbProfiles && dbProfiles.length > 0) {
          const mappedProfiles: KidProfile[] = dbProfiles.map((p: any) => ({
            id: p.id,
            name: p.name,
            classKey: p.class_key as 'mam_non' | 'lop_1' | 'lop_2' | 'lop_3',
            className: p.class_name,
            points: p.points,
            streak: p.streak,
            emoji: p.emoji,
            avatarBg: p.avatar_bg,
            avatarColor: p.avatar_color
          }));
          setProfiles(mappedProfiles);
          if (mappedProfiles.length > 0) {
            setActiveProfileId(mappedProfiles[0].id);
          }
        } else {
          for (const item of initialProfiles) {
            await supabase.from("kid_profiles").insert({
              id: item.id,
              name: item.name,
              class_key: item.classKey,
              class_name: item.className,
              points: item.points,
              streak: item.streak,
              emoji: item.emoji,
              avatar_bg: item.avatarBg,
              avatar_color: item.avatarColor
            });
          }
        }

        const { data: dbContent, error: cError } = await supabase
          .from("digital_content")
          .select("*")
          .order("created_at", { ascending: false });

        if (!cError && dbContent && dbContent.length > 0) {
          const mappedContent: DigitalContent[] = dbContent.map((c: any) => ({
            id: c.id,
            title: c.title,
            subject: c.subject as 'toan' | 'tieng_viet' | 'tieng_anh' | 'ky_nang',
            format: c.format as 'pdf' | 'flashcards' | 'video',
            age: c.age as 'mam_non' | 'lop_1' | 'lop_2' | 'lop_3',
            isPremium: c.is_premium,
            downloads: c.downloads,
            desc: c.desc_text || c.desc || ""
          }));
          setDigitalContent(mappedContent);
        } else if (!cError) {
          for (const item of initialContent) {
            await supabase.from("digital_content").insert({
              id: item.id,
              title: item.title,
              subject: item.subject,
              format: item.format,
              age: item.age,
              is_premium: item.isPremium,
              downloads: item.downloads,
              desc_text: item.desc
            });
          }
        }

        const { data: dbProducts, error: prodError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (!prodError && dbProducts && dbProducts.length > 0) {
          const mappedProducts: Product[] = dbProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            oldPrice: Number(p.old_price),
            image: p.image,
            rating: Number(p.rating),
            downloads: p.downloads,
            desc: p.description || p.desc || ""
          }));
          setShopProducts(mappedProducts);
        } else if (!prodError) {
          for (const item of initialProducts) {
            await supabase.from("products").insert({
              id: item.id,
              name: item.name,
              price: item.price,
              old_price: item.oldPrice,
              image: item.image,
              rating: item.rating,
              downloads: item.downloads,
              description: item.desc
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch or seed from Supabase:", err);
        setSupabaseConnected(false);
      }
    }

    loadData();
  }, []);

  // Audio synthethizer beep engine
  const playBeep = (frequency: number, duration: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, duration);
    } catch (e) {
      // Browser safety bypassed quietly
    }
  };

  // Toast trigger
  const showToast = (msg: string, type: 'success' | 'points' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToastBar(true);
  };

  useEffect(() => {
    if (showToastBar) {
      const timer = setTimeout(() => {
        setShowToastBar(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showToastBar]);

  // Promo Timer triggering
  useEffect(() => {
    const timer = setTimeout(() => {
      const promoSeen = sessionStorage.getItem('promo_seen_web');
      if (!promoSeen) {
        setIsPromoOpen(true);
        sessionStorage.setItem('promo_seen_web', 'true');
        playBeep(520, 100);
        setTimeout(() => playBeep(650, 100), 100);
        setTimeout(() => playBeep(780, 200), 200);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Profile switches
  const handleSwitchProfile = (id: string) => {
    setActiveProfileId(id);
    setIsProfileDropdownOpen(false);
    const target = profiles.find(p => p.id === id);
    if (target) {
      showToast(`Đã đổi sang không gian học tập của ${target.name}!`, 'success');
      playBeep(520, 150);
    }
  };

  // Profile additions
  const handleAddProfile = async (name: string, classKey: 'mam_non' | 'lop_1' | 'lop_2' | 'lop_3', emoji: string) => {
    const classNamesMap = {
      mam_non: "Mầm Non (5 tuổi)",
      lop_1: "Tiểu Học Lớp 1 (6 tuổi)",
      lop_2: "Tiểu Học Lớp 2 (7 tuổi)",
      lop_3: "Tiểu Học Lớp 3 (8 tuổi)"
    };

    const colors = [
      { bg: "fdf2f8", text: "be185d" },
      { bg: "ecfdf5", text: "047857" },
      { bg: "eff6ff", text: "1d4ed8" },
      { bg: "fff7ed", text: "c2410c" }
    ];
    const style = colors[Math.floor(Math.random() * colors.length)];

    const id = `be_${Date.now()}`;
    const classNameVal = classNamesMap[classKey];
    const newProfile: KidProfile = {
      id,
      name,
      classKey,
      className: classNameVal,
      points: 100,
      streak: 1,
      emoji,
      avatarBg: style.bg,
      avatarColor: style.text
    };

    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    showToast(`Chúc mừng Bé ${name} gia nhập câu lạc bộ Tiger Kids!`, 'success');
    playBeep(600, 200);

    if (supabaseConnected) {
      try {
        await supabase.from("kid_profiles").insert({
          id,
          name,
          class_key: classKey,
          class_name: classNameVal,
          points: 100,
          streak: 1,
          emoji,
          avatar_bg: style.bg,
          avatar_color: style.text
        });
      } catch (err) {
        console.error("Supabase insert profile failed:", err);
      }
    }
  };

  // Add stars
  const awardPoints = (amount: number) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        const nextPoints = p.points + amount;
        
        if (supabaseConnected) {
          supabase
            .from("kid_profiles")
            .update({ points: nextPoints })
            .eq("id", activeProfileId)
            .then(({ error }) => {
              if (error) console.error("Supabase awardPoints update error:", error.message);
            });
        }
        
        return { ...p, points: nextPoints };
      }
      return p;
    }));
  };

  // Shopping cart operations
  const handleAddToCart = (id: string) => {
    const product = shopProducts.find(p => p.id === id);
    if (!product) return;

    setCart(prev => {
      const exists = prev.find(item => item.id === id);
      if (exists) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    playBeep(520, 100);
    showToast(`Đã thêm món "${product.name}" vào giỏ hàng!`, 'success');
  };

  const handleAddQuantity = (id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleSubtractQuantity = (id: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity - 1;
        return nextQty <= 0 ? null : { ...item, quantity: nextQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast("Đã xóa giáo cụ khỏi giỏ hàng", "success");
  };

  const handleStartCheckout = () => {
    setIsCartModalOpen(false);
    setIsCheckoutModalOpen(true);
    playBeep(600, 100);
  };

  const handleCompleteCheckout = async (info: {
    name: string;
    phone: string;
    address: string;
    notes: string;
    method: 'banking' | 'cod';
    totalPrice: number;
    orderCode: string;
  }) => {
    playBeep(650, 250);
    showToast(`Hóa đơn ${info.orderCode} đã được khởi tạo!`, "success");

    // Optionally record orders to Supabase if order logs table is set up
    if (supabaseConnected) {
      try {
        const itemsSummary = cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }));
        await supabase.from("orders").insert({
          profile_id: activeProfileId,
          items: itemsSummary,
          total_price: info.totalPrice,
          delivery_name: info.name,
          delivery_phone: info.phone,
          delivery_address: info.address,
          delivery_notes: info.notes,
          payment_method: info.method,
          order_code: info.orderCode
        });
      } catch (err) {
        console.warn("Could not log order to Supabase orders table (optional):", err);
      }
    }

    // Delay clearing the cart slightly or immediately so success screen is correct
    setCart([]);
  };

  // Content Repo CRUD
  const handleAddContent = async (item: DigitalContent) => {
    setDigitalContent(prev => [item, ...prev]);

    if (supabaseConnected) {
      try {
        await supabase.from("digital_content").insert({
          id: item.id,
          title: item.title,
          subject: item.subject,
          format: item.format,
          age: item.age,
          is_premium: item.isPremium,
          downloads: item.downloads,
          desc_text: item.desc
        });
      } catch (err) {
        console.error("Supabase add content failed:", err);
      }
    }
  };

  const handleDeleteContent = async (id: string) => {
    setDigitalContent(prev => prev.filter(c => c.id !== id));

    if (supabaseConnected) {
      try {
        await supabase.from("digital_content").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase delete content failed:", err);
      }
    }
  };

  const handleUpdateContent = async (updatedItem: DigitalContent) => {
    setDigitalContent(prev => prev.map(c => c.id === updatedItem.id ? updatedItem : c));

    if (supabaseConnected) {
      try {
        await supabase.from("digital_content").update({
          title: updatedItem.title,
          desc_text: updatedItem.desc,
          subject: updatedItem.subject,
          format: updatedItem.format,
          age: updatedItem.age,
          is_premium: updatedItem.isPremium,
          downloads: updatedItem.downloads
        }).eq("id", updatedItem.id);
      } catch (err) {
        console.error("Supabase update content failed:", err);
      }
    }
  };

  // Shop Product CRUD
  const handleAddProduct = async (product: Product) => {
    setShopProducts(prev => [product, ...prev]);

    if (supabaseConnected) {
      try {
        await supabase.from("products").insert({
          id: product.id,
          name: product.name,
          price: product.price,
          old_price: product.oldPrice,
          image: product.image,
          rating: product.rating,
          downloads: product.downloads,
          description: product.desc
        });
      } catch (err) {
        console.error("Supabase add product failed:", err);
      }
    }
  };

  const handleUpdateProduct = async (updatedItem: Product) => {
    setShopProducts(prev => prev.map(p => p.id === updatedItem.id ? updatedItem : p));

    if (supabaseConnected) {
      try {
        await supabase.from("products").update({
          name: updatedItem.name,
          price: updatedItem.price,
          old_price: updatedItem.oldPrice,
          image: updatedItem.image,
          rating: updatedItem.rating,
          downloads: updatedItem.downloads,
          description: updatedItem.desc
        }).eq("id", updatedItem.id);
      } catch (err) {
        console.error("Supabase update product failed:", err);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setShopProducts(prev => prev.filter(p => p.id !== id));

    if (supabaseConnected) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase delete product failed:", err);
      }
    }
  };

  // Filter content
  const filteredContent = digitalContent.filter(item => {
    const matchSub = subFilter === 'all' || item.subject === subFilter;
    const matchFormat = formatFilter === 'all' || item.format === formatFilter;
    return matchSub && matchFormat;
  });

  const handleOpenPDF = (id: string) => {
    setSelectedWorksheetId(id);
    setIsWorksheetModalOpen(true);
  };

  const handleOpenDetailProduct = (id: string) => {
    setSelectedProductId(id);
    setIsProductDetailOpen(true);
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-700 min-h-screen flex flex-col antialiased">
      
      {/* Dynamic Toast Notification Panel */}
      {showToastBar && (
        <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none">
          <div className="bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-2xl">
              {toastType === 'success' ? '🚀' : toastType === 'points' ? '⭐' : '⚠️'}
            </span>
            <span className="font-bold text-sm sm:text-base">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Primary Header Navigation Bar */}
      <header className="bg-white border-b-2 border-slate-100 sticky top-0 z-40 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo/Identity */}
            <div 
              onClick={() => { setActiveTab('home'); playBeep(450, 100); }}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-12 h-16 rounded-[1.25rem] bg-gradient-to-b from-amber-300 via-orange-400 to-orange-500 flex items-center justify-center shadow-md p-1.5 transition-transform hover:scale-105 duration-200">
                <MascotTigerSVG className="w-full h-full" />
              </div>
              <div>
                <h1 className="font-vietnam font-black text-[15px] md:text-[17px] bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent leading-normal tracking-wide whitespace-nowrap">
                  HỌC LIỆU CHO BÉ
                </h1>
                <p className="font-sans text-[10px] text-slate-400 font-bold tracking-wider mt-0.5 uppercase">Cổng giáo dục toàn diện</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5">
              <button 
                onClick={() => { setActiveTab('home'); playBeep(450, 80); }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'home' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home size={16} /> <span>Trang Chủ</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('learningPaths'); playBeep(450, 80); }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'learningPaths' ? 'text-green-600 bg-green-50' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Map size={16} /> <span>Lộ Trình Học</span>
              </button>

              <button 
                onClick={() => { setActiveTab('contentRepository'); playBeep(450, 80); }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'contentRepository' ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FolderOpen size={16} /> <span>Kho Học Liệu</span>
              </button>

              <button 
                onClick={() => { setActiveTab('shop'); playBeep(450, 80); }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'shop' ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShoppingBag size={16} /> <span>Cửa Hàng</span>
              </button>

              <button 
                onClick={() => { setActiveTab('parentZone'); playBeep(450, 80); }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'parentZone' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck size={16} /> <span>Góc Phụ Huynh</span>
              </button>

              <button 
                onClick={() => { setActiveTab('adminCMS'); playBeep(450, 80); }}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'adminCMS' ? 'text-slate-900 bg-slate-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
                id="btn-nav-cms"
              >
                <Sliders size={16} /> <span>CMS</span>
              </button>
            </nav>

            {/* Profile Selector drop down & Giỏ Hàng Action panel */}
            <div className="flex items-center gap-3">
              {/* Cart Toggle button */}
              <button 
                onClick={() => { setIsCartModalOpen(true); playBeep(520, 100); }}
                className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <ShoppingBag size={22} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                    {cart.reduce((s, c) => s + c.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Profiles switch tool */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-all p-1.5 sm:p-2 rounded-2xl border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-lg select-none">
                    {activeProfile?.emoji}
                  </div>
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-extrabold text-slate-800 leading-none">{activeProfile?.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 leading-none">{activeProfile?.className}</p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2.5 z-50">
                    <p className="px-4 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b mb-1">
                      Hồ Sơ Trẻ Đang Sử Dụng
                    </p>
                    <div className="space-y-1 px-2 max-h-48 overflow-y-auto no-scrollbar">
                      {profiles.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => handleSwitchProfile(p.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                            p.id === activeProfileId ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl select-none">{p.emoji}</span>
                            <div className="text-left">
                              <p className="text-xs font-bold">{p.name}</p>
                              <p className="text-[9px] font-medium text-slate-400">{p.className}</p>
                            </div>
                          </div>
                          {p.id === activeProfileId && <Check size={14} className="text-orange-600" />}
                        </button>
                      ))}
                    </div>

                    <div className="px-2 mt-2 pt-2 border-t">
                      <button 
                        type="button"
                        onClick={() => { setIsAddProfileOpen(true); setIsProfileDropdownOpen(false); playBeep(520, 100); }}
                        className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all focus:outline-none"
                      >
                        <PlusCircle size={14} /> Thêm bé mới học
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Hero Taskbar for Kid Personalized gamifications */}
      <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-lime-400 text-white py-3 px-4 shadow-sm relative z-30 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold">
            <Award className="text-yellow-200 animate-bounce" size={16} />
            <span>Nhiệm vụ hôm nay của <span className="underline">{activeProfile?.name}</span>: Giải đố toán nhận 50 sao & lật qua 5 Flashcard Anh-Việt!</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={12} fill="currentColor" className="text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{activeProfile?.points} sao tích luỹ</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Flame size={12} fill="currentColor" className="text-orange-500" />
              <span>Streak {activeProfile?.streak} ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Banner welcome with Custom Mascot */}
            <div className="bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden border border-indigo-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-12 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20"></div>

              <div className="space-y-5 max-w-xl text-center md:text-left relative z-10">
                <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                  <Sparkles size={12} /> Đồng hành sư phạm mầm non & tiểu học
                </span>
                <h2 className="text-3xl sm:text-4.5xl font-brand font-bold text-slate-800 leading-tight">
                  Chào <span className="text-indigo-600 font-extrabold">{activeProfile?.name}</span> yêu,<br />Hôm nay bé muốn chơi học gì thế?
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  Tải nhanh kho học liệu toán nhận biết, tập viết chữ nét đứt PDF, lật thẻ từ vựng Cambridge mượt mà và nhận báo cáo tiến trình chi tiết từ Bạn Hổ AI!
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                  <button 
                    onClick={() => { setActiveTab('contentRepository'); playBeep(520, 100); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 focus:outline-none"
                  >
                    Vào Học Ngay Thôi
                  </button>
                  <button 
                    onClick={() => { setActiveTab('learningPaths'); playBeep(450, 100); }}
                    className="bg-white border hover:bg-slate-50 text-slate-700 font-extrabold text-sm px-5 py-3.5 rounded-2xl transition-all focus:outline-none"
                  >
                    Xem Lộ Trình Lớp {activeProfile?.name === "Bé Minh" ? "Mầm Non" : "Lớp 2"}
                  </button>
                </div>
              </div>

              {/* Tiger Mascot box with dynamic rendering */}
              <div className="relative z-10 flex flex-col items-center select-none">
                <div className="w-56 h-56 sm:w-64 sm:h-64 bg-white rounded-full flex items-center justify-center ring-8 ring-indigo-50 shadow-2xl overflow-hidden relative border border-slate-150">
                  <MascotTigerSVG emoji={activeProfile?.emoji} className="w-44 h-44 sm:w-52 sm:h-52" />
                </div>
                <div className="bg-white border shadow-md py-2 px-4 rounded-xl -mt-4 relative z-20 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-[11px] font-extrabold text-slate-800">Trạng thái: Đang siêu tập trung!</span>
                </div>
              </div>
            </div>

            {/* Features Columns */}
            <div className="space-y-5">
              <h3 className="text-xl sm:text-2xl font-brand font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" /> Bản Thiết Kế Giáo Dục Của Bé
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Account */}
                <div className="bg-gradient-to-tr from-orange-50/60 to-orange-100/10 border border-orange-100 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-center mb-1">
                      <span className="text-3xl bg-white p-2.5 rounded-2xl shadow-3xs border border-slate-100 w-14 h-14 flex items-center justify-center">👧</span>
                    </div>
                    <h4 className="font-brand font-bold text-lg text-slate-850 text-center">1. Quản Trị Trẻ</h4>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">Hồ sơ cá nhân hóa cho từng bé, tích lũy điểm thưởng đổi các combo quà tặng cao cấp.</p>
                  </div>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(true)}
                    className="mt-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all focus:outline-none cursor-pointer"
                  >
                    Thay đổi hồ sơ bé
                  </button>
                </div>

                {/* 2. Paths */}
                <div className="bg-gradient-to-tr from-green-50/60 to-green-100/10 border border-green-150 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-center mb-1">
                      <span className="text-3xl bg-white p-2.5 rounded-2xl shadow-3xs border border-slate-100 w-14 h-14 flex items-center justify-center">🗺️</span>
                    </div>
                    <h4 className="font-brand font-bold text-lg text-slate-850 text-center">2. Lộ Trình Vàng</h4>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">Chia tách 4 khoảng thời gian từ mầm non khơi gợi học hỏi cho tới lớp 1, 2, 3 toán rèn chữ.</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('learningPaths'); playBeep(450, 100); }}
                    className="mt-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all focus:outline-none cursor-pointer"
                  >
                    Xem chặng thông minh
                  </button>
                </div>

                {/* 3. Repo */}
                <div className="bg-gradient-to-tr from-teal-50/60 to-teal-100/10 border border-teal-150 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-center mb-1">
                      <span className="text-3xl bg-white p-2.5 rounded-2xl shadow-3xs border border-slate-100 w-14 h-14 flex items-center justify-center">📚</span>
                    </div>
                    <h4 className="font-brand font-bold text-lg text-slate-850 text-center">3. Kho Tư Liệu Số</h4>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">File tập vẽ, học tiếng Anh in ngay tại nhà, truyện video cổ tích nâng tư duy giao tiếp.</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('contentRepository'); playBeep(450, 100); }}
                    className="mt-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all focus:outline-none cursor-pointer"
                  >
                    Sưu tầm học liệu
                  </button>
                </div>

                {/* 4. Products */}
                <div className="bg-gradient-to-tr from-yellow-50/60 to-yellow-105/10 border border-yellow-150 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-center mb-1">
                      <span className="text-3xl bg-white p-2.5 rounded-2xl shadow-3xs border border-slate-100 w-14 h-14 flex items-center justify-center">🧸</span>
                    </div>
                    <h4 className="font-brand font-bold text-lg text-slate-850 text-center">4. Đồ Chơi Montessori</h4>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">Đồ chơi STEM rèn luyện cơ tay hữu cơ an toàn cho sức khỏe và kích ứng tư duy hình khối.</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('shop'); playBeep(450, 100); }}
                    className="mt-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-bold rounded-xl shadow-xs transition-all focus:outline-none cursor-pointer"
                  >
                     Vào góc mua sắm
                  </button>
                </div>

              </div>
            </div>

            {/* Quick Interactive Math Game block */}
            <MathQuest 
              activeClassKey={activeProfile?.classKey}
              onAwardPoints={awardPoints}
              playBeep={playBeep}
              showToast={showToast}
            />

            {/* Quick PDF material download and testimonials */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-brand font-bold text-lg text-slate-800 flex items-center gap-1.5">
                    <Printer className="text-indigo-600" size={18} /> In Nhanh Phiếu Điểm Chuẩn PDF
                  </h4>
                  <span className="text-[10px] font-extrabold bg-red-50 text-red-650 px-2 py-0.5 rounded-full uppercase">Độc quyền</span>
                </div>
                <p className="text-xs text-slate-400">Chọn nhanh mẫu giáo trình bên dưới để xem nháp cấu trúc trước khi nhấn in PDF khổ giấy A4.</p>
                
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mẫu phiếu đề xuất</label>
                    <select id="quickPDFSelectInput" className="w-full bg-white border rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none">
                      <option value="pdf_counting">Toán Tư Duy: Học số đếm mầm non 1-10</option>
                      <option value="pdf_alphabet">Tiếng Việt Tập Đọc: Luyện đi nét chữ cái đứt quãng</option>
                      <option value="pdf_math_grade2">Toán Tư Duy: Sơ đồ Mindmap số đếm lớp 2</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      const selVal = (document.getElementById('quickPDFSelectInput') as HTMLSelectElement)?.value || 'pdf_counting';
                      handleOpenPDF(selVal);
                      playBeep(520, 100);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    Xem Tải Giáo Án Trực Tiếp
                  </button>
                </div>
              </div>

              {/* Parents Reviews */}
              <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-brand font-bold text-lg text-slate-800">Cảm Nhận Các Mẹ</h4>
                    <div className="flex gap-0.5 text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-xs italic text-slate-500 leading-relaxed">
                    "Web học liệu hay và hữu ích cực kỳ luôn. Em tải hình tô vẽ cho bé Sóc nhà em tô buổi tối, bé rất thích các con thú ngộ nghĩnh của thương hiệu! Chú hổ AI cũng siêu thông minh kiên trì trả lời."
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50">
                  <div className="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center font-bold text-lg select-none">
                    👩‍🍳
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-850">Mẹ bé Sóc (4 tuổi)</h5>
                    <p className="text-[10px] text-slate-400">Ban quản trị mầm non quận Phú Nhuận</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: LEARNING PATHS */}
        {activeTab === 'learningPaths' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex bg-green-100 text-green-700 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                Lập trình sư phạm định hướng tư duy vàng
              </span>
              <h3 className="text-2xl sm:text-3xl font-brand font-bold text-slate-800">Lộ Trình Từng Chặng Phát Triển</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Đồng hành cùng bé qua từng bậc lớp học để nắm trọn vẹn kiến thức toàn thể, đặc biệt học lực Tiếng Anh theo chuẩn quốc tế mượt mà, đầy hứng khởi!
              </p>
            </div>

            {/* Block age selectors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {['mam_non', 'lop_1', 'lop_2', 'lop_3'].map((key) => {
                const labelsMap = {
                  mam_non: { title: "Mầm Non", age: "Từ 3-5 tuổi" },
                  lop_1: { title: "Tiểu Học Lớp 1", age: "Từ 6-7 tuổi" },
                  lop_2: { title: "Tiểu Học Lớp 2", age: "Từ 7-8 tuổi" },
                  lop_3: { title: "Tiểu Học Lớp 3", age: "Từ 8-9 tuổi" }
                };
                const spec = (labelsMap as any)[key];
                const isActive = activePathLevel === key;

                return (
                  <button
                    key={key}
                    id={`btn-path-level-${key}`}
                    onClick={() => { setActivePathLevel(key); playBeep(450, 75); }}
                    className={`py-3.5 px-4 rounded-2xl font-bold transition-all border-2 text-center focus:outline-none cursor-pointer ${
                      isActive 
                        ? 'border-green-500 bg-green-500 text-white shadow-md' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-sm sm:text-base">{spec.title}</span>
                    <span className="text-[10px] opacity-80 font-normal">{spec.age}</span>
                  </button>
                );
              })}
            </div>

            {/* Subject Filters within Path */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {[
                { key: 'all', title: 'Tất cả học phần', emoji: '🌟', color: 'bg-slate-100 text-slate-700' },
                { key: 'tieng_anh', title: 'Tiếng Anh Chuẩn Cambridge', emoji: '💬', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { key: 'toan', title: 'Toán Tư Duy', emoji: '➕', color: 'bg-orange-100 text-orange-700' },
                { key: 'tieng_viet', title: 'Tiếng Việt Tập Đọc', emoji: '📖', color: 'bg-teal-100 text-teal-700' },
                { key: 'ky_nang', title: 'Kỹ Năng Vận Động', emoji: '🎨', color: 'bg-purple-100 text-purple-700' },
              ].map((sub) => {
                const isActive = activePathSubject === sub.key;
                return (
                  <button
                    key={sub.key}
                    id={`btn-path-sub-${sub.key}`}
                    onClick={() => { setActivePathSubject(sub.key); playBeep(500, 70); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all outline-none focus:outline-none cursor-pointer border ${
                      isActive 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{sub.emoji}</span>
                    <span>{sub.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Milestones grid path */}
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                
                <div className="flex-1 space-y-6 w-full">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-brand font-bold text-slate-800 capitalize leading-snug">
                      Hành trình lớp {activePathLevel === 'mam_non' ? 'Mầm Non' : activePathLevel === 'lop_1' ? 'Lớp 1' : activePathLevel === 'lop_2' ? 'Lớp 2' : 'Lớp 3'}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">Chi tiết lộ trình bài học thông thái cho con yêu rèn luyện.</p>
                  </div>

                  <div className="space-y-4">
                    {(() => {
                      const filtered = milestones.filter(m => 
                        m.level === activePathLevel && 
                        (activePathSubject === 'all' ? true : m.subject === activePathSubject)
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="py-12 text-center space-y-2">
                            <span className="text-4xl">🌸</span>
                            <p className="text-sm font-bold text-slate-400">Danh mục này hiện chưa có bài học.</p>
                            <p className="text-xs text-slate-400">Ban quản trị hoặc bố mẹ có thể thêm trực tiếp lộ trình mới ở Bảng Admin!</p>
                          </div>
                        );
                      }

                      return filtered.map((m, idx) => {
                        const subStyles: Record<string, { bg: string; text: string; icon: string; label: string }> = {
                          tieng_anh: { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', icon: '💬', label: 'Tiếng Anh' },
                          toan: { bg: 'bg-orange-50 border-orange-100', text: 'text-orange-600', icon: '➕', label: 'Toán học' },
                          tieng_viet: { bg: 'bg-teal-50 border-teal-100', text: 'text-teal-600', icon: '📖', label: 'Tiếng Việt' },
                          ky_nang: { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-600', icon: '🎨', label: 'Kỹ năng' }
                        };
                        const style = subStyles[m.subject] || { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-600', icon: '⭐', label: 'Chung' };

                        return (
                          <div 
                            key={m.id || idx} 
                            className={`flex gap-4 items-start p-4 border rounded-2xl hover:shadow-sm transition-all ${style.bg}`}
                          >
                            <div className="w-10 h-10 rounded-full bg-white text-slate-700 flex items-center justify-center font-bold text-base shrink-0 shadow-sm border border-slate-100">
                              {style.icon}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white border border-slate-100 shadow-3xs ${style.text}`}>
                                  {style.label}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">Chặng {idx + 1}</span>
                              </div>
                              <h5 className="font-bold text-sm text-slate-800">{m.milestone}</h5>
                              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{m.detail}</p>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                <div className="w-full lg:w-80 shadow-inner">
                  <div className="bg-gradient-to-tr from-green-500 to-emerald-600 p-6 rounded-3xl text-white space-y-4 text-center">
                    <div className="w-12 h-12 bg-white/20 mx-auto rounded-full flex items-center justify-center text-xl select-none">
                      🎁
                    </div>
                    <h5 className="font-brand font-bold text-base text-white">Thưởng Hoàn Thành Chặng</h5>
                    <p className="text-xs text-green-150 leading-relaxed">
                      Lần lượt cùng bé tích luỹ học thạo được các chặng của cột mốc này để mở khoá Huy chương tài năng & nhận 200 sao thưởng vào tài khoản!
                    </p>
                    <button 
                      onClick={() => { setActiveTab('contentRepository'); playBeep(520, 100); }}
                      className="w-full py-2 bg-white hover:bg-slate-50 text-emerald-600 font-extrabold text-xs rounded-xl transition-all outline-none focus:outline-none cursor-pointer"
                    >
                      Bắt đầu thực hành
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: KHO HOC LIEU */}
        {activeTab === 'contentRepository' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="space-y-1">
                <span className="bg-teal-50 text-teal-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  Kho dữ liệu PDF, lật thẻ & phim hoạt hình học tập
                </span>
                <h3 className="text-2.5xl font-brand font-bold text-slate-800">Cổng Học Tập Tiger Kids</h3>
                <p className="text-xs text-slate-405 leading-relaxed">Học liệu chất lượng cao, chia tách khoa học kích hoạt đa trí tuệ mầm non và tiểu học.</p>
              </div>

              {/* Format filters list */}
              <div className="flex flex-wrap gap-1.5 shrink-0">
                <button 
                  onClick={() => { setFormatFilter('all'); playBeep(450, 75); }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    formatFilter === 'all' ? 'border-teal-500 bg-teal-500 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  Tất cả loại hình
                </button>
                <button 
                  onClick={() => { setFormatFilter('pdf'); playBeep(450, 75); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    formatFilter === 'pdf' ? 'border-teal-500 bg-teal-500 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  📑 File PDF tập tô
                </button>
                <button 
                  onClick={() => { setFormatFilter('flashcards'); playBeep(450, 75); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    formatFilter === 'flashcards' ? 'border-teal-500 bg-teal-500 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  🎴 Flashcards lật
                </button>
                <button 
                  onClick={() => { setFormatFilter('video'); playBeep(450, 75); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    formatFilter === 'video' ? 'border-teal-500 bg-teal-500 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  🎬 Hoạt hình 4D
                </button>
              </div>
            </div>

            {/* Subject horizontal tab icons selectors */}
            <div className="flex border-b border-slate-150 overflow-x-auto no-scrollbar gap-6 py-1 select-none">
              {[
                { key: 'all', label: 'Tất Cả Phân Môn' },
                { key: 'toan', label: '🧮 Toán Tư Duy' },
                { key: 'tieng_viet', label: '📖 Tiếng Việt Tập Đọc' },
                { key: 'tieng_anh', label: '🔤 Tiếng Anh Chuẩn' },
                { key: 'ky_nang', label: '🎨 Kỹ Năng & Tinh Tay' }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => { setSubFilter(t.key); playBeep(450, 75); }}
                  className={`pb-3 font-bold text-sm whitespace-nowrap border-b-2 transition-all focus:outline-none ${
                    subFilter === t.key ? 'border-teal-500 text-teal-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Live Interactive Featured Widget: Flashcards */}
            {(formatFilter === 'all' || formatFilter === 'flashcards') && (
              <FlashcardDeck 
                playBeep={playBeep} 
                showToast={showToast} 
                subFilter={subFilter} 
                activeClassKey={activeProfile?.classKey || 'mam_non'}
                onAwardPoints={awardPoints}
              />
            )}

            {/* Grid layout cards digital material */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => {
                let badgeStyle = "text-xs font-bold px-2.5 py-0.5 rounded-full uppercase leading-none";
                let badgeText = "";
                if (item.format === 'pdf') {
                  badgeStyle += " text-red-600 bg-red-50";
                  badgeText = "file PDF tập in";
                } else if (item.format === 'flashcards') {
                  badgeStyle += " text-blue-600 bg-blue-50";
                  badgeText = "Flashcard lật";
                } else {
                  badgeStyle += " text-emerald-600 bg-emerald-50";
                  badgeText = "Hoạt hình truyện";
                }

                return (
                  <div key={item.id} className="bg-white border rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 border-slate-100">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={badgeStyle}>{badgeText}</span>
                        {item.isPremium ? (
                          <span className="text-[9px] font-extrabold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full uppercase">
                            Premium VIP
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">Thành viên miễn phí</span>
                        )}
                      </div>

                      <h5 className="font-bold text-sm sm:text-base text-slate-800 leading-snug">{item.title}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[2.5rem]">{item.desc}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span>Môn: {item.subject === 'toan' ? 'Toán Tư Duy' : item.subject === 'tieng_viet' ? 'Tiếng Việt Tập Đọc' : item.subject === 'tieng_anh' ? 'Tiếng Anh Chuẩn' : 'Kỹ Năng & Tinh Tay'}</span>
                        <span>Đã tải bảo mật: {item.downloads} lần</span>
                      </div>

                      {item.format === 'pdf' ? (
                        <button 
                          onClick={() => handleOpenPDF(item.id)}
                          className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold py-2.5 rounded-xl text-xs transition-shadow shadow-xs focus:outline-none flex items-center justify-center gap-1.5"
                        >
                          <Printer size={12} /> Xem bản nháp in ấn
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            showToast("Để rèn trí tuệ hoàn hảo, hãy dùng bộ lật Flashcards 3D phía trên bé yêu nhé!", "success");
                            playBeep(450, 100);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition-shadow shadow-xs focus:outline-none flex items-center justify-center gap-1.5"
                        >
                          Tương tác học ngay
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        )}

        {/* VIEW 4: CUA HANG */}
        {activeTab === 'shop' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex bg-amber-100 text-amber-700 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                Combo giáo cụ gỗ & hội viên cao cấp
              </span>
              <h3 className="text-2.5xl font-brand font-bold text-slate-800">Cửa Hàng Tư Duy Montessori</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Nâng nấc trí thông minh cho con yêu qua các món đồ chơi lắp ráp STEM thông minh kèm giáo trình in không giới hạn.
              </p>
            </div>

            {/* Level upgrades plans comparisons */}
            <div className="space-y-5">
              <h4 className="font-brand font-bold text-lg text-slate-805 flex items-center gap-2">
                🌟 Bảng So Sánh Các Gói Hội Viên Bản Quyền Cho Bé
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white border rounded-[2rem] p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between border-slate-150">
                  <div className="space-y-2">
                    <h5 className="font-brand font-bold text-base text-slate-500">Mẫu Gói Basic Miễn Phí</h5>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">Miễn Phí Mãi Mãi</div>
                    <p className="text-xs text-slate-400 leading-relaxed">Phù hợp ban đầu làm quen giao diện học hoặc tập tô.</p>
                    <hr className="border-slate-100 my-4" />
                    <ul className="space-y-2.5 text-xs text-slate-600 font-bold">
                      <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Tải tối đa 10 file bài tập PDF / Tháng</li>
                      <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Lật 3 bộ từ vựng Flashcard đầu tiên</li>
                      <li className="flex items-center gap-2 text-slate-300"><span className="text-red-400">✗</span> Không mở lớp hoạt hình Premium</li>
                      <li className="flex items-center gap-2 text-slate-300"><span className="text-red-400">✗</span> Không có trợ khí AI phân tích học lực</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => { showToast("Bé đang dùng tài khoản Basic thông thái!", "success"); playBeep(520, 100); }}
                    className="w-full py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl outline-none"
                  >
                    Bản Quyền Bé Đang Học
                  </button>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between text-white relative border-2 border-orange-500">
                  <span className="absolute top-0 right-0 bg-yellow-400 text-slate-900 font-extrabold text-[9px] px-3.5 py-1.5 uppercase rounded-bl-3xl">Lọc mua nhiều</span>
                  <div className="space-y-2">
                    <h5 className="font-brand font-bold text-base text-orange-400">Gói Hội Viên Premium VIP</h5>
                    <div className="text-2xl sm:text-3xl font-extrabold">199.000đ <span className="text-xs font-normal text-slate-450 text-indigo-200">/ Tháng</span></div>
                    <p className="text-xs text-slate-300">Khóa học đếm, tô màu, rèn chữ tinh tay, xem hoạt hình không giới hạn.</p>
                    <hr className="border-slate-800 my-4" />
                    <ul className="space-y-2.5 text-xs font-bold text-indigo-100">
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Tải KHÔNG GIỚI HẠN kho PDF giáo án</li>
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Trợ lý Hổ AI giải toán mọc ví dụ cute</li>
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Xem trọn 100+ hoạt hình tiếng Anh 4D</li>
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Giảm 15% đặt sắm đồ gỗ Montessori</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      showToast("Chúc mừng bé đã nâng cấp bản Premium VIP thần kỳ! ⭐", "points");
                      playBeep(520, 80);
                      setTimeout(() => playBeep(650, 80), 80);
                      setTimeout(() => playBeep(780, 80), 160);
                      setTimeout(() => playBeep(910, 200), 240);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-orange-400 to-amber-500 hover:scale-[1.02] text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all outline-none"
                  >
                    Kích Hoạt Tài Khoản VIP
                  </button>
                </div>
              </div>
            </div>

            {/* List products for STEM */}
            <div className="space-y-4">
              <h4 className="font-brand font-bold text-lg text-slate-805">
                📦 Kho Đồ Chơi Gỗ & Giáo Cụ Trực Quan Cho Con
              </h4>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {shopProducts.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handleOpenDetailProduct(p.id)}
                    className="bg-white border hover:border-amber-100 border-slate-100 rounded-3xl p-3 sm:p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="space-y-3">
                      {/* Emoji visual frame icon */}
                      <div className="w-full h-24 sm:h-28 bg-slate-50/70 border rounded-2.5xl flex items-center justify-center text-4.5xl sm:text-5xl select-none transition-transform group-hover:scale-105 duration-200">
                        {p.image}
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug min-h-[2.5rem]">{p.name}</h5>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                          <span className="text-yellow-450 text-amber-500">★ {p.rating}</span>
                          <span>|</span>
                          <span>{p.downloads.toLocaleString('vi-VN')} mua</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50 mt-4 flex justify-between items-center bg-white">
                      <div className="leading-none">
                        <span className="text-[10px] text-slate-400 line-through leading-none block mb-0.5">{p.oldPrice.toLocaleString('vi-VN')}đ</span>
                        <span className="text-xs sm:text-sm font-extrabold text-orange-600 leading-none">{p.price.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(p.id); }}
                        className="p-1.5 sm:p-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl transition-all shadow-xs shrink-0 inline-block focus:outline-none text-slate-950"
                      >
                        <PlusCircle size={14} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 5: GOC PHU HUYNH */}
        {activeTab === 'parentZone' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex bg-indigo-150 text-indigo-700 bg-indigo-50 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                Bảo mẫu phân tích thông thương trí tuệ tự nhiên của con
              </span>
              <h3 className="text-2.5xl font-brand font-bold text-slate-800">Cổng Phân Tích Thực Cho Bố Mẹ</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Thống kê trực quan số giờ học tập của con bằng biểu đồ, kèm lời phê thông thái của trí tuệ nhân tạo.
              </p>
            </div>

            {/* Dashboard charting layouts */}
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Graphic charts inside */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-brand font-bold text-base text-slate-800">📊 Biểu Đồ Thời Gian Luyện Học Của Bé (Phút Dạy)</h4>
                  <span className="text-[10px] bg-slate-100 font-bold px-3 py-1 rounded-full text-slate-500">Chu kỳ 7 ngày vừa vặn</span>
                </div>

                {/* Simulated Chart with SVG representation */}
                <div className="relative h-60 border-b border-l border-slate-200 flex items-end justify-between px-4 sm:px-6 pt-10 select-none">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-slate-300 text-[10px] pl-8">
                    <div className="border-b border-slate-100 w-full h-0 pt-8"></div>
                    <div className="border-b border-slate-100 w-full h-0"></div>
                    <div className="border-b border-slate-100 w-full h-0"></div>
                  </div>

                  {/* Monday */}
                  <div className="flex flex-col items-center gap-1.5 z-10 w-7 sm:w-10">
                    <div className="bg-indigo-400 w-full rounded-t-lg transition-all duration-1000" style={{ height: '90px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500">T2</span>
                  </div>
                  {/* Tue */}
                  <div className="flex flex-col items-center gap-1.5 z-10 w-7 sm:w-10">
                    <div className="bg-indigo-400 w-full rounded-t-lg transition-all duration-1000" style={{ height: '140px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500">T3</span>
                  </div>
                  {/* Wed */}
                  <div className="flex flex-col items-center gap-1.5 z-10 w-7 sm:w-10">
                    <div className="bg-indigo-400 w-full rounded-t-lg transition-all duration-1000" style={{ height: '70px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500">T4</span>
                  </div>
                  {/* Thu */}
                  <div className="flex flex-col items-center gap-1.5 z-10 w-7 sm:w-10">
                    <div className="bg-orange-400 w-full rounded-t-lg transition-all duration-1000 h-40" style={{ height: '180px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500">T5</span>
                  </div>
                  {/* Fri */}
                  <div className="flex flex-col items-center gap-1.5 z-10 w-7 sm:w-10">
                    <div className="bg-indigo-400 w-full rounded-t-lg transition-all duration-1000" style={{ height: '120px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500">T6</span>
                  </div>
                  {/* Sat */}
                  <div className="flex flex-col items-center gap-1.5 z-10 w-7 sm:w-10">
                    <div className="bg-indigo-400 w-full rounded-t-lg transition-all duration-1000" style={{ height: '150px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500">T7</span>
                  </div>
                  {/* Sun */}
                  <div className="flex flex-col items-center gap-1.5 z-10 w-7 sm:w-10">
                    <div className="bg-amber-400 w-full rounded-t-lg transition-all duration-1000" style={{ height: '210px' }}></div>
                    <span className="text-[10px] font-bold text-slate-500">CN</span>
                  </div>
                </div>
              </div>

              {/* Lời phê AI bên phải */}
              <div className="space-y-4">
                <h4 className="font-brand font-bold text-base text-slate-800">Lời phê bảo mẫu Bạn Hổ AI</h4>
                
                <div className="bg-indigo-50/70 border-indigo-100 rounded-2xl p-5 border space-y-3.5">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <BrainCircuit size={20} className="animate-pulse" />
                    <div>
                      <h5 className="font-extrabold text-xs">Mô hình phân tích thông minh</h5>
                      <p className="text-[9px] text-slate-400 leading-none mt-0.5">Thời gian cập nhật 1 giây trước</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-650 leading-relaxed font-bold">
                    Bé <span className="underline">{activeProfile?.name}</span> tỏ rõ sự hứng khởi tại chặng học <span className="text-emerald-600 font-extrabold">Từ vựng động vật</span> và <span className="text-emerald-600 font-extrabold">Flashcards phản xạ</span>. Sức bền nhận thức tăng thêm 12% so với lộ trình mầm non trung bình.
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-550">
                      <span>Mức độ hoàn thành tiếng Anh mầm non:</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching tutorials resources parents guide */}
            <div className="space-y-4">
              <h4 className="font-brand font-bold text-lg text-slate-805 flex items-center gap-1.5">
                <BookOpen size={18} className="text-indigo-600" /> Cẩm Nang Giáo Cụ Đồng Hành Cho Phụ Huynh
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { tag: "Dạy bé tại gia", title: "5 Cách biến đếm số ngón tay thành những tràng cười sảng khoái", text: "Thiết lập sơ đồ mindmap toán đan xen thăng hoa cùng các phiếu học tập in tô vẽ mỗi sáng...", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                  { tag: "Tâm lý học mầm non", title: "Khi bé nản lòng làm sai nét chữ nét vẽ thì sắm gì để kịch thưởng?", text: "Nghiên cứu sư phạm chỉ dẫn thay vì dằn hắt bé, phụ huỵnh hãy lấy mồi nhấp sao đổi quà Montessori cực mọc...", color: "bg-rose-50 text-rose-700 border-rose-100" },
                  { tag: "Kế hoạch nuôi dưỡng", title: "Thiết kế thời gian biểu học & chơi hài hoà không gò bó cho bé", text: "Trọng tâm là 15 phút rèn đi nét và 20 phút phản xạ từ vựng Flashcard tiếng Anh tối muộn...", color: "bg-emerald-50 text-emerald-700 border-emerald-100" }
                ].map((post, idx) => (
                  <div key={idx} className="bg-white border rounded-[2rem] p-5 shadow-xs border-slate-100 space-y-3">
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${post.color}`}>
                      {post.tag}
                    </span>
                    <h5 className="font-bold text-sm text-slate-800 leading-snug">{post.title}</h5>
                    <p className="text-xs text-slate-550 leading-relaxed">{post.text}</p>
                    <a href="#" className="inline-block text-[10px] font-extrabold text-indigo-600 hover:underline">
                      Đọc thêm bài luận →
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 6: ADMIN CMS */}
        {activeTab === 'adminCMS' && (
          <div className="animate-in fade-in duration-300">
            <AdminCMS 
              digitalContent={digitalContent}
              onAddContent={handleAddContent}
              onDeleteContent={handleDeleteContent}
              onUpdateContent={handleUpdateContent}
              shopProducts={shopProducts}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateProduct={handleUpdateProduct}
              playBeep={playBeep}
              showToast={showToast}
              onNavigateToRepo={() => setActiveTab('contentRepository')}
              supabaseConnected={supabaseConnected}
              milestones={milestones}
              onAddMilestone={handleAddMilestone}
              onDeleteMilestone={handleDeleteMilestone}
              onUpdateMilestone={handleUpdateMilestone}
            />
          </div>
        )}

      </main>

      {/* MODALS RENDER OVERLAYS */}
      
      {/* 1. Worksheet / PDF mock Preview */}
      <WorksheetModal 
        isOpen={isWorksheetModalOpen}
        onClose={() => setIsWorksheetModalOpen(false)}
        selectedContentId={selectedWorksheetId}
        digitalContent={digitalContent}
        playBeep={playBeep}
        showToast={(m) => showToast(m, 'success')}
      />

      {/* 2. Cart Drawer */}
      <CartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cart={cart}
        onAddQuantity={handleAddQuantity}
        onSubtractQuantity={handleSubtractQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleStartCheckout}
      />

      {/* 3. Profile Add overlays */}
      <ProfileModal 
        isOpen={isAddProfileOpen}
        onClose={() => setIsAddProfileOpen(false)}
        onAddProfile={handleAddProfile}
      />

      {/* 4. Product Details Specification card */}
      <ProductDetailModal 
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        productId={selectedProductId}
        shopProducts={shopProducts}
        onAddToCart={handleAddToCart}
        onBuyNow={(id) => {
          handleAddToCart(id);
          setIsCheckoutModalOpen(true);
        }}
        playBeep={playBeep}
      />

      {/* 5. Special Daily Marketing Promos Popup */}
      <PromoModal 
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
        onClickPromo={() => { setIsPromoOpen(false); setActiveTab('shop'); playBeep(600, 150); }}
      />

      {/* 6. Product Checkout & Payment Modal Sheet */}
      <CheckoutPaymentModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        onCompletePayment={handleCompleteCheckout}
        playBeep={playBeep}
        showToast={(m, t) => showToast(m, t === 'error' ? 'error' : 'success')}
      />

      {/* Floating Smart Tutor AI assistant Hổ */}
      <AIChatWidget playBeep={playBeep} />

      {/* Footer copyright section */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-3">
              <div 
                onClick={() => { setActiveTab('home'); playBeep(450, 100); }}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div className="w-8 h-12 rounded-[0.75rem] bg-gradient-to-b from-amber-300 via-orange-400 to-orange-500 flex items-center justify-center shadow-md p-1">
                  <MascotTigerSVG className="w-full h-full" />
                </div>
                <span className="font-brand font-bold text-base text-white">Tiger Kids - Học Liệu Cho Bé</span>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed">
                Ứng dụng web giáo trình số hóa mầm non trực quan, tích hợp trợ khí AI hướng nghiệp vàng cho thế hệ trẻ em Việt Nam từ 3 đến 9 tuổi.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="text-white font-bold">Các Phân Hệ Giáo Trình</h5>
              <ul className="space-y-1">
                <li><button onClick={() => { setActiveTab('learningPaths'); playBeep(450, 80); }} className="hover:text-white outline-none">Lộ Trình Từng Chặng Tuổi</button></li>
                <li><button onClick={() => { setActiveTab('contentRepository'); playBeep(450, 80); }} className="hover:text-white outline-none">Kho File In PDF & Flashcards</button></li>
                <li><button onClick={() => { setActiveTab('shop'); playBeep(450, 80); }} className="hover:text-white outline-none">Cửa Hàng Giáo Cụ Montessori</button></li>
                <li><button onClick={() => { setActiveTab('parentZone'); playBeep(450, 80); }} className="hover:text-white outline-none">Góc Báo Cáo Phụ Huynh</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="text-white font-bold">Liên Kết Vận Hành</h5>
              <p className="leading-relaxed">Email hỗ trợ: support@hoclieuchobe.vn<br />Điện thoại đường dây nóng: 1900 6088</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Bản Quyền Vận Hành Thuộc Dự Án Tiger Kids © 2026</p>
            </div>

          </div>

          <hr className="border-slate-800" />

          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-650 gap-2">
            <p>Thiết kế tinh tế bo tròn ấm áp, đáp ứng hoàn hảo tiêu chí giáo án mầm non.</p>
            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">Chính sách bảo mật trẻ em</span>
              <span className="hover:underline cursor-pointer">Điều khoản học liệu</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
