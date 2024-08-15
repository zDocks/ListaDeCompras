import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA3Bc2rL8uUo_TVjAbKzifCayeWctjSlTo",
    authDomain: "listadecompras-37c0f.firebaseapp.com",
    databaseURL: "https://listadecompras-37c0f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "listadecompras-37c0f",
    storageBucket: "listadecompras-37c0f.appspot.com",
    messagingSenderId: "927639030212",
    appId: "1:927639030212:web:9065f25d07d80688c1fc91"
};

class Fire {
    constructor(callback){
        this.init(callback);
    }


    

    init(callback){
        if(!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().onAuthStateChanged(user => {
            if(user){
                callback(null, user);
            } else {
                firebase
                .auth()
                .signInAnonymously()
                .catch(error => {
                    callback(error);
                });
            }
        });
    }

    getLists(callback){
        let ref = this.ref.orderBy("name");

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = [];

            snapshot.forEach(doc => {
                lists.push({id: doc.id, ...doc.data()});
            });

            callback(lists);
        });
    }

    getProduct(nome, callback) {
        firebase.firestore()
            .collection('users')
            .doc(this.userId)
            .collection('produtos')
            .doc('j8mgG0pZFQmM1HzL9kS1') // ID do documento
            .get()
            .then(doc => {
                if (!doc.exists) {
                    callback(null, new Error('Nenhum produto encontrado.'));
                    return;
                }

                const data = doc.data();
                const produtos = data.produtos;
    
                const originalNome = nome; 
                const lowerCaseNome = nome.toLowerCase(); 
                const produto = produtos.find(p => p.nome.toLowerCase() === lowerCaseNome);

                if (produto) {
                    produto.nome = originalNome;
                    callback(produto, null);
                } else {
                    callback(null, new Error('Produto não encontrado.'));
                }
            })
            .catch(error => {
                console.error("Erro ao obter produto:", error);
                callback(null, error);
            });
    }
    
    
    

    addList(list){
        let ref = this.ref;
        ref.add(list);
    }

    addProductToDocument(product) {
        this.refPro.get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    const produtos = data.produtos || [];

                    produtos.push(product);
                    return this.refPro.update({ produtos: produtos });
                } else {
                    console.error("Documento 'produtos' não encontrado.");
                }
            })
            .catch(error => {
                console.error("Erro ao adicionar produto:", error);
            });
    }
    

    deleteAllTodos(list){
        let ref = this.ref;
        ref.doc(list.id).update({todos: []});
    }

    deleteList(list){
        let ref = this.ref;
        ref.doc(list.id).delete();
    }

    updateList(list){
        let ref = this.ref;
        ref.doc(list.id).update(list);
    }

    get userId(){
        return "yrNOwty7ggRW09u06N9cLjLckVM2";
    }

    get ref(){
        return firebase.firestore().collection('users').doc(this.userId).collection('lists');
    }

    get refPro(){
        return firebase.firestore().collection('users').doc(this.userId).collection('produtos').doc('j8mgG0pZFQmM1HzL9kS1');
    }

    listenToList(listId, callback) {
        let ref = this.ref.doc(listId);
        return ref.onSnapshot(doc => {
            callback({ id: doc.id, ...doc.data() });
        });
    }

    detach() {
        this.unsubscribe();
    }
}

export default Fire;
