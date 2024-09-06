
import { useForm } from 'react-hook-form';
import styles from '../styles/style.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import styles from './styles/style.module.css';


const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log('Sign Up Data:', data);
    localStorage.setItem('isSignedUp', 'true');
    navigate('/'); 
  };

  return (
    <div className={styles.maindiv}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formDiv}>
        <h2 className={styles.headingh2}>Sign Up</h2>
        <div className={styles.formMainDiv}>
          <div className={styles.loginForm}>
            <label>Username</label><br/>
            <input 
              {...register('username', { required: 'Username is required' })} 
            />
            {errors.username && <p className={styles.errorMsg}>{errors.username.message}</p>}
          </div>

          <div>
            <label>Email</label><br/>
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
            <label>Password</label><br/>
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

          <div>
            <p>Already have an account? <Link to='/'>Login</Link></p>
          </div>
          
          <button type="submit" className={styles.btnSignup}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
