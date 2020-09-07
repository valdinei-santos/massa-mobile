/* eslint-disable prettier/prettier */
import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../../commonStyles';
//import { Divider } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Props {
  id?: number;
  status_id?: number;
  dt_lote?: string;
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
  goLoteShow: (id: any) => void;
  listaStringPedidos?: string;
}

//export default props => {
const LoteItem: React.FC<Props> = (props) => {
  const swipeableRef = useRef<any>(null);
  /* let pedidos;
    props.pedidos && props.pedidos.forEach((v, i, a) => {
        pedidos = pedidos + ', ' + v.id;
    }); */
  // console.log(props);
  let check = null;
  switch (props.status_id) {
    case 1:  // Pendente
      check = (
        <View style={styles.status}>
          <Icon name='check' size={25} color={commonStyles.colors.pendente} />
        </View>
      );
      break;
    case 2: // Alocado
      check = (
        <View style={styles.status}>
          <Icon name='check' size={25} color={commonStyles.colors.alocado} />
        </View>
      );
      break;
    case 3: // Preparado
      check = (
        <View style={styles.status}>
          <Icon name='check' size={25} color={commonStyles.colors.preparado} />
        </View>
      );
      break;
    case 4: // Entregue
      check = (
        <View style={styles.status}>
          <Icon name='check' size={25} color={commonStyles.colors.entregue} />
        </View>
      );
      break;
    default:
      break;
  }

  const descStyle = props.status_id == 1 ? { fontWeight: 'bold' } : { fontWeight: '400' };

  const leftContent = () => {
    return (
      <View>
        <TouchableOpacity
          style={styles.left}
          onPress={() => {
            props.onEdit && props.onEdit(props.id);
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
            props.onDelete && props.onDelete(props.id);
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
      {/* <View style={styles.container}> */}
      <View>
        <TouchableOpacity style={styles.container} onPress={() => props.goLoteShow(props.id)}>
          <View style={styles.checkContainer}>{check}</View>
          <View style={styles.descricaoContainer}>
            <Text style={[styles.description, descStyle]}>
                            Lote: {props.id}
            </Text>
            <Text style={styles.date}>
              {/* {moment(props.dt_lote, 'DD/MM/YYYY')} */}
              { props.dt_lote }
            </Text>
            <Text style={styles.pedido}>
                            Pedidos: {props.listaStringPedidos}
            </Text>
          </View>
          {/* <Text style={styles.cliente}>
                        Pedidos: {props.listaStringPedidos}
                    </Text> */}
        </TouchableOpacity>
      </View>
      {/* <Divider style={styles.divider}/> */}
    </Swipeable>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#AAA',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  divider: {
    borderBottomWidth: 1,
    color: '#AAA',
    height: StyleSheet.hairlineWidth,
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  status: {
    //borderWidth: 3,
    height: 35,
    width: 35,
    borderRadius: 15,
    borderColor: 'blue',
    // backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descricaoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '80%',
  },
  description: {
    // color: commonStyles.colors.tipo1,
    color: 'black',
    fontSize: 25,
  },
  date: {
    // color: commonStyles.colors.tipo2,
    color: 'red',
    fontSize: 20,
  },
  pedido: {
    //color: commonStyles.colors.tipo2,
    color: 'black',
    fontSize: 20,
  },
  exclude: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  excludeText: {
    // fontFamily: commonStyles.fontFamily,
    color: '#FFFFFF',
    fontSize: 20,
    margin: 10,
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

export default LoteItem;