
import { useForm } from 'react-hook-form';
import styles from '../styles/style.module.css'

import { Link, useNavigate } from 'react-router-dom';


const SignUp = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
 
  const onSubmit = (data) => {
    console.log('Sign Up Data:', data);
  };
const navigate = useNavigate()
const navigateToLogin = () => {
  navigate('/login')
}

  return (
    <>
   
 <div className={styles.maindiv}>
 <h2>Sign Up</h2>
 <form onSubmit={handleSubmit(onSubmit)} className={styles.formDiv}>
   <div className={styles.formMainDiv}>
   <div className={styles.loginForm}>
     <label>Username</label><br/>
     <input 
       {...register('username', { required: 'Username is required' })} 
     />
     {errors.username && <p>{errors.username.message}</p>}
   </div >

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
     {errors.email && <p>{errors.email.message}</p>}
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
     {errors.password && <p>{errors.password.message}</p>}
   </div>
  
<div>
  <p>Already have an account? <Link to='/login'>Login</Link></p>
</div>
   <button onClick={navigateToLogin} type="submit" className={styles.btnSignup}>Sign Up</button>
   </div>
 </form>
</div>
   
   
    </>
  );
};

export default SignUp;
