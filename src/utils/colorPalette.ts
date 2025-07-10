// Paleta de colores principal de Habit League
export const colors = {
  vanilla: '#F1EADA',
  tobacco: '#B59E7D', 
  mountain: '#AAA396',
  mahogany: '#584738',
  sand: '#CEC1A8'
};

// Utilidad para obtener una paleta de colores por categoría de challenge
import { ChallengeCategory } from '../types';

export const challengeCategoryPalettes: Record<ChallengeCategory, { background: string; text: string }> = {
  [ChallengeCategory.FITNESS]:      { background: `linear-gradient(135deg, ${colors.vanilla} 0%, ${colors.tobacco} 100%)`, text: colors.mahogany },
  [ChallengeCategory.MINDFULNESS]: { background: `linear-gradient(135deg, ${colors.tobacco} 0%, ${colors.vanilla} 100%)`, text: colors.mahogany },
  [ChallengeCategory.PRODUCTIVITY]: { background: `linear-gradient(135deg, ${colors.vanilla} 0%, ${colors.mahogany} 100%)`, text: colors.vanilla },
  [ChallengeCategory.LIFESTYLE]:    { background: `linear-gradient(135deg, ${colors.tobacco} 0%, ${colors.mahogany} 100%)`, text: colors.vanilla },
  [ChallengeCategory.HEALTH]:       { background: `linear-gradient(135deg, ${colors.mahogany} 0%, ${colors.tobacco} 100%)`, text: colors.vanilla },
  [ChallengeCategory.CODING]:       { background: `linear-gradient(135deg, ${colors.vanilla} 0%, ${colors.mahogany} 100%)`, text: colors.vanilla },
  [ChallengeCategory.READING]:      { background: `linear-gradient(135deg, ${colors.tobacco} 0%, ${colors.vanilla} 100%)`, text: colors.mahogany },
  [ChallengeCategory.FINANCE]:      { background: `linear-gradient(135deg, ${colors.mahogany} 0%, ${colors.vanilla} 100%)`, text: colors.vanilla },
  [ChallengeCategory.LEARNING]:     { background: `linear-gradient(135deg, ${colors.vanilla} 0%, ${colors.tobacco} 100%)`, text: colors.mahogany },
  [ChallengeCategory.WRITING]:      { background: `linear-gradient(135deg, ${colors.tobacco} 0%, ${colors.mahogany} 100%)`, text: colors.vanilla },
  [ChallengeCategory.CREATIVITY]:   { background: `linear-gradient(135deg, ${colors.mahogany} 0%, ${colors.tobacco} 100%)`, text: colors.vanilla }
};

export const getChallengePalette = (category: ChallengeCategory) => {
  return challengeCategoryPalettes[category] || challengeCategoryPalettes[ChallengeCategory.FITNESS];
}; 