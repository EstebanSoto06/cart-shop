import React, { useState, useEffect, useRef } from 'react'
import { Button, Card, Form, Row, Col } from 'react-bootstrap'
import { collection, addDoc, getDocs, query, deleteDoc, doc, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import {BsTrash3, BsFillPencilFill} from 'react-icons/bs'
import NavigatorBar from '../components/navigationBar';


function FormCRUD() {

    const [values, setValues] = useState();
    const [items, setItems] = useState();
    const [file, setFile] = useState("");
    const [fileu, setFileu] = useState();
    const [currentID, setCurrentID] = useState("");

    const form = useRef();
    const nameF = useRef();
    const cantF = useRef();
    const precioF = useRef();
    const imgF = useRef();

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;

            console.log(name);
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    setFileu(progress)
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setValues((prev) => ({ ...prev, img: downloadURL }));
                    });
                }
            );
        };
        file && uploadFile();
    }, [file]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(currentID === ''){
            createItem(values)
            getItemsData();
        }else{
            handleEdit(currentID, values)
            getItemsData();
            setCurrentID("")
        }
        resetForm()
    }
    
    const createItem = async (obj) => {
        const colRef = collection(db, 'items');
        const data = await addDoc(colRef, obj);
        return data.id;
    }

    const getItems = async () => {
        const result = await getDocs(query(collection(db, 'items')));
        return result;
    }


    const getItemsData = async () => {
        const i = await getItems();
        setItems(i.docs);
    }


    useEffect(() => {
        getItems();
        getItemsData();
    })

    const handleDelete = async (id, imgId) => {
        if(window.confirm("Seguro de Eliminar este Artículo?")){
            const colRef = collection(db, 'items');
            const storageRef = ref(storage, imgId);
            await deleteDoc(doc(colRef, id));
            await deleteObject(storageRef)
        }
    }

 

    const handleEdit = async (id, obj) =>{
        const colRef = collection(db, 'items');
        await updateDoc(doc(colRef, id), obj)
    }

    const resetForm = () => {
        nameF.current.value = ""
        cantF.current.value = ""
        precioF.current.value = ""
        imgF.current.value = ""
    }

    return (
        <>
        <NavigatorBar/>
            <div className="container-fluid w-75 m-5">
                <Form ref={form} onSubmit={handleSubmit} id='form-med'>
                    <Form.Group>
                        <Form.Label>Nombre del Producto</Form.Label>
                        <Form.Control ref={nameF}  name='name' onChange={handleInputChange} type='text' placeholder='Nombre del Producto'></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control ref={cantF} name='desc' onChange={handleInputChange} type='textarea' placeholder='Cantidad de Producto'></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Precio del Producto</Form.Label>
                        <Form.Control ref={precioF} name='price' onChange={handleInputChange} type='text' placeholder='Precio Actual '></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Imagen del Producto</Form.Label>
                        <Form.Control ref={imgF} name='img' onChange={(e) => setFile(e.target.files[0])} className='img-fluid' type='file'></Form.Control>
                    </Form.Group>
                    <Form.Group className='mt-2'>
                    <Button  type='submit' disabled={fileu != null && fileu < 100} className={currentID === '' ? "" : "btn-success"}>{currentID === '' ? 'Crear': "Actualizar"}</Button>
                    </Form.Group>
                </Form>
            </div>
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
                                            <Col><BsTrash3 onClick={() => handleDelete(i.id, i.data().img)}/></Col>
                                            <Col><BsFillPencilFill onClick ={() => setCurrentID(i.id)}/></Col>
                                        </Row>
                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </>
    )
}

export default FormCRUD