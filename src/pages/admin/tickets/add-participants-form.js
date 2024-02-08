/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {
  Fragment,
  useEffect
} from 'react';
import {
  useForm,
  useFieldArray
} from 'react-hook-form';

import {
  Grid,
  Box,
  Typography
} from '@mui/material';
import Button from '../../../components/button';
import Input from '../../../components/input';
import { createRandomParticipants } from '../../../redux-saga/actions';

const AddParticipantsForm = ({
  performanceCode,
  isAddFormOpen,
  setIsAddFormOpen,
  fetchParticipants,
  performanceDetails,
  loading,
  dispatch
}) => {
  const {
    register,
    formState: { errors: fieldErrors },
    handleSubmit,
    reset,
    control,
    setValue
  } = useForm();

  const { fields } = useFieldArray({
    control,
    name: 'categories'
  });

  const handleCloseAddForm = () => {
    setIsAddFormOpen(!isAddFormOpen);
    reset();
  };

  const onSubmitAddParticipants = async data => {
    const payload = {
      performanceCode,
      data: data.categories
    };

    dispatch(createRandomParticipants(payload));
    setIsAddFormOpen(!isAddFormOpen);
    fetchParticipants();
    reset();
  };

  useEffect(() => {
    if (isAddFormOpen) {
      const eventPricing = performanceDetails.event_pricing.map(i => ({
        area: i.section,
        code: i.type_code,
        amount: i.amount,
        count: i.capacity
      }));

      setValue('categories', eventPricing);
    }
  }, [isAddFormOpen]);

  useEffect(() => {
    console.log(fieldErrors);
  }, [fieldErrors]);

  return <>
    <form onSubmit={handleSubmit(onSubmitAddParticipants)}>
      <Grid container spacing={3}>
        {fields.map((i, index) => (
          <Fragment key={index}>
            <Grid item xs={12} md={6} lg={4} xl={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>
                    <strong>{i.area}</strong>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Input
                    id={i.id}
                    name={`categories.${index}.code`}
                    label='Code'
                    {...register(`categories.${index}.code`, { required: 'Code field is required.' })}
                    error={(fieldErrors.categories && fieldErrors.categories[index])
                      && fieldErrors.categories[index].code}
                    defaultValue={i.code}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <Input
                    id={i.id}
                    name={`categories.${index}.amount`}
                    label='Amount'
                    {...register(`categories.${index}.amount`, { required: 'Amount field is required.' })}
                    error={(fieldErrors.categories && fieldErrors.categories[index])
                      && fieldErrors.categories[index].amount}
                    defaultValue={i.amount}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <Input
                    id={i.id}
                    type='number'
                    name={`categories.${index}.count`}
                    label='Number of Participant'
                    {...register(`categories.${index}.count`, {
                      required: 'Number of participant field is required.',
                      min: {
                        value: 0,
                        message: 'Number of participant field have at least 0 characters.'
                      },
                      max: {
                        value: 1000,
                        message: 'Number of participant field must not exceed 1000 characters.'
                      }
                    })}
                    error={(fieldErrors.categories && fieldErrors.categories[index])
                      && fieldErrors.categories[index].count}
                    defaultValue={i.count}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Fragment>
        ))}

        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              gap: 2
            }}
          >
            <Button
              label='Cancel'
              type='button'
              color='error'
              onClick={() => handleCloseAddForm()}
            />

            <Button
              label='Submit'
              type='submit'
              color='primary'
            />
          </Box>
        </Grid>
      </Grid>
    </form>
  </>;
};

export default AddParticipantsForm;