export default function calculateAccuracy(
  typedWords: string[],
  sourceWords: string[]
) {
  let strokeCount = 0;
  let correctCount = 0;
  let wrongCount = 0;
  for (let wi = 0; wi < typedWords.length; wi++) {
    const wordLength =
      typedWords[wi].length > sourceWords[wi].length
        ? typedWords[wi].length
        : sourceWords[wi].length;
    for (let li = 0; li < wordLength; li++) {
      strokeCount++;
      const typed = typedWords[wi][li];
      const source = sourceWords[wi][li];
      if (typed && source && typed === source) correctCount++;
      else wrongCount++;
    }
  }

  const accuracy = correctCount / strokeCount;
  return { accuracy, correctCount, wrongCount };
}
