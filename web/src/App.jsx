import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Account from "./pages/Account";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import LoggIn from "./pages/LoggIn";
import Register from "./pages/Register";
import Details from "./pages/Details";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/LoggIn" element={<LoggIn />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Basket" element={<Basket />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Details/:id" element={<Details />} />
      </Routes>
    </Router>
  )
}

export default App;