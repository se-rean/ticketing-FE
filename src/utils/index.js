export const getUser = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  return user ? user : {};
};