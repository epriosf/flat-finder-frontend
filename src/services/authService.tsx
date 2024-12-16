/* eslint-disable @typescript-eslint/no-explicit-any */
let authToken: string | null = null; // Store the token in memory

export const loginUser = async (
  email: string,
  password: string,
): Promise<any> => {
  try {
    // Send the login request
    const loginResponse = await fetch(
      'http://localhost:8080/auth/users/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const data = await loginResponse.json();
    console.log('token:', data.token);
    authToken = data.token; // Store the token from the response
    if (authToken) {
      localStorage.setItem('authToken', authToken); // Optional: Persist in localStorage/sessionStorage
    }

    // Fetch user info
    const userData = await fetchUserInfo();
    console.log('User data fetched after login:', userData); // Check fetched user data
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
    const userResponse = await fetch('http://localhost:8080/auth/users/me', {
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
