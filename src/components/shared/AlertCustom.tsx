import { Alert, Platform, ToastAndroid } from 'react-native';
   
function alertErro(msg: string) {
  Alert.alert('', msg);
  /* if (Platform.OS === 'ios') {
        Alert.alert(title, msg);
    } else {
        ToastAndroid.showWithGravity(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
    } */ 
}

function alertErroOps(msg: string) {
  Alert.alert('Ops! Ocorreu um Problema', msg);
}

function alertOk(msg: string) {
  if (Platform.OS === 'ios') {
    Alert.alert('', msg);
  } else {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  } 
}

function showError(err: string) {
  Alert.alert('Ops! Ocorreu um Problema!', err);
}

function showSuccess(msg: string) {
  Alert.alert('Sucesso!', msg);
}

export { alertErro, alertErroOps, alertOk, showError, showSuccess };
