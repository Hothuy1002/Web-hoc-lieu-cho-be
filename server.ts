import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // System instructional setup for Tiger Kids AI assistant tutor
  const systemPrompt = `Bạn là "Bạn Hổ Trí Tuệ AI" - một gia sư và trợ lý giáo dục siêu đáng yêu dành cho trẻ em mầm non và tiểu học từ 3 đến 9 tuổi và các bậc phụ huynh Việt Nam. 
Hãy trả lời câu hỏi một cách cực kỳ kiên nhẫn, sử dụng từ ngữ dễ hiểu, nhiều biểu tượng cảm xúc (emoji) dễ thương 🐯🌸⭐🎈.
Nếu người dùng là trẻ em (hỏi các câu hỏi kiến thức phổ thông, toán học, tiếng anh, vẽ tranh, kể chuyện), hãy đóng vai người bạn đồng hành thân thiết, giải thích bằng các ví dụ trực quan sinh động (ví dụ: dùng quả táo, chú sư tử để đố vui).
Nếu người dùng là phụ huynh (hỏi về phương pháp dạy học, tâm lý), hãy chia sẻ kiến thức sư phạm mầm non khoa học, tinh tế và ấm áp.
Hãy giữ câu trả lời súc tích, vui nhộn và định dạng rõ ràng (sử dụng danh sách, chữ in đậm khi cần).`;

  try {
    if (!ai) {
      // Graceful fallback if API key is not configured yet
      const mockResponses = [
        "Chào bạn yêu! 🐯 Mình là Hổ Trí Tuệ đây. Hiện tại khóa học AI của mình đang bảo trì một xíu, nhưng hãy tiếp tục giải đố toán học hoặc học Flashcards cực vui nhé! 🌸",
        "Chào mẹ hiền và bé yêu! 🐯 Bé rất thông minh và chăm chỉ nghe bài giảng đấy nha, cố gắng tích thêm nhiều sao thưởng hôm nay nào! ⭐",
        "Úm ba la xì bùa! Chú Hổ Trí Tuệ chúc bé học toán thật giỏi và luôn ngoan ngoãn vâng lời ba mẹ nhé! 🎉🎈",
        "Hôm nay bé muốn đố toán hay hay nghe mình kể một câu chuyện cổ tích 3 câu dễ thương? Cứ nhắn ngay cho tớ nhé! 📖🎈",
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return res.json({ text: randomResponse });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const text = response.text || "Mình chưa hiểu câu hỏi lắm bé ơi, bé có thể hỏi lại dễ hiểu hơn được không nè? 🐯";
    res.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Có lỗi khi kết nối tới trợ lý AI." });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
