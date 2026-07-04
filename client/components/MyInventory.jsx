import React from "react";
import ItemList from "./ItemList.jsx";
import { getMyItems } from "../api.js";

const MyInventory = () => (
  <ItemList title="My Inventory" fetchItems={getMyItems} />
);

export default MyInventory;
