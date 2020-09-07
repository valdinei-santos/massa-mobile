import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface Props {
  id?: number;
  nome?: string;
  email?: string;
  fl_admin: number;
  fl_vendedor: number;
  fl_usuario: number;
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
  onSearch?: (id: any) => void;
  ehSearch?: boolean;
}

//export default props => {
const UsuarioItem: React.FC<Props> = (props) => {    
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
      onSwipeableOpen={() => closeRow}>
      <TouchableOpacity style={styles.container} 
        onPress={props!.ehSearch ? () => props!.onSearch && props!.onSearch(props!.id) : () => {} }>     
        
        <View style={styles.descricaoContainer} >
          <Text style={[styles.title]}>
            {props!.nome}
          </Text>
          <Text style={styles.descriptionEmail}>
            {props!.email} 
          </Text>
          <Text style={styles.descriptionEmail}>
            { (props!.fl_admin === 1) ? 'Administrador' : 
              (props!.fl_vendedor === 1) ? 'Vendedor' : 
                (props!.fl_usuario === 1) ? 'Usuario' : ''
            } 
          </Text>
        </View>    
      </TouchableOpacity> 
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
  descriptionEmail: {
    //color: commonStyles.colors.tipo2,
    color: 'red',
    fontSize: 20,
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

export default UsuarioItem;