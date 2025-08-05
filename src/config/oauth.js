// OAuth 설정
export const OAUTH_CONFIG = {
  // 카카오 OAuth 설정
  kakao: {
    clientId: import.meta.env.VITE_KAKAO_CLIENT_ID || 'your_kakao_rest_api_key',
    redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:5173/oauth/kakao/callback',
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    tokenUrl: 'https://kauth.kakao.com/oauth/token',
    userInfoUrl: 'https://kapi.kakao.com/v2/user/me'
  },
  
  // 구글 OAuth 설정
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id',
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/oauth/google/callback',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
  }
};

// OAuth 인증 URL 생성 함수
export const createOAuthUrl = (provider) => {
  const config = OAUTH_CONFIG[provider];
  
  if (provider === 'kakao') {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code'
    });
    return `${config.authUrl}?${params.toString()}`;
  }
  
  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'profile email'
    });
    return `${config.authUrl}?${params.toString()}`;
  }
  
  throw new Error(`Unsupported provider: ${provider}`);
}; 