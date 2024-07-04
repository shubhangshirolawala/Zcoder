import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [avatar, setAvatar] = useState(null);

    const navigate = useNavigate();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('userName', userName);
        if (avatar) {
          formData.append('avatar', avatar);
        }
        console.log(avatar)
        try {
            const response = await fetch('http://localhost:4000/api/v1/auth/register', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            console.log(data);
            localStorage.setItem('token', data.token);

            console.log('Registration successful');
            navigate('/signin');

        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    };

    return (
        <form className="account-form" onSubmit={HandleSubmit}>
            <div className="account-form-fields sign-up">
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                />
            </div>
            <div id="subbtn">
                <button className="btn-submit-form" type="submit">
                    Sign up
                </button>
            </div>
        </form>
    );
};

export default SignUpForm;
