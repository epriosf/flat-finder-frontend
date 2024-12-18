/* eslint-disable @typescript-eslint/no-explicit-any */
let authToken: string | null = null; // Store the token in memory
// eslint-disable-next-line no-undef
const AUTH_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
export const loginUser = async (
  email: string,
  password: string,
): Promise<any> => {
  try {
    // Send the login request
    const loginResponse = await fetch(`${AUTH_URL}/auth/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      // Extract error message from response if available
      const errorData = await loginResponse.json().catch(() => null);
      const errorMessage = errorData?.message || 'Login failed';
      throw new Error(errorMessage);
    }

    const data = await loginResponse.json();

    const authToken = data.token;
    if (authToken) {
      // Store the token in localStorage
      localStorage.setItem('authToken', authToken);
    } else {
      throw new Error('Authentication token missing in the response');
    }

    // Fetch user info
    const userData = await fetchUserInfo();
    return userData;
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

export const fetchUserInfo = async (): Promise<any> => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken'); // Retrieve token if stored
  }

  if (!authToken) {
    throw new Error('No token available');
  }

  try {
    const userResponse = await fetch(`${AUTH_URL}/auth/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`, // Pass token in the header
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    return await userResponse.json();
  } catch (error) {
    console.error('Error in fetchUserInfo:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    authToken = null; // Clear token from memory
    localStorage.removeItem('authToken'); // Optional: Clear from storage
  } catch (error) {
    console.error('Error in logoutUser:', error);
    throw error;
  }
};
