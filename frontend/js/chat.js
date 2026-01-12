// chat.js

// Hàm để lưu tin nhắn vào lịch sử chat (localStorage)
window.logChat = function(role, message) {
  const key = 'chatHistory';  // Dùng 'chatHistory' làm key lưu trữ
  const history = JSON.parse(localStorage.getItem(key) || '[]');  // Lấy lịch sử chat từ localStorage

  const now = new Date();  // Lấy ngày giờ hiện tại
  const date = now.toLocaleDateString('en-CA');  // Định dạng ngày (YYYY-MM-DD)
  const time = now.toLocaleTimeString('en-GB');  // Định dạng giờ (HH:mm:ss)

  history.push({ date, time, role, message });  // Thêm tin nhắn vào lịch sử

  localStorage.setItem(key, JSON.stringify(history));  // Lưu lịch sử vào localStorage
};
