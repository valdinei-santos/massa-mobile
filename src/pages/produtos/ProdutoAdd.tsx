import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, TextInput, Alert, 
  TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../../commonStyles';

import api from '../../services/api';
import { Produto } from 'src/interfaces/Produto';
import * as alert from '../../components/shared/AlertCustom';

type ParamList = {
  ProdutoAdd: {
    produto: Produto;
  };
};

//export default function ProdutoAdd() {
const ProdutoAdd: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ProdutoAdd'>>();
  const [showButton, setShowButton] = useState(false);
  const [produto, setProduto] = useState<Produto>({} as Produto);
  const [nome, setNome] = useState('');
  const [sabor, setSabor] = useState('');
  const [peso, setPeso] = useState('');
  const [preco_unidade, setPrecoUnidade] = useState('');
  const [qtd_embalagem, setQtdEmbalagem] = useState('');
  //const [status, setStatus] = useState(1);
  const [ehEdit, setEhEdit] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    console.log('useEffect ProdutoAdd');
    if (route.params?.produto) {
      console.log(route.params?.produto);
      navigation.setOptions({title: 'Alteração Produto'});
      setProduto(route.params?.produto);
      montaProdutoNaTela(route.params?.produto);
      setEhEdit(true);
    }
  }, [route.params?.produto]);

  useEffect(() => {
    onShowButton();
  }, [nome, sabor, peso, preco_unidade, qtd_embalagem ]);

  function montaProdutoNaTela(produto: Produto) {
    console.log('montaProdutoNaTela');
    //setIdProduto(produto.id);
    setNome(produto.nome);
    setSabor(produto.sabor);
    setPeso(produto.peso);
    console.log(typeof(produto.preco_unidade));
    let precoUnidade;
    if (typeof(produto.preco_unidade) !== 'string') {
      precoUnidade = String(produto.preco_unidade.toFixed(2)).replace('.', ',');
    } else {
      precoUnidade = String(Number(produto.preco_unidade).toFixed(2));
    }
    setPrecoUnidade(precoUnidade);
    //setPrecoUnidade(String(produto.preco_unidade.toFixed(2)).replace('.',','));
    setQtdEmbalagem(String(produto.qtd_embalagem));
    //setStatus(produto.status_id);
  }

  function onShowButton() {
    if ( (nome !== '') && (sabor !== '') && (preco_unidade !== '') ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }

  async function createProduto() {
    //const data = { ...this.state };
    if (!nome && !sabor && !preco_unidade) {
      //Alert.alert('Preencha todos os campos!!!', '');
      alert.alertErro('Preencha todos os campos!!!');
      return;
    }
    const umProduto = { 
      id: produto.id,
      nome: nome,
      sabor: sabor,
      peso: peso,
      preco_unidade: Number(preco_unidade.replace(',','.')).toFixed(2),
      qtd_embalagem: qtd_embalagem,
      fl_ativo: 1,
      //ehUpdate: false,
    };
    if (ehEdit) {
      //umProduto.ehUpdate = true;
      try {
        setSpinner(true);
        const response = await api.put('produtos/' + produto.id, umProduto);
        setSpinner(false);
        if (response.status === 200) {
          alert.alertOk('Produto alterado!!!');
          navigation.navigate('ProdutoList', { umProduto, ehEdit });
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
        const response = await api.post('produtos', umProduto);
        setSpinner(false);
        if (response.status === 201) {
          alert.alertOk('Produto criado!');
          umProduto.id = response.data.id;
          navigation.navigate('ProdutoList', { umProduto, ehEdit });
        } else {
          throw 'Erro ' + response.status + ' no acesso API';
        }
      } catch(err) {
        setSpinner(false);
        alert.alertErroOps(err);
        return;
      }
    }
        
    //console.log(this.props.navigation.state.params);
    //this.props.navigation.state.params.saveProduto(umProduto);
    //this.setState({ ...getInitialState });
    // this.props.navigation.setParams({ umPedido })
    //this.props.navigation.goBack();
  }


  return (
    <KeyboardAvoidingView behavior={(Platform.OS === 'ios' ? 'padding' : 'height') } 
      style={styles.container}>    
      <Spinner 
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} />
      <TextInput placeholder='Nome Produto' style={styles.nomeInput}
        onChangeText={nome => setNome(nome)}
        value={nome} />
      <TextInput placeholder='Sabor' style={styles.nomeInput}
        onChangeText={sabor => setSabor(sabor)}
        value={sabor} />
      <TextInput placeholder='Peso' style={styles.nomeInput}
        onChangeText={peso => setPeso(peso)}
        value={peso} />
      <TextInput placeholder='Preço Unidade' style={styles.nomeInput}
        onChangeText={preco_unidade => setPrecoUnidade(preco_unidade)}
        value={preco_unidade} />
      <TextInput placeholder='Qtd na Embalagem' style={styles.nomeInput}
        onChangeText={qtd_embalagem => setQtdEmbalagem(qtd_embalagem)}
        value={qtd_embalagem} />
      <View style={styles.viewButton}>
        <TouchableOpacity style={{ padding: 10 }} 
          disabled={!showButton} 
          onPress={() => createProduto()}>
          <View style={[styles.button, !showButton ? { backgroundColor: '#AAA' } : {}]}>
            <Text style={styles.buttonText}>{ehEdit ? 'Alterar Produto' : 'Criar Produto'}</Text>
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

export default ProdutoAdd;
  