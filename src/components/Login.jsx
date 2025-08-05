import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOAuthUrl } from '../config/oauth';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 간단한 유효성 검사
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 실제 구현에서는 여기서 API 호출을 합니다
    try {
      // 로컬 스토리지에서 사용자 정보 확인 (임시 구현)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        // 로그인 처리
        login(user);
        
        // 즉시 대시보드로 리다이렉트
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>로그인</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            로그인
          </button>
        </form>
        
        <div className="social-login-buttons">
          <button
            type="button"
            className="social-btn kakao"
            onClick={() => {
              try {
                // 실제 카카오 OAuth 인증 URL로 이동
                const kakaoAuthUrl = createOAuthUrl('kakao');
                window.location.href = kakaoAuthUrl;
              } catch (error) {
                console.error('카카오 OAuth URL 생성 오류:', error);
                alert('카카오 로그인 설정을 확인해주세요.');
              }
            }}
          >
            <span className="social-logo kakao-logo" />카카오로 로그인
          </button>
          <button
            type="button"
            className="social-btn google"
            onClick={() => {
              try {
                // 실제 구글 OAuth 인증 URL로 이동
                const googleAuthUrl = createOAuthUrl('google');
                window.location.href = googleAuthUrl;
              } catch (error) {
                console.error('구글 OAuth URL 생성 오류:', error);
                alert('구글 로그인 설정을 확인해주세요.');
              }
            }}
          >
            <span className="social-logo google-logo" />구글로 로그인
          </button>
        </div>
        
        <div className="auth-links">
          <p>
            계정이 없으신가요? <Link to="/register">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login; 