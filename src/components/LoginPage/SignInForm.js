import React, { useState } from 'react';
import "./Signin.css";
import { useNavigate} from 'react-router-dom';
const SignInForm = () => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    // const [userName, setUserName] = useState('');
    const navigate = useNavigate();
  
    // localStorage.removeItem('token')
  
//   const Onclickhandler = ()=>{
//       navigate('/signin');
//   }
    const Handlesubmit = async (e) => {
  
      e.preventDefault();
      // localStorage.removeItem('token');
  
      try {
        const response = await fetch('http://localhost:4000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userName, password })
        });
         
        if (!response.ok) {
          throw new Error('Login failed');
        }
       const data=await response.json();
        // Handle successful login
        console.log('Login successful');
  
     
        console.log(data);
        // console.log(token)
        localStorage.setItem('token', data.token)
        
        navigate('/home')
  
      } catch (error) {
        console.error('Error during login:', error.message);
      }
    };
  return (
    <form className="account-form" onSubmit={Handlesubmit}>
      <div className="account-form-fields sign-in">
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          required
          value={userName}
          onChange={(e)=>setUserName(e.target.value)}
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div id="subbtn">
        <button className="btn-submit-form" type="submit">
          Sign in
        </button>
      </div>
    </form>
  );
};

export default SignInForm;