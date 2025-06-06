import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { setNickname } from "../api/userSlice";

export const AppInitializer = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        if (storedNickname) {
            dispatch(setNickname(storedNickname));
        }
    }, []);

    return null;
};