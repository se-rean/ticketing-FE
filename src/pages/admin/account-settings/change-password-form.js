import React from 'react';
import Modal from '../../../components/modal';

const ChangePasswordForm = ({ isFormOpen, setIsFormOpen }) => {
  return <>
    <Modal
      {...{
        title: 'Change Password',
        isOpen: isFormOpen === 'change-password',
        handleClose: () => setIsFormOpen('')
      }}
    >
      test
    </Modal>
  </>;
};

export default ChangePasswordForm;