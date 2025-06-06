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
    }),
})

export const { useAddSlideMutation  } = authApi
