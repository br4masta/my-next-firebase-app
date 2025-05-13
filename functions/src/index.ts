import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * CORS middleware configuration
 * Allows cross-origin requests from any origin
 */
const corsHandler = cors({origin: true});

/**
 * API endpoint for experiences
 * Handles GET requests to fetch all experiences from Firestore
 */
export const experiences = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Only allow GET requests
      if (request.method !== "GET") {
        response.status(405).send({error: "Method not allowed"});
        return;
      }

      // Fetch all experiences from Firestore
      const experiencesSnapshot = await admin.firestore().collection("experiences").get();
      const experiences = experiencesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Return the experiences as JSON
      response.status(200).send({experiences});
    } catch (error) {
      logger.error("Error in experiences API:", error);
      response.status(500).send({error: "Failed to fetch experiences"});
    }
  });
});

/**
 * API endpoint for skills
 * Handles GET requests to fetch skills from Firestore
 * Supports optional status filtering
 */
export const skills = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Only allow GET requests
      if (request.method !== "GET") {
        response.status(405).send({error: "Method not allowed"});
        return;
      }

      // Check if status filter is provided
      const status = request.query.status as string || null;

      // Fetch skills from Firestore, optionally filtered by status
      let skillsQuery: admin.firestore.Query = admin.firestore().collection("skills");

      if (status) {
        skillsQuery = skillsQuery.where("status", "==", status);
      }

      const skillsSnapshot = await skillsQuery.get();
      const skills = skillsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Return the skills as JSON
      response.status(200).send({skills});
    } catch (error) {
      logger.error("Error in skills API:", error);
      response.status(500).send({error: "Failed to fetch skills"});
    }
  });
});

/**
 * Helper function to fetch a portfolio item by ID
 * @param {string} id - The ID of the portfolio item to fetch
 * @return {Promise<Object>} The portfolio item data
 * @throws {Error} If the portfolio item is not found
 */
async function getPortfolioItemById(id: string) {
  const portfolioRef = admin.firestore().collection("portfolio").doc(id);
  const portfolioSnap = await portfolioRef.get();

  if (portfolioSnap.exists) {
    return {
      id: portfolioSnap.id,
      ...portfolioSnap.data(),
    };
  } else {
    throw new Error("Portfolio item not found");
  }
}

/**
 * API endpoint for portfolio items
 * Handles GET requests to fetch all portfolio items or a specific item by ID
 */
export const portfolio = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      // Only allow GET requests
      if (request.method !== "GET") {
        response.status(405).send({error: "Method not allowed"});
        return;
      }

      // Check if an ID is provided for a specific portfolio item
      const id = request.query.id as string || null;

      if (id) {
        // Fetch a specific portfolio item by ID
        const portfolioItem = await getPortfolioItemById(id);
        response.status(200).send({portfolioItem});
      } else {
        // Fetch all portfolio items
        const portfolioSnapshot = await admin.firestore().collection("portfolio").get();
        const portfolioItems = portfolioSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        response.status(200).send({portfolioItems});
      }
    } catch (error) {
      logger.error("Error in portfolio API:", error);
      response.status(500).send({error: "Failed to fetch portfolio items"});
    }
  });
});
