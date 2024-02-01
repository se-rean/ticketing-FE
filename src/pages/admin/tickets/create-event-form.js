/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import { createEventAction } from '../../../redux-saga/actions';

import {
  Card,
  Grid
} from '@mui/material';
import FormErrorBanner from '../../../components/form-error-banner';
import Input from '../../../components/input';
import InputTextArea from '../../../components/input-text-area';
import Button from '../../../components/button';

const stateSelectors = createSelector(
  state => state.ticket,
  (ticket) => ({
    loading: ticket.loading,
    isSuccess: ticket.createEventSuccess,
    errors: ticket.errors
  })
);

const CreateEventForm = ({ handleNextStep }) => {
  const dispatch = useDispatch();

  const {
    loading,
    isSuccess,
    errors
  } = useSelector(stateSelectors);

  const {
    register,
    formState: { errors: fieldErrors },
    handleSubmit
  } = useForm();

  const onSubmit = (data) => {
    dispatch(createEventAction(data))
      .then(({ payload: { data: { is_success: isSuccess } } }) => {
        console.log(isSuccess);
        if (isSuccess) {
          handleNextStep();
        }
      });
  };

  return <>
    <Grid item xs={12}>
      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {!isSuccess && errors && (
              <Grid item xs={12}>
                <FormErrorBanner message={errors}/>
              </Grid>
            )}

            <Grid item xs={12}>
              <Input
                name='title'
                label='Title'
                {...register('title', { required: 'Title field is required.' })}
                error={fieldErrors.title}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <InputTextArea
                name='description'
                label='Description'
                {...register('description', { required: 'Description field is required.' })}
                error={fieldErrors.description}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                name='performanceCode'
                label='Performance Code'
                {...register('performanceCode', { required: 'Performance Code field is required.' })}
                error={fieldErrors.performanceCode}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} align='right'>
              <Button
                type='submit'
                label='Create Event'
                disabled={loading}
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </Grid>
  </>;
};

export default CreateEventForm;