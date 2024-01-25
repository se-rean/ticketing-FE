import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckAuth = ({ children }) => {
  const navigate = useNavigate();

  const HAS_TOKEN = sessionStorage.getItem('token');
  const UNAUTH_ROUTES = ['/', '/login'];

  const authorized = () => {
    navigate;
    UNAUTH_ROUTES.includes(window.location.pathname) && navigate('/admin');
  };

  useEffect(() => {
    HAS_TOKEN ? authorized() : navigate('/login');
  }, [HAS_TOKEN, navigate]);

  return <>
    {children}
  </>;
};

export default CheckAuth;