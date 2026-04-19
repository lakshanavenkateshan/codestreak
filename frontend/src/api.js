export const API = "http://localhost:8080/api";
 
export const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});
 