import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const useRequireAuth = () => {
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
    }
  }, [history]);

  return;
};

export default useRequireAuth;
