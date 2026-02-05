export const generateAIExample = (word: string, category: string = 'General') => {
  const commonTemplates = [
    `The concept of "${word}" is crucial in modern society.`,
    `Surprisingly, "${word}" can be found in many ancient texts.`,
    `Experts argue that "${word}" will define the next decade.`,
    `He didn't realize that "${word}" was the answer all along.`,
    `In the context of business, "${word}" means opportunity.`,
    `To truly understand "${word}", one must look within.`,
    `The "${word}" phenomenon is spreading rapidly.`,
    `She whispered "${word}" before disappearing into the mist.`,
    `If you encounter "${word}", run the other way!`,
    `My grandmother always said: "Never forget about ${word}."`,
    `I dreamt about "${word}" last night. It was terrifying.`,
    `Is "${word}" really necessary in this economy?`,
    `They named the new planet "${word}" for some reason.`
  ];

  const medicalTemplates = [
    `The patient exhibits signs of severe "${word}".`,
    `Doctor, we need to administer "${word}" immediately!`,
    `Research suggests "${word}" is linked to high stress.`,
    `This procedure requires precise handling of "${word}".`
  ];

  const legalTemplates = [
    `The jury found the evidence regarding "${word}" inadmissible.`,
    `My client pleads the fifth on the matter of "${word}".`,
    `Under Section 8, "${word}" is strictly prohibited.`,
    `We are suing for damages related to "${word}".`
  ];

  const animeTemplates = [
    `My power level rises when I think about "${word}"!`,
    `Nani?! He mastered the "${word}" technique?!`,
    `I will become the King of "${word}"!`,
    `Notice me, "${word}"-senpai!`
  ];

  let pool = commonTemplates;
  if (category === 'Medical') pool = [...pool, ...medicalTemplates];
  if (category === 'Legal') pool = [...pool, ...legalTemplates];
  if (category === 'Anime') pool = [...pool, ...animeTemplates];

  return pool[Math.floor(Math.random() * pool.length)];
};
