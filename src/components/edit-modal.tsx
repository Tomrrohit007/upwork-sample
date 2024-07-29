import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';

import { FormEvent, useRef, useState } from 'react';
import { Input } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/react';
import { UpdateSchemaZod } from '../schema/register-schema';
import { toast } from 'sonner';

import { User } from '../functions/getUsers';
import { EditIcon } from '../dummy/edit-icon';

type Errors = {
  name?: string[] | undefined;
  email?: string[] | undefined;
  date?: string[] | undefined;
  password?: string[] | undefined;
  confirmPassword?: string[] | undefined;
};

type UpdateSchema = {
  name: string;
  email: string;
  date: string;
  password?: string;
};

const EditModal = ({ editUser }: { editUser: User }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const editTheUser = ({ name, date, email }: UpdateSchema) => {
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
        return;
      }
    }

    console.log('Reached');
    const userIndex = users.findIndex((user) => user.email === editUser.email);

    if (userIndex === -1) {
      setErrors({ email: ['User not found'] }); // Set an appropriate error
      return;
    }

    users[userIndex] = {
      ...users[userIndex],
      name,
      date,
      email,
    };

    const updatedUsersString = JSON.stringify(users);
    localStorage.setItem('users', updatedUsersString);

    console.log(updatedUsersString);
    toast(`User "${name}" updated successfully`);
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = UpdateSchemaZod.safeParse(data);

    await new Promise((res) => setTimeout(res, 1400));
    console.log('Result:', result);
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors;
      setErrors(fieldError);
      setIsLoading(false);
      return;
    }
    setErrors({});
    editTheUser(result.data);
    setIsLoading(false);

    if (formRef.current) {
      formRef.current.reset();
    }
    onOpenChange();
  };

  return (
    <>
      <Tooltip content='Edit user'>
        <Button onPress={onOpen} className='bg-transparent' size='sm'>
          <EditIcon />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className='p-2'>
          {() => (
            <>
              <ModalHeader className='flex justify-center items-center gap-1'>
                Edit User
              </ModalHeader>
              <ModalBody>
                <form
                  ref={formRef}
                  onSubmit={submitForm}
                  className='space-y-4 w-full'>
                  <div className='flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4'>
                    <Input
                      isInvalid={!!errors.name}
                      errorMessage={errors.name?.join(', ')}
                      name='name'
                      size='sm'
                      type='text'
                      label='Name'
                      value={editUser.name}
                    />
                  </div>
                  <div className='flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4'>
                    <Input
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.join(', ')}
                      name='email'
                      size='sm'
                      type='email'
                      label='Email'
                      value={editUser.email}
                    />
                  </div>
                  <div className='flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4'>
                    <DatePicker
                      isInvalid={!!errors.date}
                      errorMessage={errors.date?.join(', ')}
                      name='date'
                      label='Birth date'
                      className='w-full'
                    />
                  </div>

                  <div className='flex w-full justify-center'>
                    <Button
                      isLoading={isLoading}
                      color='success'
                      type='submit'
                      className='w-full'>
                      Submit
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
