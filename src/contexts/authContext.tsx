import React, { createContext, useState, useEffect, useContext } from 'react';
import * as RootNavigation from '../RootNavigation';

import * as storageUsuario from '../services/storage-usuario';
// import * as alert from '../components/shared/AlertCustom';
import * as common from '../services/common';
import { Usuario } from '../interfaces/Usuario';
import api from '../services/api';
// import jwtDecode from 'jwt-decode';

interface AuthContextData {
  logado: boolean;
  user: Usuario | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<Response>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('AuthProvider - useEffect - Entrou');
    async function loadStoragedData() {
      const storagedUsuario = await storageUsuario.getUsuario();
      const storagedToken = await storageUsuario.getToken();
      console.log('AuthProvider - useEffect ', storagedUsuario, storagedToken);
      if (storagedUsuario && storagedToken) {
        if (common.verifyToken(storagedToken)) {
          setUsuario(storagedUsuario);
          RootNavigation.navigate('Main', {umUsuario: user});
          setLoading(false);
        } else {
          RootNavigation.navigate('Login', {});
        }
      }
    }
    loadStoragedData();
  }, []);

  async function signIn(email: string, password: string): Promise<any> {
    console.log('AuthProvider - signIn');
    try {
      const response = await api.post('login', { email, password });
      // console.log('AuthProvider - signIn 2', response);
      // const response = await auth.login(email, password);

      const { token, id, admin: fl_admin, nome, email: email_resp, } = response.data;
      const userData: Usuario = {
        id,
        fl_admin,
        nome,
        email: email_resp,
      };
      setUsuario(userData);
      await storageUsuario.saveUsuario(userData);
      await storageUsuario.saveToken(token);
      return response;
    } catch (err) {
      throw 'API não responde';
    }

    // console.log(response);
  }

  function signOut() {
    console.log('AuthProvider - signOut');
    // storageUsuario.deleteUsuario
    storageUsuario.deleteToken();
    storageUsuario.deleteUsuarioNavigateLogin();
    // setUsuario(null); // Tirei porque ficava aparecendo os botoes de usuario vendedor quando dava sair
  }

  return (
    <AuthContext.Provider
      value={{ logado: !!user, user, signIn, signOut, loading }} 
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

// export default AuthContext;
