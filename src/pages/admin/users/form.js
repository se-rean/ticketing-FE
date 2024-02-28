/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import { useForm } from 'react-hook-form';
import { emailOnly } from '../../../utils/regex';
import { numbersOnlyKeyPress } from '../../../helpers';
import {
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  Box,
  Card, Grid, Typography
} from '@mui/material';
import Input from '../../../components/input';
import Button from '../../../components/button';
import FormErrorBanner from '../../../components/form-error-banner';
import InputPassword from '../../../components/input-password';
import {
  createUsersAction,
  getUserAction,
  setUserAction,
  updateUsersAction
} from '../../../redux-saga/actions';

const stateSelectors = createSelector(
  state => state.users,
  (users) => ({
    errors: users.errors,
    loading: users.loading,
    user: users.user
  })
);

const UsersFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { editId } = useParams();

  const {
    register,
    formState: { errors: fieldErrors },
    handleSubmit,
    setValue,
    getValues,
    reset
  } = useForm();

  const {
    errors,
    loading,
    user
  } = useSelector(stateSelectors);

  const onSubmit = async data => {
    const payloadData = {
      username: data.username,
      fname: data.fname,
      mname: data.mname,
      lname: data.lname,
      email: data.email,
      phone: data.phone,
      password: data.password,
      status: 'active'
    };

    if (!editId) {
      dispatch(createUsersAction(payloadData));
      reset();
    } else {
      dispatch(updateUsersAction({
        id: editId,
        payload: payloadData
      }));
    }
  };

  const vaidateConfirmPassword = (value) => {
    const password = getValues('password');
    return value === password || 'Confirm password does not match with New password.';
  };

  useEffect(() => {
    reset();

    if (editId) {
      dispatch(getUserAction(editId));
    } else {
      dispatch(setUserAction(null));
    }
  }, [editId]);

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('fname', user.fname);
      setValue('mname', user.mname);
      setValue('lname', user.lname);
      setValue('email', user.email);
      setValue('phone', user.phone);
    } else {
      reset();
    }
  }, [user]);

  return <>
    <Card sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {errors && (
            <Grid item xs={12}>
              <FormErrorBanner {...{ message: errors }}/>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography color='primary' variant='h6'>
              <strong>User Details</strong>
            </Typography>
          </Grid>

          <Grid item xs={12} md={12} lg={4} xl={4}>
            <Input
              name='username'
              label='Username'
              {...register('username', { required: 'Username field is required.' })}
              error={fieldErrors.username}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={4} xl={4}>
            <Input
              name='fname'
              label='First Name'
              {...register('fname', { required: 'First name field is required.' })}
              error={fieldErrors.fname}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={4} xl={4}>
            <Input
              name='mname'
              label='Middle Name (Optional)'
              {...register('mname', { required: 'Middle name field is required.' })}
              error={fieldErrors.mname}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={4} xl={4}>
            <Input
              name='lname'
              label='Last Name'
              {...register('lname', { required: 'Last name field is required.' })}
              error={fieldErrors.fname}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={4} xl={4}>
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
              error={fieldErrors.email}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={4} xl={4}>
            <Input
              name='phone'
              label='Phone #'
              {...register('phone', { required: 'Phone # field is required.' })}
              error={fieldErrors.phone}
              onKeyPress={numbersOnlyKeyPress}
              disabled={loading}
            />
          </Grid>

          {!editId && (
            <>
              <Grid item xs={12}>
                <Typography color='primary' variant='h6'>
                  <strong>Setup Password</strong>
                </Typography>
              </Grid>

              <Grid item xs={12} md={12} lg={4} xl={4}>
                <InputPassword
                  name='password'
                  label='Password'
                  {...register('password', { required: 'Password field is required.' })}
                  error={fieldErrors.password}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={12} lg={4} xl={4}>
                <InputPassword
                  name='confirmPassword'
                  label='Confirm Password'
                  {...register('confirmPassword', {
                    required: 'Confirm password field is required.',
                    validate: vaidateConfirmPassword
                  })}
                  error={fieldErrors.confirmPassword}
                  disabled={loading}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                gap: 2
              }}
            >
              <Button
                type='button'
                color='error'
                label='Cancel'
                onClick={() => navigate('/admin/users')}
                disabled={loading}
              />

              <Button
                type='submit'
                label='Submit'
                disabled={loading}
              />
            </Box>
          </Grid>
        </Grid>
      </form>
    </Card>
  </>;
};

export default UsersFormPage;