import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';

// Verify Connection on boot
testFirestoreConnection();

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
            batch.set(itemDocRef, { ...item, id: docId });
          });
          await batch.commit();
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, collectionName);
        }
      } else {
        const items = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as T[];
        onDataUpdate(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, collectionName);
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
  const dataToSave = { ...item, id: docId };

  try {
    await setDoc(docRef, dataToSave, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
    throw error;
  }
}
