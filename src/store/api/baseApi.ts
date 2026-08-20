import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api',
    prepareHeaders: (headers, { getState }) => {
      // 1. استخراج الـ Token من Redux Store أو localStorage
      const token = (getState() as RootState).auth.token || 
        (typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('token')) : null);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // 2. تعريف جميع الـ Tags لإدارة الكاش لكل ميكروسيرفيس
  tagTypes: ['Products', 'Cart', 'Orders', 'Warehouse', 'Finance', 'Permissions'],
  endpoints: () => ({}),
});
