import React, { useEffect } from 'react';
import NavigatorBar from './navigationBar';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Cart({ cartItems, checkIdInCart, handleRemoveProduct, getCartItemsFromFirebase }) {

    function calculateTotalValue(cartItems) {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    const handleAddItem = (item) => {
        checkIdInCart(item)
    }

    useEffect(() => {
        getCartItemsFromFirebase()
    }, [getCartItemsFromFirebase])

    return (
        <>
            <NavigatorBar />
            <div className='container'>
                {cartItems.length < 1 ? <h2 className='text-center mt-2'>Carrito Vacio</h2>
                    : cartItems.map((item) => {
                        const itemTotalPrice = calculateTotalValue([item]);
                        return (
                            <div key={item.id} className="shadow mt-3 border-rounded p-3">
                                <Row>
                                    <Col xs={6}>
                                        <img src={item.img} alt="" className='img-fluid' />
                                    </Col>
                                    <Col xs={6}>
                                        <p>{item.name}</p>
                                        <p>Precio: ${item.price}</p>
                                        <p>Cantidad: {item.quantity}</p>
                                        <h6>${itemTotalPrice}</h6>
                                        <div className=''>
                                            <Button className='mx-1 w-25' onClick={() => handleAddItem(item)}> + </Button>
                                            <Button className='mx-1 w-25' onClick={() => handleRemoveProduct(item)}> - </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
                <div className="text-center mt-3 mb-3">
                    {cartItems.length < 1 ? <Button as={Link} to="/">Añadir Productos</Button> : <Button className='text-center'>Pagar</Button>}
                </div>

            </div>
        </>
    )
}

export default Cart