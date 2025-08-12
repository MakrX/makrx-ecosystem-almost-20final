import { ReactElement } from 'react';
import { login, isAuthenticated } from '../lib/auth';

interface Props {
  children: ReactElement;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  if (isAuthenticated()) {
    return children;
  }
  login();
  return null;
};

export default ProtectedRoute;
