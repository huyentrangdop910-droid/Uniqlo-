import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Edit, Camera } from 'lucide-react'; // Nhớ cài: npm install lucide-react

const UserProfile = (onProfileUpdate) => {
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [user, setUser] = useState({
        username: '', fullName: '', email: '', phoneNumber: '', address: '', avatarUrl: ''
    });
    const [previewAvatar, setPreviewAvatar] = useState(null);
    
    // State cho Modal sửa thông tin
    const [showModal, setShowModal] = useState(false);
    const [editForm, setEditForm] = useState({});

    const fileInputRef = useRef(null);

    // --- 1. LOAD DATA KHI VÀO TRANG ---
    useEffect(() => {
        fetchUserProfile();
        // Cleanup ảnh preview để tránh tràn bộ nhớ
        return () => previewAvatar && URL.revokeObjectURL(previewAvatar);
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('userToken'); // Lưu ý: dùng đúng tên userToken bạn đã lưu lúc login
            const res = await axios.get('http://localhost:8080/api/v1/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            if (onProfileUpdate) onProfileUpdate(res.data);
        } catch (error) {
            console.error("Lỗi tải thông tin:", error);
        }
    };

    // --- 2. XỬ LÝ ẢNH (AVATAR) ---
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // A. Hiện ảnh xem trước ngay lập tức
        const objectUrl = URL.createObjectURL(file);
        setPreviewAvatar(objectUrl);

        // B. Gửi ngầm xuống server
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('userToken');
            const res = await axios.post('http://localhost:8080/api/v1/users/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            // Cập nhật lại user với link ảnh thật từ server
            setUser(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }));
            if (onProfileUpdate && typeof onProfileUpdate === 'function') {
                onProfileUpdate(res.data);
            }
            alert("Cập nhật ảnh thành công!");
        } catch (error) {
            console.error("Lỗi upload:", error);
            alert("Lỗi khi cập nhật ảnh (Kiểm tra lại Backend/SecurityConfig).");
            setPreviewAvatar(null); // Quay về ảnh cũ nếu lỗi
        }
    };

    // --- 3. XỬ LÝ SỬA THÔNG TIN (MODAL) ---
    const handleEditClick = () => {
        setEditForm({
            fullName: user.fullName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || ''
        });
        setShowModal(true);
    };

    const handleSaveInfo = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            // Gọi API cập nhật thông tin (PUT)
            const res = await axios.put('http://localhost:8080/api/v1/users/me', editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUser(res.data); // Cập nhật giao diện
            setShowModal(false); // Tắt modal
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error(error);
            alert("Lỗi khi lưu thông tin.");
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Hồ Sơ Của Tôi</h2>

            <div style={{ display: 'flex', gap: '40px', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                
                {/* CỘT TRÁI: ẢNH ĐẠI DIỆN */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
                        <img 
                            src={previewAvatar || user.avatarUrl || "https://via.placeholder.com/150"} 
                            alt="Avatar" 
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f0f0' }}
                        />
                        {/* Nút camera nhỏ để bấm chọn ảnh */}
                        <button 
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                position: 'absolute', bottom: '0', right: '0',
                                background: '#007bff', color: '#fff', border: 'none',
                                width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <Camera size={20} />
                        </button>
                    </div>

                    <h3 style={{ marginTop: '15px', color: '#333' }}>{user.fullName}</h3>
                    <p style={{ color: '#777' }}>@{user.username}</p>
                    <span style={{ background: '#e3f2fd', color: '#0d47a1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        {user.role}
                    </span>

                    {/* Input ẩn */}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                </div>

                {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <InfoItem label="Họ và tên" value={user.fullName} />
                        <InfoItem label="Email" value={user.email} />
                        <InfoItem label="Số điện thoại" value={user.phoneNumber} />
                        <InfoItem label="Địa chỉ" value={user.address} />
                    </div>

                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                        <button 
                            onClick={handleEditClick}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: '#007bff', color: 'white', border: 'none', 
                                padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
                            }}
                        >
                            <Edit size={16} /> Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODAL SỬA THÔNG TIN --- */}
            {showModal && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.content}>
                        <div style={modalStyles.header}>
                            <h3>Cập Nhật Thông Tin</h3>
                            <button onClick={() => setShowModal(false)} style={modalStyles.closeBtn}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSaveInfo}>
                            <FormGroup label="Họ và tên" value={editForm.fullName} onChange={v => setEditForm({...editForm, fullName: v})} />
                            <FormGroup label="Email" value={editForm.email} onChange={v => setEditForm({...editForm, email: v})} type="email" />
                            <FormGroup label="Số điện thoại" value={editForm.phoneNumber} onChange={v => setEditForm({...editForm, phoneNumber: v})} />
                            <FormGroup label="Địa chỉ" value={editForm.address} onChange={v => setEditForm({...editForm, address: v})} />
                            
                            <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={modalStyles.btnCancel}>Hủy</button>
                                <button type="submit" style={modalStyles.btnSave}>Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT CON (Cho gọn code) ---
const InfoItem = ({ label, value }) => (
    <div>
        <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '5px' }}>{label}</label>
        <div style={{ fontSize: '16px', color: '#333', fontWeight: '500' }}>{value || "Chưa cập nhật"}</div>
    </div>
);

const FormGroup = ({ label, value, onChange, type = "text" }) => (
    <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
        />
    </div>
);

// --- CSS MODAL ---
const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    content: { background: 'white', padding: '25px', borderRadius: '8px', width: '450px', maxWidth: '90%' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
    closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666' },
    btnCancel: { padding: '8px 16px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' },
    btnSave: { padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }
};

export default UserProfile;