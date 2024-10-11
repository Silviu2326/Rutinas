// src/components/schemesConfig.js

const schemesConfig = {
  'Foundation': {
    color: '#eaa8ff',
    loading: '#da4cff',
    reps: '#ff6ff5',
    loadingPercent: 13,
    repsPercent: 80,
    parameters: {},
    default: { sets: 4, reps: '8-12', rest: '60s', notes: '' }
  },
  'Hypertrophy (HYP)': {
    color: '#00c2ff',
    loading: '#0080ff',
    reps: '#4cb8ff',
    loadingPercent: 35,
    repsPercent: 71,
    parameters: {},
    default: { sets: 4, reps: '6-12', rest: '60s', notes: '' }
  },
  'Strength Capacity (STC)': {
    color: '#0044ff',
    loading: '#0033cc',
    reps: '#0044ff',
    loadingPercent: 56,
    repsPercent: 60,
    parameters: {},
    default: { sets: 5, reps: '4-6', rest: '90s', notes: '' }
  },
  'Strength (STR)': {
    color: '#ff6600',
    loading: '#cc5200',
    reps: '#ff6a00',
    loadingPercent: 78,
    repsPercent: 45,
    parameters: {},
    default: { sets: 5, reps: '3-5', rest: '120s', notes: '' }
  },
  'Max Strength (MAX)': {
    color: '#ff0000',
    loading: '#cc0000',
    reps: '#ff2a2a',
    loadingPercent: 100,
    repsPercent: 30,
    parameters: {},
    default: { sets: 5, reps: '1-3', rest: '180s', notes: '' }
  },
  'Power (PWR)': {
    color: '#00c2ff',
    loading: '#0080ff',
    reps: '#4cb8ff',
    loadingPercent: 48,
    repsPercent: 53,
    parameters: {},
    default: { sets: 3, reps: '2-5', rest: '60s', notes: 'Moderately High (with control)' }
  },
  'Speed (SPD)': {
    color: '#00cc00',
    loading: '#009900',
    reps: '#00cc00',
    loadingPercent: 33,
    repsPercent: 73,
    parameters: {},
    default: { sets: 3, reps: '2-5', rest: '60s', notes: 'High (with control)' }
  },
  'Muscular Endurance (END)': {
    color: '#66cc00',
    loading: '#4d9900',
    reps: '#66cc33',
    loadingPercent: 23,
    repsPercent: 100,
    parameters: {},
    default: { sets: 3, reps: '12-15', rest: '60s', notes: '' }
  },
  'Unload (UNL)': {
    color: '#999999',
    loading: '#666666',
    reps: '#999999',
    loadingPercent: 50,
    repsPercent: 50,
    parameters: {},
    default: { sets: 3, reps: '4-6', rest: '60s', notes: '' }
  },
  'Off': {
    color: '#666666',
    loading: '#333333',
    reps: '#666666',
    loadingPercent: 0,
    repsPercent: 0,
    parameters: {},
    default: { sets: 0, reps: '0', rest: '0s', notes: '' }
  }
};

export default schemesConfig;
