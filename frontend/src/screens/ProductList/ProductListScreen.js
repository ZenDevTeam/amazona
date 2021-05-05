import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct
} from '../../actions/productActions';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../../constants/productConstants';

import ProductForm from './ProductForm';
import DeleteBox from '../../components/DeleteBox';
import EditBox from './EditForm';

export default function ProductListScreen(props) {
  const [product, setProduct] = useState({});
  const { pageNumber = 1 } = useParams();

  const sellerMode = props.match.path.indexOf('/seller') >= 0;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });

    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(
      listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber })
    );
  }, [
    createdProduct,
    dispatch,
    props.history,
    sellerMode,
    successCreate,
    successDelete,
    userInfo._id,
    pageNumber,
  ]);

  //Delete Box
  const [deleteBoxDisplay, setDeleteBoxDisplay] = useState("none");
  const onDelete = (product) => {
    setDeleteBoxDisplay("block")
    setProduct(product);
  }
  const onCancelDelete = (e) => {
    e.preventDefault();
    setDeleteBoxDisplay("none");
    setProduct({});
  }
  const deleteHandler = (e) => {
    e.preventDefault();
    dispatch(deleteProduct(product._id))
    setDeleteBoxDisplay("none");
    setProduct({});
  }

  //Create Box
  const [display, setDisplay] = useState("none")
  const onCreate = () => {
    setDisplay("block")
  }
  const onCancelCreate = () => {

    setDisplay("none");
  }
  

  const createHandler = async (name, image, price, category, brand, countInStock, description) => {
    
    dispatch(createProduct({
      name, image, price, category, brand, countInStock, description
    }))
    setDisplay("none")
  }

  const [inEditMode, setInEditMode] = useState("none")

  const onEdit = (product) => {
    setProduct(product);
    setInEditMode("block");
  }
  const onCancelUpdate = () => {
    setProduct({});
    setInEditMode("none");
  }

  const updateHandler = async (name, image, price, category, brand, countInStock, description) => {

    dispatch(updateProduct({
      _id: product._id,
      name, price, image, category, brand, countInStock, description
    }))
    setProduct({});
  }
  return (
    <div>
      <div className="row">
        <h1>Products</h1>
        <button type="button" className="primary" onClick={onCreate}>
          Create Product
        </button>
      </div>

      {
        deleteBoxDisplay === "block" && <DeleteBox onCancelDelete={onCancelDelete} deleteHandler={deleteHandler} />
      }

      {
        inEditMode === "block" && <EditBox onCancelUpdate={onCancelUpdate} updateHandler={updateHandler} product={product} />
      }

      {
        display === "block" && <ProductForm display={display} onCancelCreate={onCancelCreate} createHandler={createHandler} />
      }

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <button
                      type="button"
                      className="small"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="small"
                      onClick={() => onDelete(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? 'active' : ''}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
