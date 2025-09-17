import { BrowserRouter, Routes, Route } from "react-router";

import UserLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/Home";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
