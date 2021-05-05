import React, { useState } from 'react';
import '../../styles/Box.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
export default function ProductForm({ onCancelCreate, createHandler }) {
    // form
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [imageFile, setImageFile] = useState('');
    const [countInStock, setCountInStock] = useState("");
    const [description, setDescription] = useState("");

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        setImageFile(URL.createObjectURL(file));
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const { data } = await axios.post('/api/uploads', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            setImage(data);
            setLoadingUpload(false);
        } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
        }
    };
    return (
        <div className="modal">

            <form className="modal-content form" >
                <span className="close" onClick={onCancelCreate}>&times;</span>
                <h1>Create form</h1>
                <div>
                    <label htmlFor="name">Name</label>
                    <input required id="name" type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} ></input>
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input
                        id="image"
                        type="text"
                        placeholder="Enter image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor="imageFile">Image File</label>
                    <input
                        type="file"
                        id="imageFile"
                        label="Choose Image"
                        onChange={uploadFileHandler}
                    ></input>
                    {loadingUpload && <LoadingBox></LoadingBox>}
                    {errorUpload && (
                        <MessageBox variant="danger">{errorUpload}</MessageBox>
                    )}
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input required id="price" type="number"
                        placeholder="Enter the Price" value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    ></input>
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <input required id="category" type="text"
                        placeholder="Enter the category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="brand">Brand</label>
                    <input required id="brand" type="text"
                        placeholder="Enter the brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="countInStock">Count In Stock</label>
                    <input required id="countInStock" type="number" placeholder="Enter the count in the stock"
                        value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input required id="description" type="text" placeholder="Enter the description"
                        value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <button className="primary" type="button" onClick={() => createHandler(name, image, price, category, brand, countInStock, description)}>Submit</button>
                </div>
            </form>
        </div>
    );
}