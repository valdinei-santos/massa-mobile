import jwtDecode from 'jwt-decode';

import * as alert from '../components/shared/AlertCustom';
import * as storageUsuario from './storage-usuario';

function verifyToken(token: string): boolean {
  try {
    const decode = JSON.parse(jwtDecode(token));
    let current_time = Date.now() / 1000;
    if (decode.exp < current_time) {
      storageUsuario.deleteToken();
      alert.alertErro('Token expirou. Refaça o Login');
      storageUsuario.deleteUsuario();
      /* storageUsuario.deleteUsuario()
                .then(() => {
                    console.log('Passou deleteUsuario');
                    //RootNavigation.navigate('Login', { });
                }); */
      return false;
    } 
    return true;       
  } catch(e) {
    //alert.alertErroOps('Erro na verificação do Token');
    return false;
  }
}

function cleanToken() {
  storageUsuario.deleteToken();
  storageUsuario.deleteUsuario();
}


export { verifyToken, cleanToken }