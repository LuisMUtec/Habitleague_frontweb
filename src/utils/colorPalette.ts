// Utilidad para obtener una paleta de colores por categoría de challenge

import { ChallengeCategory } from '../types';

export const challengeCategoryPalettes: Record<ChallengeCategory, { background: string; text: string }> = {
  [ChallengeCategory.FITNESS]:      { background: 'linear-gradient(135deg, #C8D9E6 0%, #567C8D 100%)', text: '#2F4156' },
  [ChallengeCategory.MINDFULNESS]: { background: 'linear-gradient(135deg, #567C8D 0%, #C8D9E6 100%)', text: '#2F4156' },
  [ChallengeCategory.PRODUCTIVITY]: { background: 'linear-gradient(135deg, #C8D9E6 0%, #2F4156 100%)', text: '#fff' },
  [ChallengeCategory.LIFESTYLE]:    { background: 'linear-gradient(135deg, #567C8D 0%, #2F4156 100%)', text: '#fff' },
  [ChallengeCategory.HEALTH]:       { background: 'linear-gradient(135deg, #2F4156 0%, #567C8D 100%)', text: '#fff' },
  [ChallengeCategory.CODING]:       { background: 'linear-gradient(135deg, #C8D9E6 0%, #2F4156 100%)', text: '#fff' },
  [ChallengeCategory.READING]:      { background: 'linear-gradient(135deg, #567C8D 0%, #C8D9E6 100%)', text: '#2F4156' },
  [ChallengeCategory.FINANCE]:      { background: 'linear-gradient(135deg, #2F4156 0%, #C8D9E6 100%)', text: '#fff' },
  [ChallengeCategory.LEARNING]:     { background: 'linear-gradient(135deg, #C8D9E6 0%, #567C8D 100%)', text: '#2F4156' },
  [ChallengeCategory.WRITING]:      { background: 'linear-gradient(135deg, #567C8D 0%, #2F4156 100%)', text: '#fff' },
  [ChallengeCategory.CREATIVITY]:   { background: 'linear-gradient(135deg, #2F4156 0%, #567C8D 100%)', text: '#fff' }
};

export const getChallengePalette = (category: ChallengeCategory) => {
  return challengeCategoryPalettes[category] || challengeCategoryPalettes[ChallengeCategory.FITNESS];
}; 