export const API = "https://codestreak-production-d476.up.railway.app/api";

export function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}