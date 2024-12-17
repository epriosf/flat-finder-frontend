import { Flat, Pagination } from '../components/Interfaces/FlatInterface';
import { FlatsResponse } from '../components/Interfaces/UserInterface';

const API_URL = 'http://localhost:8080/flats'; // Replace with your backend URL

const getFlats = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryParams: Record<string, any> = {},
): Promise<FlatsResponse> => {
  try {
    const authToken = localStorage.getItem('authToken') || '';
    const queryString = new URLSearchParams(queryParams).toString();

    const response = await fetch(`${API_URL}?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching flats: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      flats: data.data as Flat[],
      pagination: data.pagination as Pagination,
    };
  } catch (error) {
    console.error('Error in getFlats:', error);
    throw error;
  }
};

const getFlatsByIds = async (flatIds: string[]): Promise<FlatsResponse> => {
  try {
    const authToken = localStorage.getItem('authToken') || '';
    if (!authToken) {
      throw new Error('No token found');
    }

    const response = await fetch('http://localhost:8080/flats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ flatIds }), // Send IDs as part of the request body
    });

    if (!response.ok) {
      throw new Error(`Error fetching flats: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      flats: data.data as Flat[],
      pagination: data.pagination,
    };
  } catch (error) {
    console.error('Error fetching flats:', error);
    throw error;
  }
};
const getFlatById = async (flatId: string): Promise<Flat> => {
  try {
    const authToken = localStorage.getItem('authToken') || '';
    if (!authToken) {
      throw new Error('No token found');
    }

    const response = await fetch(`http://localhost:8080/flats/${flatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }

    const flat: Flat = await response.json();
    return flat;
  } catch (error) {
    console.error('Error fetching flats:', error);
    throw error;
  }
};
export const getUserFlats = async (
  params: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ flats: Flat[]; pagination: any }> => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    // Build query string dynamically based on parameters
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sort) query.append('sort', params.sort);
    if (params.order) query.append('order', params.order);

    const response = await fetch(`${API_URL}/user-flats?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching user flats');
    }

    const { data, pagination } = await response.json();
    return { flats: data as Flat[], pagination };
  } catch (error) {
    console.error('Error fetching user flats:', error);
    throw error;
  }
};

export { getFlatById, getFlats, getFlatsByIds };
