import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileSettings from './ProfileSettings';

const Account = () => {
  const { user, login } = useAuth();
  return (
    <div className="w-full">
      <ProfileSettings user={user?.user || {}} login={login} />
    </div>
  );
};

export default Account;
