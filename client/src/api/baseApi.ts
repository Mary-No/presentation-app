import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
    tagTypes: ['Presentations','Slides'],
    endpoints: () => ({}),
})
// https://presentation-app-6a87.onrender.com
//http://localhost:4000