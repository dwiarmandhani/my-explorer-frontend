import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FolderDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [folder, setFolder] = useState(null); // State to hold folder data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const folderId = location.state?.folderData?.id || location.pathname.split('/').pop(); // Get the folder ID from the state or URL

    // Function to fetch folder data from API
    const fetchFolderData = async (id) => {
        try {
            const token = localStorage.getItem('token'); // Get token from local storage
            const response = await axios.get(`http://localhost:8000/api/folders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.data) {
                setFolder(response.data.data); // Set folder data from API response
            } else {
                setFolder(null); // Reset folder data if response is empty
            }
        } catch (err) {
            setError('Failed to fetch folder data.'); // Set error message
            console.error(err);
            setFolder(null); // Reset folder data on error
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    useEffect(() => {
        fetchFolderData(folderId); // Fetch folder data when component mounts
    }, [folderId]);

    const handleSubfolderClick = (subfolderId) => {
        navigate(`/folders/${subfolderId}`, {
            state: { folderData: { id: subfolderId } } // Pass only the subfolder ID
        });
    };

    if (loading) {
        return <p style={{ textAlign: 'center', fontSize: '20px' }}>Loading...</p>; // Show loading state
    }

    if (error) {
        return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>; // Display error message
    }

    if (!folder) {
        return <p style={{ textAlign: 'center' }}>No folder data available</p>; // Handle case where folder data is not available
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>{folder.name}</h2>

            <h3 style={{ color: '#555' }}>Files:</h3>
            {folder.files.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No files available in this folder.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    {folder.files.map((file) => (
                        <li key={file.id} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                            <strong>{file.name}</strong> (Size: {file.size} bytes)
                            <br />
                            <span>Size: {file.size / 1024} KB</span>
                            <br />
                            <a href={`http://localhost:8000/storage/${file.path}`} download style={{ color: 'blue', textDecoration: 'underline' }}>
                                Download
                            </a>
                        </li>
                    ))}
                </ul>
            )}

            <h3 style={{ color: '#555' }}>Subfolders:</h3>
            {folder.subfolders.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No subfolders available in this folder.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    {folder.subfolders.map((subfolder) => (
                        <li key={subfolder.id} onClick={() => handleSubfolderClick(subfolder.id)} style={{ cursor: 'pointer', color: 'blue', marginBottom: '10px' }}>
                            {subfolder.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FolderDetails;
