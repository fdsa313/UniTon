import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('처리 중...');
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // URL에서 인증 코드 추출
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        // 에러가 있으면 로그인 페이지로 리다이렉트
        if (error) {
          console.error('OAuth Error:', error);
          setStatus('인증 중 오류가 발생했습니다.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // 인증 코드가 없으면 로그인 페이지로 리다이렉트
        if (!code) {
          setStatus('인증 코드를 찾을 수 없습니다.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // URL에서 provider 정보 추출 (예: /oauth/kakao/callback)
        const pathParts = location.pathname.split('/');
        const provider = pathParts[2]; // kakao 또는 google

        setStatus(`${provider} 인증 코드를 받았습니다. 처리 중...`);

        // 실제 구현에서는 여기서 백엔드 API에 코드를 전송
        // 프론트엔드에서 직접 토큰 교환은 보안상 권장하지 않음
        console.log('OAuth Code:', code);
        console.log('Provider:', provider);

        // 데모용: 임시 사용자 정보 생성
        const demoUser = {
          id: `${provider}_${Date.now()}`,
          name: `${provider === 'kakao' ? '카카오' : '구글'} 사용자`,
          email: `${provider}_demo@${provider}.com`,
          provider: provider,
          oauthCode: code, // 실제로는 백엔드에서 처리
          createdAt: new Date().toISOString()
        };

        // 로그인 처리
        login(demoUser);
        
        // users 배열에도 추가
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.find(u => u.email === demoUser.email)) {
          users.push(demoUser);
          localStorage.setItem('users', JSON.stringify(users));
        }

        setStatus('로그인 성공! 대시보드로 이동합니다...');
        
        // 즉시 대시보드로 리다이렉트
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);

      } catch (error) {
        console.error('OAuth Callback Error:', error);
        setStatus('인증 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleOAuthCallback();
  }, [navigate, location, login]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>소셜 로그인 처리 중</h2>
        <div className="oauth-callback-status">
          <div className="loading-spinner"></div>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback; 