import axios from "axios";
import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import authHeader from "../../services/auth-header";
import ConfirmModal from "../confirmModal";

const baseURL = process.env.REACT_APP_URL_PRODUCTS_API;

const ProductDataTable = () => {
  const [productData, setProductData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [SKU, setSKU] = useState();
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      name: "SKU",
      selector: (row) => row.SKU,
      sortable: true,
      maxWidth: "50px",
    },

    {
      name: "Tên sản phẩm",
      selector: (row) => row.productName,
      sortable: true,
      wrap: true,
    },

    {
      name: "Thương hiệu",
      selector: (row) => row.brand,
      sortable: true,
      wrap: true,
      maxWidth: "150px",
    },

    {
      name: "Phân loại",
      selector: (row) => row.category,
      sortable: true,
      wrap: true,
      maxWidth: "150px",
    },

    {
      name: "Số lượng kho",
      selector: (row) => row.inStockValue,
      sortable: true,
      maxWidth: "150px",
    },

    {
      name: "Giá nhập",
      selector: (row) => row.entryPrice.toLocaleString(),
      sortable: true,
      maxWidth: "100px",
    },

    {
      name: "Giá bán",
      selector: (row) => row.salePrice.toLocaleString(),
      sortable: true,
      maxWidth: "100px",
    },

    {
      name: "Cập nhật",
      cell: (row) => (
        <Link
          to={{
            pathname: `/products/edit-product`,
            search: `?SKU=${row.SKU}`,
          }}
          className="btn btn-secondary shadow btn-xs sharp mr-2"
          id={row.SKU}
        >
          <i className="bi bi-pencil"></i>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      maxWidth: "100px",
    },

    {
      name: "Xoá",
      cell: (row) => (
        <button
          onClick={() => deleteClickProduct(row.SKU)}
          className="btn btn-danger shadow btn-xs sharp"
        >
          <i className="bi bi-trash"></i>
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      maxWidth: "100px",
    },
  ];

  useEffect(() => {
    setLoading(false);
    getProductData();
  }, [loading]);

  const getProductData = async () => {
    axios
      .get(`${baseURL}/productlist`, {
        headers: { "x-access-token": authHeader() },
      })
      .then((res) => {
        const productDataList = res.data;
        setProductData(productDataList);
      })
      .catch((err) => {
        console.log("ERROR IN PRODUCT DATA TABLE: ", err);
      });
  };
  //Delete Click
  const deleteClickProduct = (SKU) => {
    setSKU(SKU);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleDeleteConfirmedClick = () => {
    axios
      .post(`${baseURL}/delete`, "", {
        headers: { "x-access-token": authHeader() },
        params: { SKU: SKU },
      })
      .then((res) => {
        setShowModal(false);
        setLoading(true);
      })
      .catch((err) => {
        console.log("DELETE PRODUCT ERR: ", err);
      });
  };

  return (
    <>
      <ConfirmModal
        title = "Xoá sản phẩm"
        body = "Bạn có chắc chắn muốn xóa sản phẩm này?"
        btnAction = "Chắc chắn"
        btnCancel = "Quay lại"
        show = {showModal}
        handleNoClicked = {handleCloseModal}
        handleYesClicked = {handleDeleteConfirmedClick}
      />
      <DataTable columns = {columns} data = {productData} pagination />
    </>
  );
};
export default ProductDataTable;
