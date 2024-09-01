import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { registerUser } from '../utils/auth';

function RegisterForm({ user, updateUser }) {
  useEffect(() => {
    const formData = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      uid: user.uid,
    };

    registerUser(formData).then(() => updateUser(user.uid));
  }, [user, updateUser]);

  return null;
}

RegisterForm.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    uid: PropTypes.string.isRequired,
  }).isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default RegisterForm;
