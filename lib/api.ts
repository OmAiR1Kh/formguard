// API utility functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("formguard_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || "An error occurred",
      response.status,
      data
    );
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    magicLink: (email: string) =>
      fetchApi("/auth/magic-link", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    verify: (token: string) =>
      fetchApi("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),
    me: () => fetchApi("/auth/me"),
    register: (data: {
      email: string;
      organizationName: string;
      name?: string;
    }) =>
      fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Organizations
  organizations: {
    get: () => fetchApi("/organizations"),
    update: (data: any) =>
      fetchApi("/organizations", { method: "PUT", body: JSON.stringify(data) }),
    getStats: () => fetchApi("/organizations/stats"),
    inviteMember: (email: string, role: string) =>
      fetchApi("/organizations/members", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      }),
    removeMember: (memberId: string) =>
      fetchApi(`/organizations/members/${memberId}`, { method: "DELETE" }),
  },

  // Billing
  billing: {
    get: () => fetchApi("/billing"),
    checkout: (plan: "starter" | "pro" | "agency") =>
      fetchApi("/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan }),
      }),
    portal: () => fetchApi("/billing/portal", { method: "POST" }),
    verifySession: (sessionId: string) =>
      fetchApi(`/billing/verify?sessionId=${encodeURIComponent(sessionId)}`),
  },

  // Forms
  forms: {
    list: () => fetchApi("/forms"),
    get: (id: string) => fetchApi(`/forms/${id}`),
    create: (data: any) =>
      fetchApi("/forms", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchApi(`/forms/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/forms/${id}`, { method: "DELETE" }),
    regenerateKey: (id: string) =>
      fetchApi(`/forms/${id}/regenerate-key`, { method: "POST" }),
    getAnalytics: (id: string) => fetchApi(`/forms/${id}/analytics`),
  },

  // Submissions
  submissions: {
    list: (params?: {
      formId?: string;
      action?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.formId) query.append("formId", params.formId);
      if (params?.action) query.append("action", params.action);
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());
      return fetchApi(`/submissions?${query.toString()}`);
    },
    get: (id: string) => fetchApi(`/submissions/${id}`),
    update: (id: string, data: any) =>
      fetchApi(`/submissions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi(`/submissions/${id}`, { method: "DELETE" }),
    export: (formId?: string) => {
      const query = formId ? `?formId=${formId}` : "";
      return fetchApi(`/submissions/export${query}`);
    },
  },
};
