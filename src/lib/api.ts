import { useAuth } from '@/contexts/AuthContext';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export const apiCall = async <T = any>(
  url: string,
  options: RequestInit = {},
  accessToken?: string | null,
  refreshTokens?: () => Promise<void>
): Promise<ApiResponse<T>> => {
  // Don't set Content-Type for FormData requests
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = isFormData 
    ? { ...(options.headers as Record<string, string> || {}) }
    : {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    // If token is expired, try to refresh and retry once
    if (response.status === 401 && refreshTokens && accessToken) {
      console.log('Token expired, attempting refresh...');
      try {
        await refreshTokens();
        // Get the new token from localStorage since the context might not be updated yet
        const newToken = localStorage.getItem('accessToken');
        if (newToken) {
          console.log('Retrying API call with new token...');
          const retryHeaders = { ...headers, 'Authorization': `Bearer ${newToken}` };
          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });
          const retryData = await retryResponse.json();
          
          return {
            data: retryData,
            status: retryResponse.status,
          };
        }
      } catch (refreshError) {
        console.error('Token refresh failed during API call:', refreshError);
        // If refresh fails, return the original 401 error
      }
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};

// Hook to use API calls with automatic token refresh
export const useApi = () => {
  const { accessToken, refreshTokens } = useAuth();

  const call = async <T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(url, options, accessToken, refreshTokens);
  };

  return { call };
}; 