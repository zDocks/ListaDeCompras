import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated, ScrollView, Modal } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import colors from "../Colors";
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Fire from "../Fire";
import Voice from '@react-native-voice/voice'; // Import the Voice module

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;



const TodoModal = (props) => {
    const styles = getStyles(props);
    const fire = new Fire();

    const [newTodo, setNewTodo] = useState("");
    const [status, setStatus] = useState("Todos");
    const [originalList, setOriginalList] = useState(props.list.todos);
    const [renderedList, setRenderedList] = useState(props.list.todos);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [text, setText] = useState('');


    useEffect(() => {
        // Initialize the voice recognition
        Voice.onSpeechResults = onSpeechResults;

        // Listener para atualizações em tempo real
        const unsubscribe = fire.listenToList(props.list.id, updatedList => {
            setOriginalList(updatedList.todos);
            filterList(); // Atualize a lista renderizada com base no filtro atual
        });

        // Limpe o listener quando o componente for desmontado
        return () => {
            unsubscribe();
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        filterList(); // Chame filterList para recriar a lista renderizada com base no filtro atual
    }, [status, originalList]);

    const handleListening = async () => {
        try {
            if(isListening){
                await Voice.stop();
                setIsListening(false);
            } else {
                setText('');
                await Voice.start('pt-BR');
                setIsListening(true);
            }

        } catch (e) {
            console.error("Erro ao iniciar o reconhecimento de voz:", e);
        }
    };

    // Function to handle speech results
    const onSpeechResults = (event) => {
        const { value } = event;
        console.log(value);
        // You can add more logic here to handle the speech recognition results
    };


    const filterList = () => {
        let filteredList = [...originalList]; // Faça uma cópia de originalList
        if (status !== "Todos") {
            filteredList = originalList.filter(todo => todo.status === status);
        }
        setRenderedList(filteredList);
    };

    const toggleTodoCompleted = (title) => {
        const updatedList = originalList.map(item => {
            if (item.title === title) {
                return { ...item, completed: !item.completed };
            }
            return item;
        });
    
        // Atualize o estado apenas da tarefa clicada
        setOriginalList(updatedList);
        props.updateList({ ...props.list, todos: updatedList });
    };
    

    const addTodo = () => {
        let list = props.list;
        let newTodoTrimmed = newTodo.trim();

        const capitalizedTodo = newTodoTrimmed.charAt(0).toUpperCase() + newTodoTrimmed.slice(1);
    
        if (selectedProduct) {
            if (!list.todos.some(todo => todo.title === selectedProduct.nome)) {
                list.todos.push({ title: selectedProduct.nome, completed: false, status: selectedProduct.status });
                props.updateList(list);
            }
            setSelectedProduct(null);
        } else {
            fire.getProduct(capitalizedTodo, (product) => {
                if (product) {
                    if (!list.todos.some(todo => todo.title === product.nome)) {
                        list.todos.push({ title: product.nome, completed: false, status: product.status });
                        props.updateList(list);
                    }
                } else {
                    setCurrentProduct(capitalizedTodo);
                    setModalVisible(true);
                }
            });
        }
    
        setNewTodo("");
        Keyboard.dismiss();
    };

    const selectCategory = (category) => {
        let list = props.list;
        setSelectedCategory(category);
        list.todos.push({ title: currentProduct, completed: false, status: category });
        props.updateList(list);
        lowerCaseNome = currentProduct.toLowerCase();

        fire.addProductToDocument({ nome: lowerCaseNome, status: category });

        setModalVisible(false);
        setNewTodo("");
        setCurrentProduct("") 
    };
    
    const deleteTodo = (title) => {
        let list = props.list;
        const updatedList = list.todos.filter(todo => todo.title !== title);
        list.todos = updatedList;
        props.updateList(list);
    
        // Atualize renderedList e recrie a lista com base no filtro atual
        filterList();
    };
    

    const renderTodo = (todo, index) => {
        return (
            <GestureHandlerRootView key={index}>
                <Swipeable renderRightActions={(_, dragX) => rightActions(dragX, index)} >
                    <View style={styles.todoContainer}>
                        <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
                            <Ionicons name={todo.completed ? "checkbox" : "square-outline"} size={24} color={todo.completed ? colors.green : colors.gray} style={{ width: 32 }} />

                            <Text style={[styles.todo, { textDecorationLine: todo.completed ? "line-through" : "none", color: todo.completed ? colors.gray : colors.black }]}>
                                {todo.title}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Swipeable>
            </GestureHandlerRootView>
        );
    };

    const rightActions = (dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: "clamp"
        });

        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: "clamp"
        });

        return (
            <TouchableOpacity onPress={() => deleteTodo(index)}>
                <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
                    <Animated.Text style={{ color: colors.white, fontWeight: "800", transform: [{ scale }] }}>Apagar</Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const listTab = [
        { status: "Todos" },
        { status: "Carne" },
        { status: "Peixe" },
        { status: "Congelados" },
        { status: "Legumes" },
        { status: "Mercearia" },
        { status: "Laticínios" },
        { status: "Charcutaria" },
        { status: "Detergentes" },
        { status: "Papel" },
        { status: "Bebidas" },
        { status: "Utensílios" }
    ];

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={{ position: "absolute", top: hp('2'), right: hp('2.5'), zIndex: 10 }}
                    onPress={props.closeModal}
                >
                    <AntDesign name="close" size={hp('3')} color={colors.black} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ position: "absolute", top: hp('2'), left: hp('35.5'), zIndex: 10 }}
                    onPress={handleListening}
                >
                    <AntDesign name={isListening ? "sound" : "sound"} size={hp('3')} color={colors.black} />
                </TouchableOpacity>

                <View style={[styles.section, styles.header, { borderBottomColor: props.list.color }]}>
                    <View>
                        <Text style={styles.title}>{props.list.name}</Text>
                        <Text style={styles.taskCount}>
                            {originalList.filter(todo => todo.completed).length} Produtos Comprados de {originalList.length} Produtos Pedidos
                        </Text>
                    </View>
                </View>
                <View style={styles.Inrow}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {listTab.map(e => (
                            <View key={e.status} style={styles.btnContainer}>
                                <TouchableOpacity
                                    style={[styles.btnFilter, status == e.status && styles.btnTabActive]}
                                    onPress={() => setStatus(e.status)}
                                >
                                    <Text style={styles.todo}>{e.status}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={[styles.section, { flex: 7, marginVertical: hp('0'), bottom: hp('0'), height: hp('15')}]}>
                    <FlatList
                        data={renderedList}
                        renderItem={({ item }) => (
                            <GestureHandlerRootView key={item.title}>
                                <Swipeable renderRightActions={(_, dragX) => rightActions(dragX, item.title)}>
                                    <View style={styles.todoContainer}>
                                        <TouchableOpacity onPress={() => toggleTodoCompleted(item.title)}>
                                            <Ionicons name={item.completed ? "checkbox" : "square-outline"} size={24} color={item.completed ? colors.green : colors.gray} style={{ width: 32 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleTodoCompleted(item.title)}>
                                            <Text style={[styles.todo, { textDecorationLine: item.completed ? "line-through" : "none", color: item.completed ? colors.gray : colors.black }]}>
                                                {item.title}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Swipeable>
                            </GestureHandlerRootView>
                        )}
                        keyExtractor={(item, index) => item.title}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <View style={[styles.footer, styles.section]}>
                    <TextInput
                        style={[styles.input, { borderColor: props.list.color }]}
                        onChangeText={text => setNewTodo(text)}
                        value={newTodo}
                    />
                    <TouchableOpacity style={[styles.addTodo, { backgroundColor: props.list.color }]} onPress={addTodo}>
                        <AntDesign name="plus" size={16} color={colors.white} />
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Qual é a categoria para "{currentProduct}"?</Text>
                            {listTab.map(e => (
                                <TouchableOpacity
                                    key={e.status}
                                    style={styles.modalOption}
                                    onPress={() => selectCategory(e.status)}
                                >
                                    <Text>{e.status}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Modal>
               {/*  <Text>{selectedCategory}</Text> // DEBBUG MODE V1.0 */}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const getStyles = (props) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        section: {
            flex: 1,
            alignSelf: "stretch",
            bottom: hp('1'),
        },
        header: {
            justifyContent: "flex-end",
            marginLeft: 0,
            borderBottomWidth: 3,
            paddingTop: hp('1'),
            bottom: hp('1.5'),
        },
        title: {
            fontSize: 30,
            fontWeight: "800",
            color: colors.black,
            left: hp('1.5'),
        },
        taskCount: {
            marginTop: hp('0'),
            marginBottom: 16,
            color: colors.gray,
            fontWeight: "600",
            left: hp('2'),
        },
        footer: {
            paddingHorizontal: hp('2.5'),
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 0,
        },
        input: {
            flex: 1,
            height: hp('6'),
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 6,
            marginRight: hp('0.7'),
            paddingHorizontal: hp('2'),
        },
        addTodo: {
            borderRadius: 4,
            padding: 16,
            alignItems: "center",
            justifyContent: "center"
        },
        todoContainer: {
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: hp('2.5'),
        },
        todo: {
            color: colors.black,
            fontWeight: "700",
            fontSize: hp('2.5'),
        },
        deleteButton: {
            flex: 1,
            backgroundColor: colors.red,
            justifyContent: "center",
            width: wp('30%'),
            alignItems: "center"
        },
        Inrow: {
            flexDirection: "row",
            bottom: hp('0.5'),
        },
        btnContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: hp('4'),
            paddingLeft: hp('1.5'),
            borderRadius: 50,
        },
        btnFilter: {
            flex: 1,
            backgroundColor: "lightgray",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "fit-content",
            width: wp('30%'),
            borderRadius: 50,
        },
        btnTabActive: {
            backgroundColor: props.list.color
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        modalContent: {
            backgroundColor: 'white',
            padding: hp('2.5'),
            borderRadius: 10,
            alignItems: 'center'
        },
        modalText: {
            fontSize: hp('2.5'),
            marginBottom: hp('1.5')
        },
        modalOption: {
            padding: hp('1.5'),
            borderBottomWidth: 1,
            borderBottomColor: props.list.color,
            width: wp('30%'), 
            alignItems: 'center'
        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: hp('4%')
        },
        modalView: {
            margin: hp('2%'),
            backgroundColor: "white",
            borderRadius: 20,
            padding: hp('2%'),
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: wp('0'),
                height: hp('2%')
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        modalButton: {
            backgroundColor: props.list.color,
            marginTop: 20
        },
        modalButtonText: {
            color: "white",
            fontWeight: "700"
        }

    });
};

export default TodoModal;