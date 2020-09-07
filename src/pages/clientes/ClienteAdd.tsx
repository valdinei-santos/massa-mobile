import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, 
  Alert, TouchableOpacity, Platform} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
//import { StackNavigationProp } from '@react-navigation/stack';;
//import { NavigationScreenProp } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
//import moment from 'moment';
import 'moment/locale/pt-br';

//import commonStyles from '../../commonStyles';
import api from '../../services/api';
import { getDataUsuario } from '../../services/storage-usuario';
import { Cliente } from 'src/interfaces/Cliente';
import { Usuario } from 'src/interfaces/Usuario';
import * as alert from '../../components/shared/AlertCustom';

/* type ClienteAddScreenNavigationProp = StackNavigationProp<RootStackParamList,'ClienteAdd'>;
type Props = {
  navigation: ClienteAddScreenNavigationProp;
}; */

/* type ClienteAddScreenRouteProp = RouteProp<RootStackParamList, 'ClienteAdd'>;
type Props = {
  route: ClienteAddScreenRouteProp;
}; */

type ParamList = {
  ClienteAdd: {
    cliente: Cliente;
  };
};


// export default function ClienteAdd() {
const ClienteAdd: React.FC<any> = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ClienteAdd'>>();
  const [user, setUsuario] = useState<Usuario>();
  const [showButton, setShowButton] = useState(false);
  const [cliente, setCliente] = useState<Cliente>();
  //const [idCliente, setIdCliente] = useState(0);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [celular, setCelular] = useState('');
  const [ehEdit, setEhEdit] = useState(false);
  //const [ehUpdate, setEhUpdate] = useState(false);
  const [spinner, setSpinner] = useState(false);


  useEffect(() => {
    getDataUsuario()
      .then((res) => {
        setUsuario(res);
      });
  }, []);

  useEffect(() => {
    console.log('useEffect ClienteAdd');
    if (route.params?.cliente) {
      setCliente(route.params?.cliente);
      montaClienteNaTela(route.params?.cliente);
      setEhEdit(true);
    }
  }, [route.params?.cliente]);

  useEffect(() => {
    onShowButton();
  }, [nome, celular]);

  function montaClienteNaTela(cliente: Cliente) {
    console.log('montaClienteNaTela');
    //console.log('AAA', cliente);
    //setIdCliente(cliente.id);
    setNome(cliente.nome);
    setEndereco(cliente.endereco);
    setCidade(cliente.cidade);
    setCelular(cliente.celular);
  }

  function onShowButton() {
    if ( (nome !== '') && (celular !== '') ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }

  async function createCliente() {
    if (!nome && !celular) {
      alert.alertErro('Preencha todos os campos!!!');
      return;
    }
    const umCliente = { 
      id: cliente?.id,
      nome: nome,
      endereco: endereco,
      cidade: cidade,
      celular: celular,
      fl_ativo: 1,
      user_id: user?.id,
      //ehUpdate: false,
    };
    if (ehEdit) {
      //umCliente.ehUpdate = true; 
      try {
        setSpinner(true);
        const response = await api.put('clientes/' + cliente?.id, umCliente);
        setSpinner(false);
        if (response.status === 200) {
          alert.alertOk('Cliente alterado!');
          navigation.navigate('ClienteList', { umCliente, ehEdit });
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
        const response = await api.post('clientes', umCliente);
        setSpinner(false);
        if (response.status === 201) {
          alert.alertOk('Cliente criado!');
          umCliente.id = response.data.id;
          navigation.navigate('ClienteList', { umCliente, ehEdit });
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      } catch(err) {
        setSpinner(false);
        alert.alertErroOps(err);
        return;
      }
    }
    /* console.log(umCliente);
        const response = await api.post('clientes', umCliente);
        console.log('RESP CLIENTE', response);
        navigation.navigate('ClienteList', { umCliente }); */
  }


  return (
    <KeyboardAvoidingView behavior={(Platform.OS === 'ios' ? 'padding' : 'height') } 
      style={styles.container}>
      <Spinner 
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} />
      <TextInput placeholder='Nome' style={styles.nomeInput}
        onChangeText={nome => setNome(nome)}
        value={nome} />
      <TextInput multiline numberOfLines={Platform.OS === 'ios' ? 0 : 2}  
        placeholder='Endereço' style={styles.nomeInput2Lines}
        onChangeText={endereco => setEndereco(endereco)}
        value={endereco} />
      <TextInput placeholder='Cidade' style={styles.nomeInput}
        onChangeText={cidade => setCidade(cidade)}
        value={cidade} />
      <TextInput placeholder='Celular' style={styles.nomeInput}
        keyboardType='phone-pad'
        onChangeText={celular => setCelular(celular)}
        value={celular} />
      <View style={styles.viewButton}>
        <TouchableOpacity style={{ padding: 10 }} 
          disabled={!showButton} 
          onPress={() => createCliente()}>
          <View style={[styles.button, !showButton ? { backgroundColor: '#AAA' } : {}]}>
            <Text style={styles.buttonText}>{ehEdit ? 'Alterar Cliente' : 'Criar Cliente'}</Text>
          </View>
        </TouchableOpacity>
      </View> 
    </KeyboardAvoidingView>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "#F5FCFF",
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  nomeInput: { // EXEMPLO PARA USO EM OUTROS LUGARES
    width: '95%',
    height: 50,
    marginTop: 10,
    marginLeft: 10,
    fontSize: 25,
    backgroundColor: 'white',
    //borderWidth: 1,
    //borderColor: '#e3e3e3',
    borderColor: '#000',
    borderRadius: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nomeInput2Lines: { // EXEMPLO PARA USO EM OUTROS LUGARES
    width: '95%',
    height: 85,
    marginTop: 10,
    marginLeft: 10,
    fontSize: 25,
    backgroundColor: 'white',
    //borderWidth: 1,
    textAlignVertical: 'top',
    //borderColor: '#e3e3e3',
    borderColor: '#000',
    borderRadius: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
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

});

export default ClienteAdd;
