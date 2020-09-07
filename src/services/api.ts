import axios from 'axios';
import { Alert } from 'react-native';
import * as RootNavigation from '../RootNavigation';
import * as alert from '../components/shared/AlertCustom';
// import * as storageUsuario from './storage-user';
import * as common from '../services/common';
// import Spinner from 'react-native-loading-spinner-overlay';
import { getToken } from './storage-usuario';

const api = axios.create({
  // baseURL: 'http://10.0.1.180:3333',
  // baseURL: 'http://10.0.0.180:3333',
  // baseURL: 'http://api.previg.org.br:80',
  baseURL: 'https://massa-backend.herokuapp.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config.url?.endsWith('login')) {
      return getToken()
        .then((res) => {
          const token = JSON.parse(res!);
          if (token) config.headers.Authorization = `${token}`;
          return Promise.resolve(config);
        })
        .catch((error) => {
          console.log(error);
          return Promise.resolve(config);
        });
    }
    return Promise.resolve(config);
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) =>
  // Do something with response data
    response,
  (error) => {
    // Do something with response error
    // You can even test for a response code
    // and try a new request before rejecting the promise
    if (error.request._hasError === true && error.request._response.includes('connect')) {
      Alert.alert('Aviso',
        'Não foi possível conectar aos nossos servidores, sem conexão a internet');
    }

    if (error.response.status === 401) {
      console.log('Entrou erro 401');
      const requestConfig = error.config;
      alert.alertErro('Falha no acesso. Refaça o Login');
      RootNavigation.navigate('Login', { });
      common.cleanToken();

      return axios(requestConfig);
    }
    // console.log(error.response);
    return Promise.reject(error);
  },
);

export default api;
