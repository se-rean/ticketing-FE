/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { emailOnly } from '../../../utils/regex';
import { numbersOnlyKeyPress } from '../../../helpers';
import countryCode from '../../../utils/countryCode.json';
import {
  Grid,
  Box
} from '@mui/material';
import Input from '../../../components/input';
import Button from '../../../components/button';
import moment from 'moment';
import { updateParticipantsAction } from '../../../redux-saga/actions';
import InputSelect from '../../../components/input-select';

const EditParticipantsForm = ({
  performanceCode,
  isEditFormOpen,
  setIsEditFormOpen,
  fetchParticipants,
  loading,
  dispatch,
  selectedRow
}) => {
  const {
    register,
    formState: { errors: fieldErrors },
    handleSubmit,
    reset,
    setValue
  } = useForm();

  const handleCloseEditForm = () => {
    setIsEditFormOpen(!isEditFormOpen);
    reset();
  };

  const onSubmit = async data => {
    const payload = {
      participantId: selectedRow.id,
      data
    };

    dispatch(updateParticipantsAction(payload)).then(() => {
      fetchParticipants();
      handleCloseEditForm();
    });
  };

  useEffect(() => {
    if (selectedRow) {
      setValue('salutation', selectedRow.salutation);
      setValue('firstname', selectedRow.firstname);
      setValue('lastname', selectedRow.lastname);
      const parsedDate = moment(selectedRow.dateofbirth).format('YYYY-MM-DD');
      setValue('dateofbirth', parsedDate);
      setValue('email', selectedRow.email);
      setValue('phonenumber', selectedRow.phonenumber);
      setValue('city', selectedRow.city);
      setValue('state', selectedRow.state);
      setValue('countrycode', selectedRow.countrycode);
      setValue('address_line_1', selectedRow.address_line_1);
      setValue('nationality', selectedRow.nationality);
      setValue('internationalcode', selectedRow.internationalcode);
      setValue('areacode', selectedRow.areacode);
      setValue('job_title', selectedRow.job_title);
      setValue('company_name', selectedRow.company_name);
      setValue('type', selectedRow.type);
      setValue('area', selectedRow.area);
      setValue('pricetype_code', selectedRow.pricetype_code);
      setValue('quantity', selectedRow.quantity);
      setValue('totalAmount', selectedRow.total_amount);
      setValue('qualifier_code', selectedRow.qualifier_code);
      setValue('offer_code', selectedRow.offer_code);
    }
  }, []);

  return <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='salutation'
            label='Salutation'
            {...register('salutation', { required: 'Salutation field is required.' })}
            error={fieldErrors?.salutation}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='firstname'
            label='First Name'
            {...register('firstname', { required: 'First Name field is required.' })}
            error={fieldErrors?.firstname}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='lastname'
            label='Last Name'
            {...register('lastname', { required: 'Last Name field is required.' })}
            error={fieldErrors?.lastname}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            type='date'
            name='dateofbirth'
            label='Date of Birth'
            {...register('dateofbirth', { required: 'Date of Birth field is required.' })}
            error={fieldErrors?.dateofbirth}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
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
            error={fieldErrors?.email}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='phonenumber'
            label='Phone number'
            {...register('phonenumber', { required: 'Phone number field is required.' })}
            onKeyPress={numbersOnlyKeyPress}
            error={fieldErrors?.phonenumber}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='city'
            label='City'
            {...register('city', { required: 'City field is required.' })}
            error={fieldErrors?.city}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='state'
            label='State'
            {...register('state', { required: 'State field is required.' })}
            error={fieldErrors?.state}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <InputSelect
            name='countrycode'
            label='Country'
            {...register('countrycode', { required: 'Country Code field is required.' })}
            options={countryCode}
            error={fieldErrors?.state}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='address_line_1'
            label='Adress'
            {...register('address_line_1', { required: 'Address field is required.' })}
            error={fieldErrors?.address_line_1}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='nationality'
            label='Nationality'
            {...register('nationality', { required: 'Nationality field is required.' })}
            error={fieldErrors?.nationality}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='internationalcode'
            label='International Code'
            {...register('internationalcode', { required: 'International code field is required.' })}
            error={fieldErrors?.internationalcode}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='areacode'
            label='Area Code'
            {...register('areacode', { required: 'Area code field is required.' })}
            error={fieldErrors?.areacode}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='job_title'
            label='Job Title'
            {...register('job_title', { required: 'Job title field is required.' })}
            error={fieldErrors?.job_title}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='company_name'
            label='Company Name'
            {...register('company_name', { required: 'Company name field is required.' })}
            error={fieldErrors?.company_name}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='type'
            label='Company Type'
            {...register('type', { required: 'Company type field is required.' })}
            error={fieldErrors?.type}
            disabled={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Input
            name='area'
            label='Area'
            {...register('area', { required: 'Area field is required.' })}
            error={fieldErrors?.area}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Input
            name='quantity'
            label='Quantity'
            {...register('quantity', { required: 'Quantity field is required.' })}
            error={fieldErrors?.quantity}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Input
            name='pricetype_code'
            label='Price Type Code'
            {...register('pricetype_code', { required: 'Price type code field is required.' })}
            error={fieldErrors?.pricetype_code}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Input
            name='totalAmount'
            label='Amount'
            {...register('totalAmount', { required: 'Amount field is required.' })}
            error={fieldErrors?.amount}
          />
        </Grid>

        {/* <Grid item xs={12} md={6} lg={6} xl={6}>
          <Input
            name='qualifier_code'
            label='Qualifier Code'
            {...register('qualifier_code', { required: 'Qualifier code field is required.' })}
            error={fieldErrors?.qualifier_code}
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Input
            name='offer_code'
            label='Offer Code'
            {...register('offer_code', { required: 'Offer code field is required.' })}
            error={fieldErrors?.qualifier_code}
            disabled
          />
        </Grid> */}

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
              onClick={() => handleCloseEditForm()}
            />

            <Button
              label='Update'
              type='submit'
              disabled={['pending', 'failed'].includes(selectedRow.status) ? false:true}
              color='primary'
            />
          </Box>
        </Grid>
      </Grid>
    </form>
  </>;
};

export default EditParticipantsForm;