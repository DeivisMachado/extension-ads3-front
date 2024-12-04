import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/nav.css'
import logoNav from '../img/logo-nav.webp';
import axios from 'axios';

export const Navbar = ({ isAdmin, onCadastrar, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
    onLogout();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=menu" />
      <span 
        className="material-symbols-outlined menu-icon" 
        onClick={toggleMenu}
      >
        menu
      </span>
      <div className={`menu-overlay ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      <nav className={`mask ${menuOpen ? 'active' : ''}`}>
        <div className="logo-nav">
          <img src={logoNav} alt="logo" />
        </div>
        <ul className="list">
          <li><Link to="/" onClick={toggleMenu}>Tudo</Link></li>
          <li><Link to="/?tipo=PREINCUBADORA" onClick={toggleMenu}>Pré-Incubadoras</Link></li>
          <li><Link to="/?tipo=INCUBADORA" onClick={toggleMenu}>Incubadoras</Link></li>
          <li><Link to="/?tipo=ACELERADORA" onClick={toggleMenu}>Aceleradoras</Link></li>
          {isAdmin ? (
            <>
              <li><button onClick={() => {
                onCadastrar();
                toggleMenu();
              }}>Cadastrar</button></li>
              <li><button onClick={() => {
                handleLogout();
                toggleMenu();
              }}>Sign out</button></li>
            </>
          ) : (
            <li><Link to="/login" onClick={toggleMenu}><button>Sign in</button></Link></li>
          )}
        </ul>
      </nav>
    </>
  );
}; 