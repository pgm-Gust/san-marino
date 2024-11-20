import "./Header.css";
import { Link } from "react-router-dom";
import Container from "../Container/Container";

const Header = () => {
  return (
    <header className="header">
      <Container>
        <nav className="header__nav">
          <ul className="nav">
            <li className="nav__item">
              <Link to="/">Home</Link>
            </li>
            <li className="nav__item">
              <Link to="/about">Over</Link>
            </li>
            <li className="nav__item">
              <Link to="/tanks">Tanks</Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
