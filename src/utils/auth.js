export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const getToken = () => localStorage.getItem('token');
  
  export const clearToken = () => {
    localStorage.removeItem('token');
  };
  
  export const isAdmin = () => {
    const role = localStorage.getItem('role');
    return role === 'admin';
  };
  