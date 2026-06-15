import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RegisterRestaurant from './pages/RegisterRestaurant';

import CustomerLayout from './components/customer/CustomerLayout';
import Explore from './pages/customer/Explore';
import BrowseRestaurants from './pages/customer/BrowseRestaurants';
import CheckoutPage from './pages/customer/CheckoutPage';
import UserDashboard from './pages/customer/UserDashboard';
import TableReservation from './pages/customer/TableReservation';
import RestaurantMenu from './pages/customer/RestaurantMenu';
import OrdersPage from './pages/customer/OrdersPage';
import ReservationsPage from './pages/customer/ReservationsPage';
import ProfilePage from './pages/customer/ProfilePage';
import FavoritesPage from './pages/customer/FavoritesPage';
import OffersPage from './pages/customer/OffersPage';
import SettingsPage from './pages/customer/SettingsPage';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminApproveRestaurants from './pages/admin/AdminApproveRestaurants';
import AdminAllRestaurants from './pages/admin/AdminAllRestaurants';
import AdminRestaurantApprovalDetail from './pages/admin/AdminRestaurantApprovalDetail';
import AdminEditRestaurant from './pages/admin/AdminEditRestaurant';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

import OwnerLayout from './components/owner/OwnerLayout';
import OwnerDashboardHome from './pages/owner/OwnerDashboardHome';
import OwnerOrdersPage from './pages/owner/OwnerOrdersPage';
import OwnerMenuPage from './pages/owner/OwnerMenuPage';
import OwnerCustomersPage from './pages/owner/OwnerCustomersPage';
import OwnerReportsPage from './pages/owner/OwnerReportsPage';
import OwnerSettingsPage from './pages/owner/OwnerSettingsPage';
import OwnerReservationsPage from './pages/owner/OwnerReservationsPage';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
          
            <Route path="/"                    element={<LandingPage />} />
            <Route path="/login"               element={<Login />} />
            <Route path="/signup"              element={<Signup />} />
            <Route path="/register-restaurant" element={<RegisterRestaurant />} />

         
            <Route element={<CustomerLayout />}>
              <Route path="/explore"                    element={<Explore />} />
              <Route path="/browse"                     element={<BrowseRestaurants />} />
              <Route path="/restaurant/:id/menu"        element={<RestaurantMenu />} />
              <Route path="/restaurant/:id/reserve"     element={<TableReservation />} />
              <Route path="/checkout"                   element={<CheckoutPage />} />
              <Route path="/orders"                     element={<OrdersPage />} />
              <Route path="/reservations"               element={<ReservationsPage />} />
              <Route path="/dashboard"                  element={<UserDashboard />} />
              <Route path="/profile"                    element={<ProfilePage />} />
              <Route path="/favorites"                  element={<FavoritesPage />} />
              <Route path="/offers"                     element={<OffersPage />} />
              <Route path="/settings"                   element={<SettingsPage />} />
            </Route>

          
            <Route path="/admin" element={<AdminLayout />}>
              <Route index                              element={<AdminDashboardHome />} />
              <Route path="approve"                     element={<AdminApproveRestaurants />} />
              <Route path="approve/:id"                 element={<AdminRestaurantApprovalDetail />} />
              <Route path="restaurants"                 element={<AdminAllRestaurants />} />
              <Route path="restaurants/:id/edit"        element={<AdminEditRestaurant />} />
              <Route path="users"                       element={<AdminUsersPage />} />
              <Route path="orders"                      element={<AdminOrdersPage />} />
              <Route path="reports"                     element={<AdminReports />} />
              <Route path="settings"                    element={<AdminSettings />} />
            </Route>

        
            <Route path="/owner" element={<OwnerLayout />}>
              <Route index                              element={<OwnerDashboardHome />} />
              <Route path="orders"                      element={<OwnerOrdersPage />} />
              <Route path="menu"                        element={<OwnerMenuPage />} />
              <Route path="reservations"                element={<OwnerReservationsPage />} />
              <Route path="customers"                   element={<OwnerCustomersPage />} />
              <Route path="reports"                     element={<OwnerReportsPage />} />
              <Route path="settings"                    element={<OwnerSettingsPage />} />
            </Route>

          
            <Route path="/Login"     element={<Navigate to="/login"  replace />} />
            <Route path="/Signup"    element={<Navigate to="/signup" replace />} />
            <Route path="/admin-old" element={<Navigate to="/admin"  replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}