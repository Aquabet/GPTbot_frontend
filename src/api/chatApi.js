import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import i18n from '../i18n';

const { t } = i18n;

const AUTH_URL = `${API_BASE_URL}/auth`;
const LOGIN_URL = `${AUTH_URL}/login`;
const LOGOUT_URL = `${AUTH_URL}/logout`;
const VALIDATE_URL = `${AUTH_URL}/validate`;

const CHAT_BASE_URL = `${API_BASE_URL}/chat`;
const CREATE_SESSION_URL = `${CHAT_BASE_URL}/session`;
const DELETE_SESSION_URL = `${CHAT_BASE_URL}/session`;
const GET_SESSIONS_URL = `${CHAT_BASE_URL}/sessions`;
const CHAT_HISTORY_URL = `${CHAT_BASE_URL}/history`;
const CHAT_MESSAGE_URL = `${CHAT_BASE_URL}/message`;

// Handle user login
export const login = async (username, password) => {
  try {
    const response = await axios.post(LOGIN_URL, { username, password }, { withCredentials: true });
    return response.data.message;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      alert(t('loginRateLimitError'));
    }
    console.error("Failed to login", error.message);
    throw error;
  }
};

// Handle user logout
export const logout = async () => {
  try {
    const response = await axios.post(LOGOUT_URL, {}, { withCredentials: true });
    return response.data.message;
  } catch (error) {
    console.error("Failed to logout:", error.message);
    throw error;
  }
};

// Validate user token
export const validateToken = async () => {
  try {
    const response = await axios.get(VALIDATE_URL, { withCredentials: true });
    return response.status === 200;
  } catch (error) {
    console.error("Failed to validate", error.message);
    return false;
  }
};

// Send a message and fetch the assistant's response
export const fetchChatResponse = async (userMessage, sessionId, onLogout, modelProvider = "openai", modelName = "gpt-4-turbo") => {
  console.log(modelProvider, modelName);
  try {
    if (!sessionId) {
      const newSession = await createSession();
      sessionId = newSession.sessionId;
    }

    const response = await axios.post(
      CHAT_MESSAGE_URL,
      {
        content: userMessage.content,
        sessionId,
        modelProvider,
        modelName,
      },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return {
      role: 'assistant',
      content: response.data.content,
      sessionId,
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      onLogout();
    }
    return { role: 'assistant', content: t('fetchChatError', { error: error.message }) };
  }
};

// Fetch chat history for a session
export const fetchChatHistory = async (sessionId) => {
  try {
    const response = await axios.get(`${CHAT_HISTORY_URL}/${sessionId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat history", error.message);
    return [];
  }
};

// Create a new session
export const createSession = async () => {
  try {
    const response = await axios.post(CREATE_SESSION_URL, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Failed to create session", error.message);
    throw error;
  }
};

// Delete a specific session
export const deleteSession = async (sessionId) => {
  try {
    await axios.delete(`${DELETE_SESSION_URL}/${sessionId}`, { withCredentials: true });
  } catch (error) {
    console.error("Failed to delete session", error.message);
  }
};

// Retrieve all user sessions
export const getSessions = async () => {
  try {
    const response = await axios.get(GET_SESSIONS_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('isAuthenticated');
      window.location.reload();
    } else {
      console.error("Failed to fetch sessions", error.message);
      return [];
    }
  }
};

// Rename a specific session
export const renameSession = async (sessionId, newName) => {
  try {
    const response = await axios.patch(
      `${CHAT_BASE_URL}/session/${sessionId}`,
      { newName },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to rename session", error.message);
    throw error;
  }
};
