import {Tldraw} from "@tldraw/tldraw";
import 'tldraw/tldraw.css'
import s from "./DrawBoard.module.scss"

export const DrawBoard = ()=>{
    return <div className={s.container}>
        <Tldraw/>
    </div>
}