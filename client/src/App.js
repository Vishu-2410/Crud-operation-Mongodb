import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ id: null, name: '', description: '' });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const result = await axios.get('http://localhost:5000/api/items');
            setItems(result.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const addItem = async () => {
        const newItem = { name, description };
        try {
            await axios.post('http://localhost:5000/api/items', newItem);
            fetchItems();
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`);
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const editItem = (item) => {
        setEditing(true);
        setCurrentItem(item);
        setName(item.name);
        setDescription(item.description);
    };

    const updateItem = async () => {
        try {
            await axios.put(`http://localhost:5000/api/items/${currentItem._id}`, {
                name,
                description,
            });
            setEditing(false);
            setCurrentItem({ id: null, name: '', description: '' });
            fetchItems();
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <div className="container">
            <h1>CRUD App</h1>
            <div>
                <h2>{editing ? 'Edit Item' : 'Add Item'}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    editing ? updateItem() : addItem();
                }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button type="submit">
                        {editing ? 'Update' : 'Add'}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                setEditing(false);
                                setCurrentItem({ id: null, name: '', description: '' });
                                setName('');
                                setDescription('');
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>
            <h2>Items</h2>
            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        <span>{item.name} - {item.description}</span>
                        <div>
                            <button onClick={() => editItem(item)}>Edit</button>
                            <button onClick={() => deleteItem(item._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
