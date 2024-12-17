import { User, UserDetail } from '../components/Interfaces/UserInterface';

const API_URL = 'http://localhost:8080/users';

export const getUserById = async (id: string): Promise<User> => {
  try {
    console.log('userId', id);
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
export const getUsers = async (
  params: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ users: UserDetail[]; pagination: any }> => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    // Build query string dynamically from parameters
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sort) query.append('sort', params.sort);
    if (params.order) query.append('order', params.order);

    const response = await fetch(`${API_URL}/?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching users');
    }

    const { data, pagination } = await response.json();
    return { users: data as UserDetail[], pagination };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
export const updateUser = async (
  id: string,
  userData: Partial<User>,
): Promise<User> => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating user');
    }

    const data = await response.json();
    return data.data as User; // Assuming the updated user is returned in `data`
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
