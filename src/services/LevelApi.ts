//src/services/LevelApi.ts
import axiosInstance from './axiosConfig';

export async function getAllLevels() {
  const res = await axiosInstance.get('/api/levels');
  return res.data; 
}