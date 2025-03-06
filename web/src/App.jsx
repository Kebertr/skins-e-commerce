import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Account from "./pages/Account";
import AdminPage from "./pages/AdminPage";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import Details from "./pages/Details";
import Home from "./pages/Home";
import LoggIn from "./pages/LoggIn";
import Register from "./pages/Register";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/LoggIn" element={<LoggIn />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Details/:id" element={<Details />} />
        <Route path="/Basket" element={<Basket />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/adminPage" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App;