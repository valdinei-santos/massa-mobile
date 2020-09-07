import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import { navigationRef } from '../RootNavigation';
// import { AuthProvider } from '../contexts/authContext';

import commonStyles from '../commonStyles';
import Main from '../pages/Main';
import PedidoList from '../pages/pedidos/PedidoList';
import PedidoAdd from '../pages/pedidos/PedidoAdd';
import PedidoShow from '../pages/pedidos/PedidoShow';
import ProdutoList from '../pages/produtos/ProdutoList';
import ProdutoAdd from '../pages/produtos/ProdutoAdd';
import ClienteList from '../pages/clientes/ClienteList';
import ClienteAdd from '../pages/clientes/ClienteAdd';
import UsuarioList from '../pages/usuarios/UsuarioList';
import UsuarioAdd from '../pages/usuarios/UsuarioAdd';
import LoteList from '../pages/lotes/LoteList';
import LoteAdd from '../pages/lotes/LoteAdd';
import LoteShow from '../pages/lotes/LoteShow';
import Login from '../pages/login/Login';

/* type RootStackParamList = {
    Home: undefined;
    Profile: { userId: string };
    Feed: { sort: 'latest' | 'top' } | undefined;
}; */

const AppStack = createStackNavigator();

const AppRoutes: React.FC = () => (
  <AppStack.Navigator
    initialRouteName="Login"
    // headerMode="none" // Para tirar a StatusBar do inicio de todas as paginas
    screenOptions={{
      headerStyle: { backgroundColor: commonStyles.colors.maonamassa2 },
      headerTintColor: commonStyles.colors.maonamassa3,
      headerTitleAlign: 'center',
      headerTitleStyle: { fontSize: 30 },
      // cardStyle: { backgroundColor: '#022695' } // Para colocar um background color igual em todas as paginas
      // headerShown: false,
    }}
  >
    <AppStack.Screen name="Login"        component={Login}        options={{ title: 'Mão Na Massa' }} />
    <AppStack.Screen name="Main"         component={Main}         options={{ title: 'Mão Na Massa' }} />
    <AppStack.Screen name="PedidoList"   component={PedidoList}   options={{ title: 'Lista Pedidos' }} />
    <AppStack.Screen name="PedidoAdd"    component={PedidoAdd}    options={{ title: 'Novo Pedido' }} />
    <AppStack.Screen name="PedidoShow"   component={PedidoShow}   options={{ title: 'Detalhe Pedido' }}/>
    <AppStack.Screen name="ProdutoList"  component={ProdutoList}  options={{ title: 'Lista Produtos' }}/>
    <AppStack.Screen name="ProdutoAdd"   component={ProdutoAdd}   options={{ title: 'Novo Produto' }}/>
    <AppStack.Screen name="ClienteList"  component={ClienteList}  options={{ title: 'Lista Clientes' }}/>
    <AppStack.Screen name="ClienteAdd"   component={ClienteAdd}   options={{ title: 'Novo Cliente' }}/>
    <AppStack.Screen name="UsuarioList"  component={UsuarioList}  options={{ title: 'Lista Usuarios' }}/>
    <AppStack.Screen name="UsuarioAdd"   component={UsuarioAdd}   options={{ title: 'Novo Usuario' }}/>
    <AppStack.Screen name="LoteList"     component={LoteList}     options={{ title: 'Lista Lotes' }}/>
    <AppStack.Screen name="LoteAdd"      component={LoteAdd}      options={{ title: 'Novo Lote' }}/>
    <AppStack.Screen name="LoteShow"     component={LoteShow}     options={{ title: 'Detalhe Lote' }}/>
  </AppStack.Navigator>
);

export default AppRoutes;
