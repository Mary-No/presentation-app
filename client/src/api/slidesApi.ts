import type { Slide } from "../app/types";
import { baseApi } from "./baseApi"

export const slidesApi = baseApi.injectEndpoints({
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
        updateSlide: builder.mutation<
            Slide,
            { presentationId: string; id: string; content: any; nickname: string }
        >({
            query: ({ presentationId, id, content, nickname }) => ({
                url: `/slides/presentations/${presentationId}/slides/${id}`,
                method: 'PATCH',
                body: { content, nickname },
            }),
            invalidatesTags: ['Slides'],
        }),
    }),
})

export const { useAddSlideMutation, useDeleteSlideMutation , useUpdateSlideMutation } = slidesApi
