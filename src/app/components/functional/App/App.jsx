import { Outlet } from "react-router";
import Header from "@design/Header/Header";
import Footer from "@design/Footer/Footer";

const App = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default App;
