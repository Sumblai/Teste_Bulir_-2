import { AppRoutes } from "./app/routes";
import store from "./app/providers/store";
import { Provider } from "react-redux";


function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
  </Provider>
  );
}

export default App;
