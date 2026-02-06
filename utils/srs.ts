export interface ReviewItem {
  id: string;
  ef: number; // Easiness Factor
  interval: number; // Days
  repetition: number;
  nextReviewDate: Date;
}

export const calculateNextReview = (item: ReviewItem, quality: number): ReviewItem => {
  // Quality: 0-5
  // 0: Complete blackout
  // 5: Perfect response

  let { ef, interval, repetition } = item;

  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    repetition += 1;
    
    // Update EF
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...item,
    ef,
    interval,
    repetition,
    nextReviewDate
  };
};

export const createNewItem = (id: string): ReviewItem => ({
  id,
  ef: 2.5,
  interval: 0,
  repetition: 0,
  nextReviewDate: new Date()
});
