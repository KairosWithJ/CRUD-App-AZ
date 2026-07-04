import React from "react";
import ItemList from "./ItemList.jsx";
import { getAllItems } from "../api.js";

const AllItems = () => <ItemList title="All Items" fetchItems={getAllItems} />;

export default AllItems;
