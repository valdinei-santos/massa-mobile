import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity, Switch, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../../commonStyles';
import api from '../../services/api';
import { Usuario } from 'src/interfaces/Usuario';
import * as alert from '../../components/shared/AlertCustom';

//import { AsyncStorage, DateTimePicker } from '@react-native-community';

// const initialState = { id: null, dt_pedido: new Date(), usuario: '', status: 1, };

type ParamList = {
  UsuarioAdd: {
    usuario: Usuario;
  };
};

//export default function UsuarioAdd() {
const UsuarioAdd: React.FC<any> = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'UsuarioAdd'>>();
  const [showButton, setShowButton] = useState(false);
  const [usuario, setUsuario] = useState<Usuario>();
  //const [idUsuario, SetIdUsuario] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [passwordUsuario, setPasswordUsuario] = useState('');
  const [ehAdmin, setEhAdmin] = useState(false);
  const [ehVendedor, setEhVendedor] = useState(false);
  const [ehUsuario, setEhUsuario] = useState(false);
  const [ehEdit, setEhEdit] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    console.log('useEffect UsuarioAdd');
    if (route.params?.usuario) {
      montaUsuarioNaTela(route.params?.usuario);
      setEhEdit(true);
    }
  }, [route.params?.usuario]);

  useEffect(() => {
    onShowButton();
  }, [nomeUsuario, emailUsuario, passwordUsuario, ehAdmin, ehVendedor, ehUsuario]);

  function montaUsuarioNaTela(usuario: Usuario) {
    console.log('montaUsuarioNaTela');
    setNomeUsuario(usuario.nome);
    setEmailUsuario(usuario.email);
    //setPasswordUsuario(usuario.password!);
    setEhAdmin(usuario.fl_admin === 0 ? false : true);
    setEhVendedor(usuario.fl_vendedor === 0 ? false : true);
    setEhUsuario(usuario.fl_usuario === 0 ? false : true);
  }

  function onShowButton() {
    if ( (nomeUsuario !== '') && (emailUsuario !== '') && (passwordUsuario !== '') 
         && (ehAdmin || ehVendedor || ehUsuario)
    ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }

  async function createUsuario() {
    if (!nomeUsuario && !emailUsuario && !passwordUsuario || (!ehAdmin && !ehVendedor && !ehUsuario)) {
      Alert.alert('Preencha todos os campos!!!', '');
      return;
    }
    if (ehAdmin && ehVendedor || (ehAdmin && ehUsuario) || (ehVendedor && ehUsuario) ) {
      Alert.alert('Só é permitido um tipo de usuário!!!', '');
      return;
    }
    const umUsuario = { 
      id: usuario?.id,
      nome: nomeUsuario,
      email: emailUsuario,
      password: passwordUsuario,
      fl_admin: ehAdmin ? 1 : 0,
      fl_vendedor: ehVendedor ? 1 : 0,
      fl_usuario: ehUsuario ? 1 : 0,
      fl_ativo: 1,
    };
    console.log('UsuarioAdd - createUsuario', umUsuario );
    if (ehEdit) {
      //umUsuario.ehUpdate = true; 
      try {
        setSpinner(true);
        const response = await api.put('users/' + usuario?.id, umUsuario);
        setSpinner(false);
        if (response.status === 200) {
          alert.alertOk('Usuario alterado!');
          navigation.navigate('UsuarioList', { umUsuario, ehEdit });
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      } catch(err) {
        setSpinner(false);
        alert.alertErroOps(err);
        return;
      }
    } else {
      try {
        setSpinner(true);
        const response = await api.post('user/register', umUsuario);
        setSpinner(false);
        //console.log('UsuarioAdd - RESPONSE: ', response)
        if (response.status === 201) {
          alert.alertOk('Usuario criado!');
          umUsuario.id = response.data.id;
          navigation.navigate('UsuarioList', { umUsuario, ehEdit });
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      } catch(err) {
        setSpinner(false);
        alert.alertErroOps(err);
        return;
      }
    }
  }
  
  const toggleSwitchAdmin = () => setEhAdmin(previousState => !previousState);
  const toggleSwitchVendedor = () => setEhVendedor(previousState => !previousState);
  const toggleSwitchUsuario = () => setEhUsuario(previousState => !previousState);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}>  
      <ScrollView contentContainerStyle={styles.scrollView}>    
        <TextInput placeholder='Nome' style={styles.nomeInput}
          onChangeText={nomeUsuario => setNomeUsuario(nomeUsuario)}
          value={nomeUsuario} />
        <TextInput placeholder='E-mail' style={styles.nomeInput}
          onChangeText={emailUsuario => setEmailUsuario(emailUsuario)}
          value={emailUsuario} />
        { !ehEdit &&
          <TextInput placeholder='Senha' style={styles.nomeInput} secureTextEntry={true}
            onChangeText={passwordUsuario => setPasswordUsuario(passwordUsuario)}
            value={passwordUsuario} />
        }
        <View style={styles.viewSwitchs}>
          <Text style={styles.textSwitch}>Tipo de Usuário:</Text>
          <View style={styles.viewUmSwitch}>
            <Switch style={styles.lineSwitch}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              //thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              thumbColor="#f5dd4b"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchAdmin}
              value={ehAdmin}
            />
            <Text style={styles.textSwitch}>Administrador</Text>
          </View> 
          <View style={styles.viewUmSwitch}>
            <Switch style={styles.lineSwitch}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor="#f5dd4b"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchVendedor}
              value={ehVendedor}
            />
            <Text style={styles.textSwitch}>Vendedor</Text>
          </View> 
          <View style={styles.viewUmSwitch}>
            <Switch style={styles.lineSwitch}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor="#f5dd4b"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchUsuario}
              value={ehUsuario}
            />
            <Text style={styles.textSwitch}>Usuário</Text>
          </View>
        </View>
        <View style={styles.viewButton}>
          <TouchableOpacity style={{ padding: 10 }} 
            disabled={!showButton} 
            onPress={() => createUsuario()}>
            <View style={[styles.button, !showButton ? { backgroundColor: '#AAA' } : {}]}>
              <Text style={styles.buttonText}>{ehEdit ? 'Alterar Usuario' : 'Criar Usuario'}</Text>
            </View>
          </TouchableOpacity>
        </View> 
      </ScrollView>
    </KeyboardAvoidingView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "flex-start",
    backgroundColor: "#F5FCFF",
    //backgroundColor: "red",
  },
  scrollView: {
    flex: 1,
    //alignItems: "flex-start", 
    //justifyContent: "flex-start",
    //backgroundColor: "yellow",
  },
  nomeInput: { // EXEMPLO PARA USO EM OUTROS LUGARES
    width: '95%',
    height: 50,
    marginTop: 10,
    marginLeft: 10,
    fontSize: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    //borderColor: '#e3e3e3',
    borderColor: '#000',
    borderRadius: 6,
  },
  viewButton: {
    width: '100%',
    height: 55,
  },
  button: {
    backgroundColor: '#00F',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    //fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 23
  },
  viewSwitchs: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 20,
  },
  viewUmSwitch: {
    flexDirection: 'row',
  },
  textSwitch: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 20,
  },
  lineSwitch: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 20,
  },

});

export default UsuarioAdd;
