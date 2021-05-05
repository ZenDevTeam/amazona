import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/Box.css';
import axios from 'axios';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
export default function EditForm({ product, onCancelUpdate, updateHandler }) {
    // form
    const [name, setName] = useState(product.name);
    const [image, setImage] = useState(product.image);
    const [price, setPrice] = useState(product.price);
    const [category, setCategory] = useState(product.category);
    const [brand, setBrand] = useState(product.brand);

    const [countInStock, setCountInStock] = useState(product.countInStock);
    const [description, setDescription] = useState(product.description);

    //style
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const uploadFileHandler = async (e) => {
      const file = e.target.files[0];
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
  
    // const onImageChange = (event) => {
    //     if (event.target.files && event.target.files[0]) {
    //         let img = event.target.files[0];
    //         setImageFile(URL.createObjectURL(img));
    //         // const bodyFormData = new FormData();
    //         // bodyFormData.append('image', img);
    //         // setLoadingUpload(true);
    //     }
    // };
    return (
        <div className="modal">

            <form className="modal-content form" >
                <span className="close" onClick={onCancelUpdate}>&times;</span>
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
                    <button className="primary" type="button" onClick={() => updateHandler(name, image, price, category, brand, countInStock, description)}>Submit</button>
                </div>
            </form>
        </div>
    );
}