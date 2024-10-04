import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom"
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {  useForm } from "react-hook-form";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth"

import styles from "./Login.module.scss";

export const Login = () => {

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      email: "test3@gmail.com",
      password: "12345"
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    if('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } else {
      alert('Authorisation problem occured. Please try once again.')
    }

  };

  if(isAuth) {
    return <Navigate to="/" />
  };



  return (
    <Paper classes={{ root: styles.root }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Your Account
        </Typography>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Please enter email' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Please enter password' })}

          fullWidth />
        <Button type="Submit" size="large" variant="contained" fullWidth>
          LogIn
        </Button>
      </form>
    </Paper>
  );
};
