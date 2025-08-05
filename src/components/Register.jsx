import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOAuthUrl } from '../config/oauth';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // 유효성 검사
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 실제 구현에서는 여기서 API 호출을 합니다
    try {
      // 로컬 스토리지에서 기존 사용자 확인
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // 이메일 중복 확인
      const existingUser = users.find(user => user.email === formData.email);
      if (existingUser) {
        setError('이미 등록된 이메일입니다.');
        return;
      }

      // 새 사용자 추가
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // 자동 로그인
      login(newUser);
      
      alert('회원가입이 완료되었습니다!');
      
      // 즉시 대시보드로 리다이렉트
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>회원가입</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          
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
              placeholder="비밀번호를 입력하세요 (최소 6자)"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            회원가입
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
            <span className="social-logo kakao-logo" />카카오로 회원가입
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
            <span className="social-logo google-logo" />구글로 회원가입
          </button>
        </div>
        
        <div className="auth-links">
          <p>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register; 