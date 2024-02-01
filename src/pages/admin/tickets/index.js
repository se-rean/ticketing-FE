/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import {
  Grid,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import CreateEventForm from './create-event-form';
import PerformanceDetailsForm from './performance-details-form';
import ParticipantsForm from './participants-form';

const TicketsPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = ['Create Event', 'Details & Generate', 'Participants'];

  const STEP_1 = 0;
  const STEP_2 = 1;
  const STEP_3 = 2;

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const goToStep1 = () => {
    setActiveStep(0);
  };

  const RenderActiveComponent = () => {
    switch (activeStep) {
      case STEP_1:
        return <CreateEventForm {...{ handleNextStep }}/>;
      case STEP_2:
        return <PerformanceDetailsForm {...{ handleNextStep }}/>;
      case STEP_3:
        return <ParticipantsForm {...{ goToStep1 }}/>;
      default:
        return <CreateEventForm {...{ handleNextStep }}/>;
    }
  };

  return <>
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Stepper activeStep={activeStep}>
          {STEPS.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>

      <Grid item xs={12}>
        <RenderActiveComponent/>
      </Grid>
    </Grid>
  </>;
};

export default TicketsPage;