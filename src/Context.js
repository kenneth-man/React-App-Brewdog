import React, { createContext, useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, doc, query, addDoc, getDoc, getDocs, onSnapshot, updateDoc, deleteDoc, orderBy, limit, where } from "firebase/firestore";

export const Context = createContext();

const ContextProvider = ({ children, auth, db }) => {
    const provider = new GoogleAuthProvider();
    const [isLoading, setIsLoading] = useState(false);
    const [navbarName, setNavbarName] = useState('LOADING...');
    const [allPageNum, setAllPageNum] = useState(1);
    const [resultPageData, setResultPageData] = useState(undefined);
    const [searchPageData, setSearchPageData] = useState([]);
    const [searchPageQuery, setSearchPageQuery] = useState('');
    const [searchPageResults, setSearchPageResults] = useState([]);
    const [shoppingCartData, setShoppingCartData] = useState([]);
    const [shoppingCartTotal, setShoppingCartTotal] = useState(0);
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;

    const checkValidEmail = inputEmail => inputEmail.match(validEmailRegex) ? true : false;

    const checkValidPassword = (inputPassword, inputPasswordConfirm) => inputPassword.length > 8 && inputPassword === inputPasswordConfirm ? true : false;

    const fetchAllData = async (pageNum, setState)=> {
        try {
            const response = await fetch(`https://api.punkapi.com/v2/beers?page=${pageNum}&per_page=10`);
            const data = await response.json();
            setState(data);
        } catch(error){
            console.log(error);
        }
    }

    const fetchRandomData = async (state, setState) => {
        try {
            const response = await fetch('https://api.punkapi.com/v2/beers/random');
            const data = await response.json();
            setState([...state, data[0]]);
        } catch(error){
            console.log(error);
        }
    }

    const fetchSearchData = async () => {
        try {
            let allItems = [];

            for(let index = 0; index < 5; index += 1){
                const pageNum = index + 1;
                const response = await fetch(`https://api.punkapi.com/v2/beers?page=${pageNum}&per_page=1`);
                const data = await response.json();
                allItems = allItems.concat(data);
            }

            setSearchPageData(allItems);
        } catch(error){
            console.log(error);
        }
    }

    //api doesn't provide prices for beers
    const generateRandomPrice = () => `£${Math.round(Math.random() * 9)}.99`
    
    //login account with google account
    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch(error){
            console.log(error);
        }
    }

    //logout of account
    const logout = async () => {
        if(auth.currentUser){
            try {
                await signOut(auth);
            } catch(error) {
                console.log(error);
            }
        }
    }

    //check if a user already exist in the 'users' collection in firestore
    const checkUserAlreadyExists = async uid => {
        try {
            const allUsers = await readAllDocuments('users');
            const userAlreadyExists = allUsers ? allUsers.find(curr => curr.uid === uid) : false;

            return userAlreadyExists;
        } catch(error){
            console.log(error);
        }
    }

    //scroll to top of specified DOM element
    const scrollToTop = () => {
        //prevent .Page from being overlapped by .navbar; offset position from top by 100px (bc .navbar is 100px height); scrollIntoView() doesn't allow offset positioning
        document.querySelector('.App').scrollTo({
            top: document.querySelector('.Page').offsetTop - 100,
            behavior: 'smooth'
        });
    }

    //scroll to bottom of specified DOM element
    const scrollToBottom = () => {
        const element = document.querySelector('.App');

        //scrollTo after data updates; not immediately otherwise will scroll to just before added message/post
        setTimeout(() => {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: 'smooth'
            });
        }, 500);
    }

    const clearInputs = inputSetStateArray => inputSetStateArray.forEach(setState => setState(''));

    //CREATE DOCUMENT (AND CREATE COLLECTION IF DOESN'T EXIST)
    const createDocument = async (collectionName, dataObj) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), dataObj);
            return docRef.id;
        } catch(error){
            console.log(error);
        }
    }

    //READ DOCUMENT
    const readDocument = async (collectionName, documentId) => {
        try {
            const document = await getDoc(doc(db, collectionName, documentId));
            return document.data();
        } catch(error){
            console.log(error);
        }
    }

    //READ DOCUMENT WITHOUT SPECIFYING DOC ID
    const readDocumentWoId = async collectionName => {
        try {
            const response = await readAllDocuments(collectionName);

            //if collection name is 'users', return the currently signed in user's object in an array
            if(collectionName === 'users') return response.filter(curr => curr.uid === auth.currentUser.uid);

            return response;
        } catch(error){
            console.log(error);
        }
    }

    //READ ALL DOCUMENTS ONCE
    const readAllDocuments = async (collectionName, orderedBy = false, limit = false, includeId = true) => {
        try {
            let allDocuments;
            let returnArray = [];

            orderedBy ?
            (
                limit ?
                allDocuments = await getDocs(query(collection(db, collectionName), orderBy(orderedBy), limit(limit))) :
                allDocuments = await getDocs(query(collection(db, collectionName), orderBy(orderedBy)))
            ) :
            (
                limit ?
                allDocuments = await getDocs(query(collection(db, collectionName), limit(limit))) :
                allDocuments = await getDocs(query(collection(db, collectionName)))
            )

            includeId ?
            allDocuments.forEach(doc => returnArray.push({ 
                ...doc.data(),
                id: doc.id
            })) :
            allDocuments.forEach(doc => returnArray.push({ 
                ...doc.data() 
            }));

            return returnArray;
        } catch(error){
            console.log(error);
        }
    }

    //READ DOCUMENT ONSNAPSNOT
    const readDocumentOnSnapshot = (collectionName, docId, setState) => {
        const firebaseQuery = query(collection(db, collectionName));

        onSnapshot(firebaseQuery, snapshot => {
            let returnArray = [];
            
            snapshot.forEach(doc => 
                docId === doc.id && 
                returnArray.push({
                    ...doc.data(),
                    id: doc.id 
                })
            )

            setState(returnArray[0]);
        });
    }

    //READ ALL DOCUMENTS ONSNAPSHOT
    const readAllDocumentsOnSnapshot = (collectionName, orderedBy, setState = false, fieldKey = false, fieldValue = false) => { 
        //'query' method is used for specifying which documents you want to retrieve from a collection
        const messagesQuery = 
            fieldKey ? 
            query(collection(db, collectionName), where(fieldKey, '==', fieldValue), orderBy(orderedBy), limit(1000)) : 
            query(collection(db, collectionName), orderBy(orderedBy), limit(1000));

        //attaching a permanent listener that listens for realtime updates
        onSnapshot(messagesQuery, snapshot => {
            let returnArray = [];
            
            snapshot.forEach(doc => returnArray.push({
                ...doc.data(),
                id: doc.id 
            }))

            if(setState){
                setState(returnArray);
            } else {
                return returnArray;
            }
        });
    }

    //UPDATE DOCUMENT
    const updateDocument = async (collectionName, documentId, key, value, overwriteField = true) => {
        try {
            let field = {};
            const existingDocumentData = await readDocument(collectionName, documentId);

            //assigning the 'key' parameter of this function, as the key for updating a field in the specified firestore document;
            //https://stackoverflow.com/questions/4244896/dynamically-access-object-property-using-variable
            overwriteField ?
            field[key] = value :
            field[key] = [...existingDocumentData[key], value];

            await updateDoc(doc(db, collectionName, documentId), field);
        } catch(error){
            console.log(error);
        }
    }

    //DELETE DOCUMENT
    const deleteDocument = async (collectionName, documentId) => {
        try {
            await deleteDoc(doc(db, collectionName, documentId));
        } catch(error){
            console.log(error);
        }
    }

    useEffect(() => 
        onAuthStateChanged(auth, async user => {
            if(user){
                const { uid, displayName, email } = auth.currentUser;
                const doesUserAlreadyExist = await checkUserAlreadyExists(uid);

                //used for new email and password registrations
                const generateNameFromEmail = inputEmail => inputEmail.split('@')[0];
                
                // updating auth and firebase
                if(!doesUserAlreadyExist){
                    //if registered via email, update the user a 'diplayName' and 'photoURL' in firebase auth; these properties already come with google accounts 
                    if(!displayName){
                        //doesn't cause state change of 'auth' object
                        await updateProfile(auth.currentUser, {
                            displayName: generateNameFromEmail(email)
                        });
                        setNavbarName(generateNameFromEmail(auth.currentUser.email));
                    } else {
                        setNavbarName(displayName);
                    }

                    //add new user's document data in firebase to easily maniplute data using firebase CRUD operations (auth data is only currently signed in user)
                    const docRefId = await createDocument('users', {
                        uid,
                        displayName: auth.currentUser.displayName,
                        email,
                        shoppingCart: []
                    });

                    //adding the document id to newly created user document; if field key doesn't exist, 'updateDoc' creates one
                    await updateDocument('users', docRefId, 'id', docRefId, true);
                } else {
                    setNavbarName(displayName);
                }
            } 
        })
    , [])

    return (
        <Context.Provider value={{
            auth, db, isLoading, navbarName, allPageNum, resultPageData, searchPageData, searchPageQuery, searchPageResults, shoppingCartData, shoppingCartTotal,
            loginWithGoogle, logout, scrollToTop, scrollToBottom, createDocument, readDocument, readDocumentWoId, readAllDocuments, readDocumentOnSnapshot, readAllDocumentsOnSnapshot, 
            updateDocument, deleteDocument, setIsLoading, setNavbarName, checkValidEmail, checkValidPassword, clearInputs, fetchAllData, setAllPageNum, setResultPageData, fetchRandomData,
            fetchSearchData, setSearchPageQuery, setSearchPageResults, generateRandomPrice, setShoppingCartData, setShoppingCartTotal
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;