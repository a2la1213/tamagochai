// src/utils/index.ts
// Barrel export de tous les utilitaires

// Helpers généraux
export {
  generateUUID,
  sleep,
  debounce,
  throttle,
  clamp,
  isBetween,
  roundTo,
  lerp,
  mapRange,
  isEmpty,
  deepClone,
  deepEqual,
  capitalize,
  truncate,
  removeAccents,
  slugify,
  groupBy,
  unique,
  minutesBetween,
  hoursBetween,
  daysBetween,
  isSameDay,
  startOfDay,
  endOfDay,
} from './helpers';

// Formatters
export {
  formatDate,
  formatDateShort,
  formatTime,
  formatDateTime,
  formatDuration,
  formatRelativeTime,
  formatNumber,
  formatPercent,
  formatCompact,
  formatXP,
  formatBattery,
  formatEmotionName,
  formatStageName,
  formatHormoneName,
  formatPartOfDay,
  formatGreeting,
  formatDaysAlive,
  formatStreak,
} from './formatters';

// Random
export {
  gaussianRandom,
  gaussianRandomClamped,
  randomChoice,
  randomSample,
  randomInt,
  randomFloat,
  randomChance,
  shuffle,
  weightedChoice,
  generateGenome,
  generateBiasedGenome,
  randomVariation,
  randomShortId,
  randomColor,
  decayingChoice,
} from './random';

// Validators
export type { ValidationResult } from './validators';
export {
  validateName,
  validateMessage,
  validateEmail,
  validateHormoneLevel,
  validateXP,
  validateDate,
  validateUUID,
  validateGenome,
  containsInappropriateContent,
  sanitizeString,
  sanitizeName,
  sanitizeMessage,
} from './validators';
