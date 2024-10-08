import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom"
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useForm } from "react-hook-form";
import { selectIsAuth, fetchRegister } from "../../redux/slices/auth"
import styles from "./Login.module.scss";

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      fullName: "John Doe",
      email: "test@gmail.com",
      password: "12345",
      avatarUrl: ""
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    const uriName = encodeURI(values.fullName)

    values.avatarUrl = `https://ui-avatars.com/api/?background=random&name=${uriName}`;

    const data = await dispatch(fetchRegister(values));
    if (data.error != undefined) {
      alert(data.error.message);
      return
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } else {
      alert('Registration problem occured. Please try once again.')
    }
  }

  if(isAuth) {
    return <Navigate to='/' />
  }


  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        SignUp
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} >

        <TextField
          className={styles.field}
          label="Full Name"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          fullWidth
          {...register('fullName', { required: 'Please enter your Full Name' })}
        />
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
          type='password'
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Please enter password' })}
          fullWidth
        />
        <Button disabled={!isValid} type="Submit" size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};
