import React, {
  Fragment,
  useState
} from 'react';
import {
  Box,
  Card,
  Grid,
  Typography
} from '@mui/material';
import {
  Key,
  Person
} from '@mui/icons-material';
import Button from '../../../components/button';
import ProfileForm from './profile-form';
import ChangePasswordForm from './change-password-form';

const AccountSettingsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user'));

  const settingsMenu = [
    user.role === 'admin' && {
      title: 'Profile',
      subTitle: 'Manage your account\'s details.',
      icon: <Person/>,
      onClick: () => setIsFormOpen('profile')
    },
    {
      title: 'Change Password',
      subTitle: 'Manage your account\'s password',
      icon: <Key/>,
      onClick: () => setIsFormOpen('change-password')
    }
  ].filter(Boolean);

  return <>
    <Grid container spacing={3}>
      {settingsMenu.map((i, index) => (
        <Fragment key={index}>
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant='h6'>
                    <span style={{ verticalAlign: 'middle' }}>{i.icon}</span> {i.title}
                  </Typography>

                  <Typography variant='body2'>
                    {i.subTitle}
                  </Typography>
                </Box>

                <Box>
                  <Button label='Manage' onClick={() => i.onClick()}/>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Fragment>
      ))}
    </Grid>

    <ProfileForm {...{
      isFormOpen,
      setIsFormOpen
    }}/>

    <ChangePasswordForm {...{
      isFormOpen,
      setIsFormOpen
    }}/>
  </>;
};

export default AccountSettingsPage;