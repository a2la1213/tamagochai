// src/utils/formatters.ts
// Fonctions de formatage pour l'affichage

/**
 * Formate une date en format lisible
 */
export function formatDate(date: Date, locale: string = 'fr-FR'): string {
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formate une date en format court
 */
export function formatDateShort(date: Date, locale: string = 'fr-FR'): string {
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formate une heure
 */
export function formatTime(date: Date, locale: string = 'fr-FR'): string {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formate une date et heure
 */
export function formatDateTime(date: Date, locale: string = 'fr-FR'): string {
  return `${formatDate(date, locale)} à ${formatTime(date, locale)}`;
}

/**
 * Formate une durée en texte lisible
 */
export function formatDuration(minutes: number): string {
  if (minutes < 1) {
    return 'moins d\'une minute';
  }
  
  if (minutes < 60) {
    const m = Math.floor(minutes);
    return `${m} minute${m > 1 ? 's' : ''}`;
  }
  
  if (minutes < 1440) { // 24 heures
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    if (m === 0) {
      return `${h} heure${h > 1 ? 's' : ''}`;
    }
    return `${h}h${m.toString().padStart(2, '0')}`;
  }
  
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  
  if (hours === 0) {
    return `${days} jour${days > 1 ? 's' : ''}`;
  }
  return `${days} jour${days > 1 ? 's' : ''} et ${hours}h`;
}

/**
 * Formate une durée relative (il y a X temps)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) {
    return 'à l\'instant';
  }
  
  if (diffMinutes < 60) {
    return `il y a ${diffMinutes} min`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `il y a ${diffHours}h`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'hier';
  }
  
  if (diffDays < 7) {
    return `il y a ${diffDays} jours`;
  }
  
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
  
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `il y a ${months} mois`;
  }
  
  const years = Math.floor(diffDays / 365);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(num: number, locale: string = 'fr-FR'): string {
  return num.toLocaleString(locale);
}

/**
 * Formate un pourcentage
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formate un nombre en version compacte (1.2K, 3.4M)
 */
export function formatCompact(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    const k = num / 1000;
    return `${k >= 10 ? Math.floor(k) : k.toFixed(1)}K`;
  }
  
  const m = num / 1000000;
  return `${m >= 10 ? Math.floor(m) : m.toFixed(1)}M`;
}

/**
 * Formate des XP
 */
export function formatXP(xp: number): string {
  return `${formatCompact(xp)} XP`;
}

/**
 * Formate un niveau de batterie
 */
export function formatBattery(level: number): string {
  return `${Math.round(level)}%`;
}

/**
 * Formate un nom d'émotion pour l'affichage
 */
export function formatEmotionName(emotion: string): string {
  const emotionNames: Record<string, string> = {
    neutral: 'Neutre',
    happy: 'Heureux',
    sad: 'Triste',
    angry: 'En colère',
    scared: 'Effrayé',
    loving: 'Aimant',
    excited: 'Excité',
    tired: 'Fatigué',
    curious: 'Curieux',
    confused: 'Confus',
  };
  return emotionNames[emotion] || emotion;
}

/**
 * Formate un nom de stade pour l'affichage
 */
export function formatStageName(stage: string): string {
  const stageNames: Record<string, string> = {
    emergence: 'Émergence',
    learning: 'Apprentissage',
    individuation: 'Individuation',
    wisdom: 'Sagesse',
    transcendence: 'Transcendance',
  };
  return stageNames[stage] || stage;
}

/**
 * Formate un nom d'hormone pour l'affichage
 */
export function formatHormoneName(hormone: string): string {
  const hormoneNames: Record<string, string> = {
    dopamine: 'Dopamine',
    serotonin: 'Sérotonine',
    oxytocin: 'Ocytocine',
    cortisol: 'Cortisol',
    adrenaline: 'Adrénaline',
    endorphins: 'Endorphines',
  };
  return hormoneNames[hormone] || hormone;
}

/**
 * Formate la partie du jour
 */
export function formatPartOfDay(hour: number): string {
  if (hour >= 6 && hour < 12) return 'matin';
  if (hour >= 12 && hour < 18) return 'après-midi';
  if (hour >= 18 && hour < 22) return 'soirée';
  return 'nuit';
}

/**
 * Formate un message de salutation selon l'heure
 */
export function formatGreeting(hour: number): string {
  if (hour >= 6 && hour < 12) return 'Bonjour';
  if (hour >= 12 && hour < 18) return 'Bon après-midi';
  if (hour >= 18 && hour < 22) return 'Bonsoir';
  return 'Bonne nuit';
}

/**
 * Formate le nombre de jours en vie
 */
export function formatDaysAlive(days: number): string {
  if (days === 0) return 'Né aujourd\'hui';
  if (days === 1) return '1 jour';
  if (days < 7) return `${days} jours`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} mois`;
  }
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  if (remainingMonths === 0) {
    return `${years} an${years > 1 ? 's' : ''}`;
  }
  return `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois`;
}

/**
 * Formate une streak
 */
export function formatStreak(days: number): string {
  if (days === 0) return 'Pas de streak';
  if (days === 1) return '🔥 1 jour';
  return `🔥 ${days} jours`;
}
