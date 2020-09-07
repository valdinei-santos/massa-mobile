import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { Divider } from 'react-native-paper';
//import Divider from 'react-native-divider';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Props {
  id?: number;
  nome?: string;
  sabor?: string;
  peso?: string;
  preco_unidade: number;
  qtd_embalagem: number;
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
  onSearch?: (id: any) => void;
  ehSearch?: boolean;
}

//export default props => {
const ProdutoItem: React.FC<Props> = (props) => {
  const swipeableRef = useRef<any>(null);

  const leftContent = () => {
    return (
      <View>
        <TouchableOpacity
          style={styles.left}
          onPress={() => {
            props!.onEdit && props!.onEdit(props!.id);
            closeRow();
          }
          }>
          <Icon name='edit' size={30} color='#FFF' />
        </TouchableOpacity>
      </View>
    );
  };
    
  const rightContent = () => {
    return (
      <View>
        <TouchableOpacity
          style={styles.right}
          onPress={() => {
            props!.onDelete && props!.onDelete(props!.id);
            closeRow();
          }
          }>
          <Icon name='trash' size={30} color='#FFF' />
        </TouchableOpacity>
      </View>
    );
  };

  const closeRow = () => {
    swipeableRef.current!.close();
  }

  return (
    <Swipeable
      renderLeftActions={leftContent}
      //onSwipeableLeftOpen={() => props.onDelete(props.id)}
      renderRightActions={rightContent}
      ref={swipeableRef}
      onSwipeableOpen={() => closeRow} >
      <TouchableOpacity style={styles.container} 
        onPress={props!.ehSearch ? () => props!.onSearch && props!.onSearch(props!.id) : () => {} }>
        <View style={styles.descricaoContainer} >
          <Text style={[styles.title]}>
            {props!.nome} {props!.sabor}
          </Text>
          <Text style={styles.description}>
            {props!.peso} - {props!.qtd_embalagem} unidades - 
                        R$ {(props!.preco_unidade * props!.qtd_embalagem).toFixed(2).replace('.',',')}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>

  /* <View>
            <View style={styles.container}>
                <View style={styles.descricaoContainer} >
                    <Text style={[styles.title]}>
                        {props.nome} {props.sabor} - R$ {props.preco_unidade.toFixed(2).replace('.',',')}
                    </Text>
                    <Text style={styles.description}>
                        {props.peso} - {props.qtd_embalagem} unidades
                    </Text>
                </View>
            </View>
            <Divider style={styles.divider}/>
        </View> */
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#AAA',
    alignItems: 'flex-start',
    backgroundColor: 'white'
  },
  divider: {
    borderBottomWidth: 5,
    color: '#AAA',
    height: StyleSheet.hairlineWidth,
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  title: {
    // color: commonStyles.colors.tipo1,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
  },
  descricaoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 5,
  },
  description: {
    //color: commonStyles.colors.tipo2,
    color: 'black',
    fontSize: 20,
  },
  edit: {
    flex: 1,
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20
  },
  right: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20
  },
})

export default ProdutoItem;