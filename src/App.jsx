
import './App.css';
import { Helmet } from 'react-helmet'; // Import Helmet for SSR meta management
import SignUp from './components/signup/Signup';
import Login from './components/login/Login';
import HomePage from './components/HomePage';
import Categories from './components/category/Categories';
import ProductDetail from './components/product-detail/ProductDetail';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      {/* Helmet for default meta tags on other pages */}
      <Helmet>
        <title>My Vite SSR App</title>
        <meta name="description" content="This is a Vite SSR React app with dynamic meta tags." />
      </Helmet>

      {/* React Router Routes */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
};

export default App;
