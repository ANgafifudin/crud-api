import React, { useEffect, useState } from 'react';
import { Carousel, Container, Button } from 'react-bootstrap';
import axios from 'axios';

const CarouselUser = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUsers, setEditedUsers] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('https://64c111a2fa35860bae9fe3d9.mockapi.io/api/v1/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  };

  const handleDeleteUser = (id) => {
    axios.delete(`https://64c111a2fa35860bae9fe3d9.mockapi.io/api/v1/users/${id}`)
      .then(() => fetchUsers())
      .catch((error) => console.error(error));
  };

  const handleCreateUser = () => {
    const newUser = {
      name: "",
      email: "",
      universitas: "",
      testimonial: "",
      foto: "https://via.placeholder.com/300x200?text=New+User",
    };

    axios.post('https://64c111a2fa35860bae9fe3d9.mockapi.io/api/v1/users', newUser)
      .then(() => fetchUsers())
      .catch((error) => console.error(error));
  };

  const handleEditUser = (id) => {
    setEditingUserId(id);
    setEditedUsers({});
  };

  const handleEditChange = (id, field, value) => {
    setEditedUsers({
      ...editedUsers,
      [id]: {
        ...editedUsers[id],
        [field]: value,
      },
    });
  };

  const handleSaveUser = (id) => {
    const updatedUser = editedUsers[id];
    if (!updatedUser) return; // No changes

    axios.put(`https://64c111a2fa35860bae9fe3d9.mockapi.io/api/v1/users/${id}`, updatedUser)
      .then(() => {
        setEditingUserId(null);
        setEditedUsers({});
        fetchUsers();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Container>
      <Carousel>
        {users.map((user) => (
          <Carousel.Item key={user.id}>
            <img
              className="d-block w-100"
              src={user.photo}
              alt={user.name}
              style={{ maxHeight: "300px" }}
            />
            <Carousel.Caption>
              {editingUserId === user.id ? (
                <>
                  <input
                    type="text"
                    placeholder="isikan nama"
                    value={editedUsers[user.id]?.name || user.name}
                    onChange={(e) => handleEditChange(user.id, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="isikan url photo"
                    value={editedUsers[user.id]?.photo || user.photo}
                    onChange={(e) => handleEditChange(user.id, 'photo', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="isikan universitas"
                    value={editedUsers[user.id]?.universitas || user.universitas}
                    onChange={(e) => handleEditChange(user.id, 'universitas', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="isikan email"
                    value={editedUsers[user.id]?.email || user.email}
                    onChange={(e) => handleEditChange(user.id, 'email', e.target.value)}
                  />
                  <textarea
                    value={editedUsers[user.id]?.testimonial || user.testimonial}
                    placeholder="isikan testimonial"
                    onChange={(e) => handleEditChange(user.id, 'testimonial', e.target.value)}
                  />
                  <Button variant="success" onClick={() => handleSaveUser(user.id)}>Save</Button>
                  <Button variant="secondary" onClick={() => setEditingUserId(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <h3>{user.name}</h3>
                  <p>{user.universitas}</p>
                  <p>{user.email}</p>
                  <p>{user.testimonial}</p>
                  <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                  <Button variant="info" onClick={() => handleEditUser(user.id)}>Edit</Button>
                </>
              )}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      <Button variant="primary" onClick={handleCreateUser}>Add New User</Button>
    </Container>
  );
};

export default CarouselUser;
