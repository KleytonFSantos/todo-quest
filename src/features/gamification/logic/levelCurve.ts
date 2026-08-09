/**
 * Level curve: triangular growth, so each level costs a bit more XP than
 * the last (level N requires 50 * N more XP than level N-1).
 *
 * xpForLevel(1) = 0
 * xpForLevel(2) = 50
 * xpForLevel(3) = 150
 * xpForLevel(4) = 300 ...
 */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * ((level - 1) * level) / 2;
}

export function getLevelForXP(xp: number): number {
  let level = 1;
  while (xp >= xpRequiredForLevel(level + 1)) {
    level += 1;
  }
  return level;
}

export interface LevelProgress {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressRatio: number; // 0..1
}

export function getLevelProgress(xp: number): LevelProgress {
  const level = getLevelForXP(xp);
  const currentFloor = xpRequiredForLevel(level);
  const nextCeiling = xpRequiredForLevel(level + 1);
  const xpIntoLevel = xp - currentFloor;
  const xpForNextLevel = nextCeiling - currentFloor;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    progressRatio: xpForNextLevel === 0 ? 1 : xpIntoLevel / xpForNextLevel,
  };
}
