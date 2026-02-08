import AppRoutes from "./routes";
import { InstallPrompt } from "./components/app/InstallPrompt";

const App = () => {
  return (
    <div>
      <AppRoutes />
      <InstallPrompt />
    </div>
  );
};

export default App;

