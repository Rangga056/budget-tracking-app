const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FetchOptions extends RequestInit {
  body?: string;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(id);

    // Redirect on 401
    if (res.status === 401 && typeof window !== 'undefined') {
      // Don't redirect if already on login or landing page
      if (!window.location.pathname.startsWith('/auth') && window.location.pathname !== '/') {
        window.location.href = '/auth/login';
      }
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      const errObj = new Error(error.error || `Request failed: ${res.status}`);
      (errObj as any).status = res.status;
      throw errObj;
    }

    return res.json();
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw err;
  }
}

const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

export default api;
