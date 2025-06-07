import type { Presentation } from "../app/types"
import { baseApi } from "./baseApi"

export const presentationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserPresentations: builder.query<Presentation[], string>({
            query: (nickname) => `/users/${nickname}/presentations`,
            providesTags: ['Presentations']
        }),
        getAllPresentations: builder.query({
            query: (search?: string) => {
                const params = new URLSearchParams()
                if (search) {
                    params.set('query', search)
                }
                return `/presentations?${params.toString()}`
            },
            providesTags: ['Presentations'],
        }),
        createPresentation: builder.mutation({
            query: (body) => ({
                url: '/presentations',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Presentations'],
        }),
        getPresentationById: builder.query({
            query: ({ id, nickname }) => ({
                url: `/presentations/${id}?nickname=${nickname}`,
                method: 'GET',
            }),
            providesTags: ['Slides'],
        }),
        deletePresentation: builder.mutation<
            { message: string },
            { id: string; nickname: string }
        >({
            query: ({ id, nickname }) => ({
                url: `/presentations/${id}`,
                method: 'DELETE',
                body: { nickname },
            }),
            invalidatesTags: ['Presentations'],
        }),

    }),
})

export const {  useGetUserPresentationsQuery,useGetAllPresentationsQuery, useCreatePresentationMutation, useGetPresentationByIdQuery, useDeletePresentationMutation  } = presentationApi
