export type ReviewItem = {
  id: string; // usually the word itself
  word: string;
  interval: number; // days
  repetition: number;
  ef: number; // easiness factor
  dueDate: number; // timestamp
};

export const initialReviewItem = (word: string): ReviewItem => ({
  id: word,
  word,
  interval: 0,
  repetition: 0,
  ef: 2.5,
  dueDate: Date.now(),
});

export const calculateReview = (item: ReviewItem, grade: number): ReviewItem => {
  // grade: 0-5 (0=forgot, 3=hard, 4=good, 5=easy)
  
  let { interval, repetition, ef } = item;

  if (grade >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  ef = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (ef < 1.3) ef = 1.3;

  return {
    ...item,
    interval,
    repetition,
    ef,
    dueDate: Date.now() + interval * 24 * 60 * 60 * 1000,
  };
};
