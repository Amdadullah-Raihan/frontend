import { apiSlice } from '../api/api';

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password, isPassHash }) => ({
        url: 'users/login',
        method: 'POST',
        body: { email, password, isPassHash },
      }),
    }),
  }),
});
