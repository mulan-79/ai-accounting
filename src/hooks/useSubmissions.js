import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useSubmissions(status = 'pending') {
  const { role } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== 'admin' && role !== 'editor') {
      setLoading(false);
      return;
    }
    async function fetch() {
      const q = query(
        collection(db, 'submissions'),
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );
      const snap = await getDocs(q);
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetch();
  }, [role, status]);

  return { submissions, loading };
}

export async function submitCase(formData, user) {
  return addDoc(collection(db, 'submissions'), {
    ...formData,
    submitterUid: user.uid,
    status: 'pending',
    submittedAt: serverTimestamp(),
  });
}

export async function approveSubmission(submissionId, reviewNotes = '') {
  return updateDoc(doc(db, 'submissions', submissionId), {
    status: 'approved',
    reviewNotes,
    reviewedAt: serverTimestamp(),
  });
}

export async function rejectSubmission(submissionId, reviewNotes = '') {
  return updateDoc(doc(db, 'submissions', submissionId), {
    status: 'rejected',
    reviewNotes,
    reviewedAt: serverTimestamp(),
  });
}
