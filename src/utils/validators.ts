// src/utils/validators.ts
// Fonctions de validation

import { APP_CONFIG } from '../constants/config';

/**
 * Résultat de validation
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valide un nom de TamagochAI
 */
export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Le nom ne peut pas être vide',
    };
  }
  
  if (trimmed.length < APP_CONFIG.limits.minNameLength) {
    return {
      isValid: false,
      error: `Le nom doit faire au moins ${APP_CONFIG.limits.minNameLength} caractères`,
    };
  }
  
  if (trimmed.length > APP_CONFIG.limits.maxNameLength) {
    return {
      isValid: false,
      error: `Le nom ne peut pas dépasser ${APP_CONFIG.limits.maxNameLength} caractères`,
    };
  }
  
  // Pas de caractères spéciaux dangereux
  const invalidChars = /[<>{}[\]\\\/]/;
  if (invalidChars.test(trimmed)) {
    return {
      isValid: false,
      error: 'Le nom contient des caractères non autorisés',
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un message utilisateur
 */
export function validateMessage(message: string): ValidationResult {
  const trimmed = message.trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Le message ne peut pas être vide',
    };
  }
  
  if (trimmed.length > APP_CONFIG.limits.maxMessageLength) {
    return {
      isValid: false,
      error: `Le message ne peut pas dépasser ${APP_CONFIG.limits.maxMessageLength} caractères`,
    };
  }
  
  return { isValid: true };
}

/**
 * Valide une adresse email
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim().toLowerCase();
  
  if (!trimmed) {
    return {
      isValid: false,
      error: 'L\'email ne peut pas être vide',
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Format d\'email invalide',
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un niveau d'hormone (0-100)
 */
export function validateHormoneLevel(level: number): ValidationResult {
  if (typeof level !== 'number' || isNaN(level)) {
    return {
      isValid: false,
      error: 'Le niveau doit être un nombre',
    };
  }
  
  if (level < 0 || level > 100) {
    return {
      isValid: false,
      error: 'Le niveau doit être entre 0 et 100',
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un montant d'XP
 */
export function validateXP(xp: number): ValidationResult {
  if (typeof xp !== 'number' || isNaN(xp)) {
    return {
      isValid: false,
      error: 'L\'XP doit être un nombre',
    };
  }
  
  if (xp < 0) {
    return {
      isValid: false,
      error: 'L\'XP ne peut pas être négatif',
    };
  }
  
  if (!Number.isInteger(xp)) {
    return {
      isValid: false,
      error: 'L\'XP doit être un entier',
    };
  }
  
  return { isValid: true };
}

/**
 * Valide une date
 */
export function validateDate(date: any): ValidationResult {
  if (!date) {
    return {
      isValid: false,
      error: 'La date ne peut pas être vide',
    };
  }
  
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return {
      isValid: false,
      error: 'Format de date invalide',
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un UUID
 */
export function validateUUID(uuid: string): ValidationResult {
  if (!uuid) {
    return {
      isValid: false,
      error: 'L\'UUID ne peut pas être vide',
    };
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    return {
      isValid: false,
      error: 'Format d\'UUID invalide',
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un génome
 */
export function validateGenome(genome: any): ValidationResult {
  if (!genome || typeof genome !== 'object') {
    return {
      isValid: false,
      error: 'Le génome doit être un objet',
    };
  }
  
  const traits = ['social', 'cognitive', 'emotional', 'energy', 'creativity'];
  
  for (const trait of traits) {
    if (!(trait in genome)) {
      return {
        isValid: false,
        error: `Le trait "${trait}" est manquant`,
      };
    }
    
    const value = genome[trait];
    if (typeof value !== 'number' || value < 0 || value > 100) {
      return {
        isValid: false,
        error: `Le trait "${trait}" doit être un nombre entre 0 et 100`,
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Vérifie si une chaîne contient des mots inappropriés
 * (Liste basique, à étendre)
 */
export function containsInappropriateContent(text: string): boolean {
  // Liste très basique pour le MVP
  // En production, utiliser une vraie solution de modération
  const inappropriatePatterns = [
    // Ajouter des patterns si nécessaire
  ];
  
  const lowerText = text.toLowerCase();
  return inappropriatePatterns.some(pattern => lowerText.includes(pattern));
}

/**
 * Sanitize une chaîne pour éviter les injections
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valide et nettoie un nom
 */
export function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')  // Espaces multiples -> simple
    .slice(0, APP_CONFIG.limits.maxNameLength);
}

/**
 * Valide et nettoie un message
 */
export function sanitizeMessage(message: string): string {
  return message
    .trim()
    .replace(/\n{3,}/g, '\n\n')  // Max 2 sauts de ligne
    .slice(0, APP_CONFIG.limits.maxMessageLength);
}
