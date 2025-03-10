import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://goals-app-m1-docker-backend-da63a4170bf6.herokuapp.com/api'
    : 'http://localhost:5001/api',  // Use localhost for development
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

// Person API endpoints
export const personApi = {
  // Get all persons
  getAllPersons: async () => {
    const response = await api.get('/persons/');
    return response.data;
  },
  
  // Get organization tree
  getOrgTree: async () => {
    const response = await api.get('/persons/tree');
    return response.data;
  },
  
  // Get a specific person
  getPerson: async (personId) => {
    const response = await api.get(`/persons/${personId}`);
    return response.data;
  },
  
  // Create a new person
  createPerson: async (personData) => {
    const response = await api.post('/persons/', personData);
    return response.data;
  },
  
  // Update a person
  updatePerson: async (personId, personData) => {
    const response = await api.put(`/persons/${personId}`, personData);
    return response.data;
  },
  
  // Delete a person
  deletePerson: async (personId) => {
    const response = await api.delete(`/persons/${personId}`);
    return response.data;
  },
  
  // Get subordinates of a person
  getSubordinates: async (personId) => {
    const response = await api.get(`/persons/${personId}/subordinates`);
    return response.data;
  }
};

// Goal API endpoints
export const goalApi = {
  // Get all goals
  getAllGoals: async () => {
    const response = await api.get('/goals/');
    return response.data;
  },
  
  // Get a specific goal
  getGoal: async (goalId) => {
    const response = await api.get(`/goals/${goalId}`);
    return response.data;
  },
  
  // Get goals for a specific person
  getPersonGoals: async (personId) => {
    const response = await api.get(`/goals/person/${personId}`);
    return response.data;
  },
  
  // Get goals from the parent of a specific person
  getParentGoals: async (personId) => {
    const response = await api.get(`/goals/parent/${personId}`);
    return response.data;
  },
  
  // Create a new goal
  createGoal: async (goalData) => {
    const response = await api.post('/goals/', goalData);
    return response.data;
  },
  
  // Update a goal
  updateGoal: async (goalId, goalData) => {
    const response = await api.put(`/goals/${goalId}`, goalData);
    return response.data;
  },
  
  // Delete a goal
  deleteGoal: async (goalId) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
  }
}; 