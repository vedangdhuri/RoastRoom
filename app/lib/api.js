import axios from 'axios';
import { supabase } from './supabase';

// Axios instance for Supabase Edge Function calls
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
    : '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.warn('Failed to attach auth token:', error.message);
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    if (status === 403) {
      console.error('Rate limited or forbidden:', message);
    } else if (status === 401) {
      console.error('Unauthorized – session may have expired');
    }

    return Promise.reject(error);
  }
);

/**
 * Score a debate/roast message via the Edge Function
 */
export const scoreMessage = async ({ message, mode, matchId, userId, round }) => {
  const { data } = await api.post('/score-debate', {
    message,
    mode,
    matchId,
    userId,
    round,
  });
  return data;
};

export default api;
