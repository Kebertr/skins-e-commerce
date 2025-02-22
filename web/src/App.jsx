import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home"
import Register from "./pages/Register"
import LoggIn from "./pages/LoggIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/LoggIn" element={<LoggIn />} />
      </Routes>
    </Router>
  )
}

export default App;

