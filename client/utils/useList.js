import { useEffect, useState, useRef } from 'react';
import { doc, addDoc, collection, onSnapshot, setDoc, getFirestore } from 'firebase/firestore';

export const useList = () => {
  const [items, setItems] = useState([]);
  const itemsRef = useRef([]);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          itemsRef.current.push({ id: change.doc.id, ...change.doc.data() });
        }
        if (change.type === 'modified') {
          const index = itemsRef.current.findIndex((item) => item.id === change.doc.id);
          itemsRef.current[index] = { id: change.doc.id, ...change.doc.data() };
        }
      });
      setItems([...itemsRef.current]);
    });

    return unsubscribe;
  }, []);

  const addItem = async (item, userID) => {
    const db = getFirestore();
    await addDoc(collection(db, 'items'), {
      item,
      isCompleted: false,
      userID,
    });
  };

  const toggleItemStatus = (item) => {
    const db = getFirestore();
    setDoc(
      doc(db, 'items', item.id),
      {
        isCompleted: !item.isCompleted,
      },
      { merge: true },
    );
  };

  return [items, addItem, toggleItemStatus];
};
