export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getUser();
};

export const logout = () => {
  localStorage.removeItem("user");
};