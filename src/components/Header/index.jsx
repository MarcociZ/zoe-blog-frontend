import React from "react";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom"

import { Link } from "react-router-dom"
import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { selectIsAuth, logout } from "../../redux/slices/auth";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if(window.confirm("Are you really want to Log Out?")) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <a className={styles.logo} href="/">
            <div>ZOE LIVE BLOG</div>
          </a>
          <div className={styles.buttons}>
            {isAuth ? (<>
              <Link to='/add-post'>
                <Button variant='contained'>Create a Post</Button>
              </Link>
              <Button variant='contained' onClick={onClickLogout} color="error">LogOut</Button>
            </>) : (<>
              <Link to='/login'>
                <Button variant="outlined">LogIn</Button>
              </Link>
              <Link to='/register'>
                <Button variant="contained">SignUp</Button>
              </Link>
            </>)}
          </div>
        </div>
      </Container>
    </div>
  );
};
