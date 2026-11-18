const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiClient {
  private static token: string | null = null;

  static setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('festiveui_token', token);
      else localStorage.removeItem('festiveui_token');
    }
  }

  static getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('festiveui_token');
    }
    return this.token;
  }

  static async fetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as any) || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errMsg = `HTTP error ${response.status}`;
      try {
        const errorJson = await response.json();
        errMsg = errorJson.message || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    return response.json();
  }
}
