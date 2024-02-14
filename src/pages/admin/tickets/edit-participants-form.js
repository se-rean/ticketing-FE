/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useForm } from 'react-hook-form';
import { emailOnly } from '../../../utils/regex';
import { numbersOnlyKeyPress } from '../../../helpers';
import { countryCodes } from '../../../utils/constants';
import {
  Grid,
  Box
} from '@mui/material';
import Input from '../../../components/input';
import Button from '../../../components/button';
import moment from 'moment';
import { updateParticipantsAction } from '../../../redux-saga/actions';
import InputSelect from '../../../components/input-select';
import { uniqBy } from 'lodash';

const EditParticipantsForm = ({
  performanceCode,
  isEditFormOpen,
  setIsEditFormOpen,
  fetchParticipants,
  loading,
  dispatch,
  selectedRow,
  performanceDetails
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

    data.area = data.area.split('-')[0];

    const payload = {
      participantId: selectedRow.id,
      data
    };

    dispatch(updateParticipantsAction(payload)).then(() => {
      fetchParticipants();
      handleCloseEditForm();
    });
  };

  const handleQuantityChange = (e) => {
    const amount = performanceDetails.event_pricing.find(i => i.performance_code === selectedRow.performance_code)?.amount || 0;
    setValue('totalAmount', e.target.value * amount);
    setValue('totalAmount', e.target.value * amount);
  };

  var typeCodeOptions = [];

  const handleAreaChange = (e) => {
    const [area, typeCode] = e.target.value.split('-');

    const amount = performanceDetails.event_pricing.find(i => i.section === area && i.type_code === typeCode)?.amount || 0;

    setValue('totalAmount', selectedRow.quantity * amount);
    setValue('pricetype_code', typeCode);
    setValue('area', area);
    setValue('quantity', selectedRow.quantity);
  };

  const sectionsOptions = performanceDetails.event_pricing.map(i => ({
    label: `${i.section}-${i.type_code}`,
    value: `${i.section}-${i.type_code}`
  }));


  return <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='salutation'
            label='Salutation'
            {...register('salutation', { required: 'Salutation field is required.' })}
            defaultValue={selectedRow && selectedRow.salutation}
            error={fieldErrors?.salutation}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='firstname'
            label='First Name'
            {...register('firstname', { required: 'First Name field is required.' })}
            defaultValue={selectedRow && selectedRow.firstname}
            error={fieldErrors?.firstname}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='lastname'
            label='Last Name'
            {...register('lastname', { required: 'Last Name field is required.' })}
            defaultValue={selectedRow && selectedRow.lastname}
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
            defaultValue={selectedRow && moment(selectedRow.dateofbirth).format('YYYY-MM-DD')}
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
            defaultValue={selectedRow && selectedRow.email}
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
            defaultValue={selectedRow && selectedRow.phonenumber}
            error={fieldErrors?.phonenumber}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='city'
            label='City'
            {...register('city', { required: 'City field is required.' })}
            defaultValue={selectedRow && selectedRow.city}
            error={fieldErrors?.city}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='state'
            label='State'
            {...register('state', { required: 'State field is required.' })}
            defaultValue={selectedRow && selectedRow.state}
            error={fieldErrors?.state}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <InputSelect
            name='countrycode'
            label='Country'
            {...register('countrycode', { required: 'Country Code field is required.' })}
            options={countryCodes}
            defaultValue={selectedRow && selectedRow.countrycode}
            error={fieldErrors?.countrycode}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='address_line_1'
            label='Adress'
            {...register('address_line_1', { required: 'Address field is required.' })}
            defaultValue={selectedRow && selectedRow.address_line_1}
            error={fieldErrors?.address_line_1}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <InputSelect
            name='nationality'
            label='Nationality'
            {...register('nationality', { required: 'Nationality field is required.' })}
            options={countryCodes}
            defaultValue={selectedRow && selectedRow.nationality}
            error={fieldErrors?.nationality}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='internationalcode'
            label='International Code'
            {...register('internationalcode', { required: 'International code field is required.' })}
            defaultValue={selectedRow && selectedRow.internationalcode}
            error={fieldErrors?.internationalcode}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='areacode'
            label='Area Code'
            {...register('areacode', { required: 'Area code field is required.' })}
            defaultValue={selectedRow && selectedRow.areacode}
            error={fieldErrors?.areacode}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='job_title'
            label='Job Title'
            {...register('job_title', { required: 'Job title field is required.' })}
            defaultValue={selectedRow && selectedRow.job_title}
            error={fieldErrors?.job_title}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='company_name'
            label='Company Name'
            {...register('company_name', { required: 'Company name field is required.' })}
            defaultValue={selectedRow && selectedRow.company_name}
            error={fieldErrors?.company_name}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={4}>
          <Input
            name='type'
            label='Company Type'
            {...register('type', { required: 'Company type field is required.' })}
            defaultValue={selectedRow && selectedRow.type}
            error={fieldErrors?.type}
            disabled={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={2} lg={2} xl={2}>
          <InputSelect
            name='area'
            label='Update Price Category'
            {...register('area', { required: 'Area field is required.' })}
            options={sectionsOptions}
            defaultValue={selectedRow && selectedRow.area}
            error={fieldErrors?.area}
            onChange={(e) => handleAreaChange(e)}
            disabled={loading}
          />
        </Grid>


        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Input
            name='area'
            label='area'
            {...register('area', { required: 'area field is required.' })}
            options={typeCodeOptions}
            defaultValue={selectedRow && selectedRow.area}
            error={fieldErrors?.area}
            disabled={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Input
            name='pricetype_code'
            label='Price Type Code'
            {...register('pricetype_code', { })}
            options={typeCodeOptions}
            defaultValue={selectedRow && selectedRow.pricetype_code}
            error={fieldErrors?.pricetype_code}
            disabled={true}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Input
            name='quantity'
            label='Quantity'
            {...register('quantity', { })}
            defaultValue={selectedRow && selectedRow.quantity}
            error={fieldErrors?.quantity}
            disabled={true}
            onChange={(e) => handleQuantityChange(e)}
          />
        </Grid>

        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Input
            name='totalAmount'
            label='Amount'
            {...register('totalAmount', { })}
            defaultValue={selectedRow && selectedRow.total_amount}
            error={fieldErrors?.totalAmount}
            disabled={true}
          />
        </Grid>

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