import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState(''); // State for password confirmation
    const [message, setMessage] = useState(''); // State for success message
    const [error, setError] = useState('');     // State for error message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');  // Clear any previous messages
        setError('');    // Clear any previous errors
        try {
            // Sending the registration request along with password_confirmation
            await axios.post('http://localhost:8000/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation, // Added password confirmation
            });
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login'); // Redirect to login after successful registration
            }, 2000);  // 2 seconds delay before redirecting
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Registration failed!');
            } else {
                setError('Something went wrong. Please try again.');
            }
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
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        },
        heading: {
            textAlign: 'center',
            marginBottom: '20px',
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
        message: {
            color: 'green',
            textAlign: 'center',
            marginBottom: '10px',
        },
        error: {
            color: 'red',
            textAlign: 'center',
            marginBottom: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Register</h2>
            {message && <div style={styles.message}>{message}</div>} {/* Display success message */}
            {error && <div style={styles.error}>{error}</div>}      {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Register</button>
            </form>
        </div>
    );
};

export default Register;
