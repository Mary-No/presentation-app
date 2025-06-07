import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    nickname: string;
}

const initialState: UserState = {
    nickname: "",
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setNickname(state, action: PayloadAction<string>) {
            state.nickname = action.payload;
        },
    },
});

export const { setNickname } = userSlice.actions;
export default userSlice.reducer;
