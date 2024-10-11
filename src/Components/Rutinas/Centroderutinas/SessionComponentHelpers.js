import { generateSetsRepsPercent } from './utilities';

export const handleShowModal = (setShowModal) => () => {
  setShowModal(true);
};

export const handleCloseModal = (setShowModal) => () => {
  setShowModal(false);
};

export const handleShowMenu = (setCurrentActivityIndex, setShowMenu) => (index) => {
  setCurrentActivityIndex(index);
  setShowMenu(true);
};

export const handleCloseMenu = (setShowMenu) => () => {
  setShowMenu(false);
};

export const handleSaveActivity = (activities, setActivities, session, setShowModal) => (activity) => {
  const updatedActivities = [...activities, { ...activity, exercises: [] }];
  setActivities(updatedActivities);
  session.actividades = updatedActivities;
  setShowModal(false);
};

export const handleAddExercise = (activities, setActivities, session, currentActivityIndex, currentScheme, setShowMenu) => (exercise) => {
  try {
    if (!exercise.grupoMuscular || exercise.grupoMuscular.length === 0) {
      throw new Error('El grupo muscular del ejercicio no está definido.');
    }

    const updatedActivities = [...activities];
    const position = updatedActivities[currentActivityIndex].exercises.length + 1;
    const transformedExercise = {
      id: exercise._id,
      nombre: exercise.nombre,
      image: exercise.imgUrl,
      grupoMuscular: exercise.grupoMuscular,
      sets: currentScheme ? generateSetsRepsPercent(exercise, currentScheme, position, exercise.grupoMuscular[0]) : [{ set: position, reps: '10', weight: '0', rest: '60s', notes: '' }]
    };
    updatedActivities[currentActivityIndex].exercises.push(transformedExercise);
    setActivities(updatedActivities);
    session.actividades = updatedActivities;
    setShowMenu(false);
  } catch (error) {
    console.error('Error adding exercise:', error.message);
  }
};

export const handleEditExercise = (activities, setActivities, session) => (editedExercise) => {
  const updatedActivities = activities.map(activity => ({
    ...activity,
    exercises: activity.exercises.map(exercise =>
      exercise.id === editedExercise.id ? editedExercise : exercise
    )
  }));
  setActivities(updatedActivities);
  session.actividades = updatedActivities;
};

export const handleDeleteExercise = (activities, setActivities, session) => (exerciseId) => {
  const updatedActivities = activities.map(activity => ({
    ...activity,
    exercises: activity.exercises.filter(exercise => exercise.id !== exerciseId)
  }));
  setActivities(updatedActivities);
  session.actividades = updatedActivities;
};

export const handleDeleteActivity = (activities, setActivities, session) => (index) => {
  const updatedActivities = activities.filter((_, i) => i !== index);
  setActivities(updatedActivities);
  session.actividades = updatedActivities;
};

export const handleSchemeChange = (activities, setActivities, session, updateActivityScheme) => (activityIndex, e) => {
  const selectedScheme = e.target.value;
  updateActivityScheme(activities, setActivities, session, activityIndex, selectedScheme);
};

export const handleGlobalSchemeChange = (activities, setActivities, session, updateActivityScheme) => (selectedScheme) => {
  const updatedActivities = activities.map((activity, index) =>
    updateActivityScheme(activities, setActivities, session, index, selectedScheme)
  );
  setActivities(updatedActivities);
  session.actividades = updatedActivities;
};

export const updateActivityScheme = (activities, setActivities, session, activityIndex, selectedScheme) => {
  if (!activities[activityIndex]) {
    console.error(`Activity at index ${activityIndex} is undefined`);
    return;
  }

  const updatedActivities = [...activities];
  updatedActivities[activityIndex].scheme = selectedScheme;

  updatedActivities[activityIndex].exercises = updatedActivities[activityIndex].exercises.map((exercise, index) => {
    exercise.sets = generateSetsRepsPercent(exercise, selectedScheme, index + 1, exercise.grupoMuscular[0]);
    return exercise;
  });

  setActivities(updatedActivities);
  session.actividades = updatedActivities;
  return updatedActivities[activityIndex];
};

export const handleIntensityChange = (activities, setActivities, session) => (activityIndex, e) => {
  const updatedActivities = [...activities];
  updatedActivities[activityIndex].intensity = e.target.value;
  setActivities(updatedActivities);
  session.actividades = updatedActivities;
};

export const handleRoundsChange = (activities, setActivities, session) => (activityIndex, e) => {
  const updatedActivities = [...activities];
  updatedActivities[activityIndex].rounds = e.target.value;
  setActivities(updatedActivities);
  session.actividades = updatedActivities;
};

export const calculateDuration = (activity) => {
  let totalMinutes = 0;

  if (!activity.exercises || !Array.isArray(activity.exercises)) {
    return totalMinutes;
  }

  activity.exercises.forEach(exercise => {
    if (!exercise.sets || !Array.isArray(exercise.sets)) {
      return;
    }

    exercise.sets.forEach(set => {
      const reps = parseInt(set.reps) || 0;
      const restSeconds = parseInt((set.rest || '').replace('s', '')) || 0;
      const workMinutes = reps / 15;
      const restMinutes = restSeconds / 60;
      totalMinutes += workMinutes + restMinutes;
    });
  });

  if (activity.mode === 'Circuit Mode' && activity.rounds) {
    totalMinutes *= activity.rounds;
  }

  return Math.round(totalMinutes);
};

export const handleMoveExercise = (activities, setActivities, session) => (activityIndex, fromIndex, toIndex) => {
  const updatedActivities = [...activities];
  const exercises = updatedActivities[activityIndex].exercises;
  const [movedExercise] = exercises.splice(fromIndex, 1);
  exercises.splice(toIndex, 0, movedExercise);
  setActivities(updatedActivities);
  session.actividades = updatedActivities;
};
