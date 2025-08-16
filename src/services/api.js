import axios from 'axios';

const API_URL = '/api';

// Summary service
export const generateSummary = async (text, prompt) => {
  try {
    const response = await axios.post(`${API_URL}/summarize`, {
      text,
      prompt
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateSummary = async (id, editedSummary) => {
  try {
    const response = await axios.put(`${API_URL}/summarize/${id}`, {
      editedSummary
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSummary = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/summarize/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllSummaries = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/summarize?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Email service
export const shareSummaryViaEmail = async (id, recipients, subject) => {
  try {
    const response = await axios.post(`${API_URL}/email/${id}`, {
      recipients,
      subject
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
