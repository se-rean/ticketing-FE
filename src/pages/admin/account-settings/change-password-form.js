/* eslint-disable no-unused-vars */
import React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import { useForm } from 'react-hook-form';
import { toastSuccess } from '../../../helpers';

import {
  Box,
  Grid
} from '@mui/material';
import InputPassword from '../../../components/input-password';
import Modal from '../../../components/modal';
import Button from '../../../components/button';
import { updateUsersAction } from '../../../redux-saga/actions';
import FormErrorBanner from '../../../components/form-error-banner';

const stateSelectors = createSelector(
  state => state.users,
  (users) => ({ errors: users.errors })
);

const ChangePasswordForm = ({ isFormOpen, setIsFormOpen }) => {
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors: fieldErrors },
    handleSubmit,
    reset,
    getValues
  } = useForm();

  const { errors } = useSelector(stateSelectors);

  const handleClose = () => {
    setIsFormOpen('');
    reset();
  };

  const onSubmit = async data => {
    const payloadData = { password: data.newPassword };

    dispatch(updateUsersAction({
      payload: payloadData,
      type: 'change-password'
    }));
  };

  const vaidateConfirmPassword = (value) => {
    const newPassword = getValues('newPassword');
    return value === newPassword || 'Confirm password does not match with New password.';
  };

  return <>
    <Modal
      {...{
        title: 'Change Password',
        isOpen: isFormOpen === 'change-password',
        handleClose
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {errors && (
            <Grid item xs={12}>
              <FormErrorBanner {...{ message: errors }}/>
            </Grid>
          )}

          <Grid item xs={12}>
            <InputPassword
              name='newPassword'
              label='New Password'
              {...register('newPassword', { required: 'New password field is required.' })}
              error={fieldErrors.newPassword}
            />
          </Grid>

          <Grid item xs={12}>
            <InputPassword
              name='confirmPassword'
              label='Confirm Password'
              {...register('confirmPassword', {
                required: 'Confirm password field is required.',
                validate: vaidateConfirmPassword
              })}
              error={fieldErrors.confirmPassword}
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

export default ChangePasswordForm;