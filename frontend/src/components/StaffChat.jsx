import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Send, User, MessageSquare, Trash2 } from 'lucide-react'; // 1. Thêm Trash2

const StaffChat = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    
    // 2. State để lưu ID tin nhắn đang được chọn
    const [selectedMsgId, setSelectedMsgId] = useState(null);

    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Lấy danh sách khách hàng
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch('http://localhost:8080/api/v1/users/customers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setCustomers(await res.json());
            } catch (e) { console.error(e); }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Kết nối khi chọn User
    useEffect(() => {
        if (selectedUser) {
            if (stompClientRef.current) stompClientRef.current.disconnect();
            
            // Reset state
            setMessages([]);
            setSelectedMsgId(null); 

            // Load lịch sử cũ
            fetch(`http://localhost:8080/api/v1/chat/history/${selectedUser.username}`)
                .then(res => res.json())
                .then(data => setMessages(data))
                .catch(err => console.error(err));

            const socket = new SockJS('http://localhost:8080/ws');
            const client = Stomp.over(socket);
            client.debug = null; 

            client.connect({}, () => {
                client.subscribe(`/topic/room/${selectedUser.username}`, (msg) => {
                    const receivedMsg = JSON.parse(msg.body);
                    setMessages(prev => {
                        const exists = prev.some(m => m.id === receivedMsg.id && m.id !== undefined);
                        if (exists) return prev;
                        return [...prev, receivedMsg];
                    });
                });
            });
            stompClientRef.current = client;
        }
        return () => {
            if (stompClientRef.current) stompClientRef.current.disconnect();
        };
    }, [selectedUser]);

    const sendMessage = () => {
        if (input.trim() && stompClientRef.current && selectedUser) {
            const msg = {
                senderId: 'STAFF', 
                recipientId: selectedUser.username,
                content: input,
                // timestamp backend tự tạo
            };
            stompClientRef.current.send(`/app/chat/${selectedUser.username}`, {}, JSON.stringify(msg));
            setInput('');
        }
    };

    // 3. Hàm Xóa Tin Nhắn
    const handleDeleteMessage = async (id) => {
        if(!window.confirm("Xóa tin nhắn này?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/chat/message/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
                setSelectedMsgId(null);
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div style={{ display: 'flex', height: '80vh', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
            
            {/* DANH SÁCH KHÁCH HÀNG */}
            <div style={{ width: '30%', borderRight: '1px solid #eee', overflowY: 'auto' }}>
                <div style={{ padding: '15px', background: '#f8f9fa', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                    Danh sách khách hàng
                </div>
                {customers.map(cus => (
                    <div 
                        key={cus.id} 
                        onClick={() => setSelectedUser(cus)}
                        style={{ 
                            padding: '15px', 
                            cursor: 'pointer', 
                            borderBottom: '1px solid #f0f0f0',
                            background: selectedUser?.id === cus.id ? '#e6f7ff' : 'white',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                    >
                        <div style={{width:'35px', height:'35px', borderRadius:'50%', background:'#ddd', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <User size={18} />
                        </div>
                        <div>
                            <div style={{fontWeight:'500'}}>{cus.fullName || cus.username}</div>
                            <div style={{fontSize:'12px', color:'#888'}}>{cus.username}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* KHUNG CHAT */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <>
                        {/* Header Chat */}
                        <div style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'10px' }}>
                            <MessageSquare size={20} color="#007bff"/>
                            Chat với: {selectedUser.fullName || selectedUser.username}
                        </div>

                        {/* Nội dung tin nhắn (ĐÃ SỬA UI ĐỂ HIỆN NÚT XÓA) */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f9f9f9' }}>
                            {messages.map((m, idx) => (
                                <div key={idx} style={{ 
                                    display: 'flex', 
                                    justifyContent: m.senderId === 'STAFF' ? 'flex-end' : 'flex-start',
                                    marginBottom: '10px'
                                }}>
                                    <div 
                                        // Click vào dòng tin nhắn để bật tắt nút xóa
                                        onClick={() => setSelectedMsgId(m.id === selectedMsgId ? null : m.id)}
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            // Đảo chiều flex nếu là STAFF để nút xóa nằm bên trái, còn khách thì nút xóa bên phải
                                            flexDirection: m.senderId === 'STAFF' ? 'row-reverse' : 'row',
                                            maxWidth: '75%',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {/* Bong bóng chat */}
                                        <div style={{ 
                                            padding: '10px 15px', 
                                            borderRadius: '15px',
                                            background: m.senderId === 'STAFF' ? '#007bff' : 'white',
                                            color: m.senderId === 'STAFF' ? 'white' : 'black',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                        }}>
                                            {m.content}
                                        </div>

                                        {/* Nút Xóa (Chỉ hiện khi selectedMsgId trùng ID tin nhắn) */}
                                        {selectedMsgId === m.id && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteMessage(m.id); }}
                                                style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '5px' }}
                                                title="Xóa tin nhắn"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && <div style={{textAlign:'center', color:'#999', marginTop:'20px'}}>Bắt đầu cuộc trò chuyện...</div>}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Ô nhập tin nhắn */}
                        <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                            <input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Nhập tin nhắn..."
                                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' }}
                            />
                            <button onClick={sendMessage} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Send size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', flexDirection:'column' }}>
                        <MessageSquare size={48} style={{marginBottom:'10px', opacity:0.2}}/>
                        <p>Chọn một khách hàng để bắt đầu chat</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffChat;