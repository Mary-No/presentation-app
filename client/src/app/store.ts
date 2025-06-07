import { configureStore } from '@reduxjs/toolkit'
import {baseApi} from "../api/baseApi.ts";
import userReducer from '../api/userSlice.ts';
import slidesReducer from '../api/slidesSlice.ts'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        user: userReducer,
        slides: slidesReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch