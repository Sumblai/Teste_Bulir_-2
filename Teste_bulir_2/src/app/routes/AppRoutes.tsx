import HomeClient from "../../modules/Home/ClientHome/presentation/pages/HomeClient";
import { HomeProvider } from "../../modules/Home/ProviderHome/presentaion/pages/HomeProvider";
import Login from "../../modules/auth/providerAuth/prsentation/ProviderAuth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "../../modules/auth/providerAuth/prsentation/pages/Sign";
import BookingList from "../../modules/Home/ClientHome/presentation/components/BookingList";
import BookingHistoryTable from "../../modules/Home/ProviderHome/presentaion/components/BookingHistory";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<Register />} />
        <Route path="/HomeClient" element={<HomeClient />} />
        <Route path="/HomeProvider" element={<HomeProvider />} />
        <Route path="/BookingList" element={<BookingList />} />
        <Route path="/BookingHistoryProvider" element={<BookingHistoryTable />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
