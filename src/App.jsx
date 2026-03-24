import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Frontend/context/AuthContext";

import Login from "./Frontend/pages/Login";
import Signup from "./Frontend/pages/Signup";
import Landing from "./Frontend/pages/Landing";
import CategoryPage from "./Frontend/pages/CategoryPage";
import About from "./Frontend/pages/About";
import Contact from "./Frontend/pages/Contact";
import ChatBot from "./Frontend/components/ChatBot/ChatBot";

function App() {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <ChatBot />
      </div>
    </AuthProvider>
  );
}

export default App;