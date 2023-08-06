import React, {useEffect, useState, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import {AuthProvider, AuthContext } from './context/AuthContext';
import HomePage from './pages/homePage';
import LoginForm from './Login/LoginForm';
import Auth from './components/Auth';
import FormCRUD from './pages/FormCRUD';
import Cart from './components/Cart';
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';

function App() {

  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useState();
  const {user} = useContext(AuthContext)

  const getItems = async (col) => {
    const result = await getDocs(query(collection(db, col)));
    return result;
  }

  useEffect(() => {
    const getItemsData = async () => {
      const i = await getItems('items');
      setItems(i.docs);
    }
    getItemsData();
  }, [])

  const createItem = async (obj) => {
    await addDoc(collection(db, 'cart'), obj);
  }
  
  const getCartItemsFromFirebase = async () => {
    try {
      const q = query(collection(db, 'cart'));
      const queryData = await getDocs(q);
      const itemsList = queryData.docs
        .map((doc) => doc.data())
        .filter((item) => item.email === user.email);
      setCartItems(itemsList);
    } catch (error) {
      console.error(error);
    }
  };



  const checkIdInCart = async (product) => {
    try {
      const q = query(collection(db, 'cart'),
      where('id', '==', product.id),
      where('email', '==', user.email)
      );
      const queryData = await getDocs(q);
      if (!queryData.empty) {
        const doc = queryData.docs[0]
        updateDoc(doc.ref, { quantity: doc.data().quantity + 1 })
      } else {
        const newProduct = { ...product, quantity: 1 };
        createItem(newProduct);
      }
      getCartItemsFromFirebase()
    } catch (error) {
      console.error(error);
    }
  };


  const handleRemoveProduct = async (product) => {
    try {
      const q = query(collection(db, 'cart'), where('id', '==', product.id));
      const queryData = await getDocs(q);
      if (!queryData.empty) {
        const doc = queryData.docs[0]
        if (doc.data().quantity > 1) {
          updateDoc(doc.ref, { quantity: doc.data().quantity - 1 })
        } else {
          deleteDoc(doc.ref)
        }
      }
      getCartItemsFromFirebase()
    } catch (error) {
      console.error(error);
    }

  }
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={
          <Auth>
            <HomePage items={items} checkIdInCart={checkIdInCart} />
          </Auth>} />
        <Route path='/mantenimiento' element={
          <Auth>
            <FormCRUD />
          </Auth>} />
        <Route path='/cart' element={
          <Auth>
            <Cart cartItems={cartItems} checkIdInCart={checkIdInCart} handleRemoveProduct={handleRemoveProduct} getCartItemsFromFirebase={getCartItemsFromFirebase}/>
          </Auth>} />
        <Route path='/login' element={<LoginForm />} />
      </Routes>
    </AuthProvider>
  )
}

export default App;