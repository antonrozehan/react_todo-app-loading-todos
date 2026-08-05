import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getUserId = () => {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const user = localStorage.getItem('user');

    if (!user) {
      return 0;
    }

    return Number(JSON.parse(user).id) || 0;
  } catch {
    return 0;
  }
};

export const USER_ID = getUserId();

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
