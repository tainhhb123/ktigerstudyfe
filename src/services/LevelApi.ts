//src/services/LevelApi.ts
import axios from 'axios';
const BASE_URL = "http://localhost:8080/api/levels";

export async function getAllLevels() {
  const res = await axios.get(BASE_URL);
  return res.data; 
}