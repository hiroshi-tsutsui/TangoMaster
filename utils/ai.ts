export const generateAIExample = (word: string) => {
  const templates = [
    `The concept of ${word} is crucial in modern society.`,
    `Surprisingly, ${word} can be found in many ancient texts.`,
    `Experts argue that ${word} will define the next decade.`,
    `He didn't realize that ${word} was the answer all along.`,
    `In the context of business, ${word} means opportunity.`,
    `To truly understand ${word}, one must look within.`,
    `The ${word} phenomenon is spreading rapidly.`,
    `She whispered "${word}" before disappearing into the mist.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};
