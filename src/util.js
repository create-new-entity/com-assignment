import { DEPENDENCY_GRAPH } from "./data";

export const getDependencies = (option, dependencies) => {
  if(!DEPENDENCY_GRAPH[option]) {
    if(!dependencies.includes(option)) dependencies.push(option);
    return dependencies;
  };

  let newDependencies = dependencies;

  DEPENDENCY_GRAPH[option].forEach((newOption) => {
    newDependencies = getDependencies(newOption, newDependencies);
  });

  newDependencies.push(option);
  return newDependencies;
};