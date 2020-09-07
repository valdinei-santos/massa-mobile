import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../contexts/authContext';

//import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  const { logado, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}} >
        <ActivityIndicator size="large" color="#999" />
      </View>
    )
  }

  //return logado ? <AppRoutes /> : <AuthRoutes />
  return <AppRoutes />

}

export default Routes;