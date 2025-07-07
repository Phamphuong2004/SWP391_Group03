import React, { useState, useRef, useEffect } from "react";
import "./ChatBox.css";

const BOT_REPLY = `Chào bạn, bạn cần hỗ trợ gì ạ? Đây là Fanpage chính thức của Trung tâm Xét nghiệm ADN. Nếu bạn gặp vấn đề về hồ sơ, kết quả xét nghiệm hoặc thanh toán, vui lòng cung cấp thông tin cụ thể trên website hỗ trợ chính thức để được chúng tôi hỗ trợ nhanh chóng. Bộ phận chăm sóc khách hàng sẽ phản hồi bạn trong thời gian sớm nhất ⭐️\n⚠️ Lưu ý: Vui lòng kiểm tra thông tin đã được đăng tải trên Fanpage trước khi nhắn tin. Hạn chế spam để tránh bị bỏ qua tin nhắn.‼️\n\n⏰ Thời gian làm việc: 8h30 – 18h00 (Nghỉ Thứ 7 và Chủ Nhật) ☑️ Cảm ơn bạn đã liên hệ!`;

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Bạn cần hỗ trợ gì?" }
  ]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: "bot", text: BOT_REPLY }]);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <div className="chatbox-float-btn" onClick={() => setOpen(!open)}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#3567A6" />
          <path d="M10 20v-6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2h-6l-4 3v-3a2 2 0 01-2-2z" fill="#fff" />
        </svg>
      </div>
      {open && (
        <div className="chatbox-popup">
          <div className="chatbox-header">
            <span>Hỗ trợ trực tuyến</span>
            <button onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="chatbox-body" ref={chatBodyRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbox-msg chatbox-msg-${msg.from}`}>
                {msg.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="chatbox-footer">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend}>Gửi</button>
          </div>
        </div>
      )}
    </>
  );
} 