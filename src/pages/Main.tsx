import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Text, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/authContext';

// import { deleteUsuarioNavigateLogin, deleteToken } from '../services/storage-user';
import Icon from 'react-native-vector-icons/FontAwesome5';
//import Icon from 'react-native-vector-icons/Feather';
import commonStyles from '../commonStyles';
// @ts-ignore
import logoImg from '../assets/logo-mao-na-massa.jpeg';

import moment from 'moment';
import 'moment/locale/pt-br';
import './pedidos/PedidoList';
import './produtos/ProdutoList';
import './clientes/ClienteList';

// export default class Main extends Component {
const Main: React.FC = () => {
  const navigation = useNavigation();
  const { logado, user, signOut} = useAuth();
  //const [user, setUsuario] = useState({});

  /* static navigationOptions = {
        title: "Mão na Massa"
    }; */

  /* constructor(props) {
        super(props);
        console.log('constructor Main');
    } */

  useEffect(() => {
    navigation.setOptions({title: user?.nome});
    /* getDataUsuario()
            .then((res) => {
                navigation.setOptions({title: res.nome});
                setUsuario(res);
            }); */
  }, [])

  function goPedidos() {
    console.log('Main - goPedidos');
    navigation.navigate('PedidoList', { });
    // this.props.navigation.navigate('PedidoList', {});
  }

  function goProdutos() {
    console.log('Main - goProdutos');
    navigation.navigate('ProdutoList', { });
    // this.props.navigation.navigate('ProdutoList', {});
  }

  function goClientes() {
    console.log('Main - goClientes');
    navigation.navigate('ClienteList', { });
  }

  function goLotes() {
    console.log('Main - goLotes');
    navigation.navigate('LoteList', { });
  }

  function goUsuarios() {
    console.log('Main - goUsuarios');
    navigation.navigate('UsuarioList', { });
  }

  function logout() {
    //deleteUsuarioNavigateLogin();
    //deleteToken();
    signOut();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewContainer}>
        <StatusBar barStyle="light-content" backgroundColor={commonStyles.colors.maonamassa2} />
        <Image 
          style={{
            borderRadius: 110,
            width: 180,
            height: 180,
          }} 
          source={logoImg} />
        <View style={styles.line}>
          <TouchableOpacity style={[styles.touchableButton, styles.buttonBlue]} onPress={goPedidos}>
            <Icon name="file" size={20} color="white" style={styles.icone} />
            <Text style={styles.button}>
                        Pedidos
            </Text>
          </TouchableOpacity>
          { user?.fl_admin === 1 &&
                    <TouchableOpacity style={[styles.touchableButton, styles.buttonPurple]} onPress={goLotes}>
                      <Icon name="truck" size={20} color="white" style={styles.icone} />
                      <Text style={styles.button}>
                            Lotes
                      </Text>
                    </TouchableOpacity>
          }
        </View>
        <View style={styles.line}>
          <TouchableOpacity style={[styles.touchableButton, styles.buttonRed]} onPress={goClientes}>
            <Icon name="user-alt" size={20} color="white" style={styles.icone} />
            <Text style={styles.button}>
                        Clientes
            </Text>
          </TouchableOpacity>
          { user?.fl_admin === 1 &&
                    <TouchableOpacity style={[styles.touchableButton, styles.buttonGreen]} onPress={goProdutos}>
                      <Icon name="pizza-slice" size={20} color="white" style={styles.icone} />
                      <Text style={styles.button}>
                            Produtos
                      </Text>
                    </TouchableOpacity>
          }
        </View>
        {/* <View style={styles.line}>
                <TouchableOpacity style={[styles.touchableButton, styles.buttonMagenta]} onPress={goVendedores}>
                    <Icon name="user-alt" size={20} color="white" style={styles.icone} />
                    <Text style={styles.button}>
                        Vendedores
                    </Text>
                </TouchableOpacity>
            </View> */}
        {/* <View style={styles.line}>
                <TouchableOpacity style={[styles.touchableButton, styles.buttonMagenta]} onPress={goVendedores}>
                    <Icon name="user" size={20} color="white" style={styles.icone} />
                    <Text style={styles.button}>
                        Vendedores
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.touchableButton, styles.buttonBlue]} onPress={logout}>
                    <Text style={styles.button}>
                        Sair
                    </Text>
                </TouchableOpacity>
            </View> */}

        <View style={styles.line}>
          { user?.fl_admin === 1 && 
            <TouchableOpacity style={[styles.touchableButton, styles.buttonOrange]} onPress={goUsuarios}>
              <Icon name="user" size={20} color="white" style={styles.icone} />
              <Text style={styles.button}>
                Usuários
              </Text>
            </TouchableOpacity>
          }
          <TouchableOpacity style={[styles.touchableButton, styles.buttonMagenta]} onPress={logout}>
            <Icon name="door-open" size={20} color="white" style={styles.icone} />
            <Text style={styles.button}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Por padrão no Mobile é "column" e no Web é "row" 
    //backgroundColor: "#F5FCFF",
    backgroundColor: commonStyles.colors.maonamassa2,
    paddingTop: 20,
  },
  viewContainer: {
    alignItems: "center",
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
    //backgroundColor: 'yellow'
  },
  touchableButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    margin: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 30,
    //backgroundColor: 'pink',
  },
  icone: {
    //paddingRight: 35,
    //backgroundColor: 'red',
    paddingRight: 10
  },
  button: {
    // fontFamily: commonStyles.fontFamily,
    fontSize: 27,
    paddingTop: 25,
    paddingBottom: 25,
    //margin: 20,
    textAlign: 'center',
    color: 'white',
    //height: 55,
    //width: 300,
    //borderRadius: 20,
  },
  buttonBlue: {
    backgroundColor: 'blue',
  },
  buttonGreen: {
    backgroundColor: 'green',
  },
  buttonRed: {
    backgroundColor: 'red',
  },
  buttonPurple: {
    backgroundColor: 'purple',
  },
  buttonMagenta: {
    backgroundColor: 'magenta',
  },
  buttonOrange: {
    backgroundColor: 'orange',
  },
  buttonGray: {
    backgroundColor: 'gray',
  },
    
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },    

});

export default Main;