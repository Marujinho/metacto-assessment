import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { FeaturePage } from "./pages/FeaturePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/features/:slug" element={<FeaturePage />} />
      </Route>
    </Routes>
  );
}
