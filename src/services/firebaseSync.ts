import { 
  collection, 
  onSnapshot, 
  setDoc, 
  deleteDoc,
  doc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';

// Verify Connection on boot
testFirestoreConnection();

/**
 * Sanitizes object by removing undefined fields recursively
 * so Firestore setDoc / updateDoc never fails on unsupported undefined values.
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((v) => v !== undefined)
      .map((v) => cleanFirestoreData(v)) as unknown as T;
  }
  if (typeof obj === 'object' && obj.constructor === Object) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as unknown as T;
  }
  return obj;
}

/**
 * Syncs a Firestore collection in real-time. If the collection is empty on first load,
 * automatically populates it with the provided defaultData.
 */
export function syncCollection<T extends { id?: string; month?: string }>(
  collectionName: string,
  defaultData: T[],
  onDataUpdate: (items: T[]) => void
) {
  const colRef = collection(db, collectionName);

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && defaultData.length > 0) {
        // Seed default data if collection is completely empty
        try {
          const batch = writeBatch(db);
          defaultData.forEach((item, index) => {
            const docId = item.id || (item.month ? `${item.month}_2026` : `item_${index}`);
            const itemDocRef = doc(db, collectionName, docId);
            const dataToSave = cleanFirestoreData({ ...item, id: docId });
            batch.set(itemDocRef, dataToSave);
          });
          await batch.commit();
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, collectionName);
        }
      } else {
        const seen = new Set<string>();
        const items: T[] = [];
        snapshot.docs.forEach((d, idx) => {
          const itemData = d.data();
          const docId = d.id || itemData.id || `doc_${idx}`;
          const rawId = itemData.id || docId;
          const finalId = seen.has(rawId) ? `${rawId}_${idx}` : rawId;
          seen.add(finalId);
          items.push({ ...itemData, id: finalId } as T);
        });
        onDataUpdate(items);
      }
    },
    (error) => {
      // Provide initial fallback data so UI remains interactive
      onDataUpdate(defaultData);
      const errCode = (error as any)?.code || '';
      if (errCode === 'unavailable' || error?.message?.includes('offline')) {
        console.warn(`Firestore collection [${collectionName}] operating offline.`);
      } else {
        console.warn(`Firestore sync warning [${collectionName}]:`, error?.message || error);
      }
    }
  );

  return unsubscribe;
}

/**
 * Saves or updates a document in a collection
 */
export async function saveDocument<T extends { id?: string; month?: string }>(
  collectionName: string,
  item: T,
  customDocId?: string
) {
  const docId = customDocId || item.id || (item.month ? `${item.month}_2026` : `doc_${Date.now()}`);
  const docRef = doc(db, collectionName, docId);
  const dataToSave = cleanFirestoreData({ ...item, id: docId });

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
    throw error;
  }
}

/**
 * Deletes a document from a collection
 */
export async function deleteDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
  }
}
