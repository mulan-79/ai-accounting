import { useState, useEffect } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useStats() {
  const [stats, setStats] = useState({ guides: 0, cases: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [guidesSnap, casesSnap, submissionsSnap] = await Promise.all([
          getCountFromServer(collection(db, 'guides')),
          getCountFromServer(collection(db, 'cases')),
          getCountFromServer(collection(db, 'submissions')),
        ]);
        setStats({
          guides: guidesSnap.data().count,
          cases: casesSnap.data().count,
          submissions: submissionsSnap.data().count,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { stats, loading };
}
