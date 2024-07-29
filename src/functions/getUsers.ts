import { toast } from 'sonner';

export type User = {
  name: string;
  email: string;
  date: string;
  password: string;
};

export const getUsersFromLocalStorage = (): User[] => {
  const usersString = localStorage.getItem('users');

  let users: User[] = [];
  if (usersString) {
    try {
      users = JSON.parse(usersString);
      if (!Array.isArray(users)) {
        console.error('Parsed data is not an array');
        users = [];
      }
    } catch (error) {
      console.error('Failed to parse users from localStorage', error);
    }
  }
  return users;
};

export const deleteUserByEmail = (email: string): void => {
  const usersString = localStorage.getItem('users');

  let users: User[] = [];
  if (usersString) {
    try {
      users = JSON.parse(usersString);
      if (!Array.isArray(users)) {
        console.error('Parsed data is not an array');
        users = [];
      }
    } catch (error) {
      console.error('Failed to parse users from localStorage', error);
    }
  }

  const updatedUsers = users.filter((user) => user.email !== email);

  localStorage.setItem('users', JSON.stringify(updatedUsers));
  console.log(updatedUsers);
  toast('User delete');
};
