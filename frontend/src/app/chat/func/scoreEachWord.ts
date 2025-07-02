type Analysis = Record<string, number>;

interface WordData {
  word: string;
  analysis: Analysis;
}
interface ScoredWord {
  word: string;
  score: number; // điểm trên thang 100
}

export default function scoreEachWord(words: WordData[]): ScoredWord[] {
  return words.map(({ word, analysis }) => {
    const values = Object.values(analysis);
    const actualScore = values.reduce((sum: number, value: number) => sum + value, 0);
    const maxPossibleScore = values.length * 1; // max mỗi ký tự là 1
    const score100 = maxPossibleScore > 0 ? ((actualScore as number) / maxPossibleScore) * 100 : 0;
    return {
      word,
      score: Math.round(score100 * 100) / 100, // làm tròn 2 chữ số
    };
  });
}
