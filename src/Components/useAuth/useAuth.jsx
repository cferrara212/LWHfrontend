import React from 'react';
import { AuthContext } from '../../services/AUTH-Context';

const useAuth = () => {
    return React.useContext(AuthContext);
}

export default useAuth;