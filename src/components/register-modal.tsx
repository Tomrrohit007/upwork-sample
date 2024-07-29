import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

import { FormEvent, useRef, useState } from 'react';
import { Input } from '@nextui-org/input';
import { EyeFilledIcon } from '../assets/eye-filled-icon';
import { EyeSlashFilledIcon } from '../assets/eye-slashed-filled-icon';
import { DatePicker } from '@nextui-org/react';
import { RegisterSchema } from '../schema/register-schema';
import { toast } from 'sonner';

import { User } from '../functions/getUsers';

type Errors = {
  name?: string[] | undefined;
  email?: string[] | undefined;
  date?: string[] | undefined;
  password?: string[] | undefined;
  confirmPassword?: string[] | undefined;
};

const RegisterModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const createTheUser = ({ name, email, date, password }: User) => {
    const usersString = localStorage.getItem('users');
    let users: User[] = [];
    if (usersString) {
      users = JSON.parse(usersString);
    }
    const alreadyUser = users.some((user) => user.email === email);
    if (alreadyUser) {
      setErrors({ email: ['Email already exist'] });
      return;
    }
    users.push({ name, email, date, password });
    const updatedUsersString = JSON.stringify(users);
    localStorage.setItem('users', updatedUsersString);
    toast(`User "${name}" created successfully`);
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = RegisterSchema.safeParse(data);

    await new Promise((res) => setTimeout(res, 1400));
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors;
      setErrors(fieldError);
      setIsLoading(false);
      return;
    }
    setErrors({});
    createTheUser(result.data);
    setIsLoading(false);

    if (formRef.current) {
      formRef.current.reset();
    }
    onOpenChange();
  };

  return (
    <>
      <Button onPress={onOpen}>Add User</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className='flex justify-center items-center gap-1'>
                Create User
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

                  <div className='flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4'>
                    <Input
                      isInvalid={!!errors.password}
                      errorMessage={errors.password?.join(', ')}
                      size='sm'
                      label='Password'
                      name='password'
                      endContent={
                        <button
                          //   className='focus:outline-none'
                          type='button'
                          onClick={() =>
                            setIsVisiblePassword(!isVisiblePassword)
                          }
                          aria-label='toggle password visibility'>
                          {isVisiblePassword ? (
                            <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                          ) : (
                            <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                          )}
                        </button>
                      }
                      type={isVisiblePassword ? 'text' : 'password'}
                    />
                  </div>
                  <div className='flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4'>
                    <Input
                      isInvalid={!!errors.confirmPassword}
                      errorMessage={errors.confirmPassword?.join(', ')}
                      name='confirmPassword'
                      size='sm'
                      label='Confirm Password'
                      endContent={
                        <button
                          //   className='focus:outline-none'
                          type='button'
                          onClick={() =>
                            setIsVisibleConfirmPassword(
                              !isVisibleConfirmPassword
                            )
                          }
                          aria-label='toggle password visibility'>
                          {isVisibleConfirmPassword ? (
                            <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                          ) : (
                            <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                          )}
                        </button>
                      }
                      type={isVisibleConfirmPassword ? 'text' : 'password'}
                    />
                  </div>
                  <ModalFooter className='flex flex-col'>
                    <div className='flex w-full justify-center'>
                      <Button
                        isLoading={isLoading}
                        color='success'
                        type='submit'
                        className='w-full'>
                        Submit
                      </Button>
                    </div>
                    <div className='flex w-full justify-center'>
                      <Button color='danger' type='reset' className='w-full'>
                        Reset
                      </Button>
                    </div>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default RegisterModal;
