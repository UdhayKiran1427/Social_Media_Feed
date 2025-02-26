import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000', 
  prepareHeaders: (headers) => {
    const token = Cookies.get('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getUser: builder.query({
      query: () => '/users/get-user',
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: '/users/update-user',
        method: 'PUT',
        body: userData,
      }),
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation, useLoginMutation } = apiSlice;
