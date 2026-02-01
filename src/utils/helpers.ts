// src/utils/helpers.ts
// Fonctions utilitaires générales

/**
 * Génère un UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Pause l'exécution pour une durée donnée
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce : retarde l'exécution jusqu'à ce qu'il n'y ait plus d'appels
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Throttle : limite la fréquence d'exécution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Limite une valeur entre min et max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Vérifie si une valeur est entre min et max (inclus)
 */
export function isBetween(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Arrondit un nombre à N décimales
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Interpole linéairement entre deux valeurs
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Map une valeur d'une plage à une autre
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Retourne true si l'objet est vide
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Deep clone d'un objet
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Compare deux objets pour égalité profonde
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Capitalise la première lettre
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Tronque un texte avec ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Supprime les accents d'une chaîne
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Convertit une chaîne en slug
 */
export function slugify(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Groupe un tableau par une clé
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Retourne les éléments uniques d'un tableau
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Retourne la différence entre deux dates en minutes
 */
export function minutesBetween(date1: Date, date2: Date): number {
  return Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60);
}

/**
 * Retourne la différence entre deux dates en heures
 */
export function hoursBetween(date1: Date, date2: Date): number {
  return minutesBetween(date1, date2) / 60;
}

/**
 * Retourne la différence entre deux dates en jours
 */
export function daysBetween(date1: Date, date2: Date): number {
  return hoursBetween(date1, date2) / 24;
}

/**
 * Vérifie si deux dates sont le même jour
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Retourne le début de la journée pour une date
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Retourne la fin de la journée pour une date
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}
