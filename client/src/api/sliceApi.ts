import type { Slide } from "../app/types";
import { baseApi } from "./baseApi"

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addSlide: builder.mutation<Slide, { presentationId: string; nickname: string }>({
            query: ({ presentationId, nickname }) => ({
                url: `/slides/${presentationId}`,
                method: 'POST',
                body: { nickname },
            }),
            invalidatesTags: ['Slides'],
        }),
        deleteSlide: builder.mutation<
            { message: string },
            { id: string; nickname: string }
        >({
            query: ({ id, nickname }) => ({
                url: `/slides/${id}`,
                method: 'DELETE',
                body: { nickname },
            }),
            invalidatesTags: ['Slides'],
        }),
    }),
})

export const { useAddSlideMutation, useDeleteSlideMutation  } = authApi
