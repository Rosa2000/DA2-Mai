import React from "react";
import ProductList from "./ProductList/ProductList";
import ProductDetail from "./ProductDetail/ProductDetail";

import { Switch, Route } from "react-router-dom";
const SkinCareProducts = () => {
  // const { search } = useLocation();
  // const searchParams = new URLSearchParams(search);
  // const SKU = searchParams.get("SKU");
  // <h1>Chăm sóc da mặt</h1>
  let routes = (
    <Switch>
      <Route exact={true} path="/shopping/skin-care">
        <ProductList />
      </Route>
      {/* <Route exact={true} path="/shopping/product-detail">
        <ProductDetail category="Chăm sóc da mặt" />
      </Route> */}
    </Switch>
  );
  return <>
    <h1>Chăm sóc da mặt</h1>
    {routes}
  </>;
};

export default SkinCareProducts;
