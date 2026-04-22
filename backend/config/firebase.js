const admin = require("firebase-admin");
const { logger } = require("../utils/logger");

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    if (!firebaseApp) {
      // Check if we have the required environment variables
      if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
        logger.warn("⚠️ Firebase credentials missing. Using mock mode.");
        firebaseApp = { mock: true };
        return firebaseApp;
      }

      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || "resourcehuh",
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      logger.info("✅ Firebase initialized successfully");
    }
    return firebaseApp;
  } catch (error) {
    logger.error(`❌ Firebase initialization error: ${error.message}`);
    logger.warn("⚠️ Falling back to mock mode");
    firebaseApp = { mock: true };
    return firebaseApp;
  }
};

// Send push notification
const sendPushNotification = async (deviceToken, title, body, data = {}, options = {}) => {
  try {
    if (!firebaseApp) initializeFirebase();
    if (firebaseApp.mock) {
      logger.info(`[MOCK] Push notification to ${deviceToken}: ${title}`);
      return { success: true };
    }

    const message = {
      token: deviceToken,
      notification: { title, body },
      data: { ...data, type: data.type || "notification" },
      android: { priority: "high" },
      apns: { payload: { aps: { sound: "default" } } },
    };

    const response = await admin.messaging().send(message);
    logger.info(`Push notification sent: ${response}`);
    return { success: true, messageId: response };
  } catch (error) {
    logger.error(`Push notification error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send multicast push notification
const sendMulticastPushNotification = async (deviceTokens, title, body, data = {}, options = {}) => {
  try {
    if (!firebaseApp) initializeFirebase();
    if (firebaseApp.mock || !deviceTokens.length) {
      logger.info(`[MOCK] Multicast to ${deviceTokens.length} devices: ${title}`);
      return { success: true, successCount: deviceTokens.length };
    }

    const message = {
      tokens: deviceTokens,
      notification: { title, body },
      data: { ...data, type: data.type || "notification" },
      android: { priority: "high" },
    };

    const response = await admin.messaging().sendMulticast(message);
    logger.info(`Multicast sent: ${response.successCount} succeeded`);
    return { success: true, successCount: response.successCount, failureCount: response.failureCount };
  } catch (error) {
    logger.error(`Multicast error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send topic notification
const sendTopicPushNotification = async (topic, title, body, data = {}, options = {}) => {
  try {
    if (!firebaseApp) initializeFirebase();
    if (firebaseApp.mock) {
      logger.info(`[MOCK] Topic push to ${topic}: ${title}`);
      return { success: true };
    }

    const message = {
      topic,
      notification: { title, body },
      data: { ...data, type: data.type || "notification" },
    };

    const response = await admin.messaging().send(message);
    logger.info(`Topic notification sent to ${topic}`);
    return { success: true, messageId: response };
  } catch (error) {
    logger.error(`Topic notification error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Subscribe to topic
const subscribeToTopic = async (deviceToken, topic) => {
  try {
    if (!firebaseApp) initializeFirebase();
    if (firebaseApp.mock) {
      logger.info(`[MOCK] Subscribe ${deviceToken} to ${topic}`);
      return { success: true };
    }

    const response = await admin.messaging().subscribeToTopic([deviceToken], topic);
    logger.info(`Subscribed to ${topic}`);
    return { success: true };
  } catch (error) {
    logger.error(`Subscribe error: ${error.message}`);
    return { success: false };
  }
};

// Unsubscribe from topic
const unsubscribeFromTopic = async (deviceToken, topic) => {
  try {
    if (!firebaseApp) initializeFirebase();
    if (firebaseApp.mock) {
      logger.info(`[MOCK] Unsubscribe ${deviceToken} from ${topic}`);
      return { success: true };
    }

    const response = await admin.messaging().unsubscribeFromTopic([deviceToken], topic);
    logger.info(`Unsubscribed from ${topic}`);
    return { success: true };
  } catch (error) {
    logger.error(`Unsubscribe error: ${error.message}`);
    return { success: false };
  }
};

// Send notification by type
const sendNotificationByType = async (userId, type, data, options = {}) => {
  logger.info(`📧 Notification to user ${userId}: ${type}`);
  return { success: true };
};

module.exports = {
  initializeFirebase,
  sendPushNotification,
  sendMulticastPushNotification,
  sendTopicPushNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendNotificationByType,
};
