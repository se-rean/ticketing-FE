import React from 'react';
import { useForm } from 'react-hook-form';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import { loginAction } from '../redux-saga/actions';

import {
  Grid,
  Typography
} from '@mui/material';

import Input from '../components/input';
import InputPassword from '../components/input-password';
import Button from '../components/button';
import FormErrorBanner from '../components/form-error-banner';

const stateSelectors = createSelector(
  state => state.login,
  state => state.table,
  (login) => ({
    loading: login.loading,
    is_success: login.is_success,
    message: login.message
  })
);

const LoginPage = () => {
  const dispatch = useDispatch();

  const {
    loading,
    message,
    is_success: isSuccess
  } = useSelector(stateSelectors);

  const {
    register,
    formState: { errors: fieldErrors },
    handleSubmit
  } = useForm();


  const onSubmit = (data) => {
    dispatch(loginAction({ payload: data }));
  };

  return <>
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography color='primary' align='center' variant='h6'>
              Ticketing Admin
            </Typography>
          </Grid>

          {!isSuccess && message && (
            <Grid item xs={12}>
              <FormErrorBanner message={message}/>
            </Grid>
          )}

          <Grid item xs={12}>
            <Input
              name='username'
              label='Username'
              {...register('username', { required: 'Username field is required.' })}
              error={fieldErrors.userNameOrEmail}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <InputPassword
              name='password'
              label='Password'
              {...register('password', { required: 'Password field is required.' })}
              error={fieldErrors.password}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              sx={{ width: '100%' }}
              type='submit'
              label='Sign In'
              disabled={loading}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  </>;
};

export default LoginPage;