// SỬ DỤNG SEVER ĐƠN THUẦN, HOẠT ĐỘNG VỚI FILE DATA.XLSX

// Function to load knowledge from an Excel file (This mean Keyword)
// // Befor running this code, you have to install package 'xlsx' and 'dotenv'.

// const fs = require('fs');
// const path = require('path');
// const XLSX = require('xlsx');
// let knowledge = [];

// const DATA_FILE = path.join(__dirname, 'data.xlsx');
// // Load (or reload) the sheet into memory
// function loadKnowledge() {

//   const wb = XLSX.readFile(DATA_FILE);  // Read the Excel file
//   console.log('📄 Sheets trong data.xlsx:', wb.SheetNames);
//   knowledge = XLSX.utils
//     .sheet_to_json(wb.Sheets['Sheet1'], { header: 1 })
//     .slice(1)               // drop header row
//     .map(([Keyword, Response]) => ({ Keyword, Response }));
// }
// loadKnowledge();



// console.log(knowledge);  // Log the knowledge base to the console


// // Import to save data in Excel file
// const CHATLOG_FILE = path.join(__dirname, 'chat_log.xlsx'); // dirname means the current directory

// // Fucntion to get AI reply from OpenRouter API
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();
// app.use(cors());
// app.use(express.json());


// // Create a function to log chat turns
// function logChatTurn({ userMessage, botReply, responseType }) {
//   const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
//   // 1. Load or create the workbook
//   const wb = fs.existsSync(CHATLOG_FILE)
//     ? XLSX.readFile(CHATLOG_FILE)  // If file exists, read it
//     : XLSX.utils.book_new();  // If not, create a new workbook

//     // 2. Load or init rows
//     let rows;
//     if (wb.SheetNames.includes(today)) {
//       rows = XLSX.utils.sheet_to_json(wb.Sheets[today], {header: 1});  // Load existing rows
//     } else {
//       rows = [['Time', 'User', 'Bot', 'Type']];  // Initialize rows with headers
//     }

//     // 3. append turn
//     rows.push([new Date().toISOString(), userMessage, botReply, responseType]);  // Add the new chat turn

//     // 4. Write to the sheet
//     const ws = XLSX.utils.aoa_to_sheet(rows);  // Convert rows to a worksheet
//     wb.Sheets[today] = ws;  // Assign the worksheet to the sheet name (today's date)
//     if (!wb.SheetNames.includes(today)) {
//       wb.SheetNames.push(today);  // Add the sheet name if it doesn't exist
//     }
//     XLSX.writeFile(wb, CHATLOG_FILE);  // Write the workbook to the file
// }
// // Chat API route
// app.post('/api/chat', async (req, res) => {
//   // const userMessage = req.body.message;
//   const userMessage = req.body.message.toLowerCase();  // Convert user message to lowercase
//   let botReply, responseType;

//   // 1. Try to find a keyword in the knowledge base (Type: Static memory)
//   const hen = knowledge.find(item => userMessage.includes(item.Keyword.toLowerCase()));

//   /*
//   The "Keyword" is the column name in the Excel file.
//   The "Response" is the column name in the Excel file.
//   You can change the name of these columns in the Excel file.  :v
//   */

//   if (hen) {
//     // If a keyword is found, respond with the corresponding response
//     botReply = hen.Response;  // Get the response from the knowledge base
//     responseType = 'static';  // Set response type to static
//     res.json({ reply: botReply }); 
//   } else { 

//     try {
//       // Call the OpenRouter API to get a response
//       const resp = await axios.post(
//         'https://openrouter.ai/api/v1/chat/completions',  // OpenRouter API endpoint
//         {
//           model: 'openai/gpt-3.5-turbo',  // AI model to use
//           messages: [{ role: 'user', content: userMessage }]  // User's message
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,  // Use your OpenRouter API key
//             'Content-Type': 'application/json'  // Set content type as JSON
//           }
//         }
//       );

//       const reply = resp.data.choices?.[0]?.message?.content || '';  // Get AI's reply
//       responseType = 'ai_kin cha na';
//       botReply = reply;  // Set the bot's reply to the AI's response
//       res.json({ reply });  // Send the reply back to the frontend

//     } catch (err) {
//       console.error('Error with OpenRouter:', err.response?.data || err.message || err);
//       responseType = 'error';
//       botReply = '(AI error, please try again.)';  // Set a default error message
//       res.status(500).json({ reply: botReply });  // Handle any errors
//     }
//   }

//   logChatTurn({userMessage: req.body.message, botReply, responseType});  // Log the chat turn
// });

// // Start the server on port 3000
// app.listen(3000, () => console.log('✅Server running on http://localhost:3000'));


// SỬ DỤNG SEVER ĐƠN THUẦN, HOẠT ĐỘNG VỚI FILE PRODUCTS.XLSX - NHIỀU THÔNG TIN HƠN
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const XLSX = require('xlsx');
// const axios = require('axios');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // ======= Cấu hình đường dẫn =======
// const DATA_FILE = process.env.KB_FILE      || path.join(__dirname, 'products.xlsx');
// const LOG_FILE  = process.env.LOG_FILE     || path.join(__dirname, 'chat_log.xlsx');
// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// let _lastMtime = 0;

// // ======= Cache dữ liệu từ products.xlsx =======
// let dfProducts = [], dfPromo = [], dfContact = [], dfFaq = [];
// function loadData() {
//   let stat;
//   try { stat = fs.statSync(DATA_FILE); }
//   catch { console.error(`❌ Không tìm thấy file ${DATA_FILE}`); return; }

//   if (stat.mtimeMs !== _lastMtime) {
//     const wb = XLSX.readFile(DATA_FILE);
//     dfProducts = XLSX.utils.sheet_to_json(wb.Sheets['Sanpham']   || []);
//     dfPromo    = XLSX.utils.sheet_to_json(wb.Sheets['Khuyenmai'] || []);
//     dfContact  = XLSX.utils.sheet_to_json(wb.Sheets['Lienhe']     || []);
//     dfFaq      = XLSX.utils.sheet_to_json(wb.Sheets['Hoidap']     || []);
//     _lastMtime = stat.mtimeMs;
//     console.log(`🔄 Reloaded data from ${DATA_FILE}`);
//   }
// }
// // Load data lần đầu
// loadData();

// // ======= Hàm ghi log vào chat_log.xlsx =======
// function logChat(userMsg, botReply) {
//   // Tên sheet theo ngày hiện tại, ví dụ "2025-05-20"
//   const today     = new Date();
//   const sheetName = today.toISOString().slice(0,10);

//   // Mở workbook nếu đã có, hoặc tạo mới
//   let wb;
//   if (fs.existsSync(LOG_FILE)) {
//     wb = XLSX.readFile(LOG_FILE);
//   } else {
//     wb = XLSX.utils.book_new();
//   }

//   // Lấy dữ liệu cũ của sheet hôm nay nếu có, hoặc khởi tạo header
//   let data;
//   if (wb.SheetNames.includes(sheetName)) {
//     data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
//   } else {
//     data = [['Timestamp', 'UserMessage', 'BotReply']];
//   }

//   // Thêm dòng mới
//   data.push([
//     new Date().toISOString(),
//     userMsg,
//     botReply
//   ]);

//   // Chuyển mảng 2D thành worksheet
//   const ws = XLSX.utils.aoa_to_sheet(data);

//   // Gán lại hoặc append sheet
//   if (!wb.SheetNames.includes(sheetName)) {
//     XLSX.utils.book_append_sheet(wb, ws, sheetName);
//   } else {
//     wb.Sheets[sheetName] = ws;
//   }

//   // Ghi file
//   XLSX.writeFile(wb, LOG_FILE);
// }

// // ======= Các hàm xử lý tĩnh (giữ nguyên) =======
// function topSelling() {
//   if (!dfProducts.length || dfProducts[0]['Số lượt bán'] == null) {
//     return 'Dữ liệu lượt bán chưa có.';
//   }
//   const top3 = [...dfProducts]
//     .sort((a, b) => (b['Số lượt bán']||0) - (a['Số lượt bán']||0))
//     .slice(0, 3);
//   return 'Top sản phẩm bán chạy:\n' +
//     top3.map(r => `- ${r['Tên sản phẩm']} (${r['Số lượt bán']} lượt)`).join('\n');
// }

// function currentPromos() {
//   if (!dfPromo.length) return 'Hiện chưa có chương trình khuyến mãi nào.';
//   return 'Các chương trình khuyến mãi:\n' + dfPromo.map(r =>
//     `🎁 ${r['TenChuongTrinh']}: ${r['MoTa']} (Áp dụng: ${r['SanPhamApDung']})`
//   ).join('\n');
// }

// function promoForProduct(msg) {
//   let out = dfPromo
//     .filter(r =>
//       String(r['SanPhamApDung']).toLowerCase()!=='tất cả' &&
//       msg.includes(String(r['SanPhamApDung']).toLowerCase())
//     )
//     .map(r =>
//       `🎉 ${r['TenChuongTrinh']}: ${r['MoTa']} (Áp dụng: ${r['SanPhamApDung']})`
//     );
//   if (!out.length) {
//     out = dfPromo
//       .filter(r => String(r['SanPhamApDung']).trim().toLowerCase()==='tất cả')
//       .map(r =>
//         `🎉 ${r['TenChuongTrinh']}: ${r['MoTa']} (Áp dụng: Tất cả)`
//       );
//   }
//   return out.length ? out.join('\n') : null;
// }

// function detailedProductInfo(msg) {
//   for (const r of dfProducts) {
//     const name = String(r['Tên sản phẩm']).toLowerCase();
//     if (msg.includes(name)) {
//       const res = [`Sản phẩm: ${r['Tên sản phẩm']}`];
//       if (msg.includes('giá'))      res.push(`Giá: ${r['Giá']} VND`);
//       if (msg.includes('màu'))      res.push(`Màu: ${r['Màu'] || 'Không rõ'}`);
//       if (msg.includes('size')||
//           msg.includes('kích cỡ')) res.push(`Size: ${r['Size'] || 'Không rõ'}`);
//       if (msg.includes('số lượng')) res.push(`Số lượng còn: ${r['Số lượng'] || 'Không rõ'}`);
//       if (res.length === 1) {
//         res.push(
//           `Giá: ${r['Giá']} VND`,
//           `Màu: ${r['Màu'] || 'Không rõ'}`,
//           `Size: ${r['Size'] || 'Không rõ'}`,
//           `Số lượng còn: ${r['Số lượng'] || 'Không rõ'}`
//         );
//       }
//       return res.join('\n');
//     }
//   }
//   return null;
// }

// function faqResponse(msg) {
//   for (const r of dfFaq) {
//     if (msg.includes(String(r['CauHoiThuongGap']).toLowerCase())) {
//       return r['TraLoi'];
//     }
//   }
//   return null;
// }

// function contactInfo() {
//   if (!dfContact.length) return null;
//   return 'Thông tin liên hệ:\n' + dfContact
//     .map(r => `${r['ThongTin']}: ${r['NoiDung']}`)
//     .join('\n');
// }

// function handleUnclear(msg) {
//   return faqResponse(msg) || contactInfo() || 'Xin lỗi, tôi chưa rõ ý bạn.';
// }

// // ======= Fallback AI =======
// async function aiGenerateReply(message) {
//   const url = 'https://openrouter.ai/api/v1/chat/completions';
//   const headers = {
//     'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
//     'Content-Type': 'application/json'
//   };
//   const payload = {
//     model: 'openai/gpt-3.5-turbo',
//     messages: [
//       { role: 'system', content: 'Bạn là trợ lý bán hàng thân thiện.' },
//       { role: 'user',   content: message }
//     ]
//   };
//   const resp = await axios.post(url, payload, { headers });
//   return resp.data.choices?.[0]?.message?.content
//     || 'Xin lỗi, tôi không hiểu yêu cầu.';
// }

// // ======= Route /api/chat =======
// app.post('/api/chat', async (req, res) => {
//   loadData();
//   const msg = (req.body.message||'').toLowerCase();

//   let reply;
//   if (msg.includes('bán chạy')) {
//     reply = topSelling();
//   }
//   else if (msg.includes('khuyến mãi') || msg.includes('giảm giá')) {
//     reply = promoForProduct(msg) || currentPromos();
//   }
//   else if ((reply = detailedProductInfo(msg))) {
//     // vừa gán vừa kiểm
//   }
//   else if ((reply = faqResponse(msg))) {
//   }
//   else if (msg.includes('liên hệ') || msg.includes('hỗ trợ')) {
//     reply = contactInfo();
//   }
//   else {
//     try {
//       reply = await aiGenerateReply(msg);
//     } catch (e) {
//       console.error(e);
//       reply = 'Xin lỗi, đã xảy ra lỗi khi kết nối AI.';
//     }
//   }

//   // Ghi log trước khi trả về
//   logChat(msg, reply);
//   return res.json({ reply });
// });

// // ======= Khởi động server =======
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server đang chạy trên http://localhost:${PORT}`);
// });


// // ======= Đoạn mã này dùng để kiểm tra xem server có chạy không =======
// Đọc biến môi trường từ file .env
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const XLSX    = require('xlsx');
const axios   = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

// ======= Cấu hình đường dẫn & key =======
const DATA_FILE           = process.env.KB_FILE  || path.join(__dirname, 'products.xlsx');
const LOG_FILE            = process.env.LOG_FILE || path.join(__dirname, 'chat_log.xlsx');
const OPENROUTER_API_KEY  = process.env.OPENROUTER_API_KEY;
let _lastMtime            = 0; //Lưu thời gian sửa đổi cuối cùng của file Excel

// ======= Cache dữ liệu Excel =======
let dfProducts = [], dfPromo = [], dfContact = [], dfFaq = [];
// function loadData() {
//   let stat;
//   try { stat = fs.statSync(DATA_FILE); }
//   catch { console.error(`❌ Không tìm thấy file ${DATA_FILE}`); return; }

//   if (stat.mtimeMs !== _lastMtime) {
//     const wb = XLSX.readFile(DATA_FILE);
//     dfProducts = XLSX.utils.sheet_to_json(wb.Sheets['Sanpham']   || []); // Đọc sheet "Sanpham"
//     dfPromo    = XLSX.utils.sheet_to_json(wb.Sheets['Khuyenmai'] || []);
//     dfContact  = XLSX.utils.sheet_to_json(wb.Sheets['Lienhe']     || []);
//     dfFaq      = XLSX.utils.sheet_to_json(wb.Sheets['Hoidap']     || []);
//     _lastMtime = stat.mtimeMs;
//     console.log(`🔄 Reloaded data from ${DATA_FILE}`);
//   }
// }

function loadData() {
  let stat;
  try {
    stat = fs.statSync(DATA_FILE);
  } catch {
    console.error(`❌ Không tìm thấy file ${DATA_FILE}`);
    return;
  }
  if (stat.mtimeMs !== _lastMtime) {
    const wb = XLSX.readFile(DATA_FILE);
    // Kiểm tra tên các sheet
    console.log('📄 Sheets trong', DATA_FILE, ':', wb.SheetNames);
    // Chọn sheet đúng (ví dụ "Sanpham" hoặc sheet đầu tiên nếu bạn đổi tên)
    const sheet = wb.Sheets['Sanpham'] || wb.Sheets[wb.SheetNames[0]];
    dfProducts = XLSX.utils.sheet_to_json(sheet);
    console.log(`📦 Đã load ${dfProducts.length} sản phẩm từ sheet "${sheet === wb.Sheets['Sanpham'] ? 'Sanpham' : wb.SheetNames[0]}"`);
    _lastMtime = stat.mtimeMs;
  }
}



// Mỗi lần load sẽ kiểm tra thời gian thay đổi của file, nếu khác thì sẽ đọc lại toàn bộ dữ liệu
loadData();

// ======= Load lịch sử chat hôm nay để cho AI học =======
// Đọc lại lịch sử chat từ file chat_log.xlsx
function loadChatHistory() {
  if (!fs.existsSync(LOG_FILE)) return '';
  const wb    = XLSX.readFile(LOG_FILE);
  const today = new Date().toISOString().slice(0,10);
  if (!wb.SheetNames.includes(today)) return '';

  // Đọc tất cả dòng (trừ header) trong sheet hôm nay
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[today], { header: 1 }); // Mỗi ngày sẽ có 1 sheet
  const data = rows.slice(1);  // bỏ header, giữ toàn bộ lịch sử

  // Ghép thành chuỗi User/Bot (Lấy toàn bộ thông tin của sheet hôm nay ròi ghép thành dạng chuỗi) Dạy AI ngữ cảnh trước đó
  return data
    .map(r => `User: ${r[1]}\nBot: ${r[2]}`)
    .join('\n\n');
}


// ======= Ghi log mỗi lần trò chuyện =======
function logChat(userMsg, botReply) {
  const today     = new Date().toISOString().slice(0,10);
  let wb;
  if (fs.existsSync(LOG_FILE)) {
    wb = XLSX.readFile(LOG_FILE);
  } else {
    wb = XLSX.utils.book_new();
  }

  // Lấy/cài header cho sheet hôm nay
  let data;
  if (wb.SheetNames.includes(today)) {
    data = XLSX.utils.sheet_to_json(wb.Sheets[today], { header: 1 });
  } else {
    data = [['Timestamp','UserMessage','BotReply']];
  }

  data.push([ new Date().toISOString(), userMsg, botReply ]);
  const ws = XLSX.utils.aoa_to_sheet(data);

  if (!wb.SheetNames.includes(today)) {
    XLSX.utils.book_append_sheet(wb, ws, today);
  } else {
    wb.Sheets[today] = ws;
  }
  XLSX.writeFile(wb, LOG_FILE);
}

// ======= Các hàm xử lý tĩnh =======
function topSelling() { /* unchanged */ }
function currentPromos() { /* unchanged */ }
function promoForProduct(msg) { /* unchanged */ }
function detailedProductInfo(msg) { /* unchanged */ }
function faqResponse(msg) { /* unchanged */ }
function contactInfo() { /* unchanged */ }
function handleUnclear(msg) { /* unchanged */ }

// ======= Fallback AI với lịch sử chat =======
// ======= Fallback AI với lịch sử chat =======
async function aiGenerateReply(message) {
  // …
  // In ra số lượng sản phẩm để debug
  console.log('📦 Tổng số sản phẩm:', dfProducts.length);

  // Đưa toàn bộ sản phẩm vào system prompt
  const systemParts = [
    'Bạn là trợ lý bán hàng thân thiện.',
    'Dưới đây là dữ liệu sản phẩm để tham khảo:',
    dfProducts.map(r =>
      `- ${r['Tên sản phẩm']}: Giá ${r['Giá']} VND${r['Size'] ? `, Size ${r['Size']}` : ''}${r['Số lượng'] ? `, Tồn ${r['Số lượng']}` : ''}`
    ).join('\n'),
  ];

  // Giữ nguyên logic ghép lịch sử chat
  const history = loadChatHistory();
  if (history) {
    systemParts.push('Lịch sử trò chuyện gần đây:\n' + history);
  }

  const messages = [
    { role: 'system', content: systemParts.join('\n\n') },
    { role: 'user',   content: message }
  ];

  const payload = { model: 'openai/gpt-3.5-turbo', messages };
  const resp    = await axios.post('https://openrouter.ai/api/v1/chat/completions', payload, {
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return resp.data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không hiểu yêu cầu.';
}


// ======= Route /api/chat =======
app.post('/api/chat', async (req, res) => {
  loadData();
  const msg = (req.body.message||'').toLowerCase();

  let reply;
  if (msg.includes('bán chạy')) {
    reply = topSelling();
  }
  else if (msg.includes('khuyến mãi') || msg.includes('giảm giá')) {
    reply = promoForProduct(msg) || currentPromos();
  }
  else if ((reply = detailedProductInfo(msg))) {
    /* static detail */
  }
  else if ((reply = faqResponse(msg))) {
    /* faq */
  }
  else if (msg.includes('liên hệ') || msg.includes('hỗ trợ')) {
    reply = contactInfo();
  }
  else {
    try {
      reply = await aiGenerateReply(msg);
    } catch (e) {
      console.error('❌ OpenRouter error:', e.response?.data || e);
      reply = 'Xin lỗi, đã xảy ra lỗi khi kết nối AI.';
    }
  }

  logChat(msg, reply);
  return res.json({ reply });
});

// ======= Start server =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên http://localhost:${PORT}`);
});

