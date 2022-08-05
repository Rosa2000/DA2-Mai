import React, { useState } from "react";
import UploadProductImg from "./UploadProductImg";
import axios from "axios";
import authHeader from "../../services/auth-header";
import ConfirmModal from "../confirmModal";
import { Redirect } from "react-router-dom";
const baseURL = process.env.REACT_APP_URL_PRODUCTS_API;

const ProductForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImg, setPreviewImg] = useState([]);
  const [productInfo, setProductInfo] = useState({
    productName: "",
    SKU: "",
    entryPrice: 0,
    salePrice: 0,
    inStockValue: 0,
    brand: "",
    category: "",
    description: "",
    userManual: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [redirectToProductList, setRedirectToProductList] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //UPLOAD PRODUCT IMAGES
  const changeUploadImageHandler = (event) => {
    event.preventDefault();
    // Change handler
    const fileArray = event.target.files;
    setSelectedFiles([]);
    for (let i = 0; i < fileArray.length; i++) {
      const newImage = fileArray[i];
      selectedFiles.push(newImage);
    }
    console.log("STATE: ", selectedFiles);
    // ------
    // SUBMIT HANDLER
    let files = selectedFiles;
    let fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append("URL_IMG", files[i]);
    }
    axios
      .post(`${baseURL}/uploadProductImgs`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": authHeader(),
        },
      })
      .then((res) => {
        setPreviewImg([]);
        if (res.data && res.data.URL_FILES) {
          let URL_FILES = res.data.URL_FILES;
          for (let i = 0; i < URL_FILES.length; i++) {
            // previewImg.push(URL_FILES[i]);
            setPreviewImg((prevImg) => [...prevImg, URL_FILES[i]]);
          }
        }
      })
      .catch((error) => {
        let msg = "Connectivitiy problem";
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.msg
        )
          msg = error.response.data.msg;

        setErrorMsg(msg);
      });
  };

  let previewProductImage;
  if (previewImg && previewImg.length > 0) {
    previewProductImage = previewImg.map((src) => {
      return <img key={src} src={src} alt="product_img" className="preview" />;
    });
  } else {
    previewProductImage = <></>;
  }
  // UPLOAD PRODUCT
  const handleFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...productInfo };
    newFormData[fieldName] = fieldValue;
    setProductInfo(newFormData);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        `${baseURL}/create-product`,
        {
          productName: productInfo.productName,
          SKU: productInfo.SKU,
          entryPrice: productInfo.entryPrice,
          salePrice: productInfo.salePrice,
          inStockValue: productInfo.inStockValue,
          brand: productInfo.brand,
          category: productInfo.category,
          description: productInfo.description,
          userManual: productInfo.userManual,
          URL_IMG: previewImg,
        },
        {
          headers: {
            "x-access-token": authHeader(),
          },
        }
      )
      .then((res) => {
        // console.log(productInfo.salePrice);
        setShowModal(true);
      })
      .catch((error) => {
        let msg = "Connectivitiy problem";
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.msg
        )
          msg = error.response.data.msg;

        setErrorMsg(msg);
      });
  };

  //Modal
  // const handleCloseModal = () => setShowModal(false);
  const handleReload = () => {
    setShowModal(false);
    window.location.reload();
  };
  const handleRedirectToProductList = () => setRedirectToProductList(true);

  if (redirectToProductList) {
    return <Redirect to="/products/" />;
  }
  //
  const form = (
    <form onSubmit={handleSubmit}>
      {errorMsg && (
        <div className="text-center text-danger fs-12">{errorMsg}</div>
      )}

      <div className="form-row justify-content-center">
        <UploadProductImg onChange={changeUploadImageHandler} />
      </div>
      {previewProductImage}

      <div className="form-row">
        <div className="form-group col-md-6">
          <label>Tên sản phẩm</label>
          <input
            required
            name="productName"
            type="text"
            className="form-control"
            onChange={handleFormChange}
          />
        </div>
        <div className="form-group col-md-6">
          <label>Mã sản phẩm</label>
          <input
            onChange={handleFormChange}
            required
            name="SKU"
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-4">
          <label>Giá nhập</label>
          <input
            onChange={handleFormChange}
            min="1"
            required
            name="entryPrice"
            type="number"
            className="form-control"
          />
        </div>
        <div className="form-group col-md-4">
          <label>Giá bán</label>
          <input
            onChange={handleFormChange}
            min="1"
            required
            name="salePrice"
            type="number"
            className="form-control"
          />
        </div>
        <div className="form-group col-md-4">
          <label>Số lượng kho</label>
          <input
            onChange={handleFormChange}
            required
            name="inStockValue"
            type="number"
            className="form-control"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label>Thương hiệu</label>
          <input
            onChange={handleFormChange}
            required
            name="brand"
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group col-md-6">
          <label>Loại sản phẩm</label>
          <select
            onChange={handleFormChange}
            required
            defaultValue="choose"
            name="category"
            className="form-control"
          >
            <option value="choose" disabled>
              Chọn...
            </option>
            <option value="Chăm sóc da mặt">Chăm sóc da mặt</option>
            <option value="Chăm sóc cơ thể">Chăm sóc cơ thể</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Mô tả sản phẩm</label>
        <textarea
          onChange={handleFormChange}
          className="form-control"
          name="description"
          rows="3"
        ></textarea>
      </div>
      <div className="form-group">
        <label>Hướng dẫn sử dụng</label>
        <textarea
          name="userManual"
          onChange={handleFormChange}
          className="form-control"
          rows="3"
        ></textarea>
      </div>
      <div className="row justify-content-center">
        <button className="col-12 col-md-5 btn btn-danger mx-auto mb-3">
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary mx-auto col-12 col-md-5 "
        >
          Tạo sản phẩm
        </button>
      </div>
    </form>
  );
  return (
    <>
      <div className="authincation h-100 p-meddle">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-9">
              <ConfirmModal
                title="Tạo sản phẩm"
                body="Tạo sản phẩm hoàn tất"
                btnAction="Quay về danh sách sản phẩm"
                btnCancel="Tạo thêm"
                show={showModal}
                // handleCloseModal={handleReload}
                handleNoClicked={handleReload}
                handleYesClicked={handleRedirectToProductList}
              />
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <h4 className="text-center mb-4 ">Tạo sản phẩm</h4>
                      {form}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductForm;
