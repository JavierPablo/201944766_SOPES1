import React, { useState } from 'react';
import SquareButton from './Buttons/SquareButton';
import "./main_style.css"

const gen_img = require('./planta.jpg')
interface Params{
    boton_actions: (()=>void)[]
}

function Main({boton_actions}:Params){
    
    return <div className='main-page'>
        <SquareButton img_src={gen_img} title={"Real Time CPU/RAM Monitor"} on_click_action={boton_actions[0]}></SquareButton>
        <SquareButton img_src={gen_img} title={"Historic CPU/RAM monitor"} on_click_action={boton_actions[1]}></SquareButton>
        <SquareButton img_src={gen_img} title={"Process Tree"} on_click_action={boton_actions[2]}></SquareButton>
        <SquareButton img_src={gen_img} title={"Process Simulation"} on_click_action={boton_actions[3]}></SquareButton>
    </div>
}

export default Main;