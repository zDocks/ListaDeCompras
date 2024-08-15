import { GestureHandlerRootView }  from "react-native-gesture-handler";
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import BottomSheet from '@gorhom/bottom-sheet';
import Fire from '../Fire';
import { AntDesign } from '@expo/vector-icons';


Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


export default function Settings(props) {

    firebase = new Fire((error, user) => {
        if (error) {
            return alert("Ops, algo deu errado");
        }
    });

    clearList = () => {
        firebase.deleteAllTodos({id: props.listId});
    }

    deleteList = () => {
        firebase.deleteList({id: props.listId});
    }

    const bottomSheetRef = React.useRef(null);
    const snapPoints = React.useMemo(() => [hp('33')], []);

    return (
        <SafeAreaView style={styles.container}>
        <GestureHandlerRootView style={styles.container}>
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                backgroundStyle={{borderRadius: 40}}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Definições</Text>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={deleteList}>
                            <View style={styles.buttonDel}>
                            <Text style={styles.text}>Apagar Lista</Text>
                            <AntDesign style={styles.iconDel} name="delete" size={hp('3.5')} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={clearList}>
                            <View style={styles.buttonLim}>
                            <Text style={styles.text}>Limpar Lista</Text>
                            <AntDesign style={styles.iconDel} name="disconnect" size={hp('3.5')} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: wp('15%'),
    },
    title: {
        fontWeight: '900',
        fontSize:16,
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp('3%'),
        marginVertical: 0,

    },
    buttonDel: {
        backgroundColor: "rgba(255, 0, 0, 0.65)", //rgba(255, 0, 0, 0.15) SE CORRER MAL MUDAR
        color: "black",
        borderRadius: 50,
        padding: hp('2%'),
        paddingVertical: wp('4%'),
        fontSize: hp('2%'),
        width: wp('70%'),
        height: hp('9%'),
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: "sans-serif-light",
    },
    text: {
        color: "rgba(0, 0, 0, 0.35)",
        fontWeight: "bold",
        fontSize: hp('3%'),
        textAlign: "left",
        left: hp('2%'),
        textTransform: "uppercase",
        fontFamily: "sans-serif-light",
    },
    iconDel: {
        position: 'absolute',
        color: "rgba(0, 0, 0, 0.35)",
        right: 40,
        paddingVertical: wp('4.5%'),
    },
    buttonLim: {
        backgroundColor: "rgba(255, 255, 0, 0.30)",
        color: "black",
        borderRadius: 50,
        padding: hp('2%'),
        paddingVertical: wp('4%'),
        fontSize: hp('2%'),
        width: wp('70%'),
        height: hp('9%'),
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        fontFamily: "sans-serif-light",
    },
    buttonEdit: {
        backgroundColor: "rgba(0, 255, 0, 0.15)",
        color: "black",
        borderColor: "rgba(0, 255, 0, 0.35)",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        width: 320,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        fontFamily: "sans-serif-light",
    }
});