import React, { useState } from 'react';
import './App.css';
import Main from './components/Main/Main';
import ProcessSim from './components/ProcessSim/ProcessSim';
import RealTimeMonitor from './components/RealTimeMonitor/RealTimeMonitor';
import HistoricMonitor from './components/HistoricMonitor/HistoricMonitor';
import ProcessTree from './components/ProcessTree/ProcessTree';
enum Page{
  None,
  RealTimeMonitor,
  HistoricMonitor,
  ProcessTree,
  ProcessSim
}
function App() {
  let [page_selected,set_page_selected] = useState(Page.None)
  let actions: (()=>void)[] = [
    ()=>{set_page_selected(Page.RealTimeMonitor)},
    ()=>{set_page_selected(Page.HistoricMonitor)},
    ()=>{set_page_selected(Page.ProcessTree)},
    ()=>{set_page_selected(Page.ProcessSim)}
  ]
  let back_action = ()=>{set_page_selected(Page.None)}
  return (
    <div className="App">
      {page_selected === Page.None? <Main  boton_actions={actions}></Main>:""}
      {page_selected === Page.RealTimeMonitor? <RealTimeMonitor back_button={back_action}></RealTimeMonitor>:""}
      {page_selected === Page.HistoricMonitor? <HistoricMonitor back_button={back_action}></HistoricMonitor>:""}
      {page_selected === Page.ProcessTree? <ProcessTree back_button={back_action}></ProcessTree>:""}
      {page_selected === Page.ProcessSim? <ProcessSim back_button={back_action}></ProcessSim>:""}
    </div>
  );
}

export default App;
