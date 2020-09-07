import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import { AuthProvider } from './contexts/authContext';
import { ProdutoProvider } from './contexts/produtoContext';
import { ClienteProvider } from './contexts/clienteContext';
import { PedidoProvider } from './contexts/pedidoContext';
import { LoteProvider } from './contexts/loteContext';

import React from 'react';
import Routes from './routes/index';
import { UsuarioProvider } from './contexts/usuarioContext';

const App: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <LoteProvider>
        <PedidoProvider>
          <UsuarioProvider>
            <ProdutoProvider>
              <ClienteProvider>
                <AuthProvider>
                  <Routes />
                </AuthProvider>
              </ClienteProvider>
            </ProdutoProvider>
          </UsuarioProvider>
        </PedidoProvider>
      </LoteProvider>
    </NavigationContainer>
  );
}

export default App;
