const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export const getWishlist = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: { token }
    });
    const data = await response.json();
    console.log('Wishlist response:', data); 
    return data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const addToWishlist = async (token: string, productId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token
      },
      body: JSON.stringify({ productId })
    });
    const data = await response.json();
    console.log('Add to wishlist response:', data); 
    return data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (token: string, productId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { token }
    });
    const data = await response.json();
    console.log('Remove from wishlist response:', data); 
    return data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};