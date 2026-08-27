import { useState } from 'react';
import Home from './pages/public/Home';
import AuthModal from './components/auth/AuthModal';
import "./styles/global.css";

function App() {
 return(
  <>
  <Home/>
  <AuthModal/>
  </>
 )
}

export default App
