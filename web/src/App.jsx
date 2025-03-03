import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoggIn from "./pages/LoggIn";
import Register from "./pages/Register";
import Account from "./pages/Account";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/LoggIn" element={<LoggIn />} />
        <Route path="/Account" element={<Account />} />
      </Routes>
    </Router>
  )
}

export default App;