export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('festiveui_admin_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `http://localhost:4000/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        error: data.message || `Request failed with status ${res.status}`,
        status: res.status
      };
    }

    return { data, status: res.status };
  } catch (err: any) {
    return {
      error: err.message || 'Network error connecting to API',
      status: 500
    };
  }
}
