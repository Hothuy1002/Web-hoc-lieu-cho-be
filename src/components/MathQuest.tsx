import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Zap, HelpCircle, ArrowRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface MathQuestProps {
  activeClassKey: 'mam_non' | 'lop_1' | 'lop_2' | 'lop_3';
  onAwardPoints: (points: number) => void;
  playBeep: (freq: number, dur: number) => void;
  showToast: (msg: string, type?: 'success' | 'points' | 'error') => void;
  forcedCategory?: 'Số học' | 'Hình học' | 'Logic' | 'Quan sát';
}

interface CustomQuestion {
  id: string;
  category: 'Số học' | 'Hình học' | 'Logic' | 'Quan sát';
  subCategory: string;
  text: string;
  choices: string[];
  correctAnswer: string;
  hint: string;
  illustration: string;
}

const MATH_EXERCISES: CustomQuestion[] = [
  // --- SỐ HỌC ---
  // Subcategory: Nhận biết số (5 questions)
  {
    id: "sh_1_1",
    category: "Số học",
    subCategory: "Nhận biết số",
    text: "Số nào dưới đây biểu diễn đúng chữ số 'MƯỜI HAI'?",
    choices: ["12", "21", "102"],
    correctAnswer: "12",
    illustration: "🔟✌️",
    hint: "Số mười hai gồm một chục và hai đơn vị lẻ bé nhé!"
  },
  {
    id: "sh_1_2",
    category: "Số học",
    subCategory: "Nhận biết số",
    text: "Số đứng liền sau số chín mươi chín (99) là số nào?",
    choices: ["98", "100", "90"],
    correctAnswer: "100",
    illustration: "🚀",
    hint: "Cộng thêm 1 đơn vị vào số 99 để tìm số tròn trăm nhé!"
  },
  {
    id: "sh_1_3",
    category: "Số học",
    subCategory: "Nhận biết số",
    text: "Số nào gồm 3 chục và 5 đơn vị?",
    choices: ["35", "53", "305"],
    correctAnswer: "35",
    illustration: "🔢",
    hint: "Chữ số 3 đứng ở hàng chục, chữ số 5 đứng ở hàng đơn vị bé nhé!"
  },
  {
    id: "sh_1_4",
    category: "Số học",
    subCategory: "Nhận biết số",
    text: "Số liền trước số hai mươi (20) là số nào dưới đây?",
    choices: ["19", "21", "10"],
    correctAnswer: "19",
    illustration: "🎯",
    hint: "Hãy lấy 20 bớt đi 1 để tìm số liền trước nhé!"
  },
  {
    id: "sh_1_5",
    category: "Số học",
    subCategory: "Nhận biết số",
    text: "Số nào là số chẵn lớn nhất có một chữ số?",
    choices: ["9", "8", "6"],
    correctAnswer: "8",
    illustration: "✨",
    hint: "Các số có một chữ số là từ 0 đến 9, số chẵn lớn nhất trong đó là số 8."
  },

  // Subcategory: Đếm số lượng (5 questions)
  {
    id: "sh_2_1",
    category: "Số học",
    subCategory: "Đếm số lượng",
    text: "Đếm số lượng chú hổ ngộ nghĩnh sau: 🐯🐯🐯🐯",
    choices: ["4 con hổ", "3 con hổ", "5 con hổ"],
    correctAnswer: "4 con hổ",
    illustration: "🐯🐯🐯🐯",
    hint: "Bé đếm từng con hổ từ trái qua phải nha!"
  },
  {
    id: "sh_2_2",
    category: "Số học",
    subCategory: "Đếm số lượng",
    text: "Giúp chú Tiger đếm xem có bao nhiêu quả táo đỏ mọng: 🍎🍎🍎🍎🍎🍎",
    choices: ["5 quả táo", "6 quả táo", "7 quả táo"],
    correctAnswer: "6 quả táo",
    illustration: "🍎🍎🍎🍎🍎🍎",
    hint: "Có tổng cộng sáu quả táo chín ngon lành kìa!"
  },
  {
    id: "sh_2_3",
    category: "Số học",
    subCategory: "Đếm số lượng",
    text: "Bé hãy đếm xem có bao nhiêu ngôi sao may mắn sau đây: ⭐⭐⭐⭐⭐⭐⭐",
    choices: ["6 ngôi sao", "7 ngôi sao", "8 ngôi sao"],
    correctAnswer: "7 ngôi sao",
    illustration: "⭐⭐⭐⭐⭐⭐⭐",
    hint: "Bé thử đếm chậm rãi từng ngôi sao một từ trái qua nhé!"
  },
  {
    id: "sh_2_4",
    category: "Số học",
    subCategory: "Đếm số lượng",
    text: "Có bao nhiêu chú cá đang bơi lội dưới hồ: 🐟🐟🐟🐟🐟🐟🐟🐟🐟",
    choices: ["8 con cá", "9 con cá", "10 con cá"],
    correctAnswer: "9 con cá",
    illustration: "🐟🐟🐟🐟🐟🐟🐟🐟🐟",
    hint: "Bé đếm cẩn thận nhé, có tất cả chín chú cá đáng yêu đấy!"
  },
  {
    id: "sh_2_5",
    category: "Số học",
    subCategory: "Đếm số lượng",
    text: "Đếm số bông hoa cúc vàng rực rỡ sau: 🌼🌼🌼🌼🌼",
    choices: ["4 bông hoa", "5 bông hoa", "6 bông hoa"],
    correctAnswer: "5 bông hoa",
    illustration: "🌼🌼🌼🌼🌼",
    hint: "Có năm cánh hoa đang nở bung rực rỡ kìa bé ơi!"
  },

  // Subcategory: So sánh số (5 questions)
  {
    id: "sh_3_1",
    category: "Số học",
    subCategory: "So sánh số",
    text: "Trong hai số 45 và 54, số nào LỚN hơn?",
    choices: ["Số 45", "Số 54", "Hai số bằng nhau"],
    correctAnswer: "Số 54",
    illustration: "⚖️",
    hint: "Hãy so sánh hàng chục trước nhé: 5 chục lớn hơn 4 chục."
  },
  {
    id: "sh_3_2",
    category: "Số học",
    subCategory: "So sánh số",
    text: "Bé tìm xem phép so sánh nào dưới đây là ĐÚNG?",
    choices: ["8 < 5", "6 > 9", "7 > 3"],
    correctAnswer: "7 > 3",
    illustration: "🦊",
    hint: "Bảy chú thỏ chắc chắn đông hơn ba chú thỏ rồi!"
  },
  {
    id: "sh_3_3",
    category: "Số học",
    subCategory: "So sánh số",
    text: "Điền dấu thích hợp vào chỗ trống: 28 ... 31",
    choices: ["<", ">", "="],
    correctAnswer: "<",
    illustration: "⚖️",
    hint: "So sánh chữ số hàng chục: 2 chục ít hơn 3 chục nên 28 nhỏ hơn 31."
  },
  {
    id: "sh_3_4",
    category: "Số học",
    subCategory: "So sánh số",
    text: "Trong các số sau: 12, 75, 43, 90, số nào là số BÉ nhất?",
    choices: ["12", "43", "75"],
    correctAnswer: "12",
    illustration: "🔍",
    hint: "Số có chữ số hàng chục nhỏ nhất (1 chục) sẽ là số bé nhất!"
  },
  {
    id: "sh_3_5",
    category: "Số học",
    subCategory: "So sánh số",
    text: "Bạn Kiên có 15 cái kẹo, bạn Đạt có 12 cái kẹo. Ai có NHIỀU kẹo hơn?",
    choices: ["Bạn Kiên", "Bạn Đạt", "Cả hai bằng nhau"],
    correctAnswer: "Bạn Kiên",
    illustration: "🍬",
    hint: "15 cái kẹo nhiều hơn 12 cái kẹo rồi đúng không bé?"
  },

  // Subcategory: Quy luật số (5 questions)
  {
    id: "sh_4_1",
    category: "Số học",
    subCategory: "Quy luật số",
    text: "Điền số thích hợp vào dấu [ ? ]: 2, 4, 6, [ ? ], 10",
    choices: ["7", "8", "9"],
    correctAnswer: "8",
    illustration: "🐸",
    hint: "Dãy số chẵn tăng dần: mỗi số sau bằng số trước cộng 2 đơn vị."
  },
  {
    id: "sh_4_2",
    category: "Số học",
    subCategory: "Quy luật số",
    text: "Tìm số thích hợp điền vào dấu chấm hỏi: 10, 20, 30, [ ? ], 50",
    choices: ["35", "40", "45"],
    correctAnswer: "40",
    illustration: "🎈",
    hint: "Dãy số tròn chục tăng dần cách đều nhau 10 đơn vị nhé."
  },
  {
    id: "sh_4_3",
    category: "Số học",
    subCategory: "Quy luật số",
    text: "Tìm số thích hợp còn thiếu vào ô trống của dãy số: 1, 3, 5, [ ? ], 9",
    choices: ["6", "7", "8"],
    correctAnswer: "7",
    illustration: "🍀",
    hint: "Dãy số lẻ tăng dần liên tiếp cách nhau 2 đơn vị."
  },
  {
    id: "sh_4_4",
    category: "Số học",
    subCategory: "Quy luật số",
    text: "Khám phá quy luật và điền số tiếp theo vào dãy số: 5, 10, 15, 20, [ ? ]",
    choices: ["25", "30", "35"],
    correctAnswer: "25",
    illustration: "🌟",
    hint: "Dãy số tăng cách đều 5 đơn vị (đếm thêm 5) nha!"
  },
  {
    id: "sh_4_5",
    category: "Số học",
    subCategory: "Quy luật số",
    text: "Điền số thích hợp vào dấu chấm hỏi theo quy luật giảm dần: 9, 8, 7, [ ? ], 5",
    choices: ["4", "6", "8"],
    correctAnswer: "6",
    illustration: "📉",
    hint: "Mỗi số đứng sau nhỏ hơn số liền trước đúng 1 đơn vị."
  },

  // Subcategory: Cộng trừ tư duy (5 questions)
  {
    id: "sh_5_1",
    category: "Số học",
    subCategory: "Cộng trừ tư duy",
    text: "Bé có 4 cái kẹo 🍭, cô giáo thưởng thêm 3 cái nữa. Hỏi bé có tất cả mấy cái kẹo?",
    choices: ["6 cái", "7 cái", "8 cái"],
    correctAnswer: "7 cái",
    illustration: "🍭🍭🍭 + 🍭🍭🍭🍭",
    hint: "Bé làm phép tính cộng 4 + 3 để biết tổng số kẹo nha!"
  },
  {
    id: "sh_5_2",
    category: "Số học",
    subCategory: "Cộng trừ tư duy",
    text: "Trong vườn có 9 chú chim 🐦, sau đó 3 chú chim bay đi mất. Hỏi trong vườn còn mấy chú chim?",
    choices: ["5 chú chim", "6 chú chim", "7 chú chim"],
    correctAnswer: "6 chú chim",
    illustration: "🌳🐦🐦🐦",
    hint: "Bé lấy 9 bớt đi 3 (phép trừ 9 - 3) nha."
  },
  {
    id: "sh_5_3",
    category: "Số học",
    subCategory: "Cộng trừ tư duy",
    text: "Bé nhẩm nhanh phép tính sau nhé: 5 + 5 bằng bao nhiêu?",
    choices: ["8", "9", "10"],
    correctAnswer: "10",
    illustration: "🙌",
    hint: "Xòe hai bàn tay xinh ra, mỗi bàn tay có 5 ngón, gộp lại là mười ngón đấy!"
  },
  {
    id: "sh_5_4",
    category: "Số học",
    subCategory: "Cộng trừ tư duy",
    text: "Mẹ mua cho bé 6 quả bóng bay 🎈. Bé sơ ý làm bay mất 2 quả. Hỏi bé còn lại bao nhiêu quả bóng bay?",
    choices: ["3 quả bóng", "4 quả bóng", "5 quả bóng"],
    correctAnswer: "4 quả bóng",
    illustration: "🎈🎈🎈🎈",
    hint: "Lấy 6 quả bớt đi 2 quả bay mất nhé: 6 - 2 = ?"
  },
  {
    id: "sh_5_5",
    category: "Số học",
    subCategory: "Cộng trừ tư duy",
    text: "Đĩa có 3 quả dâu tây 🍓. Chị cho thêm 5 quả dâu tây nữa. Hỏi đĩa có tất cả bao nhiêu quả?",
    choices: ["7 quả dâu", "8 quả dâu", "9 quả dâu"],
    correctAnswer: "8 quả dâu",
    illustration: "🍓🍓🍓",
    hint: "Bé thực hiện phép tính cộng lấy 3 quả ban đầu thêm 5 quả nữa."
  },

  // --- HÌNH HỌC ---
  // Subcategory: Nhận biết hình (5 items)
  {
    id: "hh_1_1",
    category: "Hình học",
    subCategory: "Nhận biết hình",
    text: "Bánh xe ô tô 🚗 hay chiếc đĩa ăn thường có dạng hình gì?",
    choices: ["Hình tròn ⭕", "Hình vuông ⏹️", "Hình tam giác 🔺"],
    correctAnswer: "Hình tròn ⭕",
    illustration: "🚗🎪",
    hint: "Các vật dụng không góc cạnh, lăn đều được mô phỏng hình tròn."
  },
  {
    id: "hh_1_2",
    category: "Hình học",
    subCategory: "Nhận biết hình",
    text: "Mái nhà hay kim tự tháp thường mô phỏng hình học nào?",
    choices: ["Hình chữ nhật ⬜", "Hình tam giác 🔺", "Hình bình hành"],
    correctAnswer: "Hình tam giác 🔺",
    illustration: "🏠🔺",
    hint: "Hình tam giác có 3 cạnh ghép lại tạo thành các góc nhọn đỉnh chụm."
  },
  {
    id: "hh_1_3",
    category: "Hình học",
    subCategory: "Nhận biết hình",
    text: "Biển báo hiệu giao thông dừng lại (STOP) thường có hình học dạng đặc biệt nào?",
    choices: ["Hình lục giác (6 góc)", "Hình bát giác đều (8 góc)", "Hình tròn"],
    correctAnswer: "Hình bát giác đều (8 góc)",
    illustration: "🛑",
    hint: "Biển dừng lại STOP siêu đặc biệt có 8 cạnh bằng nhau cân xứng đấy!"
  },
  {
    id: "hh_1_4",
    category: "Hình học",
    subCategory: "Nhận biết hình",
    text: "Chiếc khăn quàng đỏ xinh xắn của bạn học sinh tiểu học có dạng hình học nào?",
    choices: ["Hình tam giác 🔺", "Hình tròn ⭕", "Hình chữ nhật ⬜"],
    correctAnswer: "Hình tam giác 🔺",
    illustration: "🧣",
    hint: "Khăn quàng đỏ có 3 đỉnh nhọn và 3 cạnh thẳng tắp ghép lại."
  },
  {
    id: "hh_1_5",
    category: "Hình học",
    subCategory: "Nhận biết hình",
    text: "Cây thước kẻ dẻo học sinh thường dùng có hình học phẳng là hình gì?",
    choices: ["Hình chữ nhật ⬜", "Hình vuông ⏹️", "Hình thoi 🔶"],
    correctAnswer: "Hình chữ nhật ⬜",
    illustration: "📏",
    hint: "Thước kẻ học tập có hai cạnh dài song song và hai cạnh ngắn đứng kề nha."
  },

  // Subcategory: Hình khối (5 items)
  {
    id: "hh_2_1",
    category: "Hình học",
    subCategory: "Hình khối",
    text: "Hộp quà sinh nhật 🎁 thường có dạng hình khối nào?",
    choices: ["Khối lập phương 📦", "Khối cầu 🔮", "Khối nón 🍦"],
    correctAnswer: "Khối lập phương 📦",
    illustration: "🎁🧩",
    hint: "Khối có 6 mặt đều là hình vuông bằng nhau chính là khối lập phương."
  },
  {
    id: "hh_2_2",
    category: "Hình học",
    subCategory: "Hình khối",
    text: "Lon sữa ông thọ hoặc lon nước ngọt có hình dạng khối gì?",
    choices: ["Khối cầu 🔮", "Khối nón 🍦", "Khối trụ 🥫"],
    correctAnswer: "Khối trụ 🥫",
    illustration: "🥫🥛",
    hint: "Khối trụ có mặt bên uốn và hai đáy tròn trịa vững vàng."
  },
  {
    id: "hh_2_3",
    category: "Hình học",
    subCategory: "Hình khối",
    text: "Quả bóng đá tròn xoe bé chơi ngoài sân là đại diện cho hình khối nào nhỉ?",
    choices: ["Khối cầu 🔮", "Khối trụ 🥫", "Khối lập phương 📦"],
    correctAnswer: "Khối cầu 🔮",
    illustration: "⚽",
    hint: "Tất cả các vật thể tròn trịa lăn được muôn phương đều thuộc khối cầu!"
  },
  {
    id: "hh_2_4",
    category: "Hình học",
    subCategory: "Hình khối",
    text: "Kim tự tháp Ai Cập hùng vĩ có hình dạng của khối nào dưới đây bé?",
    choices: ["Khối chóp ⛰️", "Khối lập phương 📦", "Khối trụ 🥫"],
    correctAnswer: "Khối chóp ⛰️",
    illustration: "⛰️",
    hint: "Khối có đáy là đa giác phẳng và các mặt bên chụm lại tại một đỉnh nhọn hoắt."
  },
  {
    id: "hh_2_5",
    category: "Hình học",
    subCategory: "Hình khối",
    text: "Chiếc mũ sinh nhật vui vẻ bé hay đội có hình dạng khối gì?",
    choices: ["Khối nón 🍦", "Khối cầu 🔮", "Khối trụ 🥫"],
    correctAnswer: "Khối nón 🍦",
    illustration: "🥳",
    hint: "Khối nón có đáy tròn phẳng và nhọn dần lên đỉnh chóp như chiếc nón lá vậy!"
  },

  // Subcategory: Ghép hình (5 items)
  {
    id: "hh_3_1",
    category: "Hình học",
    subCategory: "Ghép hình",
    text: "Khi ghép 2 hình tam giác vuông giống hệt nhau ở cạnh góc vuông lớn, bé được hình gì?",
    choices: ["Hình vuông / Chữ nhật 🟦", "Hình tròn ⭕", "Hình ngôi sao ⭐"],
    correctAnswer: "Hình vuông / Chữ nhật 🟦",
    illustration: "📐📐",
    hint: "Hai mảnh ghép tam giác vạt xéo ghép kề nhau sẽ khít lại thành góc vuông đối xứng."
  },
  {
    id: "hh_3_2",
    category: "Hình học",
    subCategory: "Ghép hình",
    text: "Để tạo thành một phong thư ✉️, bé ghép một mảnh hình tam giác làm nắp lên trên hình gì?",
    choices: ["Hình chữ nhật ⬜", "Hình thoi 🔶", "Hình tròn ⭕"],
    correctAnswer: "Hình chữ nhật ⬜",
    illustration: "✉️🏡",
    hint: "Bức thư phẳng có hình chữ nhật rộng dưới đáy đấy."
  },
  {
    id: "hh_3_3",
    category: "Hình học",
    subCategory: "Ghép hình",
    text: "Bé ghép hai nửa hình tròn hoàn hảo khớp khít lại với nhau sẽ thu được hình nào?",
    choices: ["Hình tròn lớn ⭕", "Hình bầu dục 🥚", "Hình tam giác 🔺"],
    correctAnswer: "Hình tròn lớn ⭕",
    illustration: "🌗🌓",
    hint: "Hai nửa vầng trăng khuyết gộp lại sẽ thành một vầng trăng tròn trịa ban rằm!"
  },
  {
    id: "hh_3_4",
    category: "Hình học",
    subCategory: "Ghép hình",
    text: "Nếu ghép 2 hình vuông bằng nhau sát cạnh kề bên, bé được hình học phẳng nào?",
    choices: ["Hình chữ nhật ⬜", "Hình tam giác 🔺", "Hình thoi 🔶"],
    correctAnswer: "Hình chữ nhật ⬜",
    illustration: "⏹️⏹️",
    hint: "Hai cạnh kề gộp lại dài gấp đôi, tạo nên chiều dài lớn hơn chiều rộng đứng kề!"
  },
  {
    id: "hh_3_5",
    category: "Hình học",
    subCategory: "Ghép hình",
    text: "Bé dùng 4 khối lập phương nhỏ bằng khít xếp thẳng hàng ngang sẽ cấu thành khối gì?",
    choices: ["Khối hộp chữ nhật 📦", "Khối trụ tròn 🥫", "Khối cầu tròn 🔮"],
    correctAnswer: "Khối hộp chữ nhật 📦",
    illustration: "🧱",
    hint: "Chiều dài của khối hộp gỗ lúc này đã dài ra vượt trội so với các cạnh vuông kia."
  },

  // Subcategory: Xoay hình (5 items)
  {
    id: "hh_4_1",
    category: "Hình học",
    subCategory: "Xoay hình",
    text: "Khi úp ngược chiếc cốc uống nước 🥛 xuống dưới bàn, phần miệng cốc sẽ hướng đi đâu?",
    choices: ["Hướng xuống dưới ⬇️", "Hướng lên trên ⬆️", "Không đổi hướng"],
    correctAnswer: "Hướng xuống dưới ⬇️",
    illustration: "🥛🔄",
    hint: "Úp ngược (quay xoay 180 độ) thì bên trên chuyển thành bên dưới."
  },
  {
    id: "hh_4_2",
    category: "Hình học",
    subCategory: "Xoay hình",
    text: "Xoay một mũi tên hướng trái ⬅️ thuận chiều kim đồng hồ góc 90 độ sẽ chỉ về đâu?",
    choices: ["Chỉ hướng lên trên ⬆️", "Chỉ hướng sang phải ➡️", "Chỉ hướng xuống dưới ⬇️"],
    correctAnswer: "Chỉ hướng lên trên ⬆️",
    illustration: "⬅️🔄",
    hint: "Mũi tên dịch từ hướng Tây (chỉ trái) quay góc vuông lên hướng Bắc (chỉ lên)."
  },
  {
    id: "hh_4_3",
    category: "Hình học",
    subCategory: "Xoay hình",
    text: "Xoay một chiếc điện thoại 📱 đang dựng đứng nằm ngang sang phải thì nút nguồn ở cạnh trên sẽ chỉ về hướng nào?",
    choices: ["Chỉ sang hướng phải ➡️", "Chỉ sang hướng trái ⬅️", "Vẫn hướng lên trên ⬆️"],
    correctAnswer: "Chỉ sang hướng phải ➡️",
    illustration: "📱🔄",
    hint: "Xoay dọc sang ngang theo chiều kim đồng hồ thì phần đỉnh sẽ đổi hướng sang bên phải."
  },
  {
    id: "hh_4_4",
    category: "Hình học",
    subCategory: "Xoay hình",
    text: "Khi bé lật ngược chữ 'M' viết hoa qua một trục nằm ngang dưới chân, bé thu được chữ cái nào?",
    choices: ["Chữ W 👐", "Chữ N 🧭", "Chữ H 🪜"],
    correctAnswer: "Chữ W 👐",
    illustration: "Ⓜ️🔄",
    hint: "Úp ngược chữ M sẽ biến đỉnh hướng lên thành đỉnh hướng xuống như chữ W đấy."
  },
  {
    id: "hh_4_5",
    category: "Hình học",
    subCategory: "Xoay hình",
    text: "Xoay một kim đồng hồ đang chỉ hướng số 12 đúng nửa vòng tròn (180 độ) thì kim sẽ chỉ số mấy?",
    choices: ["Số 6 🕕", "Số 3 🕒", "Số 9 🕘"],
    correctAnswer: "Số 6 🕕",
    illustration: "🕛🔄",
    hint: "Nửa vòng tròn bằng góc bẹt đối diện tắp lự, từ trên đỉnh chỉ thẳng xuống gấu đáy."
  },

  // Subcategory: Tìm hình còn thiếu (5 items)
  {
    id: "hh_5_1",
    category: "Hình học",
    subCategory: "Tìm hình còn thiếu",
    text: "Dãy lặp: 🔹 🔴 🔹 🔴 [ ? ] . Hình tiếp theo điền vào dấu chấm hỏi là gì?",
    choices: ["Hình thoi xanh 🔹", "Hình tròn đỏ 🔴", "Hình vuông vàng 🟡"],
    correctAnswer: "Hình thoi xanh 🔹",
    illustration: "🔹🔴🔹🔴❓",
    hint: "Quy luật lặp lại xen kẽ liên tục: thoi xanh rồi đến tròn đỏ."
  },
  {
    id: "hh_5_2",
    category: "Hình học",
    subCategory: "Tìm hình còn thiếu",
    text: "Hình nào thích hợp: 🔺 ⏹️ 🔺 ⏹️ [ ? ]",
    choices: ["Hình tam giác 🔺", "Hình vuông ⏹️", "Hình lục giác 🟩"],
    correctAnswer: "Hình tam giác 🔺",
    illustration: "🔺⏹️🔺⏹️❓",
    hint: "Tiếp tục chu kỳ lặp: xen kẽ giữa một tam giác đỏ và một vuông đen."
  },
  {
    id: "hh_5_3",
    category: "Hình học",
    subCategory: "Tìm hình còn thiếu",
    text: "Quy luật lặp kép: ⭐️ ⭐️ 🍀 ⭐️ ⭐️ 🍀 [ ? ] . Thích hợp điền vào dấu hỏi kế tiếp là gì?",
    choices: ["Ngôi sao vàng ⭐️", "Lá cỏ xanh 🍀", "Bông hoa đỏ 🌸"],
    correctAnswer: "Ngôi sao vàng ⭐️",
    illustration: "⭐️⭐️🍀⭐️⭐️❓",
    hint: "Quy luật: Cứ hai ngôi sao vàng rồi mới đến một chiếc lá cỏ xanh."
  },
  {
    id: "hh_5_4",
    category: "Hình học",
    subCategory: "Tìm hình còn thiếu",
    text: "Dãy hình học tăng dần kích thước: ◽ ⬜ [ ? ] . Hình tiếp theo mọc to rộng nhất là hình nào?",
    choices: ["Hình vuông cực đại ⬛", "Hình chấm tí hon ▪️", "Hình tròn nhỏ 🔵"],
    correctAnswer: "Hình vuông cực đại ⬛",
    illustration: "◽⬜❓",
    hint: "Tăng dần cấp độ kích cỡ của cùng một dáng vuông đều tăm tắp nè."
  },
  {
    id: "hh_5_5",
    category: "Hình học",
    subCategory: "Tìm hình còn thiếu",
    text: "Quy luật màu xen kẽ: 🔴 🔵 🟡 🔴 🔵 [ ? ] . Màu tiếp theo sau sắc màu xanh là màu nào nhỉ?",
    choices: ["Tròn màu vàng 🟡", "Tròn màu đỏ 🔴", "Tròn màu xanh 🔵"],
    correctAnswer: "Tròn màu vàng 🟡",
    illustration: "🔴🔵🟡🔴🔵❓",
    hint: "Chu kỳ lặp ba màu liên hoàn: Đỏ rồi đến Xanh, nối tiếp là Vàng rực rỡ."
  },

  // --- LOGIC ---
  // Subcategory: Quy luật (6 items)
  {
    id: "lg_1_1",
    category: "Logic",
    subCategory: "Quy luật",
    text: "Quy luật thời gian: Buổi sáng thức dậy đi học, Buổi trưa ăn cơm dã ngoại, Buổi tối bé...",
    choices: ["Đi ngủ lấy sức khỏe 😴", "Đi tắm mát ở biển 🌊", "Học bơi ở hồ sâu 🏊"],
    correctAnswer: "Đi ngủ lấy sức khỏe 😴",
    illustration: "☀️⛅🌙",
    hint: "Sau một ngày hoạt động đầy năng lượng, đêm tối là lúc bé phục hồi trí tuệ."
  },
  {
    id: "lg_1_2",
    category: "Logic",
    subCategory: "Quy luật",
    text: "Tìm mùa còn thiếu của đất trời: Xuân - Hạ - Thu - [ ? ]",
    choices: ["Mùa mưa lũ", "Mùa Đông lạnh ❄️", "Mùa sương mù"],
    correctAnswer: "Mùa Đông lạnh ❄️",
    illustration: "🌸☀️🍁❄️",
    hint: "Một chu kỳ năm có bốn mùa tuyệt diệu: khởi sắc từ xuân ấm và khép lại ở đông lạnh."
  },
  {
    id: "lg_1_3",
    category: "Logic",
    subCategory: "Quy luật",
    text: "Chu kỳ sinh trưởng: Trứng nở thành Sâu bướm, Sâu bướm cuộn Nhộng, Nhộng hóa thân thành...",
    choices: ["Chú bướm xinh 🦋", "Cá vàng bơi 🐟", "Chim đại bàng 🦅"],
    correctAnswer: "Chú bướm xinh 🦋",
    illustration: "🥚🐛🦋",
    hint: "Con bươm bướm rực rỡ sắc màu được sinh ra sau giấc ngủ nén ấm trong kén nhộng."
  },
  {
    id: "lg_1_4",
    category: "Logic",
    subCategory: "Quy luật",
    text: "Một tuần lễ học tập của bé bắt đầu từ Thứ Hai đầy hứng khởi và khép lại trọn vẹn bởi ngày vui nào?",
    choices: ["Chủ Nhật nghỉ ngơi ☀️", "Thứ Bảy vui nhộn 🎈", "Thứ Sáu ăn bánh 🍪"],
    correctAnswer: "Chủ Nhật nghỉ ngơi ☀️",
    illustration: "📅",
    hint: "Ngày cuối tuần gia đình sum vầy chuẩn bị cho tuần mới chính là Chủ Nhật yêu mến."
  },
  {
    id: "lg_1_5",
    category: "Logic",
    subCategory: "Quy luật",
    text: "Quy luật thiên nhiên: Mây đen xám mù mịt kéo về tụ hội, sấm chớp gầm vang, sau đó ngoài trời sẽ có...",
    choices: ["Mưa rào xối xả 🌧️", "Nắng vàng chói chang ☀️", "Tuyết rơi trắng xóa ❄️"],
    correctAnswer: "Mưa rào xối xả 🌧️",
    illustration: "⛈️❓",
    hint: "Hiện tượng thiên nhiên mây tụ ẩm nặng nề rơi xuống tạo mưa tắm mát ruộng đồng."
  },
  {
    id: "lg_1_6",
    category: "Logic",
    subCategory: "Quy luật",
    text: "Thứ tự buổi ăn cơm ngoan: Súc miệng rửa tay sạch, bê bát mời người lớn ăn, tiếp theo bé sẽ...",
    choices: ["Nhai chậm nhai kỹ ăn gọn gàng 🥄", "Chạy nghịch lăn lộn khắp sàn nhà 🏃", "Hét to tranh giành điện thoại 📱"],
    correctAnswer: "Nhai chậm nhai kỹ ăn gọn gàng 🥄",
    illustration: "🥣🥄🧒",
    hint: "Nhai chậm nhai kỹ giúp bảo vệ dạ dày và rèn luyện phép lịch sự trên bàn ăn dặm."
  },

  // Subcategory: Phân loại (6 items)
  {
    id: "lg_2_1",
    category: "Logic",
    subCategory: "Phân loại",
    text: "Hãy tìm vật KHÔNG thuộc cùng nhóm dụng cụ học sinh học tập với các đồ còn lại?",
    choices: ["Hộp bút chì ✏️", "Quả chuối chín 🍌", "Cây thước kẻ 📏"],
    correctAnswer: "Quả chuối chín 🍌",
    illustration: "✏️🍌📏",
    hint: "Hộp bút và thước là đồ dùng hỗ trợ học chữ; quả chuối là trái cây tráng miệng thơm ngọt bổ trí não."
  },
  {
    id: "lg_2_2",
    category: "Logic",
    subCategory: "Phân loại",
    text: "Động vật dã ngoại nào dưới đây KHÔNG sống ở môi trường đáy biển bao la?",
    choices: ["Chú hổ vằn oai dũng 🐯", "Cá nhà táng khổng lồ 🐋", "Tôm càng bơi lội 🦐"],
    correctAnswer: "Chú hổ vằn oai dũng 🐯",
    illustration: "🐯🐋🦐",
    hint: "Chú hổ dũng mãnh là chúa sơn lâm canh giữ cánh rừng già đại ngàn trên cạn khô ráo."
  },
  {
    id: "lg_2_3",
    category: "Logic",
    subCategory: "Phân loại",
    text: "Tìm một bông hoa khoe sắc rực rỡ duy nhất trong số các quả ngọt dưới đây nhé?",
    choices: ["Hoa cúc vàng óng 🌼", "Quả xoài ngọt lịm 🥭", "Quả dưa hấu mát lành 🍉"],
    correctAnswer: "Hoa cúc vàng óng 🌼",
    illustration: "🌼🥭🍉",
    hint: "Xoài và dưa hấu là thực quả mọng nước; duy nhất có đóa hoa cúc mang sắc hương bừng sáng."
  },
  {
    id: "lg_2_4",
    category: "Logic",
    subCategory: "Phân loại",
    text: "Xe nào dưới đây thuộc nhóm phương tiện giao thông vận tải đường bộ bon bon chạy?",
    choices: ["Xe cứu hỏa đỏ rực 🚒", "Thuyền buồm căng gió ⛵", "Máy bay phản lực bay bay 🚁"],
    correctAnswer: "Xe cứu hỏa đỏ rực 🚒",
    illustration: "🚒⛵🚁",
    hint: "Xe cứu hỏa đỏ lừ chạy bằng bánh hơi lướt trên đường phố còi kêu cứu hỏa vang lừng."
  },
  {
    id: "lg_2_5",
    category: "Logic",
    subCategory: "Phân loại",
    text: "Vật dụng gia dụng nào KHÔNG thuộc nhóm đồ dùng tỏa hơi mát lạnh mùa hè?",
    choices: ["Bếp ga bếp củi tạo nhiệt ♨️", "Máy điều hòa làn gió ❄️", "Tủ lạnh trữ hoa quả kem 🍦"],
    correctAnswer: "Bếp ga bếp củi tạo nhiệt ♨️",
    illustration: "🔥❄️🧊",
    hint: "Điều hòa và tủ lạnh tạo nhiệt độ mát mẻ; còn bếp ga khai hỏa lửa nóng rực chín dẻo cơm."
  },
  {
    id: "lg_2_6",
    category: "Logic",
    subCategory: "Phân loại",
    text: "Dụng cụ thể dục nào dùng chuyên biệt chơi môn vua thể thao túc cầu tranh bóng?",
    choices: ["Quả bóng da tròn sọc ⚽", "Chiếc vợt gỗ đánh cầu 🏸", "Bóng bàn nhỏ nhẹ màu cam 🏓"],
    correctAnswer: "Quả bóng da tròn sọc ⚽",
    illustration: "⚽🏸🏓",
    hint: "Túc cầu bắt buộc hai đội sút quả bóng tròn to vượt qua thủ môn tiến vào gôn."
  },

  // Subcategory: Tìm điểm khác nhau (6 items)
  {
    id: "lg_3_1",
    category: "Logic",
    subCategory: "Tìm điểm khác nhau",
    text: "Bé quan sát nhóm con vật sau: 🐧 🐧 🐔 🐧. Con nào khác biệt nhất?",
    choices: ["Chú gà con 🐔", "Chú chim cánh cụt 🐧", "Không con nào khác"],
    correctAnswer: "Chú gà con 🐔",
    illustration: "🐧🐧🐔🐧",
    hint: "Trong nhóm chim cánh cụt lội tuyết Nam Cực bỗng xuất hiện một chú gà con lông vàng mượt."
  },
  {
    id: "lg_3_2",
    category: "Logic",
    subCategory: "Tìm điểm khác nhau",
    text: "Tìm icon có biểu hiện cảm xúc trái ngược khác biệt nhất trong nhóm sau đây:",
    choices: ["Vui vẻ 😄", "Hào hứng 😁", "Mếu khóc 😢"],
    correctAnswer: "Mếu khóc 😢",
    illustration: "😄😁😢",
    hint: "Các bạn icon kia đều cười hớn hở, duy nhất một bạn đang rưng rức nước mắt buồn."
  },
  {
    id: "lg_3_3",
    category: "Logic",
    subCategory: "Tìm điểm khác nhau",
    text: "Bé tìm xem đồ dùng nào KHÔNG thuộc nhóm vật dụng bàn ăn cơm uống nước: 🥣 🍽️ 🛏️ ?",
    choices: ["Chiếc giường ngủ ấm 🛏️", "Chiếc bát ăn soup 🥣", "Chiếc đĩa đựng thức ăn 🍽️"],
    correctAnswer: "Chiếc giường ngủ ấm 🛏️",
    illustration: "🥣🍽️🛏️",
    hint: "Chiếc giường êm giúp bé say giấc nồng ấm áp tại phòng ngủ riêng tư."
  },
  {
    id: "lg_3_4",
    category: "Logic",
    subCategory: "Tìm điểm khác nhau",
    text: "Trong dàn âm thanh còi báo nguy hại gấp, phương tiện thô sơ nào KHÔNG hề nhấp nháy đèn còi hụ?",
    choices: ["Xe đạp nhỏ xíu 🚲", "Xe cứu thương vượt tốc 🚑", "Xe cảnh sát rít còi 🚓"],
    correctAnswer: "Xe đạp nhỏ xíu 🚲",
    illustration: "🚲🚑🚓",
    hint: "Cứu thương và cảnh sát bắt buộc trang bị đèn còi cực đại; xe đạp chỉ khua tiếng chuông kính coong thỏ thẻ."
  },
  {
    id: "lg_3_5",
    category: "Logic",
    subCategory: "Tìm điểm khác nhau",
    text: "Tìm loài vật bốn chân chạy dưới đất oai vệ, KHÔNG biết bay lượn lội mây: 🦅 🦉 🦁 🦆 ?",
    choices: ["Chú sư tử dũng mãnh 🦁", "Chim cú mèo tinh oai 🦉", "Chim đại bàng uy nghi 🦅"],
    correctAnswer: "Chú sư tử dũng mãnh 🦁",
    illustration: "🦅🦉🦁🦆",
    hint: "Bầy chim sải cánh lượn cao đón gió khát khao; chúa sơn lâm sư tử chỉ rong đuổi thảo nguyên oai vệ."
  },
  {
    id: "lg_3_6",
    category: "Logic",
    subCategory: "Tìm điểm khác nhau",
    text: "Trái cây nào KHÔNG bao giờ mang mùi vị chua khi chín rực đậm mật ngào ngạt?",
    choices: ["Quả hồng đỏ bùi ngọt 🍊", "Quả chanh vỏ xanh nhiều nước 🍋", "Quả khế xanh chua lè góc cạnh 🌟"],
    correctAnswer: "Quả hồng đỏ bùi ngọt 🍊",
    illustration: "🍊🍋🌟",
    hint: "Hạt hồng dẻo thơm, khi chín có vị ngọt thanh béo bùi, không hề gắt chua tê lưỡi."
  },

  // Subcategory: Suy luận (6 items)
  {
    id: "lg_4_1",
    category: "Logic",
    subCategory: "Suy luận",
    text: "Bố cao hơn mẹ, mẹ cao hơn bé. Hỏi ai là người cao nhất gia đình?",
    choices: ["Mẹ yêu thương", "Bố oai phong", "Bé ngoan ngoãn"],
    correctAnswer: "Bố oai phong",
    illustration: "👨‍👩‍👦",
    hint: "Mẹ đã cao hơn bé rồi, mà bố còn cao vượt hơn cả mẹ nữa."
  },
  {
    id: "lg_4_2",
    category: "Logic",
    subCategory: "Suy luận",
    text: "Gốc cây có 3 chú thỏ đang gặm cỏ. 1 chú chạy đi tìm mẹ. Gốc cây còn lại mấy chú thỏ?",
    choices: ["Còn 1 chú thỏ", "Còn 2 chú thỏ", "Còn 3 chú thỏ"],
    correctAnswer: "Còn 2 chú thỏ",
    illustration: "🐇🐇🐇",
    hint: "Phép suy luận logic đơn giản: lấy 3 bớt đi 1 chú thỏ chạy đi."
  },
  {
    id: "lg_4_3",
    category: "Logic",
    subCategory: "Suy luận",
    text: "Tập truyện cổ tích nặng cân hơn vở vẽ, vở vẽ nặng hơn bút chì thon. Đồ vật nào cấu thành sức nặng bé bỏng nhẹ nhàng nhất?",
    choices: ["Cây bút chì gọt thon ✏️", "Bìa sách truyện tranh dày 📚", "Quyển vở vẽ phong cảnh 📖"],
    correctAnswer: "Cây bút chì gọt thon ✏️",
    illustration: "📚📖✏️",
    hint: "Vở nhẹ hơn sách cứng, chiếc bút chì mộc mạc lại nhẹ hơn cả cuốn vở mỏng bé con."
  },
  {
    id: "lg_4_4",
    category: "Logic",
    subCategory: "Suy luận",
    text: "Hôm nay là Thứ Ba dạo phố ăn kem. Ngược thời gian lùi trước đó đúng 2 ngày là thứ mấy an lành quây quần?",
    choices: ["Chủ Nhật thanh bình ☀️", "Thứ Hai đầu tuần 📅", "Thứ Bảy năng động 🎈"],
    correctAnswer: "Chủ Nhật thanh bình ☀️",
    illustration: "📅⏮️",
    hint: "Lùi một ngày ngược về Thứ Hai thanh thản, lui một bước nữa gặp ngay ngày nghỉ lễ vui ca."
  },
  {
    id: "lg_4_5",
    category: "Logic",
    subCategory: "Suy luận",
    text: "Dàn hót ca có 4 chú chim sơn ca đang ca hát. Mèo xám dọa gầm gừ làm bay biến đi mất 2 chú. Hỏi còn lại bao nhiêu chú bám giàn say giọng ca?",
    choices: ["Còn 2 chú líu lo 🐦", "Còn 3 chú chim 🐦", "Không còn chú nào nín khe"],
    correctAnswer: "Còn 2 chú líu lo 🐦",
    illustration: "🐦🐦🐦🐦🐈",
    hint: "Phép toán suy luận rành mạch: 4 giọng hót rớt đi mất 2 thanh âm tung vút."
  },
  {
    id: "lg_4_6",
    category: "Logic",
    subCategory: "Suy luận",
    text: "Nửa ngày chiếc cano nước lướt sóng chở được 5 ki-lô-mét đường sông. Trọn vẹn nguyên ngày đêm không nghỉ, cano lướt sóng thẳng tiến được bao xa cự ly?",
    choices: ["10 ki-lô-mét 🏁", "8 ki-lô-mét 🏁", "15 ki-lô-mét 🏁"],
    correctAnswer: "10 ki-lô-mét 🏁",
    illustration: "🚢⚓",
    hint: "Một ngày tắp lự có hai nửa ngày. Bé cộng hai lần chặng lướt hăng say nhé."
  },

  // --- QUAN SÁT ---
  // Subcategory: Ghi nhớ (6 items)
  {
    id: "qs_1_1",
    category: "Quan sát",
    subCategory: "Ghi nhớ",
    text: "Quan sát nhanh rồi nhớ: 🚗 🦁 🍎 (Xe hơi - Sư tử - Quả táo). Vật ở vị trí số 2 là gì?",
    choices: ["Xe ô tô 🚗", "Con sư tử 🦁", "Quả táo 🍎"],
    correctAnswer: "Con sư tử 🦁",
    illustration: "🚗🦁🍎 🤔",
    hint: "Con vật dũng mãnh gầm vang đứng ở giữa ô tô và quả táo đỏ."
  },
  {
    id: "qs_1_2",
    category: "Quan sát",
    subCategory: "Ghi nhớ",
    text: "Thứ tự màu từ TRÊN xuống DƯỚI của cột đèn giao thông chuẩn là:",
    choices: ["Đỏ - Vàng - Xanh", "Xanh - Đỏ - Vàng", "Vàng - Đỏ - Xanh"],
    correctAnswer: "Đỏ - Vàng - Xanh",
    illustration: "🚦🚦",
    hint: "Đèn đỏ trên đỉnh báo dừng gấp, vàng báo chuẩn bị và xanh dưới cùng báo được đi."
  },
  {
    id: "qs_1_3",
    category: "Quan sát",
    subCategory: "Ghi nhớ",
    text: "Ghi nhớ thần tốc dãy súp ngọt béo sau: 🍦 (Kem) - 🍭 (Kẹo mút) - 🍉 (Dưa hấu) - 🍩 (Donut). Đồ ngọt tọa lạc ở vị trí số 3 là gì?",
    choices: ["Quả dưa hấu nhiều nước 🍉", "Cây kẹo que sọc đỏ 🍭", "Chiếc kem béo mát lạnh 🍦"],
    correctAnswer: "Quả dưa hấu nhiều nước 🍉",
    illustration: "🍦🍭🍉🍩 🤔",
    hint: "Cận kề sắc đỏ của kẹo que ngọt chính là lát dưa hấu mộng đỏ thanh tao xắt hình tam giác."
  },
  {
    id: "qs_1_4",
    category: "Quan sát",
    subCategory: "Ghi nhớ",
    text: "Thứ tự xếp hàng điểm danh: 🐶 Cún con - 🐱 Mèo con - 🐰 Thỏ trắng. Bạn măng non mang vị trí thủ lĩnh trước tiên là ai?",
    choices: ["Bạn cún con tinh nghịch 🐶", "Bạn mèo xám sọc tai 🐱", "Bạn thỏ bông tai dài 🐰"],
    correctAnswer: "Bạn cún con tinh nghịch 🐶",
    illustration: "🐶🐱🐰 🤔",
    hint: "Anh bạn vẫy đuôi rối rít mừng rỡ đón bé đi học về xếp đầu tiên."
  },
  {
    id: "qs_1_5",
    category: "Quan sát",
    subCategory: "Ghi nhớ",
    text: "Quan sát nhanh bức họa nhỏ: 🍎 🔑 🎈 ⚽ (Táo - Khóa - Bóng bay - Bóng đá). Đồ vật đứng nối tiếp liền kề ngay sau chiếc chìa khóa đồng?",
    choices: ["Quả bóng bay thắt nơ 🎈", "Trái táo chín tía ngọt 🍎", "Bóng thi đấu thể thao ⚽"],
    correctAnswer: "Quả bóng bay thắt nơ 🎈",
    illustration: "🍎🔑🎈⚽ 🤔",
    hint: "Chiếc khóa chiếm sảnh số 2, vật kề cận phía tay hữu chính là quả bóng khí bay cao tít."
  },
  {
    id: "qs_1_6",
    category: "Quan sát",
    subCategory: "Ghi nhớ",
    text: "Ghi nhớ sắc áo bạn bè: Hoa diện áo hồng sen, Lan diện áo xanh dương, Mai diện áo vàng nơm. Bạn hiền nào vận chiếc áo mang màu nắng nồng?",
    choices: ["Bạn Mai dịu dàng 💛", "Bạn Hoa lộng lẫy 💖", "Bạn Lan tinh anh 💙"],
    correctAnswer: "Bạn Mai dịu dàng 💛",
    illustration: "🌸👗👒 🤔",
    hint: "Nhẩm thầm tên cùng màu sắc yêu thích: Mai gắn liền with sắc hoa mai xuân vàng ươm tắm nắng."
  },

  // Subcategory: Mê cung (6 items)
  {
    id: "qs_2_1",
    category: "Quan sát",
    subCategory: "Mê cung",
    text: "Bạn Ong vàng 🐝 muốn bay về tổ ngọt. Đi đường nào là an toàn tránh nguy hiểm?",
    choices: ["Đường thưa sạch không có tơ của nhện 🕸️", "Bay xuyên đá tảng cứng", "Đâm thẳng vào bụi gai nhọn"],
    correctAnswer: "Đường thưa sạch không có tơ của nhện 🕸️",
    illustration: "🐝🕸️🏡",
    hint: "Tơ nhện giăng mắc rình rập bắt mồi, bé nhớ chỉ lối cho ong tránh tơ nhện nhé."
  },
  {
    id: "qs_2_2",
    category: "Quan sát",
    subCategory: "Mê cung",
    text: "Bác nông dân dắt trâu 🐂 qua đồng ruộng hẹp. Đường thông suốt là hướng có chứa gì?",
    choices: ["Bờ cỏ xanh mướt trải dài 🌾", "Bờ đá tảng chặn lối", "Vực thung lũng sâu"],
    correctAnswer: "Bờ cỏ xanh mướt trải dài 🌾",
    illustration: "🐂🌾🏡",
    hint: "Trâu kéo cày luôn thèm cỏ ngọt và đi dọc bờ ranh đồng màu mỡ."
  },
  {
    id: "qs_2_3",
    category: "Quan sát",
    subCategory: "Mê cung",
    text: "Khỉ nâu lanh tay 🐒 đói bụng thèm trèo chuối chín hái quả ăn no. Đi lối dốc khe nào thông thoáng?",
    choices: ["Lối đi sạch không có bóng sư tử bờm khét 🦁", "Xông thẳng dốc đá mỏ vẹt dựng đứng", "Chui gốc rào đầy dây mây kẽm sét rỉ"],
    correctAnswer: "Lối đi sạch không có bóng sư tử bờm khét 🦁",
    illustration: "🐒🦁🍌",
    hint: "Tuyệt đối không đùa dốc gai hay chúa hoang dã hung hăng kẻo thương người khỉ con nhe."
  },
  {
    id: "qs_2_4",
    category: "Quan sát",
    subCategory: "Mê cung",
    text: "Thỏ trắng mịn 🐰 tìm về củ cà rốt giòn ngọt vùi sâu mê lộ. Đường chuẩn sáng được đánh dấu bằng mốc gì bảo an?",
    choices: ["Bông hoa hướng dương xoe vàng tươi 🌻", "Vực sụt thẳm cát chôn chân sụt lở", "Những bụi xương rồng tua tủa gai nhọn hoắc"],
    correctAnswer: "Bông hoa hướng dương xoe vàng tươi 🌻",
    illustration: "🐰🌻🥕",
    hint: "Dõi theo linh quang đóa hoa quỳnh tạ thái dương rạng ngời dẫn lối qua ngách hẹp tối mịt."
  },
  {
    id: "qs_2_5",
    category: "Quan sát",
    subCategory: "Mê cung",
    text: "Kiến quốc thù lao 🐜 cõng hạt gạo nếp ngào ngạt hương thơm về hang ẩm. Đường bò an nhàn, khô ráo không sợ sương ướt át?",
    choices: ["Bò men theo thớ gỗ bào nhẵn nhụi 🪵", "Leo mỏm đá rêu phong rỉ nước trơn ngã", "Chèo chống vượt vũng nước trũng loang dầu"],
    correctAnswer: "Bò men theo thớ gỗ bào nhẵn nhụi 🪵",
    illustration: "🐜🪵🏠",
    hint: "Bám chân móng nhỏ sọc vân sớ gỗ mộc mạc, kiến di chuyển nhẹ hẫng kéo dài dẻo dai."
  },
  {
    id: "qs_2_6",
    category: "Quan sát",
    subCategory: "Mê cung",
    text: "Xe cứu hỏa đỏ rực 🚒 khẩn thiết dập tắt đám cháy gia đình. Để tránh bị kẹt xe bốc khói mệt nhoài, tài xế bản lĩnh chọn tuyến oai hùng nào?",
    choices: ["Đường vành đai mênh mang trống trải 🛣️", "Khu chợ họp dân bán rổ hải sản đông đúc", "Hẻm nhỏ cụt khóa then cổng xích sắt vững khóa"],
    correctAnswer: "Đường vành đai mênh mang trống trải 🛣️",
    illustration: "🚒🛣️🔥",
    hint: "Quan lộ rộng mở không chướng ngại, phóng hết chân ga dồi dào vòi phun nước chữa cháy khẩn trương."
  },

  // Subcategory: Tìm đồ vật (6 items)
  {
    id: "qs_3_1",
    category: "Quan sát",
    subCategory: "Tìm đồ vật",
    text: "Trong balo mỹ thuật, dụng cụ nào giúp bé sửa tẩy xóa khi vẽ nhầm bút chì?",
    choices: ["Cục gôm tẩy 🧽", "Cây thước nhôm 📏", "Dao cắt giấy ✂️"],
    correctAnswer: "Cục gôm tẩy 🧽",
    illustration: "✏️🧽📏✂️",
    hint: "Hãy xoa nhẹ chiếc gôm tẩy dẻo dai lên mặt giấy nhem nhuốc nhé."
  },
  {
    id: "qs_3_2",
    category: "Quan sát",
    subCategory: "Tìm đồ vật",
    text: "Trong căn phòng xinh của bé, đồ vật nào kêu 'Reng Reng' giục bé thức dậy mỗi sáng?",
    choices: ["Chiếc giường 🛏️", "Đồng hồ báo thức ⏰", "Bàn học gỗ 🪑"],
    correctAnswer: "Đồng hồ báo thức ⏰",
    illustration: "🛏️⏰🪑",
    hint: "Chiếc đồng hồ tròn nhỏ có hai tai báo reo inh ỏi đầu giường."
  },
  {
    id: "qs_3_3",
    category: "Quan sát",
    subCategory: "Tìm đồ vật",
    text: "Khi gia đình nghỉ mát vùng vịnh xanh cát trắng 🏖️, vật hộ mạng giữ làn da non mềm khỏi bị bỏng ráp, sạm đen cháy nắng là gì?",
    choices: ["Tuýp kem chống nắng bé con 🧴", "Đôi kính mát râm sẫm màu 🕶️", "Chiếc xô nhựa xúc cát màu vàng 🪣"],
    correctAnswer: "Tuýp kem chống nắng bé con 🧴",
    illustration: "🏖️🧴🕶️",
    hint: "Lớp kem mịn màng cản phá toàn vẹn hắc sắc tố và tia tử ngoại thiêu rát da."
  },
  {
    id: "qs_3_4",
    category: "Quan sát",
    subCategory: "Tìm đồ vật",
    text: "Nằm trang hoàng sập gụ phòng khách, đồ vật chứa nước ấm nghi ngút trà đậm thơm bốc khói nhẹ?",
    choices: ["Bộ ấm chén sứ tinh xảo 🫖", "Cổ bình hoa hồng gốm nung 🏺", "Đĩa tháp đựng hạt dưa củ quả 🍬"],
    correctAnswer: "Bộ ấm chén sứ tinh xảo 🫖",
    illustration: "🫖🏺🍬",
    hint: "Ấm gốm nung giữ nhiệt lưu giữ tinh chất trà búp xanh đậm ấm đượm đãi người phương xa."
  },
  {
    id: "qs_3_5",
    category: "Quan sát",
    subCategory: "Tìm đồ vật",
    text: "Tọa lạc tủ thuốc học đường mẫu mực, dụng cụ nhấp nháy số hiển thị nhanh vạch số đo nhiệt độ trán bé?",
    choices: ["Nhiệt kế điện tử hồng ngoại 🌡️", "Miếng dán vết khâu băng dính 🩹", "Tai phone nghe tim nhịp phổi 🩺"],
    correctAnswer: "Nhiệt kế điện tử hồng ngoại 🌡️",
    illustration: "🌡️🩹🩺",
    hint: "Mộc bắn trán tít một tiếng gọn gàng, hiển thị ngay độ ẩm mức sốt để cô kịp lau trán ấm."
  },
  {
    id: "qs_3_6",
    category: "Quan sát",
    subCategory: "Tìm đồ vật",
    text: "Học bài buổi tối mịt mù, thiết bị dẻo cổ bẻ gập hướng, rọi vùng sáng tập trung êm dịu bảo vệ mắt không mỏi rã?",
    choices: ["Đèn bàn học rọi sáng 💡", "Bóng đèn măng-sông gắn gác 🏮", "Cây nến hồng rỏ giọt sáp 🕯️"],
    correctAnswer: "Đèn bàn học rọi sáng 💡",
    illustration: "💡📚🎨",
    hint: "Phát ra dải ánh sáng liên tục dịu mát, gom sáng hỗ trợ bé tập đọc tập vẽ chuẩn oai phong."
  },

  // Subcategory: Phản xạ nhanh (6 items)
  {
    id: "qs_4_1",
    category: "Quan sát",
    subCategory: "Phản xạ nhanh",
    text: "Khi có tiếng chuông cổng reo vang 🔔 nhưng bố mẹ vắng nhà, bé xử lý thế nào?",
    choices: ["Hỏi vọng to hỏi rõ danh tính người gõ 🙋", "Mở bung cổng rước đón ngay kẻo chậm", "Trốn biệt không thưa gửi"],
    correctAnswer: "Hỏi vọng to hỏi rõ danh tính người gõ 🙋",
    illustration: "🔔🚪🙋",
    hint: "Phản xạ thông minh phòng vệ, hỏi rõ thân bằng quyến thuộc rồi mới quyết định con nhe."
  },
  {
    id: "qs_4_2",
    category: "Quan sát",
    subCategory: "Phản xạ nhanh",
    text: "Con chó dữ đang sủa gầm gừ xa xa 🐕. Bé nên làm gì an toàn dưỡng thân?",
    choices: ["Đi bình tĩnh, đi bên cạnh người lớn và đi xa 🐕", "Chạy thục mạng la ré vang đất", "Cầm đá ném chọc tức"],
    correctAnswer: "Đi bình tĩnh, đi bên cạnh người lớn và đi xa 🐕",
    illustration: "🐕🚶‍♂️👨‍👩‍👦",
    hint: "Nói lời ôn hòa, nắm tay người lớn đi xa vững lòng tự nhiên chó sẽ ngoan ngoãn dịu."
  },
  {
    id: "qs_4_3",
    category: "Quan sát",
    subCategory: "Phản xạ nhanh",
    text: "Đứng cạnh thềm hồ bơi mát lạnh xanh vắt, nước té loang loáng trơn trượt dữ dội. Để không gặp ngã nhào đau đớn, bé bước ra sao?",
    choices: ["Đi chậm thong thả tìm thảm bám ranh 🚶‍♂️", "Chạy ào ạt rượt bắt nhảy bổ xuề xòa", "Thi phi đầu gối nhón nhảy loạng choạng"],
    correctAnswer: "Đi chậm thong thả tìm thảm bám ranh 🚶‍♂️",
    illustration: "🏊‍♂️🚶‍♂️⚠️",
    hint: "Sàn gạch hồ chứa màng nước láng lướt rất dễ gây trượt chấn ngã bầm da bé yêu nhé."
  },
  {
    id: "qs_4_4",
    category: "Quan sát",
    subCategory: "Phản xạ nhanh",
    text: "Hoảng hốt phát giác em nhỏ chuẩn bị chọc cọng sắt cắm vào ổ cắm điện hở mặt đất sàn nhà, phản xạ oanh liệt của bé thế nào?",
    choices: ["Hét báo ngừng ngay và kéo em dứt gấp 🙋‍♂️", "Đeo mắt kính xem sọc lửa bắn ra", "Bỏ qua im lặng tẩu thoát đi gom đồ chơi"],
    correctAnswer: "Hét báo ngừng ngay và kéo em dứt gấp 🙋‍♂️",
    illustration: "🔌⚠️⚡",
    hint: "Hạt điện dập kích đau rát cháy bỏng vô cùng tai kiếp, hô gọi người lớn can thiệp ứng biến khẩn cấp!"
  },
  {
    id: "qs_4_5",
    category: "Quan sát",
    subCategory: "Phản xạ nhanh",
    text: "Từ gian bếp gia đình khói đen bít khí tỏa khét lẹt nồng nặc do chảo nấu quên tắt bếp lửa chực bốc cao, bé gánh vác trách nhiệm ra sao dắt em nhỏ?",
    choices: ["Ngay lập tức thoát ra ngoài vườn rộng, thét to xin cứu trợ 🚨", "Đứng lại nhặt quạt lấy quạt bay khói tơi bời", "Chui góc gầm bàn tối che chăn tránh dèm pha"],
    correctAnswer: "Ngay lập tức thoát ra ngoài vườn rộng, thét to xin cứu trợ 🚨",
    illustration: "🔥🚨🏃‍♂️",
    hint: "Khí xám độc xé rát khí quản, tháo chạy ra đất thoáng khí gọi cầu cứu lớn lao là thượng sách sống còn."
  },
  {
    id: "qs_4_6",
    category: "Quan sát",
    subCategory: "Phản xạ nhanh",
    text: "Kẻ xa lạ chạy xe phân khối bảnh tiến lại chào hỏi hứa mời sinh tố sữa ngọt lịm ngon tuyệt và gạ gẫm bế bé lên xe chở đi dạo chơi bãi cỏ, bé cương nghị đáp lại ra sao?",
    choices: ["Cự tuyệt tuyệt đối: 'Con không đi theo đâu!' rồi quành chạy về bốt bảo vệ 🙅‍♀️", "Đồng ý leo tót lên yên, tha hồ được uống kem miễn phí", "Ngoan ngoãn nhận thỏi kẹo bơ rồi đứng tần ngần đợi chuyện gì sẽ xảy đến"],
    correctAnswer: "Cự tuyệt tuyệt đối: 'Con không đi theo đâu!' rồi quành chạy về bốt bảo vệ 🙅‍♀️",
    illustration: "🙅‍♀️🏍️🍬",
    hint: "An ninh thân thể là ngọc vô ngần, thét to dõng dạc nói KHÔNG oai phong rồi ẩn nấp bóng lớn bốt công an hay người thân cận."
  }
];

const HIERARCHY = {
  "Số học": {
    emoji: "🔢",
    subTopics: ["Nhận biết số", "Đếm số lượng", "So sánh số", "Quy luật số", "Cộng trừ tư duy"]
  },
  "Hình học": {
    emoji: "🔷",
    subTopics: ["Nhận biết hình", "Hình khối", "Ghép hình", "Xoay hình", "Tìm hình còn thiếu"]
  },
  "Logic": {
    emoji: "🧠",
    subTopics: ["Quy luật", "Phân loại", "Tìm điểm khác nhau", "Suy luận"]
  },
  "Quan sát": {
    emoji: "👀",
    subTopics: ["Ghi nhớ", "Mê cung", "Tìm đồ vật", "Phản xạ nhanh"]
  }
};

export const MathQuest: React.FC<MathQuestProps> = ({ 
  activeClassKey, 
  onAwardPoints, 
  playBeep,
  showToast,
  forcedCategory
}) => {
  const [activeCategory, setActiveCategory] = useState<'Số học' | 'Hình học' | 'Logic' | 'Quan sát'>('Số học');
  const [activeSub, setActiveSub] = useState<string>('Nhận biết số');

  useEffect(() => {
    if (forcedCategory) {
      setActiveCategory(forcedCategory);
    }
  }, [forcedCategory]);
  
  const [currentQuestion, setCurrentQuestion] = useState<CustomQuestion | null>(null);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [congratsParticles, setCongratsParticles] = useState<{ id: number; emoji: string; x: number; y: number; scale: number; rot: number }[]>([]);

  // Load question based on active category & subtopic
  const loadQuestion = (cat: 'Số học' | 'Hình học' | 'Logic' | 'Quan sát', sub: string) => {
    const pool = MATH_EXERCISES.filter(q => q.category === cat && q.subCategory === sub);
    if (pool.length > 0) {
      // Pick a random one from the pool of 2
      const randomQ = pool[Math.floor(Math.random() * pool.length)];
      setCurrentQuestion(randomQ);
    } else {
      // Fallback
      setCurrentQuestion(MATH_EXERCISES[0]);
    }
    // Reset status
    setSelectedAns(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  // Run initial question generation or sub filter changes
  useEffect(() => {
    setCongratsParticles([]);
    // If the category changes, auto-select first subTopic of that category
    const subs = HIERARCHY[activeCategory].subTopics;
    if (!subs.includes(activeSub)) {
      setActiveSub(subs[0]);
      loadQuestion(activeCategory, subs[0]);
    } else {
      loadQuestion(activeCategory, activeSub);
    }
  }, [activeCategory, activeSub]);

  const handleCheckAnswer = (choice: string) => {
    if (isAnswered) return; // Prevent multiple clicks on same question

    setSelectedAns(choice);
    setIsAnswered(true);

    const correct = choice === currentQuestion?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      playBeep(650, 100);
      setTimeout(() => playBeep(880, 180), 120);
      onAwardPoints(50);
      showToast("🎉 Bé chọn xuất sắc! Đúng boóc rồi, cộng ngay 50 sao đổi quà! ⭐", "points");

      // Generate a burst of 30 playful congratulatory emojis that float up and out!
      const emojis = ["⭐", "🎉", "🔥", "🌸", "👑", "🍭", "✨", "🎈", "❤️", "🦖", "🦄", "🧸"];
      const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: Date.now() + i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: (Math.random() - 0.5) * 350, // spread horizontally
        y: -40 - Math.random() * 180,  // final offset up
        scale: 0.6 + Math.random() * 1.4,
        rot: Math.random() * 720 - 360
      }));
      setCongratsParticles(particles);

      // Automatically clear congratulations effect after 5 seconds
      setTimeout(() => {
        setCongratsParticles([]);
      }, 5000);
    } else {
      playBeep(220, 250);
      showToast("😢 Gần đúng rồi bé ơi! Đọc gợi ý dưới đây rồi thử lại xem nhé.", "error");
    }
  };

  const handleNextBtn = () => {
    playBeep(450, 80);
    setCongratsParticles([]);
    loadQuestion(activeCategory, activeSub);
  };

  return (
    <div id="toan_tu_duy_game_root" className="bg-gradient-to-tr from-indigo-600 via-sky-600 to-teal-500 rounded-[2.5rem] p-6 text-white relative shadow-xl overflow-hidden mt-6 border-4 border-white/20">
      {/* Visual background overlays */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
      <div className="absolute left-0 bottom-0 w-60 h-60 bg-teal-400/10 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none"></div>

      {/* Hiệu ứng pháo hoa chúc mừng bùng nổ khi trả lời đúng */}
      <AnimatePresence>
        {congratsParticles.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {congratsParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  scale: [0, p.scale, p.scale * 1.2, 0],
                  x: p.x, 
                  y: p.y, 
                  rotate: p.rot 
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2.2, 
                  ease: "easeOut" 
                }}
                className="absolute text-3.5xl select-none"
              >
                {p.emoji}
              </motion.div>
            ))}

            {/* Banner chúc mừng hoành tráng */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 60, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, y: -20, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.4, y: -80, rotate: 10 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              className="bg-gradient-to-r from-amber-400 via-yellow-450 to-amber-300 text-slate-900 px-8 py-5 rounded-[2.5rem] border-4 border-white shadow-2xl text-center max-w-xs flex flex-col items-center justify-center gap-1.5 pointer-events-auto"
            >
              <div className="text-5xl animate-bounce">🏆</div>
              <h3 className="font-brand font-extrabold text-xl sm:text-2xl leading-none tracking-wide text-slate-950 shadow-sm">
                XUẤT SẮC QUÁ!
              </h3>
              <p className="text-[11px] font-extrabold text-indigo-950 uppercase tracking-widest bg-white/40 px-3 py-1 rounded-full">
                Bé ngoan tài ba! +50 ⭐
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 space-y-6">
        
        {/* Header Title with Tiger Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/15">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/25 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-yellow-250 animate-bounce-soft">
              <Zap size={11} className="text-yellow-300 fill-yellow-200" />
              ĐẤT NƯỚC TOÁN TƯ DUY TIGER KIDS
            </div>
            <h4 className="text-xl sm:text-2xl font-brand font-extrabold tracking-wide text-white">
              Sân Chơi Thực Hành Toán Tư Duy Trực Quan
            </h4>
            <p className="text-xs text-sky-100 font-semibold">
              Bài tập phong phú được thiết kế trực tiếp giúp rèn luyện 4 siêu tư duy chuẩn giáo trình Montessori!
            </p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/25 flex items-center gap-2">
            <span className="text-2.5xl block">🏆</span>
            <div className="text-left">
              <span className="text-[9px] block text-sky-200 font-extrabold leading-none uppercase">Sao thưởng</span>
              <span className="text-sm font-bold text-yellow-300 font-brand">Thành tựu +50 ⭐</span>
            </div>
          </div>
        </div>

        {/* 1. Main Categories Directory Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(Object.keys(HIERARCHY) as Array<keyof typeof HIERARCHY>).map((catKey) => {
            const data = HIERARCHY[catKey];
            const active = activeCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => {
                  playBeep(400 + Object.keys(HIERARCHY).indexOf(catKey) * 60, 80);
                  setActiveCategory(catKey);
                  const firstSub = data.subTopics[0];
                  setActiveSub(firstSub);
                }}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs font-bold transition-all border outline-none ${
                  active 
                    ? 'bg-yellow-400 hover:bg-yellow-350 text-slate-900 border-yellow-300 font-extrabold shadow-lg scale-[1.03]' 
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                }`}
              >
                <span className="text-base">{data.emoji}</span>
                <span>{catKey}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Sub-topics/pill selection for the selected main category */}
        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-sky-200 block mb-2">Chủ đề chi tiết:</span>
          <div className="flex flex-wrap gap-1.5">
            {HIERARCHY[activeCategory].subTopics.map((subName) => {
              const active = activeSub === subName;
              return (
                <button
                  key={subName}
                  onClick={() => {
                    playBeep(450, 70);
                    setActiveSub(subName);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active 
                      ? 'bg-white text-indigo-700 font-extrabold shadow-xs' 
                      : 'bg-transparent text-slate-100 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  🎯 {subName}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Question Card Box */}
        {currentQuestion && (
          <div id={`question_box_${currentQuestion.id}`} className="bg-white rounded-3xl p-6 text-slate-800 shadow-md flex flex-col md:flex-row gap-6 items-center">
            
            {/* Left Column: Emoji Graphic Graphic */}
            <div className="w-28 h-28 bg-gradient-to-tr from-sky-100 to-indigo-100 rounded-2.5xl flex items-center justify-center text-5xl border-2 border-indigo-50 shadow-inner shrink-0 select-none animate-bounce-soft">
              {currentQuestion.illustration}
            </div>

            {/* Right Column: Question Text and Answers */}
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase">
                  {activeCategory} &raquo; {activeSub}
                </span>
                <h5 className="font-brand font-bold text-base sm:text-lg text-slate-800 leading-snug">
                  {currentQuestion.text}
                </h5>
              </div>

              {/* Multiple Choice interactive list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentQuestion.choices.map((choice, index) => {
                  const checkThis = selectedAns === choice;
                  const isCorrectChoice = choice === currentQuestion.correctAnswer;
                  
                  let btnStyle = "border-2 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";
                  let checkIcon = null;

                  if (isAnswered) {
                    if (isCorrectChoice) {
                      btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold";
                      checkIcon = <CheckCircle size={14} className="text-emerald-600 shrink-0" />;
                    } else if (checkThis) {
                      btnStyle = "border-rose-400 bg-rose-50 text-rose-800 font-bold";
                      checkIcon = <AlertCircle size={14} className="text-rose-500 shrink-0" />;
                    } else {
                      btnStyle = "border-slate-100 bg-white text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={isAnswered}
                      onClick={() => handleCheckAnswer(choice)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm transition-all focus:outline-none ${
                        !isAnswered ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
                      } ${btnStyle}`}
                    >
                      {checkIcon}
                      <span className="text-center">{choice}</span>
                    </button>
                  );
                })}
              </div>

              {/* Live result panel or tips */}
              <div className="pt-2 min-h-[3rem]">
                {isAnswered ? (
                  <div className={`p-3 rounded-2xl flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-2 ${
                    isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-150' : 'bg-rose-50/70 text-rose-800 border border-rose-100'
                  }`}>
                    <span className="text-lg leading-none">{isCorrect ? '🥳' : '💡'}</span>
                    <div className="text-xs">
                      <p className="font-extrabold mb-0.5">{isCorrect ? 'THÀNH CÔNG!' : 'GỢI Ý HAY CHO BÉ:'}</p>
                      <p className="font-medium leading-relaxed">{isCorrect ? 'Một câu trả lời hoàn hảo! Bé xứng đáng nhận huy hiệu sao lấp lánh của Tiger. +50 Sao' : currentQuestion.hint}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-xl text-slate-500 text-xs">
                    <span className="italic flex items-center gap-1.5"><HelpCircle size={14} className="text-slate-400" /> Hãy chọn 1 đáp án bé cho là chuẩn nhất nhé!</span>
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline outline-none uppercase tracking-wider"
                    >
                      {showHint ? 'Ẩn gợi ý 🙈' : 'Gợi ý từ Tiger 🐯'}
                    </button>
                  </div>
                )}

                {showHint && !isAnswered && (
                  <div className="mt-2 p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900 text-xs flex items-start gap-2 animate-in fade-in">
                    <span className="text-base leading-none">🧠</span>
                    <div>
                      <p className="font-extrabold mb-0.5">Tiger mách nhỏ bé thương:</p>
                      <p className="font-medium">{currentQuestion.hint}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lower panel: Next Question or retry */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextBtn}
                  className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all outline-none"
                >
                  <RefreshCw size={13} className="animate-spin-slow" /> Câu hỏi khác 🔄
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
