import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 1. Import ở đây
import App from './App.jsx'
import './index.css' 
// import './App.css' // Bạn đã import App.css trong App.jsx rồi

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. Bọc App ở đây */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)