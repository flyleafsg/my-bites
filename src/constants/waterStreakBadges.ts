export type WaterStreakBadge = {
  id: string;
  name: string;
  description: string;
  minStreak: number;
  emoji: string;
};

export const waterStreakBadges: WaterStreakBadge[] = [
  {
    id: 'first_sip',
    name: 'First Sip',
    description: 'Logged water for one day',
    minStreak: 1,
    emoji: '💧',
  },
  {
    id: 'flowing_steady',
    name: 'Flowing Steady',
    description: '3-day hydration streak',
    minStreak: 3,
    emoji: '🚿',
  },
  {
    id: 'hydro_hero',
    name: 'Hydro Hero',
    description: '5-day hydration streak — you’re killing it!',
    minStreak: 5,
    emoji: '💦',
  },
  {
    id: 'fountain_will',
    name: 'Fountain of Will',
    description: '7-day hydration streak — one full week!',
    minStreak: 7,
    emoji: '⛲',
  },
  {
    id: 'aqua_ace',
    name: 'Aqua Ace',
    description: '10-day hydration dominance',
    minStreak: 10,
    emoji: '🧊',
  },
  {
    id: 'liquid_legend',
    name: 'Liquid Legend',
    description: '2-week streak — you’re unstoppable',
    minStreak: 14,
    emoji: '🌊',
  },
  {
    id: 'streak_machine',
    name: 'Streak Machine',
    description: '30-day streak — elite badge status',
    minStreak: 30,
    emoji: '🏆',
  },
];
