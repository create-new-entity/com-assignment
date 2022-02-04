export const STEPS = {
  0: 'T1_INPUT',
  1: 'FLAIR_INPUT',
  2: 'T1_AND_FLAIR_INPUT',
  3: 'SKULL_STRIP',
  4: 'BIAS_CORRECTION',
  5: 'VOXEL_MORPH',
  6: 'STRUCTURAL_SEG',
  7: 'TENSOR_MORPH',
  8: 'GRADIENT_ANALYSIS',
  9: 'INTENSITY_NORMALIZATION',
  10: 'LESION_SEG',
  11: 'CO_REGISTRATION',
  12: 'HYPERINTENSITY_SEG'
};

export const DEPENDENCY_GRAPH = {
  5: [3],
  6: [3, 4],
  7: [5, 6],
  10: [8, 9],
  11: [6, 10],
  12: [11]
};

const T1_NODES = [3, 4, 5, 6, 7];
const FLAIR_NODES = [8, 9, 10];
const T1_AND_FLAIR_NODES = [ ...T1_NODES, ...FLAIR_NODES, 11, 12];

export const NODES = {
  0: T1_NODES,
  1: FLAIR_NODES,
  2: T1_AND_FLAIR_NODES
};

