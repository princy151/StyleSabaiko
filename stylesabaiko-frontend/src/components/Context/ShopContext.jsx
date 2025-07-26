import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env['REACT_APP_BACKEND_URL']}/product/get-all`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  const contextValue = { products };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
