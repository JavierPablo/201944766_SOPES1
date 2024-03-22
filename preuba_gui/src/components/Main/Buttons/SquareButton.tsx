import React from 'react';
import './buttons_gen_styles.css';

interface Params{
  title:String
  img_src:String
  on_click_action:()=>void;
}
function SquareButton({img_src,title,on_click_action}:Params) {
  
  return (
    <div className="square-button" style={{backgroundImage :  `url(${img_src})`}} onClick={on_click_action}>
      <p>{title}</p>
    </div>
  );
}

export default SquareButton;