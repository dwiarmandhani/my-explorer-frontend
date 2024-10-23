import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import FolderList from './components/FolderList';
import FolderDetails from './components/FolderDetails';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/folders" element={<FolderList />} />
                <Route path="/folders/:id" element={<FolderDetails />} /> {/* Route for folder details */}
            </Routes>
        </Router>
    );
};

export default App;
