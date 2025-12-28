import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { X, Send, Trash2 } from 'lucide-react'; // Thêm icon Trash2

const CustomerChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    // State lưu ID tin nhắn đang được chọn để hiện nút xóa
    const [selectedMsgId, setSelectedMsgId] = useState(null);
    
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);
    const username = localStorage.getItem('username'); 

    useEffect(() => {
        if (isOpen && username) {
            fetchHistory();
            connect();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/chat/history/${username}`);
            if (res.ok) setMessages(await res.json());
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const connect = () => {
        if (stompClientRef.current && stompClientRef.current.connected) return;
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);
        client.debug = null; 
        client.connect({}, () => {
            client.subscribe(`/topic/room/${username}`, (msg) => {
                const receivedMsg = JSON.parse(msg.body);
                setMessages(prev => {
                    const exists = prev.some(m => m.id === receivedMsg.id);
                    if (exists) return prev;
                    return [...prev, receivedMsg];
                });
            });
        });
        stompClientRef.current = client;
    };

    const sendMessage = () => {
        if (input.trim() && stompClientRef.current) {
            const msg = { senderId: username, recipientId: 'STAFF', content: input };
            stompClientRef.current.send(`/app/chat/${username}`, {}, JSON.stringify(msg));
            setInput('');
        }
    };

    // --- HÀM XÓA TIN NHẮN ---
    const handleDeleteMessage = async (id) => {
        if(!window.confirm("Bạn muốn xóa tin nhắn này?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/chat/message/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                // Xóa thành công thì lọc bỏ khỏi state ngay lập tức
                setMessages(prev => prev.filter(m => m.id !== id));
                setSelectedMsgId(null);
            }
        } catch (error) { console.error("Lỗi xóa:", error); }
    };

    return (
        <div style={{ 
            display: isOpen ? 'flex' : 'none', 
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, 
            width: '320px', height: '450px', background: 'white', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)', borderRadius: '12px', 
            flexDirection: 'column', border: '1px solid #ddd'
        }}>
            <div style={{ padding: '12px', background: '#007bff', color: 'white', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                <span>Chat hỗ trợ</span>
                <X size={20} cursor="pointer" onClick={onClose} />
            </div>
            
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f5f5f5' }}>
                {messages.length === 0 && <div style={{textAlign: 'center', color: '#999', marginTop: '20px', fontSize: '14px'}}>Xin chào {username},<br/>Chúng tôi có thể giúp gì cho bạn?</div>}
                
                {messages.map((m, idx) => (
                    <div 
                        key={idx} 
                        style={{ 
                            textAlign: m.senderId === username ? 'right' : 'left', 
                            margin: '8px 0',
                            position: 'relative' // Để đặt nút xóa
                        }}
                        // Khi click vào tin nhắn thì hiện nút xóa
                        onClick={() => setSelectedMsgId(m.id === selectedMsgId ? null : m.id)}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: m.senderId === username ? 'row-reverse' : 'row', gap: '5px' }}>
                            
                            <span style={{ 
                                background: m.senderId === username ? '#007bff' : 'white', 
                                color: m.senderId === username ? 'white' : '#333',
                                padding: '8px 12px', borderRadius: '15px', display: 'inline-block', maxWidth: '80%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', fontSize: '14px', cursor: 'pointer'
                            }}>
                                {m.content}
                            </span>

                            {/* Nút xóa chỉ hiện khi selectedMsgId trùng khớp */}
                            {selectedMsgId === m.id && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteMessage(m.id); }}
                                    style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '0 5px' }}
                                    title="Xóa tin nhắn"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', background: 'white', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Nhập tin nhắn..." style={{ flex: 1, border: 'none', outline: 'none', padding: '0 10px' }} />
                <button onClick={sendMessage} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}><Send size={20}/></button>
            </div>
        </div>
    );
};

export default CustomerChat;