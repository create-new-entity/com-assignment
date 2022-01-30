import React, { useState } from "react";


const STEPS = {
  'T1_INPUT': 0,
  0: 'T1_INPUT',

  'FLAIR_INPUT': 1,
  1: 'FLAIR_INPUT',

  'T1_AND_FLAIR_INPUT': 2,
  2: 'T1_AND_FLAIR_INPUT',

  'SKULL_STRIP': 3,
  3: 'SKULL_STRIP',

  'BIAS_CORRECTION': 4,
  4: 'BIAS_CORRECTION',

  'VOXEL_MORPH': 5,
  5: 'VOXEL_MORPH',

  'STRUCTURAL_SEG': 6,
  6: 'STRUCTURAL_SEG',

  'TENSOR_MORPH': 7,
  7: 'TENSOR_MORPH'
};

const DEPENDENCY_GRAPH = {
  [STEPS.SKULL_STRIP]: [STEPS.T1_INPUT],
  [STEPS.BIAS_CORRECTION]: [STEPS.T1_INPUT],
  [STEPS.VOXEL_MORPH]: [STEPS.SKULL_STRIP],
  [STEPS.STRUCTURAL_SEG]: [STEPS.SKULL_STRIP, STEPS.BIAS_CORRECTION],
  [STEPS.TENSOR_MORPH]: [STEPS.VOXEL_MORPH, STEPS.STRUCTURAL_SEG]
};

const REVERSE_DEPENDENCY_GRAPH = {
  [STEPS.T1_INPUT]: [STEPS.SKULL_STRIP, STEPS.BIAS_CORRECTION],
  [STEPS.SKULL_STRIP]: [STEPS.VOXEL_MORPH, STEPS.STRUCTURAL_SEG],
  [STEPS.BIAS_CORRECTION]: [STEPS.STRUCTURAL_SEG],
  [STEPS.VOXEL_MORPH]: [STEPS.TENSOR_MORPH],
  [STEPS.STRUCTURAL_SEG]: [STEPS.TENSOR_MORPH]
};



const App = () => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [config, setConfig] = useState([]);
  const [buttonsToShow, setButtonsToShow] = useState([]);

  const dependenciesSlected = (option) => {
    // console.log(config);
    // console.log(config.map(o => STEPS[0]));
    // console.log(DEPENDENCY_GRAPH[option].every(dependency => config.includes(dependency)));
    return DEPENDENCY_GRAPH[option].every(dependency => config.includes(dependency));
  };

  // const filterButtons = (option) => {
  //   const filteredButtons = buttonsToShow.filter(btn => btn !== option);
  //   const nextButtons = REVERSE_DEPENDENCY_GRAPH[option].filter(btn => dependenciesSlected(btn));
  //   const newButtonsToShow = filteredButtons.concat(nextButtons.filter(btn => filteredButtons.includes(btn) === false ));
  //   setButtonsToShow(newButtonsToShow);
  // };

  const handleSelectedOption = (option) => {
    const newButtonsToShow = REVERSE_DEPENDENCY_GRAPH[option].filter(btn => buttonsToShow.includes(btn) === false);
    setSelectedOption(option);
    setConfig([option]);
    setButtonsToShow(newButtonsToShow);
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
        <button onClick={() => handleSelectedOption(STEPS.T1_INPUT)}>T1 input image</button>
        <button onClick={() => handleSelectedOption(STEPS.FLAIR_INPUT)}>FLAIR input image</button>
        <button onClick={() => handleSelectedOption(STEPS.T1_AND_FLAIR_INPUT)}>T1 and FLAIR input image</button>
      </div>
    );
  };

  const handleStepSelection = (option) => {
    // filterButtons(option);
    const filteredButtons = buttonsToShow.filter(btn => btn !== option);
    const nextButtonsFromTheSelectedOne = REVERSE_DEPENDENCY_GRAPH[option] ? REVERSE_DEPENDENCY_GRAPH[option].filter(btn => buttonsToShow.includes(btn) === false) : [];
    const newButtonsToShow = filteredButtons.concat(nextButtonsFromTheSelectedOne);
    
    const newConfig = config.concat(option);

    setConfig(newConfig);
    setButtonsToShow(newButtonsToShow);
  };

  const getButtons = () => {
    if(!buttonsToShow.length) return null;
    return buttonsToShow.map(btn => {
      return <button disabled={ dependenciesSlected(btn) ? false : true } key={btn} onClick={() => handleStepSelection(btn)}>{STEPS[btn]}</button>;
    });
  };


  console.log(config);
  console.log(config.map(o => STEPS[o]));
  return (
    <>
      { renderInputOptions() }
      <hr/>
      <div>
        Selected { selectedOption === null ? 'None' : STEPS[selectedOption] }
      </div>
      <hr/>
      {
        getButtons()
      }
      <hr/>
      Configuration so far: { config.length ? config.map(step => STEPS[step]).join(' > ') : 'None' }
    </>
    
  );
}

export default App;
