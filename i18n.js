/**
 * @file i18n.js
 * Internationalization (i18n) module for Time2Live.
 * Manages translations, active language state, and localized string resolution.
 */

export const i18n = {
  en: {
    appSubtitle: 'Actuarial Longevity & Life Affirmation Estimator',
    aboutBtn: 'About',
    creatorLabel: 'Creator:',
    assistedLabel: 'Assisted by:',
    aboutDesc1: 'Welcome to <strong>Time2Live</strong>—a positive, life-affirming actuarial longevity projection tool!',
    aboutDesc2: 'Designed to celebrate every chapter of life ahead, <strong>Time2Live</strong> pairs official demographic life expectancy baselines (from statistical agencies like ONS, INSEE, and US CDC/SSA) with body metrics, lifestyle choices, medical conditions, and occupational hazard factors.',
    aboutDesc3: '100% offline, privacy-focused, and free of ads. Discover how small daily positive habits can extend your personal longevity horizon!',
    aboutClose: 'Celebrate Life!',
    presetsLabel: 'Quick Load Test Profiles:',
    presetHealthy: '🌱 Vibrant Active Life',
    presetSmoker: '🚬 Heavy Smoker / Sedentary',
    presetSenior: '🏃 Active Senior (65+)',
    presetDrinker: '🍺 Sedentary Heavy Drinker',
    presetSmokerDrinker: '⚠️ High Lifestyle Stress Profile',
    secDemographics: '1. Baseline Demographics',
    labelAge: 'Current Age:',
    unitYears: 'years',
    labelSex: 'Biological Sex',
    sexMale: 'Male',
    sexFemale: 'Female',
    labelRegion: 'Regional Demographic Baseline',
    optRegionUk: 'United Kingdom (ONS Official Tables)',
    optRegionFr: 'France (INSEE Official Tables)',
    optRegionUs: 'United States (CDC / SSA Official Tables)',
    secPhysical: '2. Physical Profile & Health Status',
    labelHeight: 'Height:',
    labelWeight: 'Weight:',
    labelHealthHistory: 'Personal Medical Factors (Check all that apply):',
    condCardioLabel: 'Cardiovascular / Heart Condition',
    condStrokeLabel: 'Stroke / TIA History',
    condCancerLabel: 'Cancer History (Active / Remission)',
    condDiabetesLabel: 'Type 2 Diabetes',
    condHypertensionLabel: 'Hypertension / High Blood Pressure',
    secLifestyle: '3. Lifestyle & Vitality Habits',
    labelSmoking: 'Tobacco Habits',
    optSmokeNever: 'Non-smoker / Clean Air',
    optSmokeExLong: 'Ex-smoker (Quit > 10 years)',
    optSmokeExMed: 'Ex-smoker (Quit 5–10 years)',
    optSmokeExShort: 'Ex-smoker (Quit < 5 years)',
    optSmokeLight: 'Light smoker (< 10 daily)',
    optSmokeHeavy: 'Heavy smoker (10+ daily)',
    labelExercise: 'Physical Activity (Weekly)',
    optExLessHalf: 'Less than 0.5 hour / week',
    optExOverHalf: '0.5 – 1 hour / week',
    optExOverOne: '1 – 3 hours / week',
    optExOverThree: 'Over 3 hours / week (Active)',
    labelAlcohol: 'Alcohol Consumption',
    optAlcNone: 'None / Rare (<1 unit/week)',
    optAlcMod: 'Moderate (1–14 units/week)',
    optAlcHigh: 'High (15–28 units/week)',
    optAlcExtreme: 'Heavy (28+ units/week)',
    labelOccupation: 'Occupational Work Environment',
    optOccLow: 'Low Risk (Office / Remote)',
    optOccMed: 'Medium Risk (Active / Retail)',
    optOccHigh: 'High Hazard Level (Construction/Hazardous)',
    labelGenetics: 'Earliest Deceased Relative Lifespan',
    geneticsHint: 'Based on the shortest non-accidental lifespan among your 6 direct ancestors.',
    optGenHigh: 'High Longevity Family (All 90+ years)',
    optGenAboveAvg: 'Above Average Family (80–90 years)',
    optGenAvg: 'Average Lifespans (73–80 years)',
    optGenLow: 'At least 1 Early Natural Loss (< 73 years)',
    labelGeneticsCause: 'Hereditary Medical History (Check all that apply):',
    optCauseNone: 'None / Accidental / Non-Hereditary',
    optCauseCardio: 'Cardiovascular / Heart Disease',
    optCauseStroke: 'Cerebrovascular / Stroke',
    optCauseCancer: 'Hereditary Cancer',
    optCauseDiabetes: 'Type 2 Diabetes / Renal',
    optCauseDementia: 'Neurodegenerative / Early Memory Loss',
    kpiHeader: 'Actuarial Life Projection',
    btnCopy: 'Copy',
    btnCopied: 'Copied!',
    btnExportHtml: 'Export HTML',
    btnExportedHtml: 'Saved!',
    kpiEstimatedSuffix: 'years expected lifespan',
    kpiRemainingYears: 'Remaining Life Years',
    kpiNetShift: 'Vitality Net Bonus',
    kpiDays: 'Est. Golden Days Ahead:',
    kpiWeeks: 'Weeks:',
    titleBarComparison: 'Regional Baseline vs. Your Horizon',
    barBaselineLabel: 'Regional Baseline Average',
    barUserLabel: 'Your Projected Horizon',
    titleBreakdown: 'Vitality & Risk Breakdown',
    titleDetails: 'How Actuarial Longevity Logic Works',
    detailsP1: '<strong>Demographic Baseline:</strong> Built upon period life table data published by national statistical agencies (such as UK ONS, France INSEE, and US CDC/SSA).',
    detailsP2: '<strong>Survivorship Principle:</strong> As you achieve higher ages, expected lifespan naturally expands because earlier life hazards have already been navigated.',
    detailsP4: '<strong>Statistical Anomalies & Skews:</strong> Actuarial probabilities can occasionally throw up unusual results due to confounding factors. For example, total alcohol abstainers sometimes exhibit slightly skewed negative mortality rates compared to moderate drinkers—a phenomenon largely driven by "sick quitters" (individuals who stopped drinking entirely due to pre-existing serious medical conditions).',
    detailsP3: '<strong>Disclaimer:</strong> This tool yields statistical cohort projections for educational and wellness affirmation purposes and does not substitute medical diagnostic advice.',
    bmiUnderweight: 'Underweight',
    bmiOptimal: 'Optimal',
    bmiOverweight: 'Overweight',
    bmiObese: 'Obese (Class I)',
    bmiSevere: 'Severe Obesity',
    modBmi: 'Body Mass Index (BMI)',
    modHealthHistory: 'Personal Health Factors',
    modTobacco: 'Tobacco Usage Impact',
    modExercise: 'Physical Activity Bonus',
    modAlcohol: 'Alcohol Intake Impact',
    modOccupation: 'Occupational Factor',
    modGenetics: 'Family Longevity Baseline',
    rememberToggleLabel: 'Remember Profile on this Device',
    rememberToggleHint: 'Stored strictly in your local browser. Zero cloud tracking or accounts.',
    rememberStatusOff: 'Ephemeral Mode (Forgets on close)',
    rememberStatusOn: 'Saved on Device',
    resetProfileBtn: 'Clear & Start Fresh',
    resetProfileTooltip: 'Wipe saved profile so a friend can test their longevity',
    resetProfileCleared: 'Profile Cleared!',
    installAppBtn: 'Install App',
    installAppIosTitle: 'Install on iPhone / iPad',
    installAppIosDesc: '1. Tap the <strong>Share</strong> button in the Safari toolbar.<br>2. Scroll down and tap <strong>Add to Home Screen</strong>.',
    offlineStatusNotice: 'Offline Mode — Cached data is being used.'
  },
  fr: {
    appSubtitle: "Calculateur d'Espérance de Vie Actuarielle et de Vitalité",
    aboutBtn: 'À propos',
    creatorLabel: 'Créateur :',
    assistedLabel: 'Assisté par :',
    aboutDesc1: 'Bienvenue sur <strong>Time2Live</strong>—un outil actuariel positif et optimiste pour projeter votre longévité !',
    aboutDesc2: 'Conçu pour célébrer chaque étape de la vie à venir, <strong>Time2Live</strong> combine les tables de mortalité officielles (INSEE, ONS et CDC/SSA américain) avec votre profil physique, vos habitudes quotidiennes et vos antécédents de santé.',
    aboutDesc3: '100% hors ligne, privé et sans publicité. Découvrez comment de petites habitudes positives au quotidien peuvent prolonger votre horizon de vie !',
    aboutClose: 'Célébrer la Vie !',
    presetsLabel: 'Profils de test rapides :',
    presetHealthy: '🌱 Mode de Vie Actif et Serein',
    presetSmoker: '🚬 Fumeur / Sédentaire',
    presetSenior: '🏃 Senior Actif (65+)',
    presetDrinker: '🍺 Sédentaire Grand Buveur',
    presetSmokerDrinker: '⚠️ Profil à Fort Stress',
    secDemographics: '1. Démographie de base',
    labelAge: 'Âge actuel :',
    unitYears: 'ans',
    labelSex: 'Sexe biologique',
    sexMale: 'Homme',
    sexFemale: 'Femme',
    labelRegion: 'Données actuarielles régionales',
    optRegionUk: 'Royaume-Uni (Tables officielles ONS)',
    optRegionFr: 'France (Tables officielles INSEE)',
    optRegionUs: 'États-Unis (Tables officielles CDC / SSA)',
    secPhysical: '2. Profil physique et Santé',
    labelHeight: 'Taille :',
    labelWeight: 'Poids :',
    labelHealthHistory: 'Facteurs de santé personnels (Cochez le cas échéant) :',
    condCardioLabel: 'Trouble Cardiovasculaire / Cardiaque',
    condStrokeLabel: 'Antécédent d’AVC / AIT',
    condCancerLabel: 'Antécédent de Cancer (Actif / Rémis)',
    condDiabetesLabel: 'Diabète de type 2',
    condHypertensionLabel: 'Hypertension artérielle',
    secLifestyle: '3. Mode de vie & Vitalité',
    labelSmoking: 'Consommation de tabac',
    optSmokeNever: 'Non-fumeur / Air Pur',
    optSmokeExLong: 'Ex-fumeur (Arrêt > 10 ans)',
    optSmokeExMed: 'Ex-fumeur (Arrêt 5–10 ans)',
    optSmokeExShort: 'Ex-fumeur (Arrêt < 5 ans)',
    optSmokeLight: 'Fumeur modéré (< 10/jour)',
    optSmokeHeavy: 'Grand fumeur (10+/jour)',
    labelExercise: 'Activité physique (Hebdomadaire)',
    optExLessHalf: 'Moins de 0,5 heure / semaine',
    optExOverHalf: '0,5 – 1 heure / semaine',
    optExOverOne: '1 – 3 heures / semaine',
    optExOverThree: 'Plus de 3 heures / semaine (Actif)',
    labelAlcohol: 'Consommation d’alcool',
    optAlcNone: 'Aucune / Rare (<1 unité/semaine)',
    optAlcMod: 'Modérée (1–14 unités/semaine)',
    optAlcHigh: 'Élevée (15–28 unités/semaine)',
    optAlcExtreme: 'Très élevée (28+ unités/semaine)',
    labelOccupation: 'Environnement professionnel',
    optOccLow: 'Risque faible (Bureau / Télétravail)',
    optOccMed: 'Risque moyen (Actif / Commerce)',
    optOccHigh: 'Risque élevé (BTP / Métiers pénibles)',
    labelGenetics: 'Longévité du parent/grand-parent décédé le plus jeune',
    geneticsHint: 'Basé sur la plus courte longévité non-accidentelle parmi vos 6 ascendants directs.',
    optGenHigh: 'Famille à très grande longévité (Tous 90+ ans)',
    optGenAboveAvg: 'Famille au-dessus de la moyenne (80–90 ans)',
    optGenAvg: 'Longévité moyenne (73–80 ans)',
    optGenLow: 'Au moins 1 décès précoce naturel (< 73 ans)',
    labelGeneticsCause: 'Hérédité médicale (Cochez le cas échéant) :',
    optCauseNone: 'Aucune / Accidentel / Non-héréditaire',
    optCauseCardio: 'Maladie Cardiovasculaire',
    optCauseStroke: 'Maladie Cérébrovasculaire / AVC',
    optCauseCancer: 'Cancer héréditaire',
    optCauseDiabetes: 'Diabète de type 2 / Rénal',
    optCauseDementia: 'Neurodégénératif / Mémoire',
    kpiHeader: 'Projection Actuarielle de Vie',
    btnCopy: 'Copier',
    btnCopied: 'Copié !',
    btnExportHtml: 'Exporter HTML',
    btnExportedHtml: 'Enregistré !',
    kpiEstimatedSuffix: 'ans d’espérance de vie estimée',
    kpiRemainingYears: 'Années de vie restantes',
    kpiNetShift: 'Bonus Vitalité Net',
    kpiDays: 'Beaux Jours à Venir :',
    kpiWeeks: 'Semaines :',
    titleBarComparison: 'Moyenne Régionale vs Votre Horizon',
    barBaselineLabel: 'Moyenne Régionale de Base',
    barUserLabel: 'Votre Horizon Projeté',
    titleBreakdown: 'Détail Vitalité et Facteurs',
    titleDetails: 'Comment fonctionne le calcul actuariel',
    detailsP1: '<strong>Base démographique :</strong> Basée sur les tables de mortalité publiées par l’INSEE, l’ONS et le CDC/SSA américain.',
    detailsP2: '<strong>Principe de survie :</strong> Plus vous avancez en âge, plus votre espérance totale augmente car les facteurs de risque précoces sont franchis.',
    detailsP4: '<strong>Anomalies et biais statistiques :</strong> Les probabilités actuarielles peuvent parfois produire des résultats inattendus en raison de variables masquées. Par exemple, les abstinents totaux affichent parfois des risques de mortalité légèrement majorés par rapport aux buveurs modérés, un phénomène souvent causé par des personnes ayant cessé de boire en raison de graves problèmes de santé préexistants (effet des « abstinents pour raison de santé »).',
    detailsP3: '<strong>Avertissement :</strong> Outil générant une estimation statistique éducative, ne remplaçant pas un avis médical.',
    bmiUnderweight: 'Insuffisance pondérale',
    bmiOptimal: 'Corpulence idéale',
    bmiOverweight: 'Surpoids',
    bmiObese: 'Obésité (Classe I)',
    bmiSevere: 'Obésité sévère',
    modBmi: 'Indice de Masse Corporelle (IMC)',
    modHealthHistory: 'Facteurs de santé personnels',
    modTobacco: 'Impact du tabagisme',
    modExercise: 'Bonus d’activité physique',
    modAlcohol: 'Impact de l’alcool',
    modOccupation: 'Environnement de travail',
    modGenetics: 'Longévité familiale',
    rememberToggleLabel: 'Mémoriser le profil sur cet appareil',
    rememberToggleHint: 'Stocké uniquement dans votre navigateur local. Aucun compte ni suivi.',
    rememberStatusOff: 'Mode éphémère (effacé à la fermeture)',
    rememberStatusOn: 'Enregistré sur l’appareil',
    resetProfileBtn: 'Effacer & Réinitialiser',
    resetProfileTooltip: 'Efface le profil enregistré pour permettre à un proche de tester',
    resetProfileCleared: 'Profil effacé !',
    installAppBtn: "Installer l'app",
    installAppIosTitle: 'Installer sur iPhone / iPad',
    installAppIosDesc: "1. Appuyez sur le bouton <strong>Partager</strong> dans Safari.<br>2. Faites défiler et touchez <strong>Sur l'écran d'accueil</strong>.",
    offlineStatusNotice: 'Mode hors ligne — Utilisation des données en cache.'
  }
};

let currentLang = 'en';

/**
 * Returns current language code ('en' | 'fr').
 * @returns {'en'|'fr'}
 */
export function getCurrentLang() {
  return currentLang;
}

/**
 * Sets current language.
 * @param {'en'|'fr'} lang
 */
export function setCurrentLang(lang) {
  if (lang === 'fr' || lang === 'en') {
    currentLang = lang;
  }
}

/**
 * Translates a key for the given language (or currentLang).
 * @param {string} key
 * @param {'en'|'fr'} [lang]
 * @returns {string}
 */
export function t(key, lang = currentLang) {
  const dict = i18n[lang] || i18n.en;
  return dict[key] !== undefined ? dict[key] : (i18n.en[key] || key);
}

/**
 * Updates all elements with [data-i18n] in the document to match current language.
 * @param {'en'|'fr'} [lang]
 */
export function applyTranslations(lang = currentLang) {
  setCurrentLang(lang);
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((elem) => {
    const key = elem.getAttribute('data-i18n');
    if (key && i18n[currentLang] && i18n[currentLang][key] !== undefined) {
      elem.innerHTML = i18n[currentLang][key];
    }
  });
}
