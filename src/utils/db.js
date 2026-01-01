import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';

const RESUMES_COLLECTION = 'resumes';

// Create a new resume
export const createResume = async (userId, resumeData) => {
    try {
        const docRef = await addDoc(collection(db, RESUMES_COLLECTION), {
            ...resumeData,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...resumeData };
    } catch (error) {
        console.error("Error creating resume:", error);
        throw error;
    }
};

// Update an existing resume
export const updateResume = async (resumeId, resumeData) => {
    try {
        const resumeRef = doc(db, RESUMES_COLLECTION, resumeId);
        await updateDoc(resumeRef, {
            ...resumeData,
            updatedAt: serverTimestamp()
        });
        return { id: resumeId, ...resumeData };
    } catch (error) {
        console.error("Error updating resume:", error);
        throw error;
    }
};

// Get all resumes for a specific user
export const getUserResumes = async (userId) => {
    try {
        const q = query(
            collection(db, RESUMES_COLLECTION),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching resumes:", error);
        throw error;
    }
};

// Get a single resume by ID
export const getResumeById = async (resumeId) => {
    try {
        const docRef = doc(db, RESUMES_COLLECTION, resumeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Resume not found");
        }
    } catch (error) {
        console.error("Error fetching resume:", error);
        throw error;
    }
};

// Delete a resume
export const deleteResume = async (resumeId) => {
    try {
        await deleteDoc(doc(db, RESUMES_COLLECTION, resumeId));
        return true;
    } catch (error) {
        console.error("Error deleting resume:", error);
        throw error;
    }
};
