import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import registerNNPushToken from 'native-notify';
import { AntDesign } from '@expo/vector-icons';
import colors from './Colors';
import TodoList from './components/TodoList';
import AddListModal from './components/addListModal';
import Fire from './Fire';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


export default class App extends Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true
  };

  componentDidMount() {
    // Initialize Firebase
    this.firebase = new Fire((error, user) => {
      if (error) {
        return alert("Ops, algo deu errado");
      }
  
      // Get lists from Firebase
      this.firebase.getLists(lists => {
        this.setState({ lists, user, loading: false });
      });
  
      this.setState({ user });
    });
  }
  

  componentWillUnmount() {
    // Detach Firebase listener
    if (this.firebase) {
      this.firebase.detach();
    }
  }

  toggleAddTodoModal = () => {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  renderList = ({ item }) => {
    return <TodoList list={item} updateList={this.updateList} />;
  };

  addList = (list) => {
    this.firebase.addList({
      name: list.name,
      color: list.color,
      todos: []
    });
  };

  updateList = (list) => {
    this.firebase.updateList(list);
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleAddTodoModal()}
        >
          <AddListModal
            closeModal={() => this.toggleAddTodoModal()}
            addList={this.addList}
          />
        </Modal>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.divider} />
          <Text style={styles.title}>
            Lista<Text style={{ fontWeight: "300", color: colors.blue }}>Compras</Text>
          </Text>
          <View style={styles.divider} />
        </View>
        <View style={{ marginVertical: hp('5'), top: hp('1') }}>
          <TouchableOpacity
            style={styles.addList}
            onPress={() => this.toggleAddTodoModal()}
          >
            <AntDesign name="plus" size={16} color={colors.blue} />
          </TouchableOpacity>
          <Text style={styles.add}>Criar Lista</Text>
        </View>
        <View style={{ height: hp('65'), paddingLeft: 0, top: hp('1.5') }}>
          <FlatList
            data={this.state.lists}
            keyExtractor={item => item.id.toString()}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderList}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: hp('0.1%'),
    flex: 1,
    alignSelf: "center",
    top: 41
  },
  title: {
    fontSize: hp('4.5%'),
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 14,
    top: 40
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  }
});
