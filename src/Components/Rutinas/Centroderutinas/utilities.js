// src/components/utilities.js

import schemesConfig from './schemesConfig';

export function adjusted1RM(base1RM, position, muscleFatigued, muscleGroup) {
  let adjustmentFactor = 1;

  if (position > 1) {
    if (muscleGroup.includes(muscleFatigued)) {
      adjustmentFactor -= 0.1 * (position - 1);  // Reducción del 10% por cada posición adicional
    } else {
      adjustmentFactor -= 0.05 * (position - 1);  // Reducción del 5% por cada posición adicional
    }
  }

  const adjusted1RM = base1RM * adjustmentFactor;
  console.log(`adjusted1RM: base1RM=${base1RM}, position=${position}, muscleFatigued=${muscleFatigued}, muscleGroup=${muscleGroup}, adjustmentFactor=${adjustmentFactor}, adjusted1RM=${adjusted1RM}`);
  return adjusted1RM;
}

export function generateSetsRepsPercent(exercise, scheme, position, muscleFatigued) {
  const schemeConfig = schemesConfig[scheme];
  if (!schemeConfig) {
    throw new Error(`El esquema (${scheme}) no está definido en schemesConfig.`);
  }

  const muscleGroup = exercise.grupoMuscular[0];
  const schemeParams = schemeConfig.parameters[muscleGroup] || schemeConfig.default;

  if (!schemeParams) {
    throw new Error(`El grupo muscular (${muscleGroup}) no está definido en el esquema (${scheme}).`);
  }

  const base1RM = 100;  // Suponemos un 1RM base
  const estimated1RM = adjusted1RM(base1RM, position, muscleFatigued, exercise.grupoMuscular);

  const sets = Array.from({ length: schemeParams.sets }, (_, i) => ({
    set: i + 1,
    reps: getRepsForSet(schemeParams.reps, i),
    percent: (estimated1RM / base1RM * 100).toFixed(1),
    rest: schemeParams.rest,
    notes: schemeParams.notes || ''
  }));

  console.log(`generateSetsRepsPercent: exercise=${exercise.nombre}, scheme=${scheme}, position=${position}, sets=${JSON.stringify(sets)}`);
  return sets;
}

function getRepsForSet(repsRange, setIndex) {
  const [minReps, maxReps] = repsRange.split('-').map(Number);
  return Math.floor(Math.random() * (maxReps - minReps + 1)) + minReps;
}
