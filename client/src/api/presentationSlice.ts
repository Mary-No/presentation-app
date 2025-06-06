import {createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Presentation } from "../app/types";

type PresentationState = {
    currentPresentation: Presentation | null;
}

const initialState: PresentationState = {
    currentPresentation: null,
};

const presentationSlice = createSlice({
    name: 'presentation',
    initialState,
    reducers: {
        setCurrentPresentation: (state, action: PayloadAction<Presentation>) => {
            state.currentPresentation = action.payload;
        },
        clearPresentation: (state) => {
            state.currentPresentation = null;
        },
    },
});

export const { setCurrentPresentation, clearPresentation } = presentationSlice.actions;
export default presentationSlice.reducer;