import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<h1>LOGIN ROUTE TEST</h1>}
        />

        <Route
          path="/admin"
          element={<h1>ADMIN ROUTE WORKS!</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
