// firebase-service.js
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase-config';

// Experience CRUD operations
/**
 * Fetches all experience items from Firestore
 * @returns {Promise<Array>} Array of experience items
 */
export const getExperiences = async () => {
  try {
    const experiencesCollection = collection(db, 'experiences');
    const experienceSnapshot = await getDocs(experiencesCollection);
    return experienceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting experiences:', error);
    throw error;
  }
};

/**
 * Adds a new experience item to Firestore
 * @param {Object} experienceData - Experience data (name, tahun, description)
 * @returns {Promise<string>} ID of the created document
 */
export const addExperience = async (experienceData) => {
  try {
    const docRef = await addDoc(collection(db, 'experiences'), experienceData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

/**
 * Updates an existing experience item in Firestore
 * @param {string} id - Document ID to update
 * @param {Object} experienceData - Updated experience data
 * @returns {Promise<void>}
 */
export const updateExperience = async (id, experienceData) => {
  try {
    const experienceRef = doc(db, 'experiences', id);
    await updateDoc(experienceRef, experienceData);
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

/**
 * Deletes an experience item from Firestore
 * @param {string} id - Document ID to delete
 * @returns {Promise<void>}
 */
export const deleteExperience = async (id) => {
  try {
    await deleteDoc(doc(db, 'experiences', id));
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

// Skills CRUD operations
/**
 * Fetches all skills from Firestore, optionally filtered by status
 * @param {string} status - Optional status filter (current, ai, progress)
 * @returns {Promise<Array>} Array of skill items
 */
export const getSkills = async (status = null) => {
  try {
    const skillsCollection = collection(db, 'skills');
    let skillsQuery;
    
    if (status) {
      skillsQuery = query(skillsCollection, where("status", "==", status));
    } else {
      skillsQuery = skillsCollection;
    }
    
    const skillsSnapshot = await getDocs(skillsQuery);
    return skillsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting skills:', error);
    throw error;
  }
};

/**
 * Adds a new skill to Firestore
 * @param {Object} skillData - Skill data (image, name, status)
 * @returns {Promise<string>} ID of the created document
 */
export const addSkill = async (skillData) => {
  try {
    const docRef = await addDoc(collection(db, 'skills'), skillData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

/**
 * Updates an existing skill in Firestore
 * @param {string} id - Document ID to update
 * @param {Object} skillData - Updated skill data
 * @returns {Promise<void>}
 */
export const updateSkill = async (id, skillData) => {
  try {
    const skillRef = doc(db, 'skills', id);
    await updateDoc(skillRef, skillData);
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

/**
 * Deletes a skill from Firestore
 * @param {string} id - Document ID to delete
 * @returns {Promise<void>}
 */
export const deleteSkill = async (id) => {
  try {
    await deleteDoc(doc(db, 'skills', id));
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// Portfolio CRUD operations
/**
 * Fetches all portfolio items from Firestore
 * @returns {Promise<Array>} Array of portfolio items
 */
export const getPortfolioItems = async () => {
  try {
    const portfolioCollection = collection(db, 'portfolio');
    const portfolioSnapshot = await getDocs(portfolioCollection);
    return portfolioSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting portfolio items:', error);
    throw error;
  }
};

/**
 * Fetches a single portfolio item by ID
 * @param {string} id - Document ID to fetch
 * @returns {Promise<Object>} Portfolio item data
 */
export const getPortfolioItemById = async (id) => {
  try {
    const portfolioRef = doc(db, 'portfolio', id);
    const portfolioSnap = await getDoc(portfolioRef);
    
    if (portfolioSnap.exists()) {
      return {
        id: portfolioSnap.id,
        ...portfolioSnap.data()
      };
    } else {
      throw new Error('Portfolio item not found');
    }
  } catch (error) {
    console.error('Error getting portfolio item:', error);
    throw error;
  }
};

/**
 * Uploads an image to Firebase Storage
 * @param {File} file - File to upload
 * @param {string} path - Storage path
 * @returns {Promise<string>} Download URL of the uploaded file
 */
export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Uploads multiple images to Firebase Storage
 * @param {Array<File>} files - Files to upload
 * @param {string} basePath - Base storage path
 * @returns {Promise<Array<string>>} Array of download URLs
 */
export const uploadMultipleImages = async (files, basePath) => {
  try {
    const uploadPromises = Array.from(files).map(async (file, index) => {
      const path = `${basePath}/${index}_${file.name}`;
      return await uploadImage(file, path);
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Adds a new portfolio item to Firestore
 * @param {Object} portfolioData - Portfolio data
 * @returns {Promise<string>} ID of the created document
 */
export const addPortfolioItem = async (portfolioData) => {
  try {
    const docRef = await addDoc(collection(db, 'portfolio'), portfolioData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    throw error;
  }
};

/**
 * Updates an existing portfolio item in Firestore
 * @param {string} id - Document ID to update
 * @param {Object} portfolioData - Updated portfolio data
 * @returns {Promise<void>}
 */
export const updatePortfolioItem = async (id, portfolioData) => {
  try {
    const portfolioRef = doc(db, 'portfolio', id);
    await updateDoc(portfolioRef, portfolioData);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    throw error;
  }
};

/**
 * Deletes a portfolio item from Firestore and its associated images from Storage
 * @param {string} id - Document ID to delete
 * @param {Array<string>} imagePaths - Paths of images to delete from Storage
 * @returns {Promise<void>}
 */
export const deletePortfolioItem = async (id, imagePaths = []) => {
  try {
    // Delete the document from Firestore
    await deleteDoc(doc(db, 'portfolio', id));
    
    // Delete associated images from Storage if paths are provided
    if (imagePaths.length > 0) {
      const deletePromises = imagePaths.map(async (path) => {
        if (path) {
          const imageRef = ref(storage, path);
          try {
            await deleteObject(imageRef);
          } catch (error) {
            console.warn(`Error deleting image at ${path}:`, error);
          }
        }
      });
      
      await Promise.all(deletePromises);
    }
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    throw error;
  }
};