import { baseApi } from "./baseApi"

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation<{ nickname: string, id: string }, { nickname: string }>({
            query: ({ nickname }) => ({
                url: '/users',
                method: 'POST',
                body: { nickname },
            }),
        }),
    }),
})

export const { useRegisterUserMutation } = authApi
