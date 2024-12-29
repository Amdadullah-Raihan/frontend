import { apiSlice } from '../api/api.slice';

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
  overrideExisting: false,
});

export const { useLoginMutation } = authApiSlice;
