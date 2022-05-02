import { useEffect, useState, useRef } from 'react';
import { doc, addDoc, collection, onSnapshot, setDoc, getFirestore } from 'firebase/firestore';

export const useList = () => {
  const [items, setItems] = useState([]);
  const todosRef = useRef([]);

  useEffect(() => {}, []);

  const addItem = async (item, userID) => {
    const db = getFirestore();
    await addDoc(collection(db, 'items'), {
      item,
      isCompleted: false,
      userID,
    });
  };

  const toggleItemStatus = (item) => {};

  return [items, addItem, toggleItemStatus];
};
