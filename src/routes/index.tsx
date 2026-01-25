import ResolveMainPage from "@/layout/ResolveMainPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<ResolveMainPage />} />
        </Routes>       
      </Router>
    </div>
  );
};

export default AppRoutes;
