import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        '/api/auth/google',
        { idToken: credentialResponse.credential },
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        toast.success('Google login successful');
        navigate('/profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="mt-4">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error('Google Sign In Failed')}
      />
    </div>
  );
}