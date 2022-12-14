import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

import {addProduct, setProduct, updateProduct, setCategory} from "../reducerSlice";
import authHeader from "../../services/auth-header";



const Component = () => {
    const [Name, setName] = useState("");
    const [Price, setPrice] = useState("");
    const [Image, setImage] = useState("");
    const [CategoryId, setCategoryId] = useState("");


    const apiBase = useSelector((state) => state.toolkit.apiBase);
    const product = useSelector((state) => state.toolkit.product);
    const category = useSelector((state) => state.toolkit.category);
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [selectedName, setSelectedName] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");



    useEffect(() => {
        axios.get(`${apiBase}/products?all=1`, { headers: authHeader() }).then((resp) => {
            dispatch(setProduct(resp.data));
        });

        axios.get(`${apiBase}/products`, { headers: authHeader() }).then((resp) => {
            dispatch(setProduct(resp.data));
        });
        axios.get(`${apiBase}/category`, { headers: authHeader() }).then((resp) => {
            dispatch(setCategory(resp.data));
        });

    }, [apiBase, dispatch]);

    const addNew = (e) => {
        e.preventDefault();

        axios
            .post(
                `${apiBase}/products`,
                {
                    name: Name,
                    price: +Price,
                    image: Image,
                    category_id: +CategoryId,
                },
                { headers: authHeader() }
            )
            .then((resp) => {
                dispatch(addProduct(resp.data));
            });
    };

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        const products = product.find((x) => x.id === id);

        if (!products) return;

        setSelectedId(products.id);
        setSelectedName(products.name);
        setSelectedPrice(products.price);
        setSelectedImage(products.image);
        setSelectedCategory(products.category_id);

        setShow(true);
    };


    const handleSave = () => {
        const products = product.find((x) => x.id === selectedId);

        if (!products) return;

        const o = { ...products };
        o.id = selectedId;
        o.name = selectedName;
        o.price = selectedPrice;
        o.image = selectedImage;
        o.category_id = selectedCategory;

        axios
            .put(`${apiBase}/products/${o.id}`, o, { headers: authHeader() })
            .then((resp) => {
                dispatch(updateProduct(o));
                handleClose();
            });
    };


    return (
        <div className="mb-5 p-2 border border-top-0 rounded-bottom">
            <h3>???????????? ??????????????</h3>

            {product && (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>????????????????</th>
                        <th>????????</th>
                        <th>??????????????????????</th>
                        <th>??????????????????</th>
                        <th>????????????????</th>
                    </tr>
                    </thead>
                    <tbody>
                    {product.length > 0 &&
                        product.map((x) => {
                            return (
                                <tr key={x.id}>
                                    <td>{x.id}</td>
                                    <td>{x.name}</td>
                                    <td>{x.price}</td>
                                    <td>{x.image}</td>
                                    <td>{x.category_id} - {category.find((el) => +el.id === x.category_id).name} </td>
                                    <td>
                                        <Button
                                            variant="light" style={{color:'#ec407a'}}
                                            onClick={() => handleShow(x.id)}
                                        >
                                            &#9998;
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    {!product.length && (
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}

            <h3>???????????????? ?????????? ??????????</h3>

            <Form onSubmit={addNew}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>????????????????</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="????????????????"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>??????????????????</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="??????????????????"
                                value={Price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>?????????????????????? (????????????)</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                placeholder="??????????????????????"
                                value={Image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>??????????????????</Form.Label>
                            <Form.Select
                                name="category_id"
                                placeholder="??????????????????"
                                value={CategoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                onBlur={(e) => setCategoryId(e.target.value)}
                            >
                                <option disabled value="">
                                    ???????????????? ??????????????????
                                </option>
                                {category &&
                                    category.map((x) => (
                                        <option key={x.id} value={x.id}>
                                            {x.name}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Button  variant="light" style={{color:'#ec407a'}}  type="submit">
                    ????????????????
                </Button>
            </Form>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>????????????????</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>????????????????</Form.Label>
                        <Form.Control
                            type="text"
                            name="image"
                            placeholder="??????????????????????"
                            value={selectedName}
                            onChange={(e) => setSelectedName(e.target.value)}
                            onBlur={(e) => setSelectedName(e.target.value)}
                        />
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>??????????????????</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            placeholder="??????????????????"
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            onBlur={(e) => setSelectedPrice(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>??????????????????????</Form.Label>
                        <Form.Control
                            type="text"
                            name="image"
                            placeholder="??????????????????????"
                            value={selectedImage}
                            onChange={(e) => setSelectedImage(e.target.value)}
                            onBlur={(e) => setSelectedImage(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>??????????????????</Form.Label>
                        <Form.Select
                            name="category_id"
                            placeholder="??????????????????"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            onBlur={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option disabled value="">
                                ???????????????? ??????????????????
                            </option>
                            {category &&
                                category.map((x) => (
                                    <option key={x.id} value={x.id}>
                                        {x.id} - {x.name}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ????????????
                    </Button>
                    <Button  variant="light" style={{color:'#ec407a'}}  onClick={handleSave}>
                        ??????????????????
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Component;
