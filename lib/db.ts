import { openDB, DBSchema } from 'idb';
import { ReviewItem } from './srs';

interface VocabDB extends DBSchema {
  reviews: {
    key: string;
    value: ReviewItem;
    indexes: { 'by-due': number };
  };
  settings: {
    key: string;
    value: any;
  };
}

const dbPromise = typeof window !== 'undefined' 
  ? openDB<VocabDB>('vocab-drill-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('reviews')) {
          const store = db.createObjectStore('reviews', { keyPath: 'word' });
          store.createIndex('by-due', 'dueDate');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    })
  : Promise.resolve(null as any);

export const getReviewsDue = async (): Promise<ReviewItem[]> => {
  const db = await dbPromise;
  if (!db) return [];
  const now = Date.now();
  // Get all items due before now
  return db.getAllFromIndex('reviews', 'by-due', IDBKeyRange.upperBound(now));
};

export const saveReview = async (item: ReviewItem) => {
  const db = await dbPromise;
  if (!db) return;
  return db.put('reviews', item);
};

export const getReview = async (word: string): Promise<ReviewItem | undefined> => {
  const db = await dbPromise;
  if (!db) return undefined;
  return db.get('reviews', word);
};

export const getAllReviews = async (): Promise<ReviewItem[]> => {
  const db = await dbPromise;
  if (!db) return [];
  return db.getAll('reviews');
};

// Settings helper
export const getSetting = async (key: string) => {
  const db = await dbPromise;
  if (!db) return null;
  return db.get('settings', key);
};

export const setSetting = async (key: string, value: any) => {
  const db = await dbPromise;
  if (!db) return;
  return db.put('settings', value, key);
};
