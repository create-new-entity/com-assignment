import React, { useState } from "react";
import { STEPS, NODES } from "./data";
import { getDependencies } from "./util";
import problemImage from './pic.png';



const App = () => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [config, setConfig] = useState([]);
  const [buttonsToShow, setButtonsToShow] = useState([]);

  const handleSelectedOption = (option) => {
    setSelectedOption(option);
    setButtonsToShow(NODES[option]);
  };

  const clearEverything = () => {
    setSelectedOption(null);
    setConfig([]);
    setButtonsToShow([]);
  };

  const renderInputOptions = () => {
    if(selectedOption !== null) return <div><button onClick={clearEverything}>Clear Everything</button></div>;
    return (
      <div>
        <button onClick={() => handleSelectedOption(0)}>T1 input image</button>
        <button onClick={() => handleSelectedOption(1)}>FLAIR input image</button>
        <button onClick={() => handleSelectedOption(2)}>T1 and FLAIR input image</button>
      </div>
    );
  };

  const handleStepSelection = (option) => {
    const dependencies = getDependencies(option, []);
    const unSelectedDependencies = dependencies.filter(dependency => config.includes(dependency) === false);
    
    const newConfig = config.concat(unSelectedDependencies);
    let newButtonsToShow = buttonsToShow.filter(btn => newConfig.includes(btn) === false);

    setConfig(newConfig);
    setButtonsToShow(newButtonsToShow);
  };

  const getButtons = () => {
    if(!buttonsToShow.length) return ' None';
    return (
      <div>
        {
            buttonsToShow.map(btn => {
            return <button key={btn} onClick={() => handleStepSelection(btn)}>{STEPS[btn]}</button>;
          })
        }
      </div>
    );
  };


  return (
    <>
      { renderInputOptions() }
      <hr/>
      <div>
        Selected: { selectedOption === null ? 'None' : STEPS[selectedOption] }
      </div>
      <hr/>
      Available Steps: 
      {
        getButtons()
      }
      <hr/>
      Configuration: { config.length ? config.map(step => STEPS[step]).join(' > ') : 'None' }
      <br/> <br/> <br/> <br/> <br/> <br/>
      Possible paths:
      <div>
        <img src={problemImage} alt='Very meaningful text'/>
      </div>
    </>
    
  );
}

export default App;
