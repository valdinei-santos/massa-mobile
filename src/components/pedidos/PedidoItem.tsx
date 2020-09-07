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
  dt_pedido?: string;
  nomeVendedor?: string;
  nomeCliente?: string;
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
  goPedidoShow: (id: any) => void;
}

//export default props => {
const PedidoItem: React.FC<Props> = (props) => {
  const swipeableRef = useRef<any>(null);

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

  const descStyle = props.status_id === 1 ? { fontWeight: 'bold' } : {};

  const leftContent = () => {
    return (
    /* <View style={styles.left}>
                <Icon name='trash' size={20} color='#FFF' />
                <Text style={styles.excludeText}>Excluir</Text>
            </View> */
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
        <TouchableOpacity style={styles.container} onPress={() => props.goPedidoShow(props.id)}>
          <View style={styles.checkContainer}>{check}</View>
          <View style={styles.descricaoContainer}>
            <Text style={[styles.description, descStyle]}>
                            Pedido: {props.id}
            </Text>
            <Text style={styles.date}>
              {/* {moment(props.dt_pedido).format('DD/MM/YYYY')} - {props.nomeVendedor} */}
              {props.dt_pedido} - {props.nomeVendedor}
            </Text>
            <Text style={styles.cliente}>
              {props.nomeCliente}
            </Text>
          </View>
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
  cliente: {
    //color: commonStyles.colors.tipo2,
    color: 'black',
    fontSize: 25,
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

export default PedidoItem;