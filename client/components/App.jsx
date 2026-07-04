import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import Nav from "./Nav.jsx";
import AllItems from "./AllItems.jsx";
import MyInventory from "./MyInventory.jsx";
import ItemDetail from "./ItemDetail.jsx";
import NewItem from "./NewItem.jsx";
import SignUp from "./SignUp.jsx";
import Login from "./Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<AllItems />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route
              path="/items/new"
              element={
                <ProtectedRoute>
                  <NewItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <MyInventory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
