import type { Practice } from '../interfaces/Practice';
import { fetchUserPractices } from '../api/practicesAPI';

export const getUserPractices = async (userId: string): Promise<Practice[]> => {
  try {
    const practices = await fetchUserPractices(userId);

    return practices.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching user practices:', error);
    return [];
  }
};
