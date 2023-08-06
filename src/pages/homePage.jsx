import React, { useContext } from "react";
import NavigatorBar from "../components/navigationBar";
import { Card, Col, Row, ToastContainer } from "react-bootstrap";
import { BsCartPlus } from 'react-icons/bs'
import { AuthContext } from "../context/AuthContext";

const Home = ({ items, checkIdInCart }) => {
    const {user} = useContext(AuthContext);
    return (
        <>
            <NavigatorBar />
            <div className="container-fluid m-5 w-75">
                <h1>Items</h1>
                <Row>
                    {
                        items && items.map(i =>
                            <Col md='4' sm='6' xs='12' className='mt-2 mb-2' key={i.id}>
                                <Card className='h-100'>
                                    <Card.Img variant="top" src={i.data().img} />
                                    <Card.Body>
                                        <Card.Title>{i.data().name}</Card.Title>
                                        <h2>Precio: ₡{i.data().price}</h2>
                                    </Card.Body>
                                    <div className="container-fluid p-2 text-center border-top">
                                        <Row>
                                            <Col><BsCartPlus style={{ cursor: 'pointer' }} onClick={() =>  checkIdInCart({ ...i.data(), id: i.id, email: user.email })} /></Col>
                                        </Row>
                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
            <ToastContainer />
        </>
    )
}

export default Home;