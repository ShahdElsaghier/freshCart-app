const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export const addToCart = async (token: string, productId: string) => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token
    },
    body: JSON.stringify({ productId })
  });
  return await response.json();
};

export const getCart = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: { token }
  });
  return await response.json();
};

export const updateCartItem = async (token: string, productId: string, count: number) => {
  const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: token
    },
    body: JSON.stringify({ count })
  });
  return await response.json();
};

export const removeFromCart = async (token: string, productId: string) => {
  const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: { token }
  });
  return await response.json();
};

export const clearCart = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: { token }
  });
  return await response.json();
};