import { Usuario } from 'src/interfaces/Usuario';
import { Alert } from 'react-native';
import * as alert from '../components/shared/AlertCustom';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from '../RootNavigation';

   
async function saveUsuario(usuario: Usuario): Promise<void> {
  //console.log('USER PRA SALVAR', usuario);
  console.log('storage-usuario - saveUsuario', usuario);
  try {
    await AsyncStorage.setItem('@MaoNaMassa:usuario', JSON.stringify(usuario))
  } catch (e) {
    alert.alertErro('Erro ao registrar Token do Usuário');
    /* Alert.alert('Aviso',
            'Erro ao registrar Token do Usuário',
            [ { text: 'OK' } ],
            { cancelable: false },
        ); */
  }
}

async function getUsuario(): Promise<Usuario | any> {
  console.log('storage-usuario - getUsuario');
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:usuario');
    if(value !== null && value !== undefined) {
      console.log('storage-usuario - Vai fazer JSON.parse');
      const usuario: Usuario = JSON.parse(value)
      return Promise.resolve(usuario);
    }
    return Promise.resolve(null);
  } catch(e) {
    return Promise.reject(e);
  }
}

async function getDataUsuario() {
  console.log('storage-usuario - getDataUsuario');
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:usuario');
    if(value !== null && value !== undefined) {
      return JSON.parse(value);
    }
    return null;
  } catch(e) {
    alert.alertErro('Não foi possível encontrar os dados do Usuário: ' + e);
    //Alert.alert('Aviso', 'Não foi possível encontrar os dados do Usuário: ' + e);
    return;
  }
}

async function getIdUsuario() {
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:usuario');
    if(value !== null) {
      return JSON.parse(value).id;
    }
  } catch(e) {
    // return e;
    alert.alertErro('Não foi possível encontrar o ID do Usuário');
    //Alert.alert('Aviso', 'Não foi possível encontrar o ID do Usuário');
    return;
  }
}

async function deleteUsuario() {
  console.log('storage-usuario - deleteUsuario');
  try {
    await AsyncStorage.removeItem('@MaoNaMassa:usuario');
    return Promise.resolve();
  } catch(e) {
    return Promise.reject(e);
  }
}

async function deleteUsuarioNavigateLogin() {
  console.log('storage-usuario - deleteUsuarioNavigationLogin');
  try {
    await AsyncStorage.removeItem('@MaoNaMassa:usuario');
    //console.log('Utils - Remove Token');
    RootNavigation.navigate('Login', { });
  } catch(e) {
    Alert.alert(
      'Aviso',
      'Não foi possível excluir o Token do Usuário: ' + e,
      [ { text: 'OK' } ],
      { cancelable: false },
    )
  }
}


// TOKEN
async function saveToken(token: string) {
  //console.log('USER PRA SALVAR', usuario);
  console.log('storage-usuario - saveToken', token);
  try {
    await AsyncStorage.setItem('@MaoNaMassa:usuarioToken', JSON.stringify(token))
  } catch (e) {
    alert.alertErro('Erro ao registrar Token do Usuário');
    /* Alert.alert('Aviso',
            'Erro ao registrar Token do Usuário',
            [ { text: 'OK' } ],
            { cancelable: false },
        ); */
  }
}

async function getToken() {
  console.log('storage-usuario - getToken');
  try {
    const value = await AsyncStorage.getItem('@MaoNaMassa:usuarioToken');
    if(value !== null) {
      return Promise.resolve(value);
    }
  } catch(e) {
    return Promise.reject(e);
  }
}

async function deleteToken() {
  console.log('storage-usuario - deleteToken');
  try {
    await AsyncStorage.removeItem('@MaoNaMassa:usuarioToken');
    return Promise.resolve();
  } catch(e) {
    return Promise.reject(e);
  }
}


export {
  saveUsuario, getUsuario, getDataUsuario, getIdUsuario, deleteUsuario, deleteUsuarioNavigateLogin,
  saveToken, getToken, deleteToken
}
