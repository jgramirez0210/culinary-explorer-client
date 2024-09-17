import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { registerUser } from '../../utils/auth';

function RegisterForm({ user, updateUser }) {

  const fullName = user.fbUser?.displayName || 'Default Name';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const [formData, setFormData] = useState({
    first_name: firstName,
    last_name: lastName,
    email_address: user.fbUser?.email || '',
    profile_image_url: user.fbUser?.photoURL || '',
    uid: user.uid,
  });

  const router = useRouter();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(formData).then(() => updateUser(user.uid));
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   registerUser(formData)
  //     .then((response) => {
  //       const id = response?.id;

  //       if (id !== undefined && !Number.isNaN(id)) {
  //         const newUser = { ...formData, id };
  //         updateUser(id, newUser);
  //         router.push('/');
  //       } else {
  //         console.error('Registration failed, no valid ID returned');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Registration failed:', error);
  //     });
  // };


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="first_name"
          required
          placeholder="Enter your first name"
          value={formData.first_name}
          onChange={({ target }) => setFormData((prev) => ({ ...prev, [target.name]: target.value }))}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="last_name"
          required
          placeholder="Enter your last name"
          value={formData.last_name}
          onChange={({ target }) => setFormData((prev) => ({ ...prev, [target.name]: target.value }))}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email_address"
          required
          placeholder="Enter your email"
          value={formData.email_address}
          onChange={({ target }) => setFormData((prev) => ({ ...prev, [target.name]: target.value }))}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Profile Image URL</Form.Label>
        <Form.Control
          type="text"
          name="profile_image_url"
          placeholder="Enter your profile image URL"
          value={formData.profile_image_url}
          onChange={({ target }) => setFormData((prev) => ({ ...prev, [target.name]: target.value }))}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

RegisterForm.propTypes = {
  user: PropTypes.shape({
    fbUser: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string,
      photoURL: PropTypes.string,
      uid: PropTypes.string.isRequired,
    }),
  }).isRequired,
  updateUser: PropTypes.func.isRequired,
};
export default RegisterForm;
