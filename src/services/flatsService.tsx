import { Flat } from '../components/Interfaces/FlatInterface';

const API_URL = 'http://localhost:8080/flats'; // Replace with your backend URL

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFlats = async (queryParams: Record<string, any> = {}) => {
  try {
    // Get the auth token (for authorization)
    const authToken = localStorage.getItem('authToken') || ''; // Assuming token is stored in localStorage

    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${API_URL}?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Include the authorization token
      },
      credentials: 'include', // Send cookies with the request if needed
    });
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Error fetching flats: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('data flat', data);
    return {
      flats: data.data as Flat[], // Array of flats
      pagination: data.pagination, // Pagination details
    };
  } catch (error) {
    console.error('Error in getFlats:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export default getFlats;
