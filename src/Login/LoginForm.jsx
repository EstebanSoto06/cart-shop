import React, { useContext } from "react";
import { GoogleButton } from 'react-google-button'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import "./LoginForm.css";
  
function LoginForm() {

  const navigate = useNavigate();
  const {login} = useContext(AuthContext);

  const handleLogin = async () =>{
      await login()
      navigate('/')
  }

    return (
      <div className="login-form">
        <form>
          <h2>Login</h2>
          <br />
          <br />
           <div className="google-btn">
                <GoogleButton onClick={handleLogin}/>
            </div>
        </form>
      </div>
    );
  }
  
  export default LoginForm;