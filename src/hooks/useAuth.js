import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 인증 상태 확인
  const checkAuth = () => {
    try {
      const user = localStorage.getItem('currentUser');
      if (user) {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('인증 상태 확인 오류:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인
  const login = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  useEffect(() => {
    // 초기 인증 상태 확인
    checkAuth();

    // localStorage 변경 감지
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser') {
        checkAuth();
      }
    };

    // storage 이벤트 리스너 추가 (다른 탭에서의 변경 감지)
    window.addEventListener('storage', handleStorageChange);

    // 같은 탭에서의 localStorage 변경 감지
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'currentUser') {
        setTimeout(() => checkAuth(), 0);
      }
    };
    
    localStorage.removeItem = function(key) {
      originalRemoveItem.apply(this, arguments);
      if (key === 'currentUser') {
        setTimeout(() => checkAuth(), 0);
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, []);

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout,
    checkAuth
  };
}; 