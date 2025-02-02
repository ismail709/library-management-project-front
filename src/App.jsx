
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CollectionPage from "./pages/CollectionPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import BookPage from "./pages/BookPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import MostRentedPage from "./pages/MostRentedPage";
import RecentPage from "./pages/RecentPage";
import PopularPage from "./pages/PopularPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RentPage from "./pages/RentPage";
import ReservationsPage from "./pages/ReservationsPage";
import FavoritesPage from "./pages/FavoritesPage";


export default function App(){
  const queryClient = new QueryClient();
  return <div className="overflow-hidden min-h-screen flex flex-col">
  <QueryClientProvider client={queryClient}>
    <NavBar />
    <div className="grow w-full max-w-full lg:max-w-5xl mx-auto">
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/c/:id?" element={<CategoryPage />} />
      <Route path="/cl/:id" element={<CollectionPage />} />
      <Route path="/book/:slug" element={<BookPage />} />
      <Route path="/mostrented" element={<MostRentedPage />} />
      <Route path="/popular" element={<PopularPage />} />
      <Route path="/recent" element={<RecentPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/rent/:slug" element={<RentPage />} />
      </Route>
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
    </div>
    <Footer />
    <ReactQueryDevtools initialIsOpen={true} />
  </QueryClientProvider>
  </div>
}