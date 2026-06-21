import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, RotateCw, Sparkles, BookOpen, Check, Award } from 'lucide-react';
import { Flashcard } from '../types';
import { MathQuest } from './MathQuest';

interface FlashcardDeckProps {
  playBeep: (freq: number, dur: number) => void;
  showToast: (msg: string, type?: 'success' | 'points' | 'error') => void;
  subFilter?: string;
  activeClassKey?: 'mam_non' | 'lop_1' | 'lop_2' | 'lop_3';
  onAwardPoints?: (points: number) => void;
}

// Lookup map for numbers from 0 to 20, and tens up to 100 with accurate IPA pronunciations and names
const numbersInfo: Record<number, { eng: string; viet: string; pron: string; emoji: string }> = {
  0: { emoji: "0️⃣", eng: "Zero", viet: "Số Không", pron: "/ˈzɪə.roʊ/" },
  1: { emoji: "1️⃣", eng: "One", viet: "Số Một", pron: "/wʌn/" },
  2: { emoji: "2️⃣", eng: "Two", viet: "Số Hai", pron: "/tuː/" },
  3: { emoji: "3️⃣", eng: "Three", viet: "Số Ba", pron: "/θriː/" },
  4: { emoji: "4️⃣", eng: "Four", viet: "Số Bốn", pron: "/fɔːr/" },
  5: { emoji: "5️⃣", eng: "Five", viet: "Số Năm", pron: "/faɪv/" },
  6: { emoji: "6️⃣", eng: "Six", viet: "Số Sáu", pron: "/sɪks/" },
  7: { emoji: "7️⃣", eng: "Seven", viet: "Số Bảy", pron: "/ˈsev.ən/" },
  8: { emoji: "8️⃣", eng: "Eight", viet: "Số Tám", pron: "/eɪt/" },
  9: { emoji: "9️⃣", eng: "Nine", viet: "Số Chín", pron: "/naɪn/" },
  10: { emoji: "🔟", eng: "Ten", viet: "Số Mười", pron: "/ten/" },
  11: { emoji: "1️⃣1️⃣", eng: "Eleven", viet: "Số Mười Một", pron: "/ɪˈlev.ən/" },
  12: { emoji: "1️⃣2️⃣", eng: "Twelve", viet: "Số Mười Hai", pron: "/twelv/" },
  13: { emoji: "1️⃣3️⃣", eng: "Thirteen", viet: "Số Mười Ba", pron: "/ˌθɜːrˈtiːn/" },
  14: { emoji: "1️⃣4️⃣", eng: "Fourteen", viet: "Số Mười Bốn", pron: "/ˌfɔːrˈtiːn/" },
  15: { emoji: "1️⃣5️⃣", eng: "Fifteen", viet: "Số Mười Lăm", pron: "/ˌfɪfˈtiːn/" },
  16: { emoji: "1️⃣6️⃣", eng: "Sixteen", viet: "Số Mười Sáu", pron: "/ˌsɪksˈtiːn/" },
  17: { emoji: "1️⃣7️⃣", eng: "Seventeen", viet: "Số Mười Bảy", pron: "/ˌsev.ənˈtiːn/" },
  18: { emoji: "1️⃣8️⃣", eng: "Eighteen", viet: "Số Mười Tám", pron: "/ˌeɪˈtiːn/" },
  19: { emoji: "1️⃣9️⃣", eng: "Nineteen", viet: "Số Mười Chín", pron: "/ˌnaɪnˈtiːn/" },
  20: { emoji: "2️⃣0️⃣", eng: "Twenty", viet: "Số Hai Mươi", pron: "/ˈtwen.ti/" },
  30: { emoji: "3️⃣0️⃣", eng: "Thirty", viet: "Số Ba Mươi", pron: "/ˈθɜː.ti/" },
  40: { emoji: "4️⃣0️⃣", eng: "Forty", viet: "Số Bốn Mươi", pron: "/ˈfɔː.ti/" },
  50: { emoji: "5️⃣0️⃣", eng: "Fifty", viet: "Số Năm Mươi", pron: "/ˈfɪf.ti/" },
  60: { emoji: "6️⃣0️⃣", eng: "Sixty", viet: "Số Sáu Mươi", pron: "/ˈsɪks.ti/" },
  70: { emoji: "7️⃣0️⃣", eng: "Seventy", viet: "Số Bảy Mươi", pron: "/ˈsev.ən.ti/" },
  80: { emoji: "8️⃣0️⃣", eng: "Eighty", viet: "Số Tám Mươi", pron: "/ˈeɪ.ti/" },
  90: { emoji: "9️⃣0️⃣", eng: "Ninety", viet: "Số Chín Mươi", pron: "/ˈnaɪn.ti/" },
  100: { emoji: "💯", eng: "One Hundred", viet: "Một Trăm", pron: "/wʌn ˈhʌn.drəd/" }
};

// High-fidelity number list covering kids' critical counting skills
const generateNumberCards = (): Flashcard[] => {
  const cards: Flashcard[] = [];
  const activeNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  for (const num of activeNumbers) {
    const info = numbersInfo[num];
    if (info) {
      cards.push({
        emoji: info.emoji,
        eng: info.eng,
        viet: info.viet,
        pron: info.pron,
        category: "Số đếm"
      });
    }
  }
  return cards;
};

interface InstructionData {
  title: string;
  advice: string;
  steps: string[];
  audioText: string;
}

const getInstructionData = (title: string): InstructionData => {
  const t = title.toLowerCase();
  
  if (t.includes("nối nét") || t.includes("tracing")) {
    return {
      title: "Học Nối Nét (Khéo Tay Luyện Bút)",
      advice: "Cơ tay bé khi cầm bút sẽ dẻo dai hơn qua từng nét nối chấm mờ. Phụ huynh hãy in hoặc chuẩn bị các phiếu nét rời đơn giản cho bé luyện tập cùng nhé.",
      steps: [
        "Cầm bút nhẹ nhàng bằng ba ngón tay: ngón cái, ngón trỏ và ngón giữa nâng đỡ đặt nhẹ lên giấy.",
        "Xác định chấm xuất phát màu đỏ, khéo léo lia ngòi bút theo các đường nét đứt.",
        "Tiến dần về phía điểm kết thúc mượt mà, hạn chế nhấc bút giữa chừng."
      ],
      audioText: "Khi nối nét, bé cầm bút nhẹ nhàng bằng ba ngón tay rồi vẽ từ từ từ chấm tròn đỏ sang đích nhé, đừng nhấc bút nửa chừng nha."
    };
  }
  if (t.includes("tô nét") || t.includes("coloring")) {
    return {
      title: "Tô Nét Màu Sắc (Khám Phá Sáng Tạo)",
      advice: "Tập tô màu rèn sự tập trung cao độ, kỹ năng phân biệt mảng màu sắc sặc sỡ và điều chỉnh tay không vượt ra bờ viền tranh.",
      steps: [
        "Chuẩn bị bức tranh nét đen đơn giản có chủ đề bé yêu thích như con thỏ, bông hoa hay ngôi nhà.",
        "Tô mỏng nhẹ phần sát đường viền màu đen trước tiên tạo thành đệm bảo vệ.",
        "Di bút sáp đều tay theo một hướng xiên hoặc vòng tròn từ ngoài vào trong ấm áp."
      ],
      audioText: "Tô màu thật vui! Bé hãy tô từ đường viền phía ngoài trước rồi tô dần vào trong để bức tranh thật gọn gàng nhé!"
    };
  }
  if (t.includes("đồ chữ số") || t.includes("number")) {
    return {
      title: "Đồ Vẽ Chữ Số (Làm Quen Toán Học)",
      advice: "Giúp ngón tay bé làm quen với lực ấn viết số học tự nhiên từ 0 đến 10, mở lối tư duy số đếm sớm đầy hào hứng.",
      steps: [
        "Ngồi thẳng lưng ngay ngắn, giữ khoảng cách mắt đến vở tầm 25-30cm.",
        "Đặt ngòi bút đúng điểm xuất phát nơi có chỉ dẫn mũi tên nét thứ một.",
        "Kéo bút đều tay tì sát theo các hướng chấm uốn lượn uốn tròn của từng con số."
      ],
      audioText: "Đồ chữ số sẽ giúp chúng mình viết thật đẹp! Bé nhớ đặt bút ở điểm bắt đầu và đưa bút theo chiều mũi tên vẽ nhé."
    };
  }
  if (t.includes("cắt dán") || t.includes("cut and paste")) {
    return {
      title: "Cắt Dán Thủ Công (Trí Não Khéo Léo)",
      advice: "Sử dụng kéo rèn luyện sự kết hợp chặt chẽ tay mắt. Phụ huynh bắt buộc cùng tham gia hướng dẫn và sử dụng kéo chuyên dụng an toàn.",
      steps: [
        "Chuẩn bị kéo nhựa bo tròn đầu an toàn tự uốn mở và hồ dính khô.",
        "Hướng dẫn bé dùng các ngón tay nhắm mở kéo mượt mà cắt rời từng dải giấy phụ.",
        "Phết hồ khô mỏng lên mặt sau bức tranh rồi ấn nhẹ, vuốt phẳng xuống giấy bìa nền."
      ],
      audioText: "Bé chỉ cầm kéo nhựa an toàn của trẻ em thôi nhé, tập nhấp kéo nhịp nhàng rồi cắt dán những bức tranh ngộ nghĩnh cùng bố mẹ nha."
    };
  }
  if (t.includes("xâu hạt") || t.includes("bead")) {
    return {
      title: "Xâu Chuỗi Hạt Nhỏ (Tinh Tế Kiên Trì)",
      advice: "Xâu luồn rèn tính kiên nhẫn bẩm sinh của trẻ và phối hợp đỉnh cao 2 bán cầu não trái phải một lúc.",
      steps: [
        "Sử dụng các hạt gỗ tròn to nhẵn bóng màu sắc sinh động kèm sợi dây dù đã được se đầu cho cứng.",
        "Một tay bé cầm hạt cố định, tay kia khéo léo hướng sợi dây luồn qua lỗ.",
        "Kéo nhẹ sợi dây sang bên đối diện và tiếp tục lặp lại tinh mắt dệt nên chiếc vòng xinh xắn."
      ],
      audioText: "Xây dựng chuỗi hạt xinh xắn bằng cách kiên nhẫn khéo léo luồn sợi dây qua tâm lỗ gỗ trò chơi này cực kỳ rèn tập trung đấy!"
    };
  }
  if (t.includes("gắp") || t.includes("kẹp") || t.includes("tweezer")) {
    return {
      title: "Gắp Kẹp Đồ Vật (Gia Lực Cơ Tay Nhỏ)",
      advice: "Hành động bóp mở kẹp rèn tư thế cầm bút vững chắc cho trẻ chuẩn bị vào lớp Một học viết dẻo tay lâu dài.",
      steps: [
        "Chuẩn bị chiếc kẹp gỗ nhỏ phơi đồ hoặc kẹp gắp y tế cùng các quả bông vải nhung màu ấm.",
        "Bé sử dụng ngón cái, ngón trỏ và ngón giữa ấn bóp mở kẹp ngậm chặt quả bông.",
        "Nhấc quả bông lên khéo léo thả sang khu vực khay phân chia kế bên mà không rơi."
      ],
      audioText: "Hãy dùng lực của ngón tay bóp chặt kẹp nhảy múa gắp bông gòn sặc sỡ sang bát khác nhé ngon lành dẻo dai đôi tay xinh."
    };
  }
  if (t.includes("gấp giấy") || t.includes("folding")) {
    return {
      title: "Gấp Giấy Origami (Logic Hình Học)",
      advice: "Sáng tạo nghệ thuật giúp trẻ học cách tuân thủ đúng quy trình kết cấu hình họa, kích thích trí thông minh không gian.",
      steps: [
        "Chuẩn bị sẵn giấy màu vuông mỏng vừa phải phẳng phiu xinh đẹp.",
        "Cùng bé đối chiếu căn chỉnh mép ranh giới giấy thật trùng khớp nhau.",
        "Dùng đầu ngón tay cái vuốt phẳng nếp miết rõ nét tạo khuôn gấp mượt mà."
      ],
      audioText: "Gấp giấy Origami Nhật Bản siêu vui! Bé hãy xếp các góc giấy thật đều khớp nhau rồi miết nếp gấp phẳng phiu nhé."
    };
  }
  if (t.includes("xếp hình") || t.includes("building")) {
    return {
      title: "Xếp Hình Kiến Trúc (Kỹ Sư Nhí Sáng Tạo)",
      advice: "Lắp ráp thăng bằng các khối gỗ giúp mắt thẩm mỹ và óc phán đoán thăng bằng vận vật phát triển bứt phá rõ rệt.",
      steps: [
        "Sử dụng khối gỗ màu sạch sẽ hoặc lego chữ nhật vuông ngộ nghĩnh.",
        "Dựng xây móng vuông kiên cố phía chân đất trước làm trụ đỡ thăng bằng.",
        "Xếp chồng chậm rãi lên cao và hô biến ngôi nhà, khu vườn hay cây cầu vững chắc."
      ],
      audioText: "Các nhà xây dựng nhí ơi, hãy cùng sáng tạo nên những lâu đài nguy nga tráng lệ từ các khối tháp vững vàng nhé!"
    };
  }
  
  // Custom skills
  if (t.includes("tự phục vụ") || t.includes("self care")) {
    return {
      title: "Kỹ Năng Tự Phục Vụ (Tập Tự Lập Sớm)",
      advice: "Nâng cao niềm kiêu hãnh và khả năng tự lo cho cuộc sống của bé qua những lời khen khích lệ kịp thời từ bố mẹ.",
      steps: [
        "Học xỏ tay dẻo dai qua ống tay áo, cài khuy từ dưới lên trên thẳng thớm.",
        "Tự xỏ quai giày dép đúng bên trái - phải hướng ra ngoài.",
        "Cất gọn gàng balo sách vở lên kệ trang trọng của mình sau mỗi buổi tan trường."
      ],
      audioText: "Bé yêu hãy tập tự mặc quần áo gọn gàng, xếp mũ nón dép vào ngăn tủ nhé để trở thành một thiên thần nhỏ độc lập ngoan ngoãn."
    };
  }
  if (t.includes("sinh hoạt") || t.includes("routine")) {
    return {
      title: "Nề Nếp Sinh Hoạt Học Đường & Gia Đình",
      advice: "Tạo niềm vui dọn dẹp bằng cách biến nó thành một cuộc phiêu lưu lý thú đồng hành cùng bé yêu dọn nhà.",
      steps: [
        "Thu dọn gọn toàn bộ gấu bông, đồ chơi xếp hình cất về chiếc giỏ xinh xắn sau giờ chơi.",
        "Dùng khăn ẩm sạch lau sạch mảng mực vẽ mờ bám trên bàn học của bé.",
        "Giúp mẹ quét gấp quần áo phơi khô phẳng thớm bỏ vào tủ đồ riêng."
      ],
      audioText: "Chơi xong chúng mình nhớ giúp bé thu dọn đồ chơi gọn gàng ngăn nắp cất vào hòm nhé giúp phòng luôn thoáng đãng sạch đẹp."
    };
  }
  if (t.includes("an toàn") || t.includes("safety")) {
    return {
      title: "Bảo Vệ Bản Thân (Kỹ Năng An Toàn Số 1)",
      advice: "Hãy dạy bé phản xạ phòng tránh nguy hiểm dứt khoát tránh những hậu quả đáng tiếc xảy ra hằng ngày.",
      steps: [
        "Tuyệt đối nói không chạm tay ướt lên các ổ điện sinh hoạt trong gia đình.",
        "Không lại gần vùng bếp ga đỏ lửa, xoong nước đang bốc khói ấm.",
        "Ghi lòng học thuộc số điện thoại ba mẹ và tên nhà để đề phòng đi lạc."
      ],
      audioText: "An toàn là trên hết bé yêu ơi! Tránh xa ổ cắm điện, nước nóng sôi hay dạo kim bén nhé hân hoan an lành mỗi ngày."
    };
  }
  if (t.includes("giao tiếp") || t.includes("social")) {
    return {
      title: "Giao Tiếp Kính Trên Nhường Dưới",
      advice: "Sự lịch thiệp, dễ mến bắt nguồn từ tấm lòng biết ơn và kính trọng ông bà cha mẹ tự nhiên nhất.",
      steps: [
        "Khoanh tròn tay cúi chào lễ phép khi ông bà, bố mẹ bước vào cửa chào hỏi.",
        "Nói dạ thưa lễ phép khi trả lời câu hỏi và xưng hô đúng mực tôn kính.",
        "Nói câu cảm ơn chân thành khi nhận đồ ăn và câu xin lỗi dũng cảm dứt khoát."
      ],
      audioText: "Chào hỏi lễ phép khoanh tròn tay chào ông bà bố mẹ, cảm ơn hào phóng khi nhận quà là hành động của một em bé tuyệt vời bé nha."
    };
  }
  if (t.includes("cảm xúc") || t.includes("emotion")) {
    return {
      title: "Nhận Biết & Giải Tỏa Cảm Xúc (EQ Nhỏ)",
      advice: "Giúp con xoa dịu đi các suy nghĩ tức tối bằng các bài tập hơi thở đơn giản hữu ích cùng cha mẹ hỗ trợ.",
      steps: [
        "Gọi đúng tên cảm xúc của bé qua nét mặt biểu thị: Vui xoe mắt, buồn rũ mếu, tức giận đỏ nụ.",
        "Khi bực mình giận dỗi, thực hiện hít thở căng tròn bụng hạ xuống mượt mà 3 giây để cân thăng bằng tâm trạng.",
        "Nắm tay ba mẹ kể nhẹ nhàng câu chuyện lý do con chưa vui lòng."
      ],
      audioText: "Hãy đặt tay lên bụng, hít sâu thở đều một hai ba là vui say cười yêu trở lại ngay! Hãy kể bé nghe gì cùng mẹ nhé!"
    };
  }
  if (t.includes("tập trung") || t.includes("focus")) {
    return {
      title: "Sự Tập Trung Chú Ý (Bí Kíp Học Giỏi)",
      advice: "Quản trị sự sao nhãng bằng không gian học góc vuông yên tĩnh, thúc đẩy con bứt phá khả năng chú tâm hoàn thành việc.",
      steps: [
        "Tắt tivi hoặc âm thanh ồn ào xung quanh tạo chốn ngồi an tĩnh tập trung.",
        "Cam kết làm việc vẽ/nhìn sách xong xuôi liên tục trong 10 đến 15 phút mới dừng nghỉ chân.",
        "Nghiêng tai lắng nghe cặn kẽ từng câu chỉ dạy từ cô giáo thầy cô."
      ],
      audioText: "Tập trung tuyệt đối khi học tập giúp bé học siêu nhanh và nhớ cực lâu đó bé yêu nghe giảng thấu đáo nhé!"
    };
  }

  // 24. Âm nhạc
  if (t.includes("cảm thụ âm nhạc") || t.includes("music appreciation")) {
    return {
      title: "Cảm Thụ Âm Nhạc (Lắng Nghe & Cảm Nhận)",
      advice: "Âm nhạc kích thích thính giác và khơi dậy trí tưởng tượng phong phú của bé. Bố mẹ hãy cùng nhắm mắt cảm nhận nhé.",
      steps: [
        "Mở một bản nhạc cổ điển không lời nhẹ nhàng hoặc bài hát thiếu nhi vui nhộn.",
        "Mời bé nhắm mắt lại, lắng nghe và đoán xem giai điệu đang diễn tả điều gì (nước chảy, chim hót hay gió reo).",
        "Hãy cùng bé đu đưa cơ thể từ từ theo tiếng đàn ngân nga mượt mà đầy cảm xúc."
      ],
      audioText: "Bé yêu ơi, hãy nhắm mắt lại và lắng nghe tiếng nhạc du dương, rồi đưa tay múa theo giai điệu cùng bố mẹ nha."
    };
  }
  if (t.includes("gõ nhịp") || t.includes("rhythm")) {
    return {
      title: "Gõ Nhịp Điệu (Phát Triển Nhịp Phách)",
      advice: "Giúp bé kiểm soát vận động và rèn tính cảm nhận tiết tấu phách mạnh phách nhẹ linh hoạt.",
      steps: [
        "Chuẩn bị chiếc trống đồ chơi nhỏ, cặp phách gỗ hoặc đơn giản là vỗ đôi bàn tay xinh.",
        "Bố mẹ làm mẫu nhịp điệu đơn giản: 'Vỗ - Vỗ - Nghỉ' hoặc 'Chậm - Chậm - Nhanh'.",
        "Khuyên bé chú tâm lắng nghe rồi bắt chước gõ lại đúng khớp theo từng bước chân nhạc."
      ],
      audioText: "Cùng gõ nhịp thôi nào! Vỗ tay một, hai, nghỉ, rồi dùng phách gõ nhịp nhàng theo giai điệu vui tươi nhé!"
    };
  }
  if (t.includes("hát và vận động") || t.includes("sing & dance")) {
    return {
      title: "Múa Hát & Vận Động (Nhịp Điệu Cơ Thể)",
      advice: "Vận động thô kết hợp ca hát giúp bé giải phóng năng lượng tích cực, phát triển thể chất và tinh thần tự tin vui tươi.",
      steps: [
        "Lựa chọn bài hát vận động vui tươi như 'Kìa con bướm vàng' hoặc 'Cả nhà thương nhau'.",
        "Cùng bé học các động tác đơn giản: giơ tay lên cao, lắc hông, nhún chân nhịp nhàng.",
        "Vừa hát to rõ tiếng vừa múa theo giai điệu say sưa đầy ắp tiếng cười hạnh phúc."
      ],
      audioText: "Nhảy múa rèn luyện sức khỏe! Bé hãy hát vang và làm các động tác múa lắc lư thật dẻo dai vui tươi nha!"
    };
  }
  if (t.includes("xướng âm") || t.includes("solfege")) {
    return {
      title: "Xướng Âm Vui Nhộn (Làm Quen Cao Độ)",
      advice: "Học cao độ các nốt nhạc cơ bản Đồ Rê Mi giúp bé phát triển giọng hát đúng tông và thính giác nhạy bén tuyệt vời.",
      steps: [
        "Chỉ vào các ký hiệu nốt nhạc màu sắc tương ứng hoặc dùng phím đàn organ/piano.",
        "Bố mẹ hát mẫu nốt 'Đồ' trầm ấm, 'Rê' nâng cao, 'Mi' thanh cao ngân vang.",
        "Mời bé bắt chước ngân nga độ dài hơi, phối cảm nhận cao thấp cực kỳ sinh động."
      ],
      audioText: "Đồ, Rê, Mi, Pha, Son! Bé hãy thử hát nốt trầm Đồ rồi cao dần lên Son theo giọng hát ấm áp của bố mẹ nha."
    };
  }

  // Vietnamese Nursery Songs (Bài hát thiếu nhi)
  if (t.includes("một con vịt") || t.includes("one little duck")) {
    return {
      title: "Bài hát: Một Con Vịt (Nhảy Múa Vui Nhộn)",
      advice: "Bài hát kinh điển giúp bé phát triển nhạc cảm, kết hợp vẫy hai cánh tay làm cánh vịt và lắc lư mông rèn luyện cơ thể theo nhạc điệu vui tai.",
      steps: [
        "Giơ hai tay ép sát khuỷu nách làm hai cánh vịt nhỏ xòe ra rập rờn.",
        "Hát vang to, rõ ràng theo tiếng nhạc: 'Quác quác quác, quạc quạc quạc' cực vui tợn.",
        "Nhún chân khom lưng nhịp nhàng bắt chước chú vịt khi bơi lội bì bõm dưới làn nước hồ."
      ],
      audioText: "Một con vịt xòe ra hai cái cánh, nó kêu rằng: quác quác quác, quạc quạc quạc! Gặp hồ nước nó bì bà bì bõm, lúc lên bờ vẫy cái cánh cho khô."
    };
  }
  if (t.includes("cả nhà thương nhau") || t.includes("family love")) {
    return {
      title: "Bài hát: Cả Nhà Thương Nhau (Ấm Áp Tình Thân)",
      advice: "Giai điệu chậm ấm áp vinh danh tình yêu thương của bố mẹ dành cho bé yêu. Bài hát thích hợp nhất để rèn cảm xúc thấu hiểu yêu thương.",
      steps: [
        "Hai tay của bé ôm chéo nhẹ lên đôi vai của mình tựa như cái ôm gia đình nồng ấm.",
        "Môi nở nụ cười tươi hạnh phúc, hát vang: 'Ba thương con vì con giống mẹ, mẹ thương con vì con giống ba'.",
        "Chào đón cái ôm yêu quý ấm áp thật sự từ bố mẹ của bé sau câu: 'Khi xa là nhớ, gần nhau là cười'."
      ],
      audioText: "Ba thương con vì con giống mẹ. Mẹ thương con vì con giống ba. Cả nhà ta cùng thương yêu nhau. Xa là nhớ, gặp nhau là cười!"
    };
  }
  if (t.includes("kìa con bướm vàng") || t.includes("golden butterfly")) {
    return {
      title: "Bài hát: Kìa Con Bướm Vàng (Múa Xoay Đôi Cánh)",
      advice: "Giai điệu pháp điệu vui nhộn giúp nâng cao sự tập trung bắt nhịp cao dốc, cùng con múa đôi cánh thăng hoa sáng tạo cảm xúc.",
      steps: [
        "Đan chéo hai cổ tay mỏng, vỗ nhẹ rập rờn nhịp nhàng lặp lại làm bướm lượn dẻo dai.",
        "Nhún tay nhấc gót xoay tròn 1 vòng tại chỗ rực rỡ như chú bướm đang bay lượn trên vườn hoa xuân.",
        "Khoe giọng hát to trong trẻo, ngân dài tròn đầy chữ: 'Xòe đôi cánh, xòe đôi cánh'."
      ],
      audioText: "Kìa con bướm vàng, kìa con bướm vàng. Xoè đôi cánh, xoè đôi cánh. Bươm bướm bay đôi ba vòng, bươm bướm bay đôi ba vòng. Xem bên này, xem bên này."
    };
  }
  if (t.includes("rửa mặt như mèo") || t.includes("wash like a cat")) {
    return {
      title: "Bài hát: Rửa Mặt Như Mèo (Vệ Sinh Cá Nhân Vui)",
      advice: "Cái nhìn hài hước nhắc nhở dặn bé thói quen lau dọn rửa vùng mắt và mặt sạch mượt vào mỗi khung giờ sớm mai thức giấc.",
      steps: [
        "Khum khum khéo hai bàn tay xinh giơ lên xoa tròn nhịp nhành nhẹ nhàng giả làm mèo con rửa má.",
        "Xướng giọng cao khỏe: 'Khăn mặt đâu mà ngồi liếm láp, đau mắt rồi lại khóc meo meo'.",
        "Vẫy đôi chân gót dẻo nụ cười tươi hân hoan rèn thói quen rửa mặt bằng khăn sạch mượt nhé."
      ],
      audioText: "Meo meo meo rửa mặt như mèo. Xấu xấu trị chẳng được mẹ yêu. Khăn mặt đâu mà ngồi liếm láp. Đau mắt rồi lại khóc meo meo."
    };
  }

  // 25. Mỹ thuật
  if (t.includes("vẽ nét") || t.includes("basic drawing")) {
    return {
      title: "Vẽ Nét Cơ Bản (Nền Móng Mỹ Thuật)",
      advice: "Mọi bức tranh đẹp đều bắt đầu từ nét vẽ cơ bản nhất. Hãy khuyến khích bé thoải mái đưa nét bút tự do.",
      steps: [
        "Chuẩn bị một tờ giấy trắng khổ lớn và bút lông hoặc bút màu sáp dễ cầm.",
        "Hướng dẫn vẽ đường thẳng đứng vững chãi, đường ngang kéo dài, và nét sóng uốn lượn liên tục.",
        "Khép kín vòng tròn mềm mại để tạo hình quả bóng tròn hay mặt trời rực rỡ."
      ],
      audioText: "Chào mừng họa sĩ nhí! Bé hãy cầm bút sáp vẽ những nét thẳng mượt, nét sóng uốn lượn rồi xoay tròn thành quả bóng xinh nhé."
    };
  }
  if (t.includes("pha trộn") || t.includes("color mixing")) {
    return {
      title: "Pha Trộn Sắc Màu (Khoa Học Nghệ Thuật)",
      advice: "Giúp bé hiểu quy luật tạo màu trực quan sinh động, phát triển trí tò mò khám phá khôn lường.",
      steps: [
        "Chuẩn bị ba màu cơ bản có sẵn: Đỏ, Vàng, và Xanh Dương dạng màu nước an toàn.",
        "Thử trộn màu Đỏ với Vàng để biến hóa ra màu Cam rực sáng đầy bất ngờ kỳ thú.",
        "Trộn Xanh Dương với Vàng xem lá cây Xanh mướt xuất hiện ra sao dưới mắt trẻ thơ."
      ],
      audioText: "Kỳ diệu chưa! Bé hãy cùng bố mẹ pha màu đỏ với màu vàng để xem màu cam rực rỡ hiện ra như thế nào nhé!"
    };
  }
  if (t.includes("nặn đất") || t.includes("clay")) {
    return {
      title: "Sáng Tạo Nặn Đất Sét (Tạo Hình Không Gian)",
      advice: "Bóp nặn đất sét rèn luyện cơ ngón tay vững chắc và tư duy không gian 3D vô cùng hiệu quả.",
      steps: [
        "Sử dụng đất sét màu hữu cơ tự nhiên, an toàn, không dính dầu bẩn tay bé.",
        "Hướng dẫn bé dùng lòng bàn tay xoa tròn tạo mẫu quả bóng, vuốt dài thành chú sâu nhỏ.",
        "Ấn dẹt hoặc lắp ghép các phần đất sét lại thành hình bông hoa hay con lật đật ngộ nghĩnh."
      ],
      audioText: "Đất sét biến hình! Bé hãy bóp mềm đất sét, vo tròn xoe rồi kéo dài thành chú sâu con xinh đẹp ngộ nghĩnh nha."
    };
  }
  if (t.includes("in tranh vân tay") || t.includes("fingerprint")) {
    return {
      title: "In Tranh Vân Tay (Dấu Ấn Cá Nhân Độc Đáo)",
      advice: "Vân tay tròn trịa của bé có thể biến hóa thành muôn vàn con vật dễ thương chỉ với vài nét vẽ phụ họa.",
      steps: [
        "Ấn nhẹ ngón tay trỏ dẻo mềm của bé vào miếng mút thấm khay màu nước rực rỡ.",
        "Ấn dứt khoát dấu tay lên trang giấy trắng phẳng phiu tạo thành mảng tròn sắc màu ấm.",
        "Dùng bút đen vẽ thêm mắt, râu, chân để biến hình dấu tay thành chú ong, chú rùa xinh xắn."
      ],
      audioText: "Đóng dấu vân tay vui nhộn! Bé ấn ngón tay xinh vào khay màu nước rồi in lên giấy để tạo chú rùa ngộ nghĩnh nha."
    };
  }
  if (t.includes("xé dán") || t.includes("torn paper")) {
    return {
      title: "Xé Dán Thủ Công Nghệ Thuật (Khéo Bàn Tay Xinh)",
      advice: "Hành động xé giấy khéo léo giúp bé điều phối lực ngón tay dẻo dai, kích thích óc thẩm mỹ và tư duy xếp ghép mảng miếng.",
      steps: [
        "Chuẩn bị các dải giấy thủ công màu sắc rực rỡ và hồ dính khô dạng thỏi phẳng.",
        "Bé dùng hai tay xé giấy thành các mảnh nhỏ kích thước ngẫu nhiên tự nhiên.",
        "Chấm hồ dán bôi mỏng lên bìa giấy rồi xếp ghép các dải giấy xé lấp đầy bầu trời, đại dương xanh thẳm."
      ],
      audioText: "Nào, bé cùng dùng tay xé những mẫu giấy nhỏ sặc sỡ rồi dán khít lại tạo nên bức tranh chiếc lá rực sỡ mùa thu nha."
    };
  }

  return {
    title: title,
    advice: "Dành thời gian rèn luyện từng chút một mỗi ngày cùng bé sẽ giúp bé yêu tiến bộ vượt bậc, xây đắp vững chãi trí tự tin độc lập.",
    steps: [
      "Thực hiện theo chỉ dẫn từng bước một chậm rãi.",
      "Cùng bố mẹ thực hành trò chuyện ấm áp vui tươi.",
      "Nhận ngay lời khen thưởng động viên xứng đáng khi làm tốt."
    ],
    audioText: `Nào, chúng ta cùng thực hành bài học hướng dẫn ${title} thật vui vẻ nha!`
  };
};

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ 
  playBeep, 
  showToast, 
  subFilter = 'all',
  activeClassKey = 'mam_non',
  onAwardPoints = (_points: number) => {}
}) => {
  const flashcardsDeck: Flashcard[] = [
    // 1. Động vật - 10 cards
    { emoji: "🦁", eng: "Lion", viet: "Sư Tử", pron: "/ˈlaɪ.ən/", category: "Động vật" },
    { emoji: "🐘", eng: "Elephant", viet: "Con Voi", pron: "/ˈel.ə.fənt/", category: "Động vật" },
    { emoji: "🐯", eng: "Tiger", viet: "Con Hổ", pron: "/ˈtaɪ.ɡər/", category: "Động vật" },
    { emoji: "🐶", eng: "Dog", viet: "Con Chó", pron: "/dɔːɡ/", category: "Động vật" },
    { emoji: "🐱", eng: "Cat", viet: "Con Mèo", pron: "/kæt/", category: "Động vật" },
    { emoji: "🐵", eng: "Monkey", viet: "Con Khỉ", pron: "/ˈmʌŋ.ki/", category: "Động vật" },
    { emoji: "🐦", eng: "Bird", viet: "Con Chim", pron: "/bɜːrd/", category: "Động vật" },
    { emoji: "🐟", eng: "Fish", viet: "Con Cá", pron: "/fɪʃ/", category: "Động vật" },
    { emoji: "🐻", eng: "Bear", viet: "Con Gấu", pron: "/ber/", category: "Động vật" },
    { emoji: "🐰", eng: "Rabbit", viet: "Con Thỏ", pron: "/ˈræb.ɪt/", category: "Động vật" },

    // 2. Trái cây - 10 cards
    { emoji: "🍎", eng: "Apple", viet: "Quả Táo", pron: "/ˈæp.əl/", category: "Trái cây" },
    { emoji: "🍌", eng: "Banana", viet: "Quả Chuối", pron: "/bəˈnæn.ə/", category: "Trái cây" },
    { emoji: "🥕", eng: "Carrot", viet: "Củ Cà Rốt", pron: "/ˈkær.ət/", category: "Trái cây" },
    { emoji: "🍰", eng: "Cake", viet: "Bánh Ngọt", pron: "/keɪk/", category: "Trái cây" },
    { emoji: "🥛", eng: "Milk", viet: "Sữa", pron: "/mɪlk/", category: "Trái cây" },
    { emoji: "💧", eng: "Water", viet: "Nước", pron: "/ˈwɔː.tər/", category: "Trái cây" },
    { emoji: "🍊", eng: "Orange", viet: "Quả Cam", pron: "/ˈɔːr.ɪndʒ/", category: "Trái cây" },
    { emoji: "🍓", eng: "Strawberry", viet: "Quả Dâu Tây", pron: "/ˈstrɔː.ber.i/", category: "Trái cây" },
    { emoji: "🍞", eng: "Bread", viet: "Bánh Mì", pron: "/bred/", category: "Trái cây" },
    { emoji: "🥚", eng: "Egg", viet: "Quả Trứng", pron: "/eɡ/", category: "Trái cây" },

    // 3. Thiên nhiên - 10 cards
    { emoji: "🌈", eng: "Rainbow", viet: "Cầu Vồng", pron: "/ˈreɪn.boʊ/", category: "Thiên nhiên" },
    { emoji: "☀️", eng: "Sun", viet: "Mặt Trời", pron: "/sʌn/", category: "Thiên nhiên" },
    { emoji: "🌙", eng: "Moon", viet: "Mặt Trăng", pron: "/muːn/", category: "Thiên nhiên" },
    { emoji: "⭐", eng: "Star", viet: "Ngôi Sao", pron: "/stɑːr/", category: "Thiên nhiên" },
    { emoji: "🌸", eng: "Flower", viet: "Bông Hoa", pron: "/ˈflaʊ.ər/", category: "Thiên nhiên" },
    { emoji: "🌳", eng: "Tree", viet: "Cái Cây", pron: "/triː/", category: "Thiên nhiên" },
    { emoji: "☁️", eng: "Cloud", viet: "Đám Mây", pron: "/klaʊd/", category: "Thiên nhiên" },
    { emoji: "🌧️", eng: "Rain", viet: "Mưa", pron: "/reɪn/", category: "Thiên nhiên" },
    { emoji: "❄️", eng: "Snow", viet: "Tuyết", pron: "/snoʊ/", category: "Thiên nhiên" },
    { emoji: "💨", eng: "Wind", viet: "Gió", pron: "/wɪnd/", category: "Thiên nhiên" },

    // 4. Học tập - 10 cards
    { emoji: "📖", eng: "Book", viet: "Quyển Sách", pron: "/bʊk/", category: "Học tập" },
    { emoji: "✏️", eng: "Pencil", viet: "Bút Chì", pron: "/ˈpen.səl/", category: "Học tập" },
    { emoji: "🖊️", eng: "Pen", viet: "Bút Bi", pron: "/pen/", category: "Học tập" },
    { emoji: "📏", eng: "Ruler", viet: "Thước Kẻ", pron: "/ˈruː.lər/", category: "Học tập" },
    { emoji: "🧽", eng: "Eraser", viet: "Cục Tẩy", pron: "/ɪˈreɪ.sər/", category: "Học tập" },
    { emoji: "🎒", eng: "Bag", viet: "Cặp Sách", pron: "/bæɡ/", category: "Học tập" },
    { emoji: "🪑", eng: "Chair", viet: "Cái Ghế", pron: "/tʃer/", category: "Học tập" },
    { emoji: "💻", eng: "Computer", viet: "Máy Tính", pron: "/kəmˈpjuː.tər/", category: "Học tập" },
    { emoji: "📄", eng: "Paper", viet: "Tờ Giấy", pron: "/ˈpeɪ.pər/", category: "Học tập" },
    { emoji: "🖌️", eng: "Marker", viet: "Bút Dạ", pron: "/ˈmɑːr.kər/", category: "Học tập" },

    // 5. Xe & Đồ chơi - 10 cards
    { emoji: "🚗", eng: "Car", viet: "Xe Ô Tô", pron: "/kɑːr/", category: "Xe & Đồ chơi" },
    { emoji: "🚲", eng: "Bicycle", viet: "Xe Đạp", pron: "/ˈbaɪ.sɪ.kəl/", category: "Xe & Đồ chơi" },
    { emoji: "🚂", eng: "Train", viet: "Tàu Hỏa", pron: "/treɪn/", category: "Xe & Đồ chơi" },
    { emoji: "✈️", eng: "Airplane", viet: "Máy Bay", pron: "/ˈer.pleɪn/", category: "Xe & Đồ chơi" },
    { emoji: "⚽", eng: "Ball", viet: "Quả Bóng", pron: "/bɔːl/", category: "Xe & Đồ chơi" },
    { emoji: "🎈", eng: "Balloon", viet: "Bóng Bay", pron: "/bəˈluːn/", category: "Xe & Đồ chơi" },
    { emoji: "🚀", eng: "Rocket", viet: "Tên Lửa", pron: "/ˈrɑː.kɪt/", category: "Xe & Đồ chơi" },
    { emoji: "🤖", eng: "Robot", viet: "Người Máy", pron: "/ˈroʊ.bɑːt/", category: "Xe & Đồ chơi" },
    { emoji: "🧸", eng: "Doll", viet: "Búp Bê", pron: "/dɑːl/", category: "Xe & Đồ chơi" },
    { emoji: "🪁", eng: "Kite", viet: "Cái Diều", pron: "/kaɪt/", category: "Xe & Đồ chơi" },

    // 6. Màu sắc - 10 cards
    { emoji: "🔴", eng: "Red", viet: "Màu Đỏ", pron: "/red/", category: "Màu sắc" },
    { emoji: "🔵", eng: "Blue", viet: "Màu Xanh Dương", pron: "/bluː/", category: "Màu sắc" },
    { emoji: "🟢", eng: "Green", viet: "Màu Xanh Lá", pron: "/ɡriːn/", category: "Màu sắc" },
    { emoji: "🟡", eng: "Yellow", viet: "Màu Vàng", pron: "/ˈjel.oʊ/", category: "Màu sắc" },
    { emoji: "🌸", eng: "Pink", viet: "Màu Hồng", pron: "/pɪŋ/", category: "Màu sắc" },
    { emoji: "🟣", eng: "Purple", viet: "Màu Tím", pron: "/ˈpɜːr.pəl/", category: "Màu sắc" },
    { emoji: "⚫", eng: "Black", viet: "Màu Đen", pron: "/blæk/", category: "Màu sắc" },
    { emoji: "⚪", eng: "White", viet: "Màu Trắng", pron: "/waɪt/", category: "Màu sắc" },
    { emoji: "🟤", eng: "Brown", viet: "Màu Nâu", pron: "/braʊn/", category: "Màu sắc" },
    { emoji: "🔘", eng: "Gray", viet: "Màu Xám", pron: "/ɡreɪ/", category: "Màu sắc" },

    // 7. Số đếm (Dynamic from 0 to 100)
    ...generateNumberCards(),

    // 8. Cơ thể bé - 10 cards
    { emoji: "👦", eng: "Head", viet: "Cái Đầu", pron: "/hed/", category: "Cơ thể bé" },
    { emoji: "👁️", eng: "Eye", viet: "Con Mắt", pron: "/aɪ/", category: "Cơ thể bé" },
    { emoji: "👃", eng: "Nose", viet: "Cái Mũi", pron: "/noʊz/", category: "Cơ thể bé" },
    { emoji: "👄", eng: "Mouth", viet: "Cái Miệng", pron: "/maʊθ/", category: "Cơ thể bé" },
    { emoji: "👂", eng: "Ear", viet: "Cái Tai", pron: "/ɪr/", category: "Cơ thể bé" },
    { emoji: "🤚", eng: "Hand", viet: "Bàn Tay", pron: "/hænd/", category: "Cơ thể bé" },
    { emoji: "👣", eng: "Foot", viet: "Bàn Chân", pron: "/fʊt/", category: "Cơ thể bé" },
    { emoji: "💇", eng: "Hair", viet: "Mái Tóc", pron: "/her/", category: "Cơ thể bé" },
    { emoji: "💪", eng: "Arm", viet: "Cánh Tay", pron: "/ɑːrm/", category: "Cơ thể bé" },
    { emoji: "🦵", eng: "Leg", viet: "Cái Chân", pron: "/leɡ/", category: "Cơ thể bé" },

    // 9. Gia đình & Nghề - 10 cards
    { emoji: "👨", eng: "Father", viet: "Bố / Cha", pron: "/ˈfɑː.ðər/", category: "Gia đình & Nghề" },
    { emoji: "👩", eng: "Mother", viet: "Mẹ", pron: "/ˈmʌð.ər/", category: "Gia đình & Nghề" },
    { emoji: "👦", eng: "Brother", viet: "Anh Trai", pron: "/ˈbrʌð.ər/", category: "Gia đình & Nghề" },
    { emoji: "👧", eng: "Sister", viet: "Chị Gái", pron: "/ˈsɪs.tər/", category: "Gia đình & Nghề" },
    { emoji: "👶", eng: "Baby", viet: "Em Bé", pron: "/ˈbeɪ.bi/", category: "Gia đình & Nghề" },
    { emoji: "👨‍⚕️", eng: "Doctor", viet: "Bác Sĩ", pron: "/ˈdɑːk.tər/", category: "Gia đình & Nghề" },
    { emoji: "👩‍🏫", eng: "Teacher", viet: "Cô Giáo", pron: "/ˈtiː.tʃər/", category: "Gia đình & Nghề" },
    { emoji: "🧑‍🎓", eng: "Student", viet: "Học Sinh", pron: "/ˈstuː.dənt/", category: "Gia đình & Nghề" },
    { emoji: "🧑‍⚕️", eng: "Nurse", viet: "Y Tá", pron: "/nɜːrs/", category: "Gia đình & Nghề" },
    { emoji: "👨‍✈️", eng: "Pilot", viet: "Phi Công", pron: "/ˈpaɪ.lət/", category: "Gia đình & Nghề" },

    // 10. Ký hiệu toán học - Comprehensive for Kindergarten to Grade 3
    { emoji: "➕", eng: "Plus Sign", viet: "Dấu Cộng", pron: "/plʌs saɪn/", category: "Ký hiệu toán học" },
    { emoji: "➖", eng: "Minus Sign", viet: "Dấu Trừ", pron: "/ˈmaɪ.nəs saɪn/", category: "Ký hiệu toán học" },
    { emoji: "✖️", eng: "Multiplication Sign", viet: "Dấu Nhân", pron: "/ˌmʌl.tə.plɪˈkeɪ.ʃən/", category: "Ký hiệu toán học" },
    { emoji: "➗", eng: "Division Sign", viet: "Dấu Chia", pron: "/dɪˈvɪʒ.ən saɪn/", category: "Ký hiệu toán học" },
    { emoji: "🟰", eng: "Equal Sign", viet: "Dấu Bằng", pron: "/ˈiː.kwəl saɪn/", category: "Ký hiệu toán học" },
    { emoji: "📈", eng: "Greater Than", viet: "Dấu Lớn Hơn", pron: "/ˈɡreɪ.tər ðæn/", category: "Ký hiệu toán học" },
    { emoji: "📉", eng: "Less Than", viet: "Dấu Bé Hơn", pron: "/les ðæn/", category: "Ký hiệu toán học" },
    { emoji: "⚠️", eng: "Not Equal", viet: "Dấu Khác", pron: "/nɑːt ˈiː.kwəl/", category: "Ký hiệu toán học" },
    { emoji: "🤔", eng: "Question Mark", viet: "Dấu Hỏi Chấm", pron: "/ˈkwes.tʃən mɑːrk/", category: "Ký hiệu toán học" },
    { emoji: "🔢", eng: "Number Sign", viet: "Dấu Thăng Số", pron: "/ˈnʌm.bər saɪn/", category: "Ký hiệu toán học" },

    // 11. Hình học phẳng
    { emoji: "⭕", eng: "Circle", viet: "Hình Tròn", pron: "/ˈsɜːr.kəl/", category: "Hình học phẳng" },
    { emoji: "⏹️", eng: "Square", viet: "Hình Vuông", pron: "/skwer/", category: "Hình học phẳng" },
    { emoji: "🔺", eng: "Triangle", viet: "Hình Tam Giác", pron: "/ˈtraɪ.æŋ.ɡəl/", category: "Hình học phẳng" },
    { emoji: "⬜", eng: "Rectangle", viet: "Hình Chữ Nhật", pron: "/ˈrek.tæŋ.ɡəl/", category: "Hình học phẳng" },
    { emoji: "⭐", eng: "Star Shape", viet: "Hình Ngôi Sao", pron: "/stɑːr/", category: "Hình học phẳng" },
    { emoji: "🥚", eng: "Oval", viet: "Hình Bầu Dục", pron: "/ˈoʊ.vəl/", category: "Hình học phẳng" },
    { emoji: "💎", eng: "Diamond Shape", viet: "Hình Thoi", pron: "/ˈdaɪ.mənd/", category: "Hình học phẳng" },
    { emoji: "🛑", eng: "Hexagon", viet: "Hình Lục Giác", pron: "/ˈhek.sə.ɡɒn/", category: "Hình học phẳng" },
    { emoji: "❤️", eng: "Heart Shape", viet: "Hình Trái Tim", pron: "/hɑːrt/", category: "Hình học phẳng" },
    { emoji: "📐", eng: "Right Angle", viet: "Góc Vuông", pron: "/raɪt ˈæŋ.ɡəl/", category: "Hình học phẳng" },

    // 12. Hình khối
    { emoji: "📦", eng: "Cube", viet: "Khối Lập Phương", pron: "/kjuːb/", category: "Hình khối" },
    { emoji: "🥫", eng: "Cylinder", viet: "Khối Trụ", pron: "/ˈsɪl.ɪn.dər/", category: "Hình khối" },
    { emoji: "🔮", eng: "Sphere", viet: "Khối Cầu", pron: "/sfɪr/", category: "Hình khối" },
    { emoji: "🍦", eng: "Cone", viet: "Khối Nón", pron: "/koʊn/", category: "Hình khối" },
    { emoji: "🧱", eng: "Rectangular Block", viet: "Khối Hộp Chữ Nhật", pron: "/rekˈtæŋ.ɡjə.lər blɑːk/", category: "Hình khối" },
    { emoji: "📐", eng: "Pyramid", viet: "Khối Chóp", pron: "/ˈpɪr.ə.mɪd/", category: "Hình khối" },

    // 13. Đo lường
    { emoji: "📏", eng: "Ruler", viet: "Thước Đo Độ Dài", pron: "/ˈruː.lər/", category: "Đo lường" },
    { emoji: "⚖️", eng: "Scale", viet: "Cân Nặng Khối Lượng", pron: "/skeɪl/", category: "Đo lường" },
    { emoji: "🌡️", eng: "Temperature", viet: "Nhiệt Độ C", pron: "/ˈtem.prə.tʃər/", category: "Đo lường" },
    { emoji: "🧪", eng: "Volume", viet: "Thể Tích Lít", pron: "/ˈvɑːl.juːm/", category: "Đo lường" },
    { emoji: "📐", eng: "Protractor", viet: "Thước Đo Góc", pron: "/prəˈtræk.tər/", category: "Đo lường" },
    { emoji: "👣", eng: "Pacing", viet: "Đo Bằng Bước Chân", pron: "/ˈpeɪ.sɪŋ/", category: "Đo lường" },
    { emoji: "⌛", eng: "Hourglass", viet: "Khoảng Thời Gian", pron: "/ˈaʊər.ɡlæs/", category: "Đo lường" },

    // 14. Vị trí không gian
    { emoji: "⬆️", eng: "Above", viet: "Ở Phía Trên", pron: "/əˈbʌv/", category: "Vị trí không gian" },
    { emoji: "⬇️", eng: "Below", viet: "Ở Phía Dưới", pron: "/bɪˈloʊ/", category: "Vị trí không gian" },
    { emoji: "📥", eng: "Inside", viet: "Ở Phía Trong", pron: "/ɪnˈsaɪd/", category: "Vị trí không gian" },
    { emoji: "📤", eng: "Outside", viet: "Ở Phía Ngoài", pron: "/ˌaʊtˈsaɪd/", category: "Vị trí không gian" },
    { emoji: "⬅️", eng: "Left", viet: "Bên Trái", pron: "/left/", category: "Vị trí không gian" },
    { emoji: "➡️", eng: "Right", viet: "Bên Phải", pron: "/raɪt/", category: "Vị trí không gian" },
    { emoji: "🎯", eng: "Middle", viet: "Ở Chính Giữa", pron: "/ˈmɪd.əl/", category: "Vị trí không gian" },
    { emoji: "⏭️", eng: "In Front Of", viet: "Ở Phía Trước", pron: "/ɪn frʌnt ɒv/", category: "Vị trí không gian" },
    { emoji: "⏮️", eng: "Behind", viet: "Ở Phía Sau", pron: "/bɪˈhaɪnd/", category: "Vị trí không gian" },

    // 15. Quy luật
    { emoji: "🔄", eng: "Repeating Pattern", viet: "Quy Luật Lặp Lại", pron: "/rɪˈpiːtɪŋ ˈpæt.ərn/", category: "Quy luật" },
    { emoji: "📈", eng: "Increasing Pattern", viet: "Quy Luật Tăng Thêm", pron: "/ɪnˈkriːsɪŋ ˈpæt.ərn/", category: "Quy luật" },
    { emoji: "📉", eng: "Decreasing Pattern", viet: "Quy Luật Giảm Bớt", pron: "/dɪˈkriːsɪŋ ˈpæt.ərn/", category: "Quy luật" },
    { emoji: "🔁", eng: "Repeat", viet: "Lặp Lại Xoay Vòng", pron: "/rɪˈpiːt/", category: "Quy luật" },
    { emoji: "🔀", eng: "Alternate", viet: "Xen Kẽ Luân Phiên", pron: "/ˈɑːl.tɚ.neɪt/", category: "Quy luật" },
    { emoji: "🔢", eng: "Sequence", viet: "Dãy Số Quy Luật", pron: "/ˈsiː.kwəns/", category: "Quy luật" },
    { emoji: "🧩", eng: "Pattern Puzzle", viet: "Mảnh Ghép Quy Luật", pron: "/ˈpæt.ərn ˈpʌz.əl/", category: "Quy luật" },

    // 16. Logic
    { emoji: "🧠", eng: "Logical Thinking", viet: "Tư Duy Logic", pron: "/ˈlɒdʒ.ɪ.kəl ˈθɪŋ.kɪŋ/", category: "Logic" },
    { emoji: "⚖️", eng: "Comparison", viet: "So Sánh Lớn Bé", pron: "/kəmˈpær.ə.sən/", category: "Logic" },
    { emoji: "🗂️", eng: "Classification", viet: "Phân Loại Đồ Vật", pron: "/ˌklæs.ə.fəˈkeɪ.ʃən/", category: "Logic" },
    { emoji: "🤔", eng: "Deduction", viet: "Suy Luận Tìm Đáp Án", pron: "/dɪˈdʌk.ʃən/", category: "Logic" },
    { emoji: "❌", eng: "True or False", viet: "Đúng hay Sai", pron: "/truː ɔːr fɒls/", category: "Logic" },
    { emoji: "📊", eng: "Venn Diagram", viet: "Sơ Đồ Phân Nhóm Venn", pron: "/ven ˈdaɪ.ə.ɡræm/", category: "Logic" },

    // 17. Thời gian
    { emoji: "⏰", eng: "Clock", viet: "Đồng Hồ Chỉ Giờ", pron: "/klɑːk/", category: "Thời gian" },
    { emoji: "📅", eng: "Calendar", viet: "Lịch Xem Ngày Tháng", pron: "/ˈkæl.ən.dər/", category: "Thời gian" },
    { emoji: "☀️", eng: "Daytime", viet: "Buổi Sáng Ban Ngày", pron: "/ˈdeɪ.taɪm/", category: "Thời gian" },
    { emoji: "🌙", eng: "Nighttime", viet: "Buổi Tối Ban Đêm", pron: "/ˈnaɪt.taɪm/", category: "Thời gian" },
    { emoji: "⏳", eng: "Hourglass", viet: "Đo Thời Gian Trôi", pron: "/ˈaʊər.ɡlæs/", category: "Thời gian" },
    { emoji: "🍁", eng: "Four Seasons", viet: "Bốn Mùa Trong Năm", pron: "/fɔːr ˈsiː.zənz/", category: "Thời gian" },

    // 18. Tiền tệ
    { emoji: "💰", eng: "Money", viet: "Tiền Tệ", pron: "/ˈmʌn.i/", category: "Tiền tệ" },
    { emoji: "🪙", eng: "Coin", viet: "Đồng Tiền Xu", pron: "/kɔɪn/", category: "Tiền tệ" },
    { emoji: "💵", eng: "Banknote", viet: "Tiền Giấy Việt Nam", pron: "/ˈbæŋk.noʊt/", category: "Tiền tệ" },
    { emoji: "🐷", eng: "Saving", viet: "Heo Đất Tiết Kiệm", pron: "/ˈseɪ.vɪŋ/", category: "Tiền tệ" },
    { emoji: "🏷️", eng: "Price Tag", viet: "Giá Bán Hàng Hóa", pron: "/praɪs tæɡ/", category: "Tiền tệ" },
    { emoji: "🛒", eng: "Trade", viet: "Mua Bán Trao Đổi", pron: "/treɪd/", category: "Tiền tệ" },

    // 19. Nhận diện chữ cái
    { emoji: "🍎", eng: "Letter A", viet: "Chữ A (Quả táo)", pron: "/a/", category: "Nhận diện chữ cái" },
    { emoji: "🧣", eng: "Letter Ă", viet: "Chữ Ă (Cái khăn)", pron: "/ă/", category: "Nhận diện chữ cái" },
    { emoji: "🍄", eng: "Letter Â", viet: "Chữ Â (Cây nấm)", pron: "/â/", category: "Nhận diện chữ cái" },
    { emoji: "👶", eng: "Letter B", viet: "Chữ B (Em bé)", pron: "/bờ/", category: "Nhận diện chữ cái" },
    { emoji: "🐟", eng: "Letter C", viet: "Chữ C (Con cá)", pron: "/cờ/", category: "Nhận diện chữ cái" },
    { emoji: "🐐", eng: "Letter D", viet: "Chữ D (Con dê)", pron: "/dờ/", category: "Nhận diện chữ cái" },
    { emoji: "⛵", eng: "Letter Đ", viet: "Chữ Đ (Cái đò)", pron: "/đờ/", category: "Nhận diện chữ cái" },
    { emoji: "🐱", eng: "Letter E", viet: "Chữ E (Con mèo)", pron: "/e/", category: "Nhận diện chữ cái" },
    { emoji: "🐸", eng: "Letter Ê", viet: "Chữ Ê (Con ếch)", pron: "/ê/", category: "Nhận diện chữ cái" },
    { emoji: "🐓", eng: "Letter G", viet: "Chữ G (Con gà)", pron: "/gờ/", category: "Nhận diện chữ cái" },
    { emoji: "🌸", eng: "Letter H", viet: "Chữ H (Bông hoa)", pron: "/hờ/", category: "Nhận diện chữ cái" },
    { emoji: "🔮", eng: "Letter I", viet: "Chữ I (Viên bi)", pron: "/i/", category: "Nhận diện chữ cái" },
    { emoji: "✂️", eng: "Letter K", viet: "Chữ K (Cái kéo)", pron: "/ca/", category: "Nhận diện chữ cái" },
    { emoji: "🍐", eng: "Letter L", viet: "Chữ L (Quả lê)", pron: "/lờ/", category: "Nhận diện chữ cái" },
    { emoji: "🧢", eng: "Letter M", viet: "Chữ M (Cái mũ)", pron: "/mờ/", category: "Nhận diện chữ cái" },
    { emoji: "🍈", eng: "Letter N", viet: "Chữ N (Quả na)", pron: "/nờ/", category: "Nhận diện chữ cái" },
    { emoji: "🐝", eng: "Letter O", viet: "Chữ O (Con ong)", pron: "/o/", category: "Nhận diện chữ cái" },
    { emoji: "☂️", eng: "Letter Ô", viet: "Chữ Ô (Cái ô)", pron: "/ô/", category: "Nhận diện chữ cái" },
    { emoji: "🥑", eng: "Letter Ơ", viet: "Chữ Ơ (Quả bơ)", pron: "/ơ/", category: "Nhận diện chữ cái" },
    { emoji: "🔦", eng: "Letter P", viet: "Chữ P (Đèn pin)", pron: "/pờ/", category: "Nhận diện chữ cái" },
    { emoji: "🍊", eng: "Letter Q", viet: "Chữ Q (Quả quýt)", pron: "/cu/", category: "Nhận diện chữ cái" },
    { emoji: "🐢", eng: "Letter R", viet: "Chữ R (Con rùa)", pron: "/rờ/", category: "Nhận diện chữ cái" },
    { emoji: "🦁", eng: "Letter S", viet: "Chữ S (Con sư tử)", pron: "/sờ/", category: "Nhận diện chữ cái" },
    { emoji: "🦐", eng: "Letter T", viet: "Chữ T (Con tôm)", pron: "/tờ/", category: "Nhận diện chữ cái" },
    { emoji: "🗄️", eng: "Letter U", viet: "Chữ U (Cái tủ)", pron: "/u/", category: "Nhận diện chữ cái" },
    { emoji: "✉️", eng: "Letter Ư", viet: "Chữ Ư (Lá thư)", pron: "/ư/", category: "Nhận diện chữ cái" },
    { emoji: "🐘", eng: "Letter V", viet: "Chữ V (Con voi)", pron: "/vờ/", category: "Nhận diện chữ cái" },
    { emoji: "🚲", eng: "Letter X", viet: "Chữ X (Xe đạp)", pron: "/xờ/", category: "Nhận diện chữ cái" },
    { emoji: "🏥", eng: "Letter Y", viet: "Chữ Y (Y tá)", pron: "/i kéo dài/", category: "Nhận diện chữ cái" },

    // 20. Học âm và vần
    { emoji: "🍊", eng: "Vần AM", viet: "Vần am - Quả cam", pron: "/am/", category: "Học âm và vần" },
    { emoji: "🪑", eng: "Vần AN", viet: "Vần an - Cái bàn", pron: "/an/", category: "Học âm và vần" },
    { emoji: "🟡", eng: "Vần ANG", viet: "Vần ang - Màu vàng", pron: "/ang/", category: "Học âm và vần" },
    { emoji: "🌿", eng: "Vần ANH", viet: "Vần anh - Cành lá", pron: "/anh/", category: "Học âm và vần" },
    { emoji: "🐇", eng: "Vần ON", viet: "Vần on - Con thỏ", pron: "/on/", category: "Học âm và vần" },
    { emoji: "🐝", eng: "Vần ONG", viet: "Vần ong - Con ong", pron: "/ong/", category: "Học âm và vần" },
    { emoji: "✈️", eng: "Vần AY", viet: "Vần ay - Máy bay", pron: "/ay/", category: "Học âm và vần" },
    { emoji: "🥬", eng: "Vần AU", viet: "Vần au - Rau xanh", pron: "/au/", category: "Học âm và vần" },
    { emoji: "🪁", eng: "Vần IÊU", viet: "Vần iêu - Cánh diều", pron: "/iêu/", category: "Học âm và vần" },
    { emoji: "🔔", eng: "Vần UÔNG", viet: "Vần uông - Cái chuông", pron: "/uông/", category: "Học âm và vần" },

    // 21. Ghép tiếng
    { emoji: "👨", eng: "Spelling: Ba", viet: "b - a - ba (Ba)", pron: "/bờ - a - ba/", category: "Ghép tiếng" },
    { emoji: "🐟", eng: "Spelling: Cá", viet: "c - a - ca - sắc - cá (Con cá)", pron: "/cờ - a - ca - sắc - cá/", category: "Ghép tiếng" },
    { emoji: "☘️", eng: "Spelling: Cỏ", viet: "c - o - co - hỏi - cỏ (Ngọn cỏ)", pron: "/cờ - o - co - hỏi - cỏ/", category: "Ghép tiếng" },
    { emoji: "🐓", eng: "Spelling: Gà", viet: "g - a - ga - huyền - gà (Con gà)", pron: "/gờ - a - ga - huyền - gà/", category: "Ghép tiếng" },
    { emoji: "🏠", eng: "Spelling: Nhà", viet: "nh - a - nha - huyền - nhà (Ngôi nhà)", pron: "/nhờ - a - nha - huyền - nhà/", category: "Ghép tiếng" },
    { emoji: "👩", eng: "Spelling: Mẹ", viet: "m - e - me - nặng - mẹ (Mẹ bò/mẹ yêu)", pron: "/mờ - e - me - nặng - mẹ/", category: "Ghép tiếng" },
    { emoji: "⛵", eng: "Spelling: Bố", viet: "b - ô - bô - sắc - bố (Bố bé)", pron: "/bờ - ô - bô - sắc - bố/", category: "Ghép tiếng" },
    { emoji: "🌸", eng: "Spelling: Hoa", viet: "h - oa - hoa (Bông hoa)", pron: "/hờ - oa - hoa/", category: "Ghép tiếng" },
    { emoji: "🦗", eng: "Spelling: Ve", viet: "v - e - ve (Con ve sầu)", pron: "/vờ - e - ve/", category: "Ghép tiếng" },
    { emoji: "🐈", eng: "Spelling: Mèo", viet: "m - eo - meo - huyền - mèo (Con mèo)", pron: "/mờ - eo - meo - huyền - mèo/", category: "Ghép tiếng" },

    // 22. Tinh tay
    { emoji: "✏️", eng: "Line Tracing", viet: "Tập nối nét (Luyện bút dẻo dai)", pron: "/laɪn ˈtreɪ.sɪŋ/", category: "Tinh tay" },
    { emoji: "🎨", eng: "Coloring", viet: "Tô nét màu sắc (Khéo léo đôi bàn tay)", pron: "/ˈkʌl.ər.ɪŋ/", category: "Tinh tay" },
    { emoji: "🔢", eng: "Number Tracing", viet: "Đồ chữ số (Tô vẽ số đếm)", pron: "/ˈnʌm.bər ˈtreɪ.sɪŋ/", category: "Tinh tay" },
    { emoji: "✂️", eng: "Cut and Paste", viet: "Cắt dán thủ công (Kéo và hồ dán)", pron: "/kʌt ænd peɪst/", category: "Tinh tay" },
    { emoji: "📿", eng: "Bead Stringing", viet: "Xâu chuỗi hạt (Rèn luyện sự kiên nhẫn)", pron: "/biːd ˈstrɪŋ.ɪŋ/", category: "Tinh tay" },
    { emoji: "🥢", eng: "Tweezer Play", viet: "Gắp và kẹp đồ vật (Tinh tay khéo léo)", pron: "/ˈtwiː.zər pleɪ/", category: "Tinh tay" },
    { emoji: "📐", eng: "Paper Folding", viet: "Gấp giấy Origami (Xếp hình sáng tạo)", pron: "/ˈpeɪ.pər ˈfoʊl.dɪŋ/", category: "Tinh tay" },
    { emoji: "🧱", eng: "Building Blocks", viet: "Xếp hình khối (Phát triển tư duy)", pron: "/ˈbɪl.dɪŋ blɑːks/", category: "Tinh tay" },

    // 23. Kỹ năng
    { emoji: "👕", eng: "Self Care", viet: "Tự phục vụ (Gấp áo quần, đi giày)", pron: "/self ker/", category: "Kỹ năng" },
    { emoji: "🧹", eng: "Daily Routine", viet: "Sinh hoạt (Dọn dẹp phòng ngủ, sắp xếp đồ chơi)", pron: "/ˈdeɪ.li ruːˈtiːn/", category: "Kỹ năng" },
    { emoji: "🛑", eng: "Safety Skills", viet: "An toàn (Phòng tránh ổ điện, nước sôi)", pron: "/ˈseɪf.ti skɪlz/", category: "Kỹ năng" },
    { emoji: "🤝", eng: "Social Skills", viet: "Giao tiếp lễ phép (Chào hỏi, cảm ơn)", pron: "/ˈsoʊ.ʃəl skɪlz/", category: "Kỹ năng" },
    { emoji: "❤️", eng: "Emotions", viet: "Cảm xúc (Gọi tên vui buồn, yêu thương)", pron: "/ɪˈmoʊ.ʃənz/", category: "Kỹ năng" },
    { emoji: "🎯", eng: "Focus & Attention", viet: "Tập trung chú ý (Lắng nghe cô giảng)", pron: "/ˈfoʊ.kəs əˈten.ʃən/", category: "Kỹ năng" },

    // 24. Âm nhạc
    { emoji: "🎵", eng: "Music Appreciation", viet: "Cảm thụ âm nhạc (Lắng nghe & cảm nhận giai điệu)", pron: "/ˈmjuː.zɪk əˌpriː.ʃiˈeɪ.ʃən/", category: "Âm nhạc" },
    { emoji: "🥁", eng: "Rhythm Clapping", viet: "Gõ nhịp điệu (Vỗ tay & gõ nhịp theo bài hát)", pron: "/ˈrɪð.əm ˈklæp.ɪŋ/", category: "Âm nhạc" },
    { emoji: "🎤", eng: "Sing & Dance", viet: "Hát và vận động (Múa hát kết hợp cơ thể)", pron: "/sɪŋ ænd dæns/", category: "Âm nhạc" },
    { emoji: "🎼", eng: "Solfege Play", viet: "Trò chơi xướng âm (Tập hát Đồ - Rê - Mi)", pron: "/sɒlˈfɛʒ pleɪ/", category: "Âm nhạc" },
    { emoji: "🐤", eng: "One Little Duck", viet: "Bài hát: Một con vịt (Vui nhộn nhảy múa cùng cánh vịt xinh)", pron: "/wʌn ˈlɪt.əl dʌk/", category: "Âm nhạc" },
    { emoji: "👪", eng: "Family Love", viet: "Bài hát: Cả nhà thương nhau (Ấm áp sum vầy tình yêu gia đình)", pron: "/ˈfæm.əl.i lʌv/", category: "Âm nhạc" },
    { emoji: "🦋", eng: "Golden Butterfly", viet: "Bài hát: Kìa con bướm vàng (Múa bay rập rờn đôi cánh xinh xắn)", pron: "/ðə ˈɡoʊl.dən ˈbʌt.ər.flaɪ/", category: "Âm nhạc" },
    { emoji: "😺", eng: "Wash Like a Cat", viet: "Bài hát: Rửa mặt như mèo (Tập giữ vệ sinh cá nhân lành sạch)", pron: "/wɑːʃ laɪk ə kæt/", category: "Âm nhạc" },

    // 25. Mỹ thuật
    { emoji: "✏️", eng: "Basic Drawing", viet: "Vẽ nét cơ bản (Tròn, thẳng, sóng lượn)", pron: "/ˈbeɪ.sɪk ˈdrɔː.ɪŋ/", category: "Mỹ thuật" },
    { emoji: "🎨", eng: "Color Mixing", viet: "Pha trộn sắc màu (Phép thuật tạo màu mới)", pron: "/ˈkʌl.ər ˈmɪks.ɪŋ/", category: "Mỹ thuật" },
    { emoji: "🧸", eng: "Clay Modeling", viet: "Nặn đất sét (Xoay tròn, ép dẹt tạo hình)", pron: "/kleɪ ˈmɒd.əl.ɪŋ/", category: "Mỹ thuật" },
    { emoji: "👇", eng: "Fingerprint Art", viet: "In tranh vân tay (Đóng dấu màu sáng tạo)", pron: "/ˈfɪŋ.ɡər.prɪnt ɑːrt/", category: "Mỹ thuật" },
    { emoji: "🖼️", eng: "Torn Paper Art", viet: "Xé dán nghệ thuật (Xé giấy thủ công nghệ thuật)", pron: "/tɔːrn ˈpeɪ.pər ɑːrt/", category: "Mỹ thuật" }
  ];

  // Helper inside component to easily tag and slice categories
  const getCategory = (cardObj: Flashcard): { name: string; icon: string } => {
    const cat = cardObj.category || "Động vật";
    const iconsMap: Record<string, string> = {
      "Động vật": "🦁",
      "Trái cây": "🍎",
      "Thiên nhiên": "🌈",
      "Học tập": "✏️",
      "Xe & Đồ chơi": "🚗",
      "Màu sắc": "🎨",
      "Số học": "🔢",
      "Cơ thể bé": "👦",
      "Gia đình & Nghề": "🧑‍👩‍👧",
      "Hình học": "🔷",
      "Logic": "🧠",
      "Quan sát": "👀",
      "Số đếm": "🔢",
      "Ký hiệu toán học": "➕",
      "Hình học phẳng": "🔷",
      "Hình khối": "🧊",
      "Đo lường": "📏",
      "Vị trí không gian": "📍",
      "Quy luật": "🔄",
      "Thời gian": "⏰",
      "Tiền tệ": "💰",
      "Nhận diện chữ cái": "🅰️",
      "Học âm và vần": "🔔",
      "Ghép tiếng": "🗣️",
      "Tinh tay": "✋",
      "Kỹ năng": "🧠",
      "Âm nhạc": "🎵",
      "Mỹ thuật": "🎨"
    };
    return { name: cat, icon: iconsMap[cat] || "🌟" };
  };

  // Dynamic available categories based on subject choice
  const getAvailableCategories = () => {
    switch (subFilter) {
      case 'toan':
        return [
          { key: 'Tất cả', label: 'Tất cả Toán 🧮' },
          { key: 'Số đếm', label: '🔢 Số đếm' },
          { key: 'Ký hiệu toán học', label: '➕ Ký hiệu' },
          { key: 'Hình học phẳng', label: '🔷 Hình phẳng' },
          { key: 'Hình khối', label: '🧊 Hình khối' },
          { key: 'Đo lường', label: '📏 Đo lường' },
          { key: 'Vị trí không gian', label: '📍 Vị trí' },
          { key: 'Quy luật', label: '🔄 Quy luật' },
          { key: 'Logic', label: '🧠 Logic' },
          { key: 'Thời gian', label: '⏰ Thời gian' },
          { key: 'Tiền tệ', label: '💰 Tiền tệ' }
        ];
      case 'tieng_viet':
        return [
          { key: 'Tất cả', label: 'Tất cả Tiếng Việt 📖' },
          { key: 'Nhận diện chữ cái', label: '🅰️ Nhận diện chữ cái' },
          { key: 'Học âm và vần', label: '🔔 Học âm & Vần' },
          { key: 'Ghép tiếng', label: '🗣️ Ghép tiếng' },
          { key: 'Học tập', label: 'Học tập ✏️' },
          { key: 'Cơ thể bé', label: 'Cơ thể bé 👦' },
          { key: 'Gia đình & Nghề', label: 'Gia đình 🧑‍👩‍👧' }
        ];
      case 'ky_nang':
        return [
          { key: 'Tất cả', label: 'Tất cả Kỹ Năng 🎨' },
          { key: 'Tinh tay', label: '✋ Tinh tay' },
          { key: 'Kỹ năng', label: '🧠 Kỹ năng' },
          { key: 'Âm nhạc', label: '🎵 Âm nhạc' },
          { key: 'Mỹ thuật', label: '🎨 Mỹ thuật' }
        ];
      case 'tieng_anh':
      default:
        return [
          { key: 'Tất cả', label: 'Tất cả Từ Vựng 🇺🇸' },
          { key: 'Động vật', label: 'Động vật 🦁' },
          { key: 'Trái cây', label: 'Trái cây 🍎' },
          { key: 'Thiên nhiên', label: 'Thiên nhiên 🌈' },
          { key: 'Học tập', label: 'Học tập ✏️' },
          { key: 'Xe & Đồ chơi', label: 'Đồ chơi 🚗' },
          { key: 'Màu sắc', label: 'Màu sắc 🎨' },
          { key: 'Cơ thể bé', label: 'Cơ thể bé 👦' },
          { key: 'Gia đình & Nghề', label: 'Gia đình 🧑‍👩‍👧' },
          { key: 'Số đếm', label: 'Số đếm 🔢' },
          { key: 'Ký hiệu toán học', label: 'Ký hiệu ➕' },
          { key: 'Hình học phẳng', label: 'Hình phẳng 🔷' },
          { key: 'Hình khối', label: 'Hình khối 🧊' }
        ];
    }
  };

  const categories = getAvailableCategories();

  const [activeLearningMode, setActiveLearningMode] = useState<'flashcard' | 'exercise'>('flashcard');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
  const activeMusicStopRef = useRef<(() => void) | null>(null);

  // Reset filter when parent subFilter changes
  useEffect(() => {
    setSelectedCategory('Tất cả');
    setCurrentIndex(0);
    setIsFlipped(false);
    setActiveLearningMode('flashcard');
    if (activeMusicStopRef.current) {
      activeMusicStopRef.current();
      activeMusicStopRef.current = null;
    }
  }, [subFilter]);

  // Reset steps checkbox on category or index slide, and stop background music
  useEffect(() => {
    setCompletedSteps([false, false, false]);
    if (activeMusicStopRef.current) {
      activeMusicStopRef.current();
      activeMusicStopRef.current = null;
    }
  }, [currentIndex, selectedCategory]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (activeMusicStopRef.current) {
        activeMusicStopRef.current();
      }
    };
  }, []);

  // Warm up Web Speech Synthesis voices early under the hood for Chrome compatibility
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
          }
        };
      }
    }
  }, []);

  // Filter cards by subject first, then by child category
  const getSubjectFilteredCards = () => {
    switch (subFilter) {
      case 'toan':
        return flashcardsDeck.filter(item => 
          item.category === 'Số đếm' || 
          item.category === 'Ký hiệu toán học' || 
          item.category === 'Hình học phẳng' || 
          item.category === 'Hình khối' || 
          item.category === 'Đo lường' || 
          item.category === 'Vị trí không gian' || 
          item.category === 'Quy luật' || 
          item.category === 'Logic' || 
          item.category === 'Thời gian' || 
          item.category === 'Tiền tệ'
        );
      case 'tieng_viet':
        return flashcardsDeck.filter(item => 
          item.category === 'Nhận diện chữ cái' || 
          item.category === 'Học âm và vần' || 
          item.category === 'Ghép tiếng' || 
          item.category === 'Học tập' || 
          item.category === 'Cơ thể bé' || 
          item.category === 'Gia đình & Nghề'
        );
      case 'ky_nang':
        return flashcardsDeck.filter(item => 
          item.category === 'Tinh tay' || 
          item.category === 'Kỹ năng' ||
          item.category === 'Âm nhạc' ||
          item.category === 'Mỹ thuật'
        );
      case 'tieng_anh':
      default:
        return flashcardsDeck;
    }
  };

  const subjectFilteredCards = getSubjectFilteredCards();

  const filteredCards = selectedCategory === 'Tất cả' || !selectedCategory.startsWith('Tất cả') && selectedCategory === 'Tất cả' // Safe fallback
    ? subjectFilteredCards 
    : subjectFilteredCards.filter(item => item.category === selectedCategory);

  const card = filteredCards[currentIndex] || filteredCards[0] || flashcardsDeck[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playBeep(450, 75);
  };

  const handleNext = () => {
    setIsFlipped(false);
    playBeep(480, 100);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    playBeep(480, 100);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  // Play background song melody using Web Audio API
  const playSongMelody = (songKey: string) => {
    if (typeof window === 'undefined') return;
    
    // Stop any currently playing background melody
    if (activeMusicStopRef.current) {
      activeMusicStopRef.current();
      activeMusicStopRef.current = null;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    try {
      const ctx = new AudioContextClass();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.06, ctx.currentTime); // Gentle background volume
      masterGain.connect(ctx.destination);

      const NOTES: Record<string, number> = {
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
      };

      let sequence: { note: string, dur: number }[] = [];
      const keyClean = songKey.toLowerCase();

      if (keyClean.includes("vịt") || keyClean.includes("duck")) {
        // Một con vịt
        sequence = [
          { note: 'G4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.55 },
          { note: 'A4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'D4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'D4', dur: 0.55 },
          { note: 'C4', dur: 0.35 }, { note: 'D4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.55 },
          { note: 'G4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.55 },
          { note: 'C4', dur: 0.35 }, { note: 'D4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'D4', dur: 0.35 }, { note: 'D4', dur: 0.35 }, { note: 'C4', dur: 0.65 }
        ];
      } else if (keyClean.includes("ba thương con") || keyClean.includes("nhà thương nhau") || keyClean.includes("family")) {
        // Cả nhà thương nhau
        sequence = [
          { note: 'C4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'G4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 0.6 },
          { note: 'A4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'G4', dur: 0.4 }, { note: 'D4', dur: 0.4 }, { note: 'C4', dur: 0.6 },
          { note: 'G4', dur: 0.4 }, { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'G4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 0.6 },
          { note: 'A4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'D4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'C4', dur: 0.7 }
        ];
      } else if (keyClean.includes("bướm vàng") || keyClean.includes("butterfly")) {
        // Kìa con bướm vàng
        sequence = [
          { note: 'C4', dur: 0.45 }, { note: 'D4', dur: 0.45 }, { note: 'E4', dur: 0.45 }, { note: 'C4', dur: 0.45 },
          { note: 'C4', dur: 0.45 }, { note: 'D4', dur: 0.45 }, { note: 'E4', dur: 0.45 }, { note: 'C4', dur: 0.45 },
          { note: 'E4', dur: 0.45 }, { note: 'F4', dur: 0.45 }, { note: 'G4', dur: 0.75 },
          { note: 'E4', dur: 0.45 }, { note: 'F4', dur: 0.45 }, { note: 'G4', dur: 0.75 },
          { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'F4', dur: 0.35 }, { note: 'E4', dur: 0.45 }, { note: 'C4', dur: 0.45 },
          { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'F4', dur: 0.35 }, { note: 'E4', dur: 0.45 }, { note: 'C4', dur: 0.45 },
          { note: 'C4', dur: 0.45 }, { note: 'G4', dur: 0.45 }, { note: 'C4', dur: 0.75 },
          { note: 'C4', dur: 0.45 }, { note: 'G4', dur: 0.45 }, { note: 'C4', dur: 0.75 }
        ];
      } else if (keyClean.includes("mèo") || keyClean.includes("cat")) {
        // Rửa mặt như mèo
        sequence = [
          { note: 'E4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'G4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 0.6 },
          { note: 'A4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'D4', dur: 0.4 }, { note: 'C4', dur: 0.6 },
          { note: 'E4', dur: 0.35 }, { note: 'G4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'D4', dur: 0.6 },
          { note: 'E4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'G4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 0.6 },
          { note: 'A4', dur: 0.35 }, { note: 'A4', dur: 0.35 }, { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'D4', dur: 0.4 }, { note: 'C4', dur: 0.7 }
        ];
      }

      if (sequence.length === 0) return;

      const activeOscillators: { osc1: OscillatorNode; osc2: OscillatorNode }[] = [];
      let timeOffset = ctx.currentTime + 0.15;

      sequence.forEach((item) => {
        const freq = NOTES[item.note] || 440;
        const dur = item.dur;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, timeOffset);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, timeOffset);

        gainNode.gain.setValueAtTime(0, timeOffset);
        gainNode.gain.linearRampToValueAtTime(0.07, timeOffset + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.001, timeOffset + dur - 0.04);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(masterGain);

        osc1.start(timeOffset);
        osc2.start(timeOffset);
        osc1.stop(timeOffset + dur);
        osc2.stop(timeOffset + dur);

        activeOscillators.push({ osc1, osc2 });
        timeOffset += dur;
      });

      const stopFn = () => {
        activeOscillators.forEach(o => {
          try { o.osc1.stop(); } catch (e) {}
          try { o.osc2.stop(); } catch (e) {}
        });
        try { ctx.close(); } catch (e) {}
      };

      activeMusicStopRef.current = stopFn;

      const totalDurationMs = (timeOffset - ctx.currentTime) * 1000;
      setTimeout(() => {
        if (activeMusicStopRef.current === stopFn) {
          activeMusicStopRef.current = null;
        }
      }, totalDurationMs + 500);

    } catch (e) {
      console.warn("Melody synthesizer error:", e);
    }
  };

  // Speak helper using native Google Chrome Speech Synthesis API for standard Vietnamese and English
  const handleSpeakText = (e: React.MouseEvent, text: string, langCode: 'en-US' | 'vi-VN') => {
    e.stopPropagation(); // Avoid flipping the card
    playBeep(650, 80);
    
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast(`🔈 Phát âm: "${text}" (Thiết bị không hỗ trợ phát âm tự động)`);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any currently playing audio immediately

      let cleanText = text;
      if (langCode === 'vi-VN') {
        // Strip dashes and brackets to speak clean chunks
        cleanText = text
          .replace(/-/g, ' ')
          .replace(/[\(\)]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langCode;

      // Get standard browser/device voices directly at runtime to ensure full 100% real-time load
      const allVoices = window.speechSynthesis.getVoices();

      if (langCode === 'vi-VN') {
        const viVoices = allVoices.filter(v => 
          v.lang.toLowerCase().replace('_', '-').startsWith('vi')
        );

        // 1. Highest Priority: Google Chrome Standard Vietnamese Voice (usually called "Google tiếng Việt" or includes "google")
        let viVoice = viVoices.find(voice => {
          const name = voice.name.toLowerCase();
          return name.includes('google') && (name.includes('tiếng việt') || name.includes('viet') || name.includes('vi-') || name.includes('vn'));
        });

        // 2. Second Priority: Any other Google Cloud/Network voice
        if (!viVoice) {
          viVoice = viVoices.find(voice => voice.name.toLowerCase().includes('google'));
        }

        // 3. Third Priority: Familiar high-quality system voices (Hoai My for Microsoft Windows, Linh/My An for Apple iOS/macOS)
        if (!viVoice) {
          viVoice = viVoices.find(voice => {
            const name = voice.name.toLowerCase();
            return name.includes('hoaimy') || name.includes('hoài mỹ') || name.includes('linh') || name.includes('my an') || name.includes('mỹ an');
          });
        }

        // 4. Fourth Priority: Default system voice
        if (!viVoice) {
          viVoice = viVoices.find(voice => voice.default);
        }

        // 5. Final Fallback: First Vietnamese voice in list
        if (!viVoice) {
          viVoice = viVoices[0];
        }

        if (viVoice) {
          utterance.voice = viVoice;
        }

        // Test if the text contains a kid song to tune speech rate & pitch & play synthesized track!
        const isKidsSong = text.toLowerCase().includes("một con vịt") || 
                           text.toLowerCase().includes("thương nhau") || 
                           text.toLowerCase().includes("bướm vàng") || 
                           text.toLowerCase().includes("mèo");

        utterance.lang = 'vi-VN';
        
        if (isKidsSong) {
          utterance.rate = 0.98; // Energetic, crisp tempo
          utterance.pitch = 1.40; // Sweet child-like high pitch!
          playSongMelody(text); // Play beautiful real-time synthesizer melody synchronously!
        } else {
          utterance.rate = 0.90; // Natural slow sweet reading pace
          utterance.pitch = 1.0; 
        }

        window.speechSynthesis.speak(utterance);

        const voiceLabel = viVoice ? viVoice.name : 'Giọng mặc định';
        const isSongLabel = isKidsSong ? "🎶 Đang hát giọng trẻ em" : "Tiger đọc";
        showToast(`🔈 ${isSongLabel} (${voiceLabel}): "${text}"`);
      } else {
        const usVoice = allVoices.find(voice => 
          voice.lang.toLowerCase() === 'en-us' || 
          voice.lang.toLowerCase().replace('-', '_') === 'en_us' ||
          voice.name.toLowerCase().includes('united states') ||
          voice.name.toLowerCase().includes('google us')
        ) || allVoices.find(voice => voice.lang.substring(0, 2) === 'en');

        if (usVoice) utterance.voice = usVoice;
        utterance.rate = 0.85; // Natural speed for English learning kids
        utterance.pitch = 1.05; // Slightly cheerful pitch
        
        window.speechSynthesis.speak(utterance);
        const nameLabel = usVoice ? usVoice.name : 'Mặc định';
        showToast(`⚡ Tiger phát âm tiếng Anh (${nameLabel}): "${text}"`);
      }
    } catch (err) {
      console.error("Speech Synthesis error:", err);
      showToast(`🔈 Lỗi giọng đọc: "${text}"`);
    }
  };

  const isVietFirst = (subFilter === 'toan' || subFilter === 'tieng_viet' || subFilter === 'ky_nang');

  const frontHeader = 
    subFilter === 'toan' ? 'TOÁN TƯ DUY 🧮' :
    subFilter === 'tieng_viet' ? 'TIẾNG VIỆT TẬP ĐỌC 📖' :
    subFilter === 'ky_nang' ? 'KỸ NĂNG & TINH TAY 🎨' :
    'THẦN ĐỒNG TIẾNG ANH 🇺🇸';

  const backHeader = isVietFirst ? 'TIẾNG ANH CHUẨN 🇺🇸' : 'DỊCH NGHĨA TIẾNG VIỆT 🇻🇳';

  const frontText = isVietFirst ? card.viet : card.eng;
  const backText = isVietFirst ? card.eng : card.viet;

  const getForcedCategory = (): 'Số học' | 'Hình học' | 'Logic' | 'Quan sát' | undefined => {
    if (selectedCategory === 'Số đếm' || selectedCategory === 'Ký hiệu toán học' || selectedCategory === 'Đo lường' || selectedCategory === 'Thời gian' || selectedCategory === 'Tiền tệ') return 'Số học';
    if (selectedCategory === 'Hình học phẳng' || selectedCategory === 'Hình khối' || selectedCategory === 'Vị trí không gian') return 'Hình học';
    if (selectedCategory === 'Quy luật' || selectedCategory === 'Logic') return 'Logic';
    return undefined;
  };

  return (
    <div className="bg-gradient-to-tr from-sky-450 via-sky-400 to-indigo-500 rounded-[2.5rem] p-6 sm:p-10 text-white space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <span className="bg-white/20 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles size={11} className="text-yellow-200" /> TRẢI NGHIỆM TRỰC QUAN
          </span>
          <h4 className="text-xl sm:text-2xl font-brand font-bold mt-1 text-white flex items-center gap-2">
            <BookOpen size={24} className="text-sky-150" /> Bảng Từ Vựng Flashcard Thông Minh
          </h4>
        </div>
        {activeLearningMode === 'flashcard' && (
          <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full text-white">
            {filteredCards.length > 0 ? `${currentIndex + 1} / ${filteredCards.length}` : '0 / 0'}
          </span>
        )}
      </div>

      {/* Choose learning mode banner when learning Toán Tư duy */}
      {subFilter === 'toan' && (
        <div className="bg-white/10 p-1.5 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-2 w-full">
          <button
            onClick={() => {
              playBeep(450, 80);
              setActiveLearningMode('flashcard');
            }}
            className={`flex-1 py-3.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer outline-none ${
              activeLearningMode === 'flashcard'
                ? 'bg-white text-indigo-700 shadow-md scale-[1.01]'
                : 'bg-transparent text-slate-100 hover:bg-white/5'
            }`}
          >
            🎴 Thẻ Học Từ Vựng (Flashcards)
          </button>
          <button
            onClick={() => {
              playBeep(520, 80);
              setActiveLearningMode('exercise');
            }}
            className={`flex-1 py-3.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer outline-none ${
              activeLearningMode === 'exercise'
                ? 'bg-yellow-350 text-slate-900 bg-yellow-400 font-extrabold shadow-md scale-[1.01]'
                : 'bg-transparent text-slate-100 hover:bg-white/5'
            }`}
          >
            🧠 Chơi Game Bài Tập Toán Tư Duy (5 Câu/Mục Số Học) ⭐
          </button>
        </div>
      )}

      {/* Categories Filter Bar */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10 no-scrollbar overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              playBeep(400, 60);
              setSelectedCategory(cat.key);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.key
                ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Render selected Mode view */}
      {subFilter === 'toan' && activeLearningMode === 'exercise' ? (
        <div className="bg-white text-slate-800 rounded-3xl p-1 sm:p-4 shadow-xl border border-slate-100">
          <MathQuest 
            activeClassKey={activeClassKey}
            onAwardPoints={onAwardPoints}
            playBeep={playBeep}
            showToast={showToast}
            forcedCategory={getForcedCategory()}
          />
        </div>
      ) : filteredCards.length > 0 ? (
        <div className="space-y-4 w-full animate-in fade-in duration-300">

          {/* Flashcard Viewport wrapper */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-4">
            {/* Nav Left */}
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white/11 hover:bg-white/25 border border-white/20 flex items-center justify-center text-xl transition-all font-bold focus:outline-none cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            
            {/* Card Object / Instruction Dashboard */}
            {(() => {
              const isInstructionCard = card.category === 'Tinh tay' || card.category === 'Kỹ năng' || card.category === 'Âm nhạc' || card.category === 'Mỹ thuật';
              if (isInstructionCard) {
                const instrData = getInstructionData(card.viet);
                const allChecked = completedSteps.every(Boolean);

                return (
                  <div className="w-full max-w-lg bg-orange-50 text-slate-800 rounded-[2rem] p-5 sm:p-7 flex flex-col justify-between items-center shadow-2xl border-4 border-amber-350 transform transition-all duration-300 hover:scale-[1.01] animate-in zoom-in-95 duration-200">
                    {/* Header bar */}
                    <div className="w-full flex justify-between items-center pb-3 border-b border-orange-200 text-[10px] font-extrabold text-orange-600 uppercase tracking-widest">
                      <span className="flex items-center gap-1 font-bold">✋ bé thực hành: {card.category.toUpperCase()}</span>
                      <span className="bg-amber-100 text-amber-850 px-2.2 py-0.5 rounded-full select-none">HƯỚNG DẪN 📖</span>
                    </div>

                    {/* Big Emoji and Title */}
                    <div className="text-center my-3 space-y-1.5 w-full">
                      <span className="text-5xl sm:text-6xl block animate-bounce-soft">{card.emoji}</span>
                      <h5 className="text-xl sm:text-2xl font-brand font-extrabold text-amber-950 tracking-wide">
                        {instrData.title}
                      </h5>
                    </div>

                    {/* Advice Card Callout */}
                    <div className="bg-amber-100/55 rounded-2xl p-3.5 text-[11px] sm:text-xs font-semibold leading-relaxed text-amber-900 border border-amber-200 text-left w-full space-y-1 select-none">
                      <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-amber-500 animate-spin" /> Lời khuyên cho Phụ huynh:
                      </div>
                      <p className="font-medium">{instrData.advice}</p>
                    </div>

                    {/* Active Checklist Steps */}
                    <div className="w-full mt-4 space-y-2 text-left">
                      <p className="text-[10px] uppercase font-black text-amber-900 tracking-wider">
                        Các bước cùng bé thực hiện:
                      </p>
                      {instrData.steps.map((step, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            const next = [...completedSteps];
                            next[idx] = !next[idx];
                            setCompletedSteps(next);
                            playBeep(next[idx] ? 580 : 400, 70);
                            if (next.every(Boolean)) {
                              showToast("🎉 Giỏi quá! Bé đã hoàn thành tất cả các bước bài học rồi! +10đ", "points");
                              onAwardPoints?.(10);
                            }
                          }}
                          className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                            completedSteps[idx] 
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-850' 
                              : 'bg-white hover:bg-orange-100/30 border-orange-200/60 text-slate-700'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${
                            completedSteps[idx] 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'bg-white border-slate-350'
                          }`}>
                            {completedSteps[idx] && <Check size={14} className="stroke-[3]" />}
                          </div>
                          <span className="text-xs font-bold leading-snug">
                            {idx + 1}. {step}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer speech synthesis trigger */}
                    <div className="w-full mt-5 flex flex-col sm:flex-row gap-2 items-center justify-between pt-3 border-t border-orange-150">
                      {allChecked ? (
                        <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1.5 shrink-0 animate-pulse">
                          <Award size={15} className="text-yellow-500 animate-bounce" /> Bé đã hoàn thành xuất sắc!
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-slate-400 shrink-0 select-none">
                          Tích chọn các bước sau khi làm xong
                        </span>
                      )}

                      <button 
                        onClick={(e) => handleSpeakText(e, instrData.audioText, 'vi-VN')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 shadow-sm w-full sm:w-auto justify-center"
                      >
                        <Volume2 size={14} className="text-rose-500 animate-pulse" /> 
                        Tiger hướng dẫn 🐯
                      </button>
                    </div>
                  </div>
                );
              }

              // Normal vocabulary flashcard
              return (
                <div onClick={handleFlip} className="w-72 h-80 perspective-1000 cursor-pointer select-none">
                  <div className={`w-full h-full duration-500 transform-style-3d relative rounded-[2rem] shadow-2xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}>
                    
                    {/* FRONT side */}
                    <div className="absolute inset-0 bg-white rounded-[2rem] p-6 flex flex-col justify-between items-center text-slate-800 backface-hidden border-2 border-indigo-150">
                      <div className="w-full flex justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        <span>{frontHeader}</span>
                        <span className="flex items-center gap-1 text-sky-500">Lật xem <RotateCw size={10} /></span>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <span className="text-7xl block animate-bounce-soft">{card.emoji}</span>
                        <h5 className="text-3xl font-brand font-extrabold text-slate-850 tracking-wide">{frontText}</h5>
                        {isVietFirst ? (
                          <p className="text-xs font-brand text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">
                            Chủ đề: {getCategory(card).name}
                          </p>
                        ) : (
                          <p className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                            {card.pron}
                          </p>
                        )}
                      </div>

                      <button 
                        onClick={(e) => handleSpeakText(e, frontText, isVietFirst ? 'vi-VN' : 'en-US')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                          isVietFirst 
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' 
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        <Volume2 size={15} className={isVietFirst ? 'text-rose-500' : 'text-indigo-500'} /> 
                        Nghe đọc {isVietFirst ? '🇻🇳' : '🇺🇸'}
                      </button>
                    </div>

                    {/* BACK side */}
                    <div className="absolute inset-0 bg-amber-400 rounded-[2rem] p-6 flex flex-col justify-between items-center text-white rotate-y-180 backface-hidden">
                      <div className="w-full flex justify-between text-[10px] font-extrabold text-amber-100 uppercase tracking-widest">
                        <span>{backHeader}</span>
                        <span className="flex items-center gap-1">Quay lại <RotateCw size={10} /></span>
                      </div>

                      <div className="text-center space-y-3">
                        <span className="text-7xl block">{card.emoji}</span>
                        <h5 className="text-3xl font-brand font-extrabold text-white">{backText}</h5>
                        {isVietFirst ? (
                          <p className="text-xs font-mono text-amber-950 font-bold bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                            {card.pron}
                          </p>
                        ) : (
                          <p className="text-xs text-amber-900/80 font-bold bg-white/20 px-3 py-1 rounded-full font-brand">
                            Chủ đề: {getCategory(card).name} {getCategory(card).icon}
                          </p>
                        )}
                      </div>

                      <button 
                        onClick={(e) => handleSpeakText(e, backText, isVietFirst ? 'en-US' : 'vi-VN')}
                        className="px-4 py-2 bg-white/25 hover:bg-white/40 text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <Volume2 size={15} className="text-white" /> 
                        Nghe đối chiếu {isVietFirst ? '🇺🇸' : '🇻🇳'}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })()}

            {/* Nav Right */}
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white/11 hover:bg-white/25 border border-white/20 flex items-center justify-center text-xl transition-all font-bold focus:outline-none cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-white/75 bg-white/5 rounded-2xl">
          Đang không có học liệu từ vựng thuộc danh mục này.
        </div>
      )}
    </div>
  );
};
