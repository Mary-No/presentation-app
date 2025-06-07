import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import s from "./DrawBoard.module.scss"

export const DrawBoard = ()=>{

    return <div className={s.container}>
        <Tldraw options={{ maxPages: 1 }}/>
    </div>
}