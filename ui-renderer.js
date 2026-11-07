/**
 * @file ui-renderer.js
 * DOM Controller and UI Rendering Orchestrator for Time2Live.
 * Connects user input controls to the actuarial calculation engine and i18n module.
 */

import {
  calculateLongevity,
  calculateBMI,
  regionalActuarialTables,
  saveProfile,
  loadSavedProfile,
  clearSavedProfile,
  DEFAULT_PROFILE
} from './actuarial-engine.js';
import { i18n, getCurrentLang, setCurrentLang, t, applyTranslations } from './i18n.js';

// DOM Element References Cache
let dom = null;

export function getDomElements() {
  if (dom) return dom;
  dom = {
    // Inputs
    ageInput: document.getElementById('age'),
    ageVal: document.getElementById('ageVal'),
    heightInput: document.getElementById('height'),
    heightVal: document.getElementById('heightVal'),
    weightInput: document.getElementById('weight'),
    weightVal: document.getElementById('weightVal'),
    regionInput: document.getElementById('region'),

    // Health Conditions
    condCardio: document.getElementById('condCardio'),
    condStroke: document.getElementById('condStroke'),
    condCancer: document.getElementById('condCancer'),
    condDiabetes: document.getElementById('condDiabetes'),
    condHypertension: document.getElementById('condHypertension'),

    // BMI Display
    bmiDisplay: document.getElementById('bmiDisplay'),
    bmiCategory: document.getElementById('bmiCategory'),

    // Lifestyle & Genetics
    smokingInput: document.getElementById('smoking'),
    exerciseInput: document.getElementById('exercise'),
    alcoholInput: document.getElementById('alcohol'),
    occupationInput: document.getElementById('occupation'),
    geneticsInput: document.getElementById('genetics'),

    // Hereditary Causes
    causeCardio: document.getElementById('causeCardio'),
    causeStroke: document.getElementById('causeStroke'),
    causeCancer: document.getElementById('causeCancer'),
    causeDiabetes: document.getElementById('causeDiabetes'),
    causeDementia: document.getElementById('causeDementia'),

    // Outputs & KPIs
    estimatedAgeElem: document.getElementById('estimatedAge'),
    remainingYearsElem: document.getElementById('remainingYears'),
    netShiftElem: document.getElementById('netShift'),
    remainingDaysElem: document.getElementById('remainingDays'),
    remainingWeeksElem: document.getElementById('remainingWeeks'),
    modifiersListElem: document.getElementById('modifiersList'),

    // Comparison Bar
    barBaselineVal: document.getElementById('barBaselineVal'),
    barUserVal: document.getElementById('barUserVal'),
    barBaselineFill: document.getElementById('barBaselineFill'),
    barUserFill: document.getElementById('barUserFill'),
    barDiffLabel: document.getElementById('barDiffLabel'),

    // Actions & Navigation
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    toggleDetailsBtn: document.getElementById('toggleDetailsBtn'),
    detailsPanel: document.getElementById('detailsPanel'),
    detailsChevron: document.getElementById('detailsChevron'),
    shareBtn: document.getElementById('shareBtn'),
    shareBtnText: document.getElementById('shareBtnText'),
    exportHtmlBtn: document.getElementById('exportHtmlBtn'),
    exportHtmlBtnText: document.getElementById('exportHtmlBtnText'),
    secretIconDownloadBtn: document.getElementById('secretIconDownloadBtn'),

    // Language
    langEnBtn: document.getElementById('langEnBtn'),
    langFrBtn: document.getElementById('langFrBtn'),

    // Modal
    aboutBtn: document.getElementById('aboutBtn'),
    aboutModal: document.getElementById('aboutModal'),
    aboutModalContent: document.getElementById('aboutModalContent'),
    closeAboutBtn: document.getElementById('closeAboutBtn'),
    closeAboutModalBtn: document.getElementById('closeAboutModalBtn'),

    // Sex Labels
    sexMaleLabel: document.getElementById('sexMaleLabel'),
    sexFemaleLabel: document.getElementById('sexFemaleLabel'),

    // Persistence & Privacy Controls (Option A)
    rememberProfileToggle: document.getElementById('rememberProfileToggle'),
    rememberStatusBadge: document.getElementById('rememberStatusBadge'),
    resetProfileBtn: document.getElementById('resetProfileBtn'),
    resetProfileBtnText: document.getElementById('resetProfileBtnText'),

    // PWA & Connectivity
    installPwaBtn: document.getElementById('installPwaBtn'),
    iosInstallModal: document.getElementById('iosInstallModal'),
    closeIosInstallBtn: document.getElementById('closeIosInstallBtn'),
    dismissIosInstallBtn: document.getElementById('dismissIosInstallBtn'),
    offlineIndicator: document.getElementById('offlineIndicator')
  };
  return dom;
}

/**
 * Reads all input values from the form.
 * @returns {Object}
 */
export function getFormInputValues() {
  const elements = getDomElements();
  const age = elements.ageInput ? parseInt(elements.ageInput.value, 10) : 45;
  const height = elements.heightInput ? parseInt(elements.heightInput.value, 10) : 175;
  const weight = elements.weightInput ? parseInt(elements.weightInput.value, 10) : 74;

  const sexRadio = document.querySelector('input[name="sex"]:checked');
  const sex = sexRadio ? sexRadio.value : 'male';
  const region = elements.regionInput ? elements.regionInput.value : 'uk';

  const smoking = elements.smokingInput ? elements.smokingInput.value : 'never';
  const exercise = elements.exerciseInput ? elements.exerciseInput.value : 'over_one';
  const alcohol = elements.alcoholInput ? elements.alcoholInput.value : 'moderate';
  const occupation = elements.occupationInput ? elements.occupationInput.value : 'low';
  const genetics = elements.geneticsInput ? elements.geneticsInput.value : 'average';

  const healthConditions = {
    cardio: !!(elements.condCardio && elements.condCardio.checked),
    stroke: !!(elements.condStroke && elements.condStroke.checked),
    cancer: !!(elements.condCancer && elements.condCancer.checked),
    diabetes: !!(elements.condDiabetes && elements.condDiabetes.checked),
    hypertension: !!(elements.condHypertension && elements.condHypertension.checked)
  };

  const hereditaryCauses = {
    cardio: !!(elements.causeCardio && elements.causeCardio.checked),
    stroke: !!(elements.causeStroke && elements.causeStroke.checked),
    cancer: !!(elements.causeCancer && elements.causeCancer.checked),
    diabetes: !!(elements.causeDiabetes && elements.causeDiabetes.checked),
    dementia: !!(elements.causeDementia && elements.causeDementia.checked)
  };

  const lang = getCurrentLang();
  const labels = {
    modBmi: t('modBmi', lang),
    modHealthHistory: t('modHealthHistory', lang),
    modTobacco: t('modTobacco', lang),
    modExercise: t('modExercise', lang),
    modAlcohol: t('modAlcohol', lang),
    modOccupation: t('modOccupation', lang),
    modGenetics: t('modGenetics', lang),
    bmiUnderweight: t('bmiUnderweight', lang),
    bmiOptimal: t('bmiOptimal', lang),
    bmiOverweight: t('bmiOverweight', lang),
    bmiObese: t('bmiObese', lang),
    bmiSevere: t('bmiSevere', lang),
    condCardio: 'Cardio',
    condStroke: 'Stroke',
    condCancer: 'Cancer',
    condDiabetes: 'Diabetes',
    condHypertension: 'Hypertension',
    smokingDetail: elements.smokingInput ? elements.smokingInput.options[elements.smokingInput.selectedIndex]?.text : smoking,
    exerciseDetail: elements.exerciseInput ? elements.exerciseInput.options[elements.exerciseInput.selectedIndex]?.text : exercise,
    alcoholDetail: elements.alcoholInput ? elements.alcoholInput.options[elements.alcoholInput.selectedIndex]?.text : alcohol,
    occupationDetail: elements.occupationInput ? elements.occupationInput.options[elements.occupationInput.selectedIndex]?.text : occupation,
    geneticsDetail: elements.geneticsInput ? elements.geneticsInput.options[elements.geneticsInput.selectedIndex]?.text : genetics
  };

  return {
    age,
    sex,
    region,
    height,
    weight,
    smoking,
    exercise,
    alcohol,
    occupation,
    genetics,
    healthConditions,
    hereditaryCauses,
    labels
  };
}

/**
 * Applies a profile object to form inputs and controls.
 * @param {Object} profile
 */
export function applyProfileToForm(profile) {
  const elements = getDomElements();
  if (!profile) return;

  if (profile.age !== undefined && elements.ageInput) elements.ageInput.value = profile.age;
  if (profile.height !== undefined && elements.heightInput) elements.heightInput.value = profile.height;
  if (profile.weight !== undefined && elements.weightInput) elements.weightInput.value = profile.weight;

  if (profile.sex) {
    const radio = document.querySelector(`input[name="sex"][value="${profile.sex}"]`);
    if (radio) radio.checked = true;
  }

  if (profile.region && elements.regionInput) elements.regionInput.value = profile.region;
  if (profile.smoking && elements.smokingInput) elements.smokingInput.value = profile.smoking;
  if (profile.exercise && elements.exerciseInput) elements.exerciseInput.value = profile.exercise;
  if (profile.alcohol && elements.alcoholInput) elements.alcoholInput.value = profile.alcohol;
  if (profile.occupation && elements.occupationInput) elements.occupationInput.value = profile.occupation;
  if (profile.genetics && elements.geneticsInput) elements.geneticsInput.value = profile.genetics;

  if (profile.healthConditions) {
    if (elements.condCardio) elements.condCardio.checked = !!profile.healthConditions.cardio;
    if (elements.condStroke) elements.condStroke.checked = !!profile.healthConditions.stroke;
    if (elements.condCancer) elements.condCancer.checked = !!profile.healthConditions.cancer;
    if (elements.condDiabetes) elements.condDiabetes.checked = !!profile.healthConditions.diabetes;
    if (elements.condHypertension) elements.condHypertension.checked = !!profile.healthConditions.hypertension;
  }

  if (profile.hereditaryCauses) {
    if (elements.causeCardio) elements.causeCardio.checked = !!profile.hereditaryCauses.cardio;
    if (elements.causeStroke) elements.causeStroke.checked = !!profile.hereditaryCauses.stroke;
    if (elements.causeCancer) elements.causeCancer.checked = !!profile.hereditaryCauses.cancer;
    if (elements.causeDiabetes) elements.causeDiabetes.checked = !!profile.hereditaryCauses.diabetes;
    if (elements.causeDementia) elements.causeDementia.checked = !!profile.hereditaryCauses.dementia;
  }
}

/**
 * Updates status text and badge styling for local persistence.
 */
export function updateRememberStatusUI() {
  const elements = getDomElements();
  if (!elements.rememberStatusBadge) return;

  const isRememberOn = elements.rememberProfileToggle ? elements.rememberProfileToggle.checked : false;
  if (isRememberOn) {
    elements.rememberStatusBadge.textContent = t('rememberStatusOn');
    elements.rememberStatusBadge.className =
      'text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 transition-colors';
  } else {
    elements.rememberStatusBadge.textContent = t('rememberStatusOff');
    elements.rememberStatusBadge.className =
      'text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 transition-colors';
  }
}

/**
 * Synchronizes current form values to localStorage if persistence toggle is enabled.
 */
export function syncSavedProfile() {
  const elements = getDomElements();
  if (elements.rememberProfileToggle && elements.rememberProfileToggle.checked) {
    const values = getFormInputValues();
    saveProfile({
      age: values.age,
      sex: values.sex,
      region: values.region,
      height: values.height,
      weight: values.weight,
      smoking: values.smoking,
      exercise: values.exercise,
      alcohol: values.alcohol,
      occupation: values.occupation,
      genetics: values.genetics,
      healthConditions: values.healthConditions,
      hereditaryCauses: values.hereditaryCauses,
      remember: true
    });
  }
}

/**
 * Handles user toggling the Remember Profile switch.
 */
export function handleRememberToggle() {
  const elements = getDomElements();
  if (!elements.rememberProfileToggle) return;

  if (elements.rememberProfileToggle.checked) {
    syncSavedProfile();
  } else {
    clearSavedProfile();
  }
  updateRememberStatusUI();
}

/**
 * Clears saved data, wipes profile back to defaults, and turns off toggle.
 */
export function handleResetProfile() {
  const elements = getDomElements();
  clearSavedProfile();

  if (elements.rememberProfileToggle) {
    elements.rememberProfileToggle.checked = false;
  }

  applyProfileToForm(DEFAULT_PROFILE);
  updateSexStyle();
  calculateMortality();
  updateRememberStatusUI();

  if (elements.resetProfileBtnText) {
    elements.resetProfileBtnText.textContent = t('resetProfileCleared');
    setTimeout(() => {
      elements.resetProfileBtnText.textContent = t('resetProfileBtn');
    }, 2000);
  }
}


/**
 * Calculates longevity and updates the DOM view.
 */
export function calculateMortality() {
  const elements = getDomElements();
  const inputValues = getFormInputValues();
  const data = calculateLongevity(inputValues);

  // Update slider badge texts
  if (elements.ageVal) elements.ageVal.textContent = data.age;
  if (elements.heightVal) elements.heightVal.textContent = data.height;
  if (elements.weightVal) elements.weightVal.textContent = data.weight;

  // BMI indicators
  if (elements.bmiDisplay) elements.bmiDisplay.textContent = data.bmi.toFixed(1);
  if (elements.bmiCategory) elements.bmiCategory.textContent = t(data.bmiCategoryKey);

  // Main KPI numbers
  if (elements.estimatedAgeElem) elements.estimatedAgeElem.textContent = data.estimatedAge.toFixed(1);
  if (elements.remainingYearsElem) elements.remainingYearsElem.textContent = data.remainingYears.toFixed(1);

  if (elements.netShiftElem) {
    elements.netShiftElem.textContent = `${data.netShift >= 0 ? '+' : ''}${data.netShift.toFixed(1)} yrs`;
    elements.netShiftElem.className = data.netShift >= 0
      ? 'text-2xl font-black text-amber-300'
      : 'text-2xl font-black text-rose-300';
  }

  if (elements.remainingDaysElem) elements.remainingDaysElem.textContent = data.remainingDays.toLocaleString();
  if (elements.remainingWeeksElem) elements.remainingWeeksElem.textContent = data.remainingWeeks.toLocaleString();

  // Progress Bar comparison
  if (elements.barBaselineVal) elements.barBaselineVal.textContent = `${data.baseLifespan.toFixed(1)} yrs`;
  if (elements.barUserVal) elements.barUserVal.textContent = `${data.estimatedAge.toFixed(1)} yrs`;

  const maxBarVal = 100;
  if (elements.barBaselineFill) {
    elements.barBaselineFill.style.width = `${Math.min(100, (data.baseLifespan / maxBarVal) * 100)}%`;
  }
  if (elements.barUserFill) {
    elements.barUserFill.style.width = `${Math.min(100, (data.estimatedAge / maxBarVal) * 100)}%`;
  }

  if (elements.barDiffLabel) {
    elements.barDiffLabel.textContent = `${data.netShift >= 0 ? '+' : ''}${data.netShift.toFixed(1)} Yrs`;
    elements.barDiffLabel.className = data.netShift >= 0
      ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
      : 'text-rose-600 dark:text-rose-400 font-extrabold';
  }

  // Factor breakdown list
  if (elements.modifiersListElem) {
    elements.modifiersListElem.innerHTML = '';
    data.modifiers.forEach((mod) => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-xs border border-slate-100 dark:border-slate-700/60';

      const isPos = mod.shift >= 0;
      const shiftColor = isPos
        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
        : 'text-rose-600 dark:text-rose-400 font-bold';

      item.innerHTML = `
        <div class="pr-2">
            <div class="font-semibold text-slate-800 dark:text-slate-200">${mod.name}</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400">${mod.detail}</div>
        </div>
        <div class="${shiftColor} whitespace-nowrap">${isPos ? '+' : ''}${mod.shift.toFixed(1)} yrs</div>
      `;
      elements.modifiersListElem.appendChild(item);
    });
  }

  return data;
}

/**
 * Updates biological sex radio selector visual styles.
 */
export function updateSexStyle() {
  const elements = getDomElements();
  const maleRadio = document.querySelector('input[name="sex"][value="male"]');
  const isMale = maleRadio ? maleRadio.checked : true;

  if (elements.sexMaleLabel && elements.sexFemaleLabel) {
    if (isMale) {
      elements.sexMaleLabel.classList.add('bg-sky-50', 'dark:bg-sky-950/40', 'border-sky-500');
      elements.sexMaleLabel.classList.remove('border-slate-300', 'dark:border-slate-600');
      elements.sexFemaleLabel.classList.remove('bg-emerald-50', 'dark:bg-emerald-950/40', 'border-emerald-500');
      elements.sexFemaleLabel.classList.add('border-slate-300', 'dark:border-slate-600');
    } else {
      elements.sexFemaleLabel.classList.add('bg-emerald-50', 'dark:bg-emerald-950/40', 'border-emerald-500');
      elements.sexFemaleLabel.classList.remove('border-slate-300', 'dark:border-slate-600');
      elements.sexMaleLabel.classList.remove('bg-sky-50', 'dark:bg-sky-950/40', 'border-sky-500');
      elements.sexMaleLabel.classList.add('border-slate-300', 'dark:border-slate-600');
    }
  }
}

/**
 * Sets current language and updates UI components.
 * @param {'en'|'fr'} lang
 */
export function setLanguage(lang) {
  const elements = getDomElements();
  setCurrentLang(lang);

  if (elements.langFrBtn && elements.langEnBtn) {
    if (lang === 'fr') {
      elements.langFrBtn.className = 'px-2.5 py-1 rounded-lg transition-all bg-emerald-600 text-white shadow-sm';
      elements.langEnBtn.className = 'px-2.5 py-1 rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200';
    } else {
      elements.langEnBtn.className = 'px-2.5 py-1 rounded-lg transition-all bg-emerald-600 text-white shadow-sm';
      elements.langFrBtn.className = 'px-2.5 py-1 rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200';
    }
  }

  applyTranslations(lang);
  updateRememberStatusUI();
  calculateMortality();
}

/**
 * Loads predefined lifestyle preset.
 * @param {'healthy'|'sedentary'|'senior'|'drinker'|'smoker_drinker'} presetType
 */
export function loadPreset(presetType) {
  const elements = getDomElements();

  if (presetType === 'healthy') {
    elements.ageInput.value = 32;
    elements.heightInput.value = 178;
    elements.weightInput.value = 72;
    const male = document.querySelector('input[name="sex"][value="male"]');
    if (male) male.checked = true;
    elements.smokingInput.value = 'never';
    elements.exerciseInput.value = 'over_three';
    elements.alcoholInput.value = 'moderate';
    elements.occupationInput.value = 'low';
    elements.geneticsInput.value = 'above_avg';
    elements.condCardio.checked = false;
    elements.condStroke.checked = false;
    elements.condCancer.checked = false;
    elements.condDiabetes.checked = false;
    elements.condHypertension.checked = false;
    elements.causeCardio.checked = false;
    elements.causeStroke.checked = false;
    elements.causeCancer.checked = false;
    elements.causeDiabetes.checked = false;
    elements.causeDementia.checked = false;
  } else if (presetType === 'sedentary') {
    elements.ageInput.value = 48;
    elements.heightInput.value = 170;
    elements.weightInput.value = 92;
    const male = document.querySelector('input[name="sex"][value="male"]');
    if (male) male.checked = true;
    elements.smokingInput.value = 'heavy';
    elements.exerciseInput.value = 'less_half';
    elements.alcoholInput.value = 'high';
    elements.occupationInput.value = 'low';
    elements.geneticsInput.value = 'average';
    elements.condCardio.checked = false;
    elements.condStroke.checked = false;
    elements.condCancer.checked = false;
    elements.condDiabetes.checked = true;
    elements.condHypertension.checked = true;
    elements.causeCardio.checked = true;
    elements.causeStroke.checked = false;
    elements.causeCancer.checked = false;
    elements.causeDiabetes.checked = false;
    elements.causeDementia.checked = false;
  } else if (presetType === 'senior') {
    elements.ageInput.value = 68;
    elements.heightInput.value = 165;
    elements.weightInput.value = 64;
    const female = document.querySelector('input[name="sex"][value="female"]');
    if (female) female.checked = true;
    elements.smokingInput.value = 'ex_long';
    elements.exerciseInput.value = 'over_one';
    elements.alcoholInput.value = 'moderate';
    elements.occupationInput.value = 'low';
    elements.geneticsInput.value = 'exceptional';
    elements.condCardio.checked = false;
    elements.condStroke.checked = false;
    elements.condCancer.checked = false;
    elements.condDiabetes.checked = false;
    elements.condHypertension.checked = false;
    elements.causeCardio.checked = false;
    elements.causeStroke.checked = false;
    elements.causeCancer.checked = false;
    elements.causeDiabetes.checked = false;
    elements.causeDementia.checked = false;
  } else if (presetType === 'drinker') {
    elements.ageInput.value = 42;
    elements.heightInput.value = 175;
    elements.weightInput.value = 85;
    const male = document.querySelector('input[name="sex"][value="male"]');
    if (male) male.checked = true;
    elements.smokingInput.value = 'never';
    elements.exerciseInput.value = 'less_half';
    elements.alcoholInput.value = 'extreme';
    elements.occupationInput.value = 'low';
    elements.geneticsInput.value = 'average';
    elements.condCardio.checked = false;
    elements.condStroke.checked = false;
    elements.condCancer.checked = false;
    elements.condDiabetes.checked = false;
    elements.condHypertension.checked = true;
    elements.causeCardio.checked = false;
    elements.causeStroke.checked = false;
    elements.causeCancer.checked = false;
    elements.causeDiabetes.checked = false;
    elements.causeDementia.checked = false;
  } else if (presetType === 'smoker_drinker') {
    elements.ageInput.value = 50;
    elements.heightInput.value = 172;
    elements.weightInput.value = 90;
    const male = document.querySelector('input[name="sex"][value="male"]');
    if (male) male.checked = true;
    elements.smokingInput.value = 'heavy';
    elements.exerciseInput.value = 'less_half';
    elements.alcoholInput.value = 'extreme';
    elements.occupationInput.value = 'low';
    elements.geneticsInput.value = 'premature';
    elements.condCardio.checked = true;
    elements.condStroke.checked = false;
    elements.condCancer.checked = false;
    elements.condDiabetes.checked = true;
    elements.condHypertension.checked = true;
    elements.causeCardio.checked = true;
    elements.causeStroke.checked = true;
    elements.causeCancer.checked = false;
    elements.causeDiabetes.checked = false;
    elements.causeDementia.checked = false;
  }

  updateSexStyle();
  calculateMortality();
  syncSavedProfile();
}

/**
 * About Modal controls.
 */
export function openModal() {
  const elements = getDomElements();
  if (!elements.aboutModal || !elements.aboutModalContent) return;
  elements.aboutModal.classList.remove('hidden');
  setTimeout(() => {
    elements.aboutModalContent.classList.remove('scale-95', 'opacity-0');
    elements.aboutModalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
}

export function closeModal() {
  const elements = getDomElements();
  if (!elements.aboutModal || !elements.aboutModalContent) return;
  elements.aboutModalContent.classList.remove('scale-100', 'opacity-100');
  elements.aboutModalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    elements.aboutModal.classList.add('hidden');
  }, 200);
}

/**
 * Exports detailed standalone printable HTML report.
 */
export function exportHtmlReport() {
  const elements = getDomElements();
  const inputValues = getFormInputValues();
  const data = calculateLongevity(inputValues);
  const currentLang = getCurrentLang();
  const dateStr = new Date().toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportHtml = `<!DOCTYPE html>
<html lang="${currentLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Time2Live - Comprehensive Longevity & Life Report</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #ffffff; color: #1e293b; }
    </style>
</head>
<body class="bg-white text-slate-800 antialiased min-h-screen p-6 sm:p-12">
    <div class="max-w-3xl mx-auto space-y-8">
        <!-- Header Banner -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-6">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                    <i class="fa-solid fa-leaf text-2xl"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">Time2Live</h1>
                    <p class="text-xs text-emerald-600 font-semibold">Official Actuarial Longevity & Vitality Assessment</p>
                </div>
            </div>
            <div class="text-right text-xs text-slate-500">
                <p><strong>Date:</strong> ${dateStr}</p>
                <p><strong>Baseline:</strong> ${data.region.toUpperCase()} (${data.sex.toUpperCase()})</p>
            </div>
        </div>

        <!-- Main KPI Summary Card -->
        <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div class="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
                <i class="fa-solid fa-heart-pulse text-9xl"></i>
            </div>
            <div class="text-xs font-bold uppercase tracking-widest text-emerald-100 mb-1">Projected Lifespan Horizon</div>
            <div class="flex items-baseline space-x-3 my-2">
                <span class="text-6xl font-black">${data.estimatedAge.toFixed(1)}</span>
                <span class="text-xl font-semibold text-emerald-100">years total expected age</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-500/40 text-sm">
                <div>
                    <div class="text-xs text-emerald-100">Remaining Years</div>
                    <div class="text-2xl font-bold">${data.remainingYears.toFixed(1)} yrs</div>
                </div>
                <div>
                    <div class="text-xs text-emerald-100">Vitality Net Bonus</div>
                    <div class="text-2xl font-bold text-amber-300">${data.netShift >= 0 ? '+' : ''}${data.netShift.toFixed(1)} yrs</div>
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <div class="text-xs text-emerald-100">Golden Days Ahead</div>
                    <div class="text-2xl font-bold">${data.remainingDays.toLocaleString()}</div>
                </div>
            </div>
        </div>

        <!-- Baseline vs Projected Comparison -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex justify-between">
                <span>Demographic Baseline vs. Your Profile</span>
                <span class="text-emerald-600 font-extrabold">${data.netShift >= 0 ? '+' : ''}${data.netShift.toFixed(1)} Yrs Shift</span>
            </h2>
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1 text-slate-600">
                        <span>Regional Statistical Average</span>
                        <span>${data.baseLifespan.toFixed(1)} yrs</span>
                    </div>
                    <div class="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-full bg-slate-400" style="width: ${Math.min(100, (data.baseLifespan / 100) * 100)}%;"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1 text-slate-800">
                        <span>Your Personal Projected Horizon</span>
                        <span class="text-emerald-600 font-bold">${data.estimatedAge.toFixed(1)} yrs</span>
                    </div>
                    <div class="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500" style="width: ${Math.min(100, (data.estimatedAge / 100) * 100)}%;"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detailed Factor Breakdown Table -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Detailed Lifestyle & Health Factor Breakdown</h3>
                <i class="fa-solid fa-list-check text-emerald-600"></i>
            </div>
            <div class="divide-y divide-slate-100">
                ${data.modifiers.map((m) => `
                    <div class="px-6 py-3.5 flex items-center justify-between text-sm">
                        <div>
                            <div class="font-semibold text-slate-800">${m.name}</div>
                            <div class="text-xs text-slate-500">${m.detail}</div>
                        </div>
                        <div class="font-bold ${m.shift >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
                            ${m.shift >= 0 ? '+' : ''}${m.shift.toFixed(1)} yrs
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- How Actuarial Longevity Logic Works (Embedded Section) -->
        <div class="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 space-y-3 text-xs text-slate-700">
            <h3 class="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-2">
                <i class="fa-solid fa-circle-info text-emerald-600"></i>
                <span>How Actuarial Longevity Logic Works</span>
            </h3>
            <p><strong>Demographic Baseline:</strong> Built upon period life table data published by national statistical agencies (such as UK ONS, France INSEE, and US CDC/SSA).</p>
            <p><strong>Survivorship Principle:</strong> As you achieve higher ages, expected lifespan naturally expands because earlier life hazards have already been navigated.</p>
            <p><strong>Statistical Anomalies & Skews:</strong> Actuarial probabilities can occasionally throw up unusual results due to confounding factors. For example, total alcohol abstainers sometimes exhibit slightly skewed negative mortality rates compared to moderate drinkers—a phenomenon largely driven by "sick quitters" (individuals who stopped drinking entirely due to pre-existing serious medical conditions).</p>
            <p class="text-slate-500 italic"><strong>Disclaimer:</strong> This tool yields statistical cohort projections for educational and wellness affirmation purposes and does not substitute medical diagnostic advice.</p>
        </div>

        <!-- Footer Notes -->
        <div class="text-center text-xs text-slate-400 pt-6 border-t border-slate-200 space-y-1">
            <p>Generated securely and privately via Time2Live Actuarial Estimator (100% offline app).</p>
            <p>This report is for life affirmation and educational guidance and does not replace medical diagnostics.</p>
        </div>
    </div>
</body>
</html>`;

  const blob = new Blob([reportHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Time2Live_Detailed_Report.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (elements.exportHtmlBtnText) {
    elements.exportHtmlBtnText.textContent = t('btnExportedHtml');
    setTimeout(() => {
      elements.exportHtmlBtnText.textContent = t('btnExportHtml');
    }, 2000);
  }
}

/**
 * Copies shareable link to clipboard.
 */
export function copyShareLink() {
  const elements = getDomElements();
  const age = elements.estimatedAgeElem ? elements.estimatedAgeElem.textContent : '84.5';
  const text = `My projected lifespan horizon is ${age} years according to Time2Live! Calculate your life outlook: ${window.location.href}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  } else {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
    } catch {
      // fallback
    }
    document.body.removeChild(tempInput);
  }

  if (elements.shareBtnText) {
    elements.shareBtnText.textContent = t('btnCopied');
    setTimeout(() => {
      elements.shareBtnText.textContent = t('btnCopy');
    }, 2000);
  }
}

/**
 * Downloads SVG/PNG app icon.
 */
export function generateAndDownloadIcon() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#059669');
  grad.addColorStop(1, '#0f766e');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, 512, 512, 110);
  ctx.fill();

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">
      <path d="M50 15 C35 15 25 28 25 42 C25 62 50 82 50 82 C50 82 75 62 75 42 C75 30 68 15 50 15 Z" fill="#10B981"/>
      <path d="M50 28 C42 28 36 34 36 42 C36 54 50 68 50 68 C50 68 64 54 64 42 C64 34 58 28 50 28 Z" fill="#ECFDF5"/>
      <path d="M50 36 Q45 46 50 58 M50 46 Q56 42 60 45 M50 50 Q43 47 40 51" stroke="#059669" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  </svg>`;

  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'icon.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  img.src = url;
}

// PWA & Service Worker
let deferredInstallPrompt = null;

/**
 * Registers the cache-first service worker.
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('[Time2Live] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[Time2Live] Service Worker registration note:', err);
        });
    });
  }
}

/**
 * Configures the in-app PWA install flow and connectivity listeners.
 */
export function setupPwaInstallAndOffline() {
  const elements = getDomElements();

  // Detect standalone mode (already installed)
  const isStandalone =
    (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
    (typeof navigator !== 'undefined' && /** @type {*} */ (navigator).standalone === true);

  // Detect iOS Safari
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const isIOS = /iphone|ipad|ipod/.test(userAgent);

  if (!isStandalone) {
    if (isIOS) {
      // iOS Safari does not support beforeinstallprompt; display custom guide
      if (elements.installPwaBtn) {
        elements.installPwaBtn.classList.remove('hidden');
        elements.installPwaBtn.classList.add('flex');
        elements.installPwaBtn.addEventListener('click', () => {
          if (elements.iosInstallModal) {
            elements.iosInstallModal.classList.remove('hidden');
          }
        });
      }
    } else {
      // Chromium / Edge / Android beforeinstallprompt flow
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        if (elements.installPwaBtn) {
          elements.installPwaBtn.classList.remove('hidden');
          elements.installPwaBtn.classList.add('flex');
        }
      });

      if (elements.installPwaBtn) {
        elements.installPwaBtn.addEventListener('click', async () => {
          if (!deferredInstallPrompt) return;
          deferredInstallPrompt.prompt();
          const choice = await deferredInstallPrompt.userChoice;
          if (choice && choice.outcome === 'accepted') {
            elements.installPwaBtn.classList.add('hidden');
            elements.installPwaBtn.classList.remove('flex');
          }
          deferredInstallPrompt = null;
        });
      }
    }
  }

  // App installed event
  window.addEventListener('appinstalled', () => {
    if (elements.installPwaBtn) {
      elements.installPwaBtn.classList.add('hidden');
      elements.installPwaBtn.classList.remove('flex');
    }
    deferredInstallPrompt = null;
  });

  // iOS modal dismissal
  const closeIosModal = () => {
    if (elements.iosInstallModal) {
      elements.iosInstallModal.classList.add('hidden');
    }
  };
  if (elements.closeIosInstallBtn) {
    elements.closeIosInstallBtn.addEventListener('click', closeIosModal);
  }
  if (elements.dismissIosInstallBtn) {
    elements.dismissIosInstallBtn.addEventListener('click', closeIosModal);
  }
  if (elements.iosInstallModal) {
    elements.iosInstallModal.addEventListener('click', (e) => {
      if (e.target === elements.iosInstallModal) closeIosModal();
    });
  }

  // Connectivity status indicator
  const updateOnlineStatus = (e) => {
    if (!elements.offlineIndicator) return;
    const isOffline = (e && e.type === 'offline') || (typeof navigator !== 'undefined' && !navigator.onLine);
    if (isOffline) {
      elements.offlineIndicator.classList.remove('hidden');
      elements.offlineIndicator.classList.add('flex');
    } else {
      elements.offlineIndicator.classList.add('hidden');
      elements.offlineIndicator.classList.remove('flex');
    }
  };

  window.addEventListener('online', (e) => updateOnlineStatus(e));
  window.addEventListener('offline', (e) => updateOnlineStatus(e));
  updateOnlineStatus();
}

/**
 * Initializes and wires all application events and handlers.
 */
export function initApp() {
  const elements = getDomElements();

  // Initialize Service Worker and PWA install capabilities
  registerServiceWorker();
  setupPwaInstallAndOffline();

  // Expose global handlers for inline HTML event attributes
  window.loadPreset = loadPreset;
  window.updateSexStyle = updateSexStyle;
  window.setLanguage = setLanguage;
  window.handleRememberToggle = handleRememberToggle;
  window.handleResetProfile = handleResetProfile;

  // Persistence & Privacy Controls (Option A)
  if (elements.rememberProfileToggle) {
    elements.rememberProfileToggle.addEventListener('change', handleRememberToggle);
  }
  if (elements.resetProfileBtn) {
    elements.resetProfileBtn.addEventListener('click', handleResetProfile);
  }

  // Language buttons
  if (elements.langEnBtn) elements.langEnBtn.addEventListener('click', () => setLanguage('en'));
  if (elements.langFrBtn) elements.langFrBtn.addEventListener('click', () => setLanguage('fr'));

  // Modal events
  if (elements.aboutBtn) elements.aboutBtn.addEventListener('click', openModal);
  if (elements.closeAboutBtn) elements.closeAboutBtn.addEventListener('click', closeModal);
  if (elements.closeAboutModalBtn) elements.closeAboutModalBtn.addEventListener('click', closeModal);
  if (elements.aboutModal) {
    elements.aboutModal.addEventListener('click', (e) => {
      if (e.target === elements.aboutModal) closeModal();
    });
  }

  // Secret Icon download
  if (elements.secretIconDownloadBtn) {
    elements.secretIconDownloadBtn.addEventListener('click', generateAndDownloadIcon);
  }

  // Details expand toggle
  if (elements.toggleDetailsBtn && elements.detailsPanel) {
    elements.toggleDetailsBtn.addEventListener('click', () => {
      elements.detailsPanel.classList.toggle('hidden');
      if (elements.detailsChevron) elements.detailsChevron.classList.toggle('rotate-180');
    });
  }

  // Theme toggle
  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });
  }

  // Share & Export
  if (elements.shareBtn) elements.shareBtn.addEventListener('click', copyShareLink);
  if (elements.exportHtmlBtn) elements.exportHtmlBtn.addEventListener('click', exportHtmlReport);

  const onInputChange = () => {
    calculateMortality();
    syncSavedProfile();
  };

  // Form input change listeners
  const inputList = [
    elements.ageInput,
    elements.heightInput,
    elements.weightInput,
    elements.regionInput,
    elements.smokingInput,
    elements.exerciseInput,
    elements.alcoholInput,
    elements.occupationInput,
    elements.geneticsInput,
    elements.condCardio,
    elements.condStroke,
    elements.condCancer,
    elements.condDiabetes,
    elements.condHypertension,
    elements.causeCardio,
    elements.causeStroke,
    elements.causeCancer,
    elements.causeDiabetes,
    elements.causeDementia
  ];

  inputList.forEach((input) => {
    if (input) {
      input.addEventListener('input', onInputChange);
      input.addEventListener('change', onInputChange);
    }
  });

  document.querySelectorAll('input[name="sex"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      updateSexStyle();
      onInputChange();
    });
  });

  // Attach preset listeners if buttons use data attributes
  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const preset = e.currentTarget.getAttribute('data-preset');
      if (preset) loadPreset(preset);
    });
  });

  // Check and restore saved profile if available
  const savedProfile = loadSavedProfile();
  if (savedProfile && savedProfile.remember) {
    applyProfileToForm(savedProfile);
    if (elements.rememberProfileToggle) {
      elements.rememberProfileToggle.checked = true;
    }
  } else {
    if (elements.rememberProfileToggle) {
      elements.rememberProfileToggle.checked = false;
    }
  }

  updateRememberStatusUI();
  updateSexStyle();
  calculateMortality();
}

// Automatically initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
