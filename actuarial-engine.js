/**
 * @file actuarial-engine.js
 * Pure Actuarial Longevity Calculation Engine for Time2Live.
 * Enforces separation of concerns: contains no DOM or UI dependencies.
 */

export const regionalActuarialTables = {
  uk: {
    18: { male: 60.5, female: 64.2 },
    25: { male: 53.8, female: 57.4 },
    35: { male: 44.3, female: 47.7 },
    45: { male: 35.0, female: 38.2 },
    55: { male: 26.0, female: 29.0 },
    65: { male: 17.8, female: 20.4 },
    75: { male: 10.8, female: 12.6 },
    85: { male: 5.6,  female: 6.6 },
    95: { male: 2.5,  female: 2.9 }
  },
  fr: {
    18: { male: 61.8, female: 67.1 },
    25: { male: 55.0, female: 60.3 },
    35: { male: 45.4, female: 50.5 },
    45: { male: 36.0, female: 40.9 },
    55: { male: 27.1, female: 31.6 },
    65: { male: 18.9, female: 22.8 },
    75: { male: 11.6, female: 14.5 },
    85: { male: 6.1,  female: 7.7 },
    95: { male: 2.8,  female: 3.5 }
  }
};

export const AGE_BRACKETS = [18, 25, 35, 45, 55, 65, 75, 85, 95];

/**
 * Calculates Body Mass Index and actuarial weight impact.
 * @param {number} weightKg
 * @param {number} heightCm
 * @returns {{ bmi: number, categoryKey: string, shift: number }}
 */
export function calculateBMI(weightKg, heightCm) {
  const heightMeters = heightCm / 100;
  if (!heightMeters || heightMeters <= 0) {
    return { bmi: 0, categoryKey: 'bmiOptimal', shift: 0 };
  }
  const bmi = parseFloat((weightKg / (heightMeters * heightMeters)).toFixed(1));

  let categoryKey = 'bmiOptimal';
  let shift = 0;

  if (bmi < 18.5) {
    categoryKey = 'bmiUnderweight';
    shift = -2.0;
  } else if (bmi >= 18.5 && bmi < 25) {
    categoryKey = 'bmiOptimal';
    shift = +1.5;
  } else if (bmi >= 25 && bmi < 30) {
    categoryKey = 'bmiOverweight';
    shift = -0.5;
  } else if (bmi >= 30 && bmi < 35) {
    categoryKey = 'bmiObese';
    shift = -3.0;
  } else {
    categoryKey = 'bmiSevere';
    shift = -5.5;
  }

  return { bmi, categoryKey, shift };
}

/**
 * Finds the nearest actuarial baseline bracket for a given age.
 * @param {number} age
 * @returns {number}
 */
export function getClosestAgeBracket(age) {
  let closestAge = 45;
  let minDiff = 999;
  for (const k of AGE_BRACKETS) {
    const diff = Math.abs(k - age);
    if (diff < minDiff) {
      minDiff = diff;
      closestAge = k;
    }
  }
  return closestAge;
}

/**
 * Calculates mortality projection from demographic, biometric, and lifestyle parameters.
 * @param {Object} params
 * @param {number} params.age - Current age (18-95)
 * @param {'male'|'female'} params.sex - Biological sex
 * @param {'uk'|'fr'} params.region - Demographic table key
 * @param {number} params.height - Height in cm
 * @param {number} params.weight - Weight in kg
 * @param {string} params.smoking - Smoking status key
 * @param {string} params.exercise - Exercise activity key
 * @param {string} params.alcohol - Alcohol intake key
 * @param {string} params.occupation - Occupational hazard key
 * @param {string} params.genetics - Genetics lifespan bracket key
 * @param {Object} [params.healthConditions] - Boolean flags for personal health factors
 * @param {Object} [params.hereditaryCauses] - Boolean flags for ancestral premature causes
 * @param {Object} [params.labels] - Human-readable label overrides
 * @returns {Object} Complete calculated actuarial longevity dataset
 */
export function calculateLongevity(params) {
  const {
    age = 45,
    sex = 'male',
    region = 'uk',
    height = 175,
    weight = 74,
    smoking = 'never',
    exercise = 'over_one',
    alcohol = 'moderate',
    occupation = 'low',
    genetics = 'average',
    healthConditions = {},
    hereditaryCauses = {},
    labels = {}
  } = params;

  // 1. Physical profile (BMI)
  const bmiInfo = calculateBMI(weight, height);

  // 2. Baseline life table lookup
  const closestAge = getClosestAgeBracket(age);
  const selectedRegion = regionalActuarialTables[region] || regionalActuarialTables.uk;
  const tableEntry = selectedRegion[closestAge] || selectedRegion[45];
  const baseRemainingYears = tableEntry[sex] ?? 35.0;
  const baseLifespan = age + baseRemainingYears;

  const modifiers = [];

  // BMI modifier
  modifiers.push({
    id: 'bmi',
    nameKey: 'modBmi',
    name: labels.modBmi || 'Body Mass Index (BMI)',
    detail: labels.bmiDetail || `BMI ${bmiInfo.bmi} (${labels[bmiInfo.categoryKey] || bmiInfo.categoryKey})`,
    shift: bmiInfo.shift
  });

  // Personal health conditions
  let healthShift = 0;
  const healthDetails = [];
  if (healthConditions.cardio) { healthShift -= 4.0; healthDetails.push(labels.condCardio || 'Cardio'); }
  if (healthConditions.stroke) { healthShift -= 4.5; healthDetails.push(labels.condStroke || 'Stroke'); }
  if (healthConditions.cancer) { healthShift -= 3.5; healthDetails.push(labels.condCancer || 'Cancer'); }
  if (healthConditions.diabetes) { healthShift -= 3.0; healthDetails.push(labels.condDiabetes || 'Diabetes'); }
  if (healthConditions.hypertension) { healthShift -= 2.0; healthDetails.push(labels.condHypertension || 'Hypertension'); }

  if (healthShift !== 0) {
    modifiers.push({
      id: 'healthHistory',
      nameKey: 'modHealthHistory',
      name: labels.modHealthHistory || 'Personal Health Factors',
      detail: healthDetails.join(', '),
      shift: healthShift
    });
  }

  // Tobacco modifier
  let smokeShift = 0;
  if (smoking === 'never') smokeShift = +1.0;
  else if (smoking === 'ex_long') smokeShift = 0;
  else if (smoking === 'ex_med') smokeShift = -1.5;
  else if (smoking === 'ex_short') smokeShift = -3.0;
  else if (smoking === 'light') smokeShift = -4.5;
  else if (smoking === 'heavy') smokeShift = -8.0;

  modifiers.push({
    id: 'smoking',
    nameKey: 'modTobacco',
    name: labels.modTobacco || 'Tobacco Usage Impact',
    detail: labels.smokingDetail || smoking,
    shift: smokeShift
  });

  // Physical activity modifier
  let exShift = 0;
  if (exercise === 'less_half') exShift = -2.0;
  else if (exercise === 'over_half') exShift = 0;
  else if (exercise === 'over_one') exShift = +2.0;
  else if (exercise === 'over_three') exShift = +3.5;

  modifiers.push({
    id: 'exercise',
    nameKey: 'modExercise',
    name: labels.modExercise || 'Physical Activity Bonus',
    detail: labels.exerciseDetail || exercise,
    shift: exShift
  });

  // Alcohol consumption modifier
  let alcShift = 0;
  if (alcohol === 'none') alcShift = 0;
  else if (alcohol === 'moderate') alcShift = +0.5;
  else if (alcohol === 'high') alcShift = -2.5;
  else if (alcohol === 'extreme') alcShift = -5.0;

  modifiers.push({
    id: 'alcohol',
    nameKey: 'modAlcohol',
    name: labels.modAlcohol || 'Alcohol Intake Impact',
    detail: labels.alcoholDetail || alcohol,
    shift: alcShift
  });

  // Occupational factor modifier
  let occShift = 0;
  if (occupation === 'low') occShift = +0.5;
  else if (occupation === 'medium') occShift = -0.5;
  else if (occupation === 'high') occShift = -2.0;

  modifiers.push({
    id: 'occupation',
    nameKey: 'modOccupation',
    name: labels.modOccupation || 'Occupational Factor',
    detail: labels.occupationDetail || occupation,
    shift: occShift
  });

  // Family genetics modifier
  let genShift = 0;
  if (genetics === 'exceptional') genShift = +4.0;
  else if (genetics === 'above_avg') genShift = +2.0;
  else if (genetics === 'average') genShift = 0;
  else if (genetics === 'premature') {
    genShift = -2.0;
    if (hereditaryCauses.cardio) genShift -= 1.5;
    if (hereditaryCauses.stroke) genShift -= 1.5;
    if (hereditaryCauses.cancer) genShift -= 1.5;
    if (hereditaryCauses.diabetes) genShift -= 1.0;
    if (hereditaryCauses.dementia) genShift -= 1.5;
  }

  modifiers.push({
    id: 'genetics',
    nameKey: 'modGenetics',
    name: labels.modGenetics || 'Family Longevity Baseline',
    detail: labels.geneticsDetail || genetics,
    shift: genShift
  });

  // Aggregate net shifts & estimate lifespan
  const netShift = parseFloat(modifiers.reduce((acc, curr) => acc + curr.shift, 0).toFixed(1));
  let estimatedAge = baseLifespan + netShift;
  if (estimatedAge <= age) {
    estimatedAge = age + 1.0;
  }
  estimatedAge = parseFloat(estimatedAge.toFixed(1));

  const remainingYears = parseFloat((estimatedAge - age).toFixed(1));
  const remainingDays = Math.round(remainingYears * 365.25);
  const remainingWeeks = Math.round(remainingYears * 52.1775);

  return {
    age,
    sex,
    region,
    height,
    weight,
    bmi: bmiInfo.bmi,
    bmiCategoryKey: bmiInfo.categoryKey,
    bmiShift: bmiInfo.shift,
    baseRemainingYears,
    baseLifespan: parseFloat(baseLifespan.toFixed(1)),
    netShift,
    estimatedAge,
    remainingYears,
    remainingDays,
    remainingWeeks,
    modifiers
  };
}
