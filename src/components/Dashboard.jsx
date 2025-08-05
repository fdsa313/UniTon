import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!currentUser) {
    return <div className="auth-container">로딩 중...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>대시보드</h2>
        
        <div className="user-info">
          <h3>환영합니다, {currentUser.name}님!</h3>
          <p><strong>이메일:</strong> {currentUser.email}</p>
          <p><strong>가입일:</strong> {new Date(currentUser.createdAt).toLocaleDateString('ko-KR')}</p>
          {currentUser.provider && (
            <p><strong>로그인 방식:</strong> {currentUser.provider === 'kakao' ? '카카오' : currentUser.provider === 'google' ? '구글' : '일반'}</p>
          )}
        </div>
        
        <div className="dashboard-actions">
          <button onClick={handleLogout} className="auth-button logout-button">
            로그아웃
          </button>
        </div>
        
        <div className="dashboard-content">
          <h4>최근 활동</h4>
          <p>아직 활동 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 