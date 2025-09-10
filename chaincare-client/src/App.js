import React, { useState, useEffect } from 'react';

// Import all your new page components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

// Import common layout components
import AppNavbar from './components/AppNavbar';
import AppFooter from './components/AppFooter';

export default function App() {
  const [auth, setAuth] = useState(null);
  const [page, setPage] = useState('home'); // 'home', 'about', 'contact', 'login', 'dashboard'

  useEffect(() => {
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    bootstrapLink.integrity = 'sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM';
    bootstrapLink.crossOrigin = 'anonymous';
    document.head.appendChild(bootstrapLink);
    return () => {
      if (document.head.contains(bootstrapLink)) {
        document.head.removeChild(bootstrapLink);
      }
    };
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('chaincare_token');
    const storedUser = localStorage.getItem('chaincare_user');
    if (storedToken && storedUser) {
      setAuth({ token: storedToken, user: JSON.parse(storedUser) });
      setPage('dashboard'); // If logged in, go to dashboard
    }
  }, []);

  const handleAuthSuccess = (authData) => {
    localStorage.setItem('chaincare_token', authData.token);
    localStorage.setItem('chaincare_user', JSON.stringify(authData.user));
    setAuth(authData);
    setPage('dashboard'); // Go to dashboard on login
  };

  const handleLogout = () => {
    localStorage.removeItem('chaincare_token');
    localStorage.removeItem('chaincare_user');
    setAuth(null);
    setPage('home'); // Go to home on logout
  };

  const handleNavigate = (newPage) => {
    setPage(newPage);
  };

  const renderPage = () => {
    if (auth && page === 'dashboard') {
        return <DashboardPage user={auth.user} token={auth.token} onLogout={handleLogout} />;
    }
    
    switch (page) {
        case 'home':
            return <HomePage onNavigate={handleNavigate} />;
        case 'about':
            return <AboutPage />;
        case 'contact':
            return <ContactPage />;
        case 'login':
            return <AuthPage onAuthSuccess={handleAuthSuccess} />;
        default:
            return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNavbar auth={auth} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <AppFooter />
    </div>
  );
}