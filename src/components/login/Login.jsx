import { useForm } from 'react-hook-form';
import styles from '../styles/style.module.css';
import { useNavigate } from 'react-router-dom';
import HomePage from '../HomePage';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isAuthenticated , setIsAuthenticated] = useState(false)
  const navigate = useNavigate();
 
  const loginwithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });
        console.log(res.data);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setIsAuthenticated(true);
        navigate('/homepage');
      } catch (err) {
        console.log(err);
      }
    },
  });
  
    

  const onSubmit = (data) => {
    console.log('Login Data:', data);
    const isSignedUp = localStorage.getItem('isSignedUp');

    if (isSignedUp) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/homepage');
    } else {
      alert('Please sign up first.');
      navigate('/signup');
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <HomePage/>
      ) : (
        <div className={styles.maindiv}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.formDiv}>
            <h2 className={styles.headingh2}>Login</h2>
            <div className={styles.formMainDiv}>
              <div>
                <label>Email</label>
                <input 
                  type="email" 
                  {...register('email', { 
                    required: 'Email is required', 
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: 'Invalid email address',
                    }
                  })} 
                />
                {errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>}
              </div>

              <div>
                <label>Password</label>
                <input 
                  type="password" 
                  {...register('password', { 
                    required: 'Password is required', 
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    }
                  })} 
                />
                {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}
              </div>

              <div className={styles.loginFormOr}>
                <p></p>
                <h6>Or</h6>
                <p></p>
              </div>

              <div className={styles.loginFormWith} onClick={() => loginwithGoogle()}>
                <p className={styles.paraWith}>Login with</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18" fill="none">
                  <path d="M17.3585 8.88589C17.3585 8.30277 17.3116 7.71965 17.2178 7.14844H9.25781V10.4448H13.8181C13.6305 11.504 13.0209 12.456 12.13 13.051V15.1931H14.8497C16.4441 13.7055 17.3585 11.504 17.3585 8.88589Z" fill="#4285F4"/>
                  <path d="M9.25672 17.2619C11.531 17.2619 13.4536 16.5003 14.8486 15.1913L12.1289 13.0492C11.3669 13.5728 10.3939 13.8703 9.25672 13.8703C7.05277 13.8703 5.18879 12.359 4.52058 10.3359H1.71875V12.5494C3.14897 15.4412 6.06803 17.2619 9.25672 17.2619Z" fill="#34A853"/>
                  <path d="M4.52053 10.3376C4.16878 9.27849 4.16878 8.12416 4.52053 7.05313V4.85156H1.71826C0.510582 7.26733 0.510582 10.1234 1.71826 12.5392L4.52053 10.3376Z" fill="#FBBC04"/>
                  <path d="M9.25672 3.51711C10.4642 3.49331 11.6248 3.95743 12.4923 4.80235L14.9073 2.35088C13.3715 0.89904 11.3552 0.101717 9.25672 0.125518C6.06803 0.125518 3.14897 1.95817 1.71875 4.84995L4.52058 7.06341C5.18879 5.02846 7.05277 3.51711 9.25672 3.51711Z" fill="#EA4335"/>
                </svg>
              </div>
             
              <div>
                <p>Didn't have an account? <Link to='/signup'>Sign Up</Link></p>
              </div>

              <button type="submit" className={styles.btnSignup}>
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
