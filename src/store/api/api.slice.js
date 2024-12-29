/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import log from '../../utils/log';
import useApiUrl from '../../api/useApiUrl';

const baseURL = useApiUrl();

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: 'cors',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // console.log('Authorization Header Set:', headers.get('Authorization'));
      } else {
        log.warn('No token found in state!');
      }

      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
