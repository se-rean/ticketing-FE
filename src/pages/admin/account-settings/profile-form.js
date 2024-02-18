import React from 'react';
import { useForm } from 'react-hook-form';
import { emailOnly } from '../../../utils/regex';
import { numbersOnlyKeyPress } from '../../../helpers';

import {
  Box, Grid
} from '@mui/material';
import Input from '../../../components/input';
import Modal from '../../../components/modal';
import Button from '../../../components/button';

const ProfileForm = ({ isFormOpen, setIsFormOpen }) => {
  const {
    register,
    formState: { errors: fieldErrors },
    handleSubmit,
    reset
  } = useForm();

  const userDetails = JSON.parse(sessionStorage.getItem('user'));

  const onSubmit = async data => {
    console.log(data);
  };

  const handleClose = () => {
    setIsFormOpen('');
    reset();
  };

  return <>
    <Modal
      {...{
        title: 'Update Profile',
        isOpen: isFormOpen === 'profile',
        handleClose
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input
              name='username'
              label='Username'
              {...register('username', { required: 'Username field is required.' })}
              defaultValue={userDetails.username}
              error={fieldErrors.username}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name='fname'
              label='First Name'
              {...register('fname', { required: 'First name field is required.' })}
              defaultValue={userDetails.fname}
              error={fieldErrors.fname}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name='mname'
              label='Middle Name'
              {...register('mname', { required: 'Middle name field is required.' })}
              defaultValue={userDetails.mname}
              error={fieldErrors.mname}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name='lname'
              label='Last Name'
              {...register('lname', { required: 'Last name field is required.' })}
              defaultValue={userDetails.lname}
              error={fieldErrors.lname}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name='email'
              label='Email'
              {...register('email', {
                required: 'Email field is required.',
                pattern: {
                  value: emailOnly,
                  message: 'Incorrect email address format.'
                }
              })}
              defaultValue={userDetails.email}
              error={fieldErrors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name='phone'
              label='Phone #'
              {...register('phone', { required: 'Phone # field is required.' })}
              defaultValue={userDetails.phone}
              error={fieldErrors.phone}
              onKeyPress={numbersOnlyKeyPress}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'end'
            }}>
              <Button type='submit' label='Submit'/>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Modal>
  </>;
};

export default ProfileForm;