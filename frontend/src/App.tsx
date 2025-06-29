import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AppRoutes from "./routing/AppRoutes";

function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
}

export default App;
