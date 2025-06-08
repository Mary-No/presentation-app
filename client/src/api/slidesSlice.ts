import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Slide } from "../app/types";

type SlidesState = {
    slides: Slide[];
    currentSlideIndex: number,
};

const initialState: SlidesState = {
    slides: [],
    currentSlideIndex: 0,
};

const slidesSlice = createSlice({
    name: 'slides',
    initialState,
    reducers: {
        setSlides(state, action: PayloadAction<Slide[]>) {
            state.slides = action.payload;

        },
        addSlideToStore(state, action: PayloadAction<Slide>) {
            state.slides.push(action.payload);
        },
        updateSlideContent(
            state,
            action: PayloadAction<{ id: string; content: any }>
        ) {
            const slide = state.slides.find((s) => s.id === action.payload.id);
            if (slide) {
                slide.content = action.payload.content;
            }
        },
        removeSlideFromStore: (state, action) => {
            const idToRemove = action.payload;
            state.slides = state.slides.filter(slide => slide.id !== idToRemove);

            // Переиндексация оставшихся слайдов
            state.slides.forEach((slide, index) => {
                slide.slideIndex = index;
            });

            // Корректировка текущего индекса, если нужно
            if (state.currentSlideIndex >= state.slides.length) {
                state.currentSlideIndex = Math.max(0, state.slides.length - 1);
            }
        },
        setCurrentSlideIndex(state, action: PayloadAction<number>) {
            const index = action.payload;
            if (index >= 0 && index < state.slides.length) {
                state.currentSlideIndex = index;
            }
        },
    },
});

export const { setSlides, addSlideToStore, updateSlideContent, removeSlideFromStore,   setCurrentSlideIndex, } = slidesSlice.actions;

export default slidesSlice.reducer;