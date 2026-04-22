import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useStats() {
  const [stats, setStats] = useState({ guides: 0, cases: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [guidesSnap, casesSnap, submissionsSnap] = await Promise.all([
          getDocs(collection(db, 'guides')),
          getDocs(collection(db, 'cases')),
          getDocs(collection(db, 'submissions')),
        ]);
        setStats({
          guides: guidesSnap.size,
          cases: casesSnap.size,
          submissions: submissionsSnap.size,
        });
      } catch (e) {
        console.error('stats fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { stats, loading };
}
