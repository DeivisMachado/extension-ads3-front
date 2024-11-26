import { Link } from 'react-router-dom';
import '../css/nav.css'
import logoNav from '../img/logo-nav.webp';
import axios from 'axios';

export const Navbar = ({ isAdmin, onCadastrar, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
    onLogout();
  };

  return (
    <nav className="mask">
      <div className="logo-nav">
        <img src={logoNav} alt="logo" />
      </div>
      <div className="container-nav">
        <div className="frase-nav">
          <h4>O que você procura?</h4>
        </div>
        <ul className="list">
          <li><Link to="/">Tudo</Link></li>
          <li><Link to="/?tipo=PREINCUBADORA">Pré-Incubadoras</Link></li>
          <li><Link to="/?tipo=INCUBADORA">Incubadoras</Link></li>
          <li><Link to="/?tipo=ACELERADORA">Aceleradoras</Link></li>
          {isAdmin ? (
            <>
              <li><button onClick={() => {
                console.log('Botão cadastrar clicado');
                onCadastrar();
              }}>Cadastrar</button></li>
              <li><button onClick={handleLogout}>Sign out</button></li>
            </>
          ) : (
            <li><Link to="/login"><button>Sign in</button></Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}; 