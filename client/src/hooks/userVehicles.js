// src/hooks/useVehicles.js
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION = "vehicles";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...vehicleData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const deleteVehicle = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return { vehicles, loading, error, addVehicle, deleteVehicle, refetch: fetchVehicles };
};