import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://presentation-app-6a87.onrender.com' }),
    tagTypes: ['Presentations','Slides'],
    endpoints: () => ({}),
})