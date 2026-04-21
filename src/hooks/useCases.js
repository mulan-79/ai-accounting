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

export function useCases({ industry, limitCount } = {}) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const constraints = [orderBy('order', 'desc')];
        if (industry && industry !== '전체') {
          constraints.unshift(where('industry', '==', industry));
        }
        if (limitCount) constraints.push(limit(limitCount));

        const q = query(collection(db, 'cases'), ...constraints);
        const snap = await getDocs(q);
        setCases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [industry, limitCount]);

  return { cases, loading, error };
}

export function useCase(slug) {
  const [caseItem, setCaseItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function fetch() {
      const q = query(collection(db, 'cases'), where('slug', '==', slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setCaseItem({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        const docSnap = await getDoc(doc(db, 'cases', slug));
        if (docSnap.exists()) setCaseItem({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { caseItem, loading };
}
