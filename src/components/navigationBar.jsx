import React, { useContext } from 'react';
import './navigationBar.css';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

const NavigatorBar = () => {

    const { logOut, user } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogOut = async () => {
        await logOut()
        navigate('/login')
    }

    return (
        <>
            <Navbar expand="lg" background='#712cf9"'>
                <Container>
                    <Navbar.Brand>Hola {user.displayName}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to='/'>Inicio</Nav.Link>
                            <Nav.Link as={Link} to='/mantenimiento'>Matenimiento</Nav.Link>
                            <Nav.Link as={Link} to='/cart'>Cart</Nav.Link>
                            <Button className='mx-5' onClick={handleLogOut}>Log Out</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>

    )
}

export default NavigatorBar;