import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal} from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import 'react-native-gesture-handler';
import colors from "../Colors"
import { AntDesign } from "@expo/vector-icons";
import TodoModal from "./TodoModal";
import Settings from "./Settings";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


export default class TodoList extends React.Component {
    state = {
        showListVisible: false,
        showSettingsVisible: false,
        listId: null 
    }

    toggleListModal() {
        this.setState({showListVisible: !this.state.showListVisible})
    }

    toggleSettigsModal(listId) { 
        this.setState({showSettingsVisible: !this.state.showSettingsVisible, listId})
    }

    render() {
        const list = this.props.list

        const completedCount = list.todos.filter(todo => todo.completed).length
        const remainingCount = list.todos.length - completedCount

        return (
            <View>
              <Modal animationType="slide" visible={this.state.showListVisible} onRequestClose={() => this.toggleListModal()}>
                <TodoModal 
                  list={list} 
                  closeModal={() => this.toggleListModal()} 
                  updateList={this.props.updateList} 
                />
              </Modal>
              <Modal animationType="slide" visible={this.state.showSettingsVisible} transparent={true} onRequestClose={() => this.toggleSettigsModal()}>
                <Settings 
                  closeModal={() => this.toggleSettigsModal()} 
                  listId={this.state.listId} 
                />
              </Modal>

              <TouchableOpacity 
                style={[styles.listContainer, {backgroundColor: list.color, zIndex: 0}]} 
                onPress={() => this.toggleListModal()}
              >
                <View style={{ alignItems: "right" }}>
                    <TouchableOpacity 
                        onPress={() => this.toggleSettigsModal(list.id)} // Pass the list id when clicking on the settings button
                        style={{zIndex: 1}}
                    >
                        <View style={{position: "absolute", left: hp('32'), zIndex: 10 }}>
                            <AntDesign name="ellipsis1" size={30} color="white" />
                        </View>
                    </TouchableOpacity>
                  <View style={{alignItems: "right"}}>
                    <Text style={{color: "white", fontWeight: "300"}}>
                      {list.todos.length} Produtos
                    </Text>   
                  </View>
                  <Text style={styles.listTitle} numberOfLines={1}>
                    {list.name}
                  </Text>
          
                  <View style={{alignItems: "right"}}>
                    <Text style={styles.count}>Falta Comprar :</Text>
                    <Text style={styles.subtitle}>{remainingCount}</Text>
                  </View>
                  <View style={{alignItems: "right"}}>
                    <Text style={styles.count2}>Comprados : </Text>
                    <Text style={styles.subtitle2}>{completedCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
          
    }
};


const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: hp('1.5'),
        paddingHorizontal: wp('4%'),
        borderRadius: 6,
        marginVertical: hp('0.5'),
        alignItems: "left",
        width: wp('80%'),
        height: hp('20%'),
    },
    listTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "white",
        top: hp('0.5'),
        marginBottom: hp('2%')
    },
    count: {
        color: "white",
        fontWeight: "200",
        fontSize: 18,
        top: hp('0.5%')
    },
    subtitle: {
        color: "white",
        fontWeight: "200",
        fontSize: hp('2.5%'),
        bottom: hp('2.8%'),
        left: hp('15%')
    },
    count2: {
        color: "white",
        fontWeight: "200",
        fontSize: hp('2.5%'),
        bottom: hp('1.5%'),
    },
    subtitle2: {
        color: "white",
        fontWeight: "200",
        fontSize: hp('2.5%'),
        bottom: hp('4.8%'),
        left: hp('14%')
    },
})