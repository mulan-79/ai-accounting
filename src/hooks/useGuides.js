import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useGuides({ category, limitCount } = {}) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const constraints = [orderBy('publishedAt', 'desc')];
        if (category && category !== '전체') {
          constraints.unshift(where('category', '==', category));
        }
        if (limitCount) constraints.push(limit(limitCount));

        const q = query(collection(db, 'guides'), ...constraints);
        const snap = await getDocs(q);
        setGuides(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [category, limitCount]);

  return { guides, loading, error };
}

export function useGuide(slug) {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function fetch() {
      // slug로 먼저 조회
      const q = query(collection(db, 'guides'), where('slug', '==', slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setGuide({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        // fallback: id로 조회
        const docSnap = await getDoc(doc(db, 'guides', slug));
        if (docSnap.exists()) setGuide({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { guide, loading };
}
