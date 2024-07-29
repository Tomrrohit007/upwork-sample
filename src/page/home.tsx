import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import {
  deleteUserByEmail,
  getUsersFromLocalStorage,
  User,
} from '../functions/getUsers';
import { DeleteIcon } from '../dummy/delete-icon';
import EditModal from '../components/edit-modal';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const users: User[] = getUsersFromLocalStorage();
    setUsers(users);
  }, [users]);
  return (
    <div className='mx-10'>
      <Table isStriped>
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>DATE OF BIRTH</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow key={user.email}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell className='flex gap-x-4 items-center'>
                  <EditModal editUser={user} />

                  <Tooltip color='danger' content='Delete user'>
                    <span
                      className='text-lg text-danger cursor-pointer active:opacity-50'
                      onClick={() => deleteUserByEmail(user.email)}>
                      <DeleteIcon />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
