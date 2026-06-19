/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Visas from './pages/Visas';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cars from './pages/Cars';
import CarOrder from './pages/CarOrder';
import Tracking from './pages/Tracking';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ServiceDetail from './pages/ServiceDetail';
import HotelBooking from './pages/HotelBooking';
import TravelInsurance from './pages/TravelInsurance';
import MoneyTransfer from './pages/MoneyTransfer';
import CargoService from './pages/CargoService';
import MobileMoneyService from './pages/MobileMoneyService';
import { ThemeProvider } from './components/ThemeContext';
import { SiteProvider } from './components/SiteContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <SiteProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              className: 'bg-navy-800 text-text border border-gold/30',
              style: {
                borderRadius: '8px',
                background: '#1A2942',
                color: '#fff',
                border: '1px solid rgba(212, 176, 105, 0.3)',
              },
            }}
          />
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="flights" element={<Flights />} />
              <Route path="visas" element={<Visas />} />
              <Route path="shop" element={<Shop />} />
              <Route path="shop/:id" element={<ProductDetails />} />
              <Route path="cars" element={<Cars />} />
              <Route path="cars/order/:id" element={<CarOrder />} />
              <Route path="tracking" element={<Tracking />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="contact" element={<Contact />} />
              <Route path="hotel-booking" element={<HotelBooking />} />
              <Route path="travel-insurance" element={<TravelInsurance />} />
              <Route path="money-transfer" element={<MoneyTransfer />} />
              <Route path="cargo" element={<CargoService />} />
              <Route path="mobile-money-service" element={<MobileMoneyService />} />
              <Route path="services/:id" element={<ServiceDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SiteProvider>
  );
}
