export default function calculateScore(
  results: Array<{ word: string; analysis: Record<string, number> }>
) {
  if (!results.length) return 0;

  let totalCharacters = 0;
  let correctCharacters = 0;

  results.forEach((result) => {
    const characters = Object.values(result.analysis);
    totalCharacters += characters.length;
    correctCharacters += characters.reduce((sum, score) => sum + score, 0);
  });

  return Math.round((correctCharacters / totalCharacters) * 100);
}
