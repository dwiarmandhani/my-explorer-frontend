import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/folders'); // Redirect after successful login
        } catch (error) {
            console.error('Login failed:', error);
            const errorMessage = error.response?.data?.message || 'Login failed! Please try again.';
            alert(errorMessage);
        }
    };

    // Inline styles
    const styles = {
        container: {
            maxWidth: '400px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
        },
        heading: {
            textAlign: 'center',
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
        },
        button: {
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
        },
    };

    return (
        <form onSubmit={handleSubmit} style={styles.container}>
            <h2 style={styles.heading}>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
            />
            <button type="submit" style={styles.button}>
                Login
            </button>
        </form>
    );
};

export default Login;
