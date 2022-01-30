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
  7: 'TENSOR_MORPH',

  'GRADIENT_ANALYSIS': 8,
  8: 'GRADIENT_ANALYSIS',

  'INTENSITY_NORMALIZATION':9,
  9: 'INTENSITY_NORMALIZATION',

  'LESION_SEG': 10,
  10: 'LESION_SEG',

  'CO_REGISTRATION': 11,
  11: 'CO_REGISTRATION',

  'HYPERINTENSITY_SEG': 12,
  12: 'HYPERINTENSITY_SEG'
};

const DEPENDENCY_GRAPH = {
  [STEPS.SKULL_STRIP]: [STEPS.T1_INPUT],
  [STEPS.BIAS_CORRECTION]: [STEPS.T1_INPUT],
  [STEPS.VOXEL_MORPH]: [STEPS.SKULL_STRIP],
  [STEPS.STRUCTURAL_SEG]: [STEPS.SKULL_STRIP, STEPS.BIAS_CORRECTION],
  [STEPS.TENSOR_MORPH]: [STEPS.VOXEL_MORPH, STEPS.STRUCTURAL_SEG],

  [STEPS.GRADIENT_ANALYSIS]: [STEPS.FLAIR_INPUT],
  [STEPS.INTENSITY_NORMALIZATION]: [STEPS.FLAIR_INPUT],
  [STEPS.LESION_SEG]: [STEPS.GRADIENT_ANALYSIS, STEPS.INTENSITY_NORMALIZATION],

  [STEPS.CO_REGISTRATION]: [STEPS.STRUCTURAL_SEG, STEPS.LESION_SEG],
  [STEPS.HYPERINTENSITY_SEG]: [STEPS.CO_REGISTRATION]
};

const REVERSE_DEPENDENCY_GRAPH = {
  [STEPS.T1_INPUT]: [STEPS.SKULL_STRIP, STEPS.BIAS_CORRECTION],
  [STEPS.SKULL_STRIP]: [STEPS.VOXEL_MORPH, STEPS.STRUCTURAL_SEG],
  [STEPS.BIAS_CORRECTION]: [STEPS.STRUCTURAL_SEG],
  [STEPS.VOXEL_MORPH]: [STEPS.TENSOR_MORPH],
  [STEPS.STRUCTURAL_SEG]: [STEPS.TENSOR_MORPH, STEPS.CO_REGISTRATION],

  [STEPS.FLAIR_INPUT]: [STEPS.GRADIENT_ANALYSIS, STEPS.INTENSITY_NORMALIZATION],
  [STEPS.GRADIENT_ANALYSIS]: [STEPS.LESION_SEG],
  [STEPS.INTENSITY_NORMALIZATION]: [STEPS.LESION_SEG],

  [STEPS.CO_REGISTRATION]: [STEPS.HYPERINTENSITY_SEG],
  [STEPS.LESION_SEG]: [STEPS.CO_REGISTRATION]
};



const App = () => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [config, setConfig] = useState([]);
  const [buttonsToShow, setButtonsToShow] = useState([]);

  const dependenciesSlected = (option) => {
    return DEPENDENCY_GRAPH[option].every(dependency => config.includes(dependency));
  };

  const handleSelectedOption = (option) => {
    let newButtonsToShow;
    if(option !== 2) newButtonsToShow = REVERSE_DEPENDENCY_GRAPH[option].filter(btn => buttonsToShow.includes(btn) === false);
    else {
      // Option 3
      newButtonsToShow = REVERSE_DEPENDENCY_GRAPH[STEPS.T1_INPUT].filter(btn => buttonsToShow.includes(btn) === false);
      newButtonsToShow = newButtonsToShow.concat(REVERSE_DEPENDENCY_GRAPH[STEPS.FLAIR_INPUT].filter(btn => buttonsToShow.includes(btn) === false).filter(btn => newButtonsToShow.includes(btn) === false));
      setSelectedOption(option);
      setConfig([STEPS.T1_INPUT, STEPS.FLAIR_INPUT]);
      setButtonsToShow(newButtonsToShow);
      return;
    }
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
    const filteredButtons = buttonsToShow.filter(btn => btn !== option);
    const nextButtonsFromTheSelectedOne = REVERSE_DEPENDENCY_GRAPH[option] ? REVERSE_DEPENDENCY_GRAPH[option].filter(btn => buttonsToShow.includes(btn) === false) : [];
    const newButtonsToShow = filteredButtons.concat(nextButtonsFromTheSelectedOne);
    
    const newConfig = config.concat(option);

    setConfig(newConfig);
    setButtonsToShow(newButtonsToShow);
  };

  const getButtons = () => {
    if(!buttonsToShow.length) return ' None';
    return (
      <div>
        {
          buttonsToShow.map(btn => {
          return <button disabled={ dependenciesSlected(btn) ? false : true } key={btn} onClick={() => handleStepSelection(btn)}>{STEPS[btn]}</button>;
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
    </>
    
  );
}

export default App;
