import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Recursive component to display folders and their subfolders
const FolderItem = ({ folder, handleFolderClick, isOpen, toggleFolder }) => {
    const styles = {
        item: {
            margin: '5px 0',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: isOpen ? '#e9ecef' : 'transparent',
            borderRadius: '4px',
        },
        icon: {
            marginRight: '8px',
            cursor: 'pointer',
        },
        name: {
            color: '#007bff',
        },
        subfolderList: {
            paddingLeft: '20px',
        },
        fileList: {
            paddingLeft: '40px', // Indent files under the folder
            listStyleType: 'none',
        },
        fileItem: {
            padding: '5px',
            cursor: 'default',
            color: '#333',
        },
    };

    return (
        <li key={folder.id}>
            <div style={styles.item}>
                <span 
                    onClick={toggleFolder} 
                    style={styles.icon}>
                    {isOpen ? '▼' : '►'}
                </span>
                <span 
                    onClick={() => handleFolderClick(folder.id)} 
                    style={styles.name}
                >
                    {folder.name}
                </span>
            </div>
            {isOpen && folder.subfolders && folder.subfolders.length > 0 && (
                <ul style={styles.subfolderList}>
                    {folder.subfolders.map((subfolder) => (
                        <FolderItem 
                            key={subfolder.id} 
                            folder={subfolder} 
                            handleFolderClick={handleFolderClick} 
                            isOpen={subfolder.isOpen} 
                            toggleFolder={subfolder.toggleFolder} 
                        />
                    ))}
                </ul>
            )}
            {/* New section for displaying files */}
            {isOpen && folder.files && folder.files.length > 0 && (
                <ul style={styles.fileList}>
                    {folder.files.map(file => (
                        <li key={file.id} style={styles.fileItem}>
                            {file.name} - {file.size} bytes
                            <a href={`http://localhost:8000/storage/${file.path}`} download style={{ color: 'blue', textDecoration: 'underline' }}>
                                Download
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

const FolderList = () => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/folders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.data) {
                    const foldersWithState = response.data.data.map(folder => ({
                        ...folder,
                        isOpen: false,
                    }));
                    setFolders(foldersWithState);
                } else {
                    setFolders([]);
                }
            } catch (err) {
                setError('Failed to fetch folders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, []);

    const handleFolderClick = async (folderId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://127.0.0.1:8000/api/folders/${folderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.status === 'success') {
                navigate(`/folders/${folderId}`, { state: { folderData: response.data.data } });
            }
        } catch (err) {
            console.error('Error fetching folder details:', err);
            setError('Failed to fetch folder details.');
        }
    };

    const toggleFolder = (folderId) => {
        setFolders(prevFolders =>
            prevFolders.map(folder => {
                if (folder.id === folderId) {
                    return { ...folder, isOpen: !folder.isOpen };
                }
                return folder;
            })
        );
    };

    const openModal = (folderId) => {
        setSelectedFolderId(folderId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedFolderId(null);
        setFile(null);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder_id', selectedFolderId);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/files/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            // Optionally, you could close the modal or update UI here
        } catch (err) {
            console.error('Error uploading file:', err);
            setError('Failed to upload file.');
        } finally {
            closeModal();
        }
    };

    if (loading) {
        return <p>Loading folders...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
        }}>
            <h2 style={{ color: '#333' }}>Folder List</h2>
            {folders.length === 0 ? (
                <p>No folders available</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left' }}>
                    {folders.map((folder) => (
                        <FolderItem 
                            key={folder.id} 
                            folder={folder} 
                            handleFolderClick={handleFolderClick} 
                            isOpen={folder.isOpen} 
                            toggleFolder={() => toggleFolder(folder.id)} 
                        />
                    ))}
                </ul>
            )}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}>
                    <h3>Upload File</h3>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleFileUpload}>Upload</button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
            )}
            <button onClick={() => openModal(null)}>Add File</button>
        </div>
    );
};

export default FolderList;
