import HeaderLogo from "../images/header-logo.svg";
import { Route, Routes, NavLink } from 'react-router-dom'

export const Header = ({ onExit, userEmail }) => {
  return (
    <header className="header">
      <img className="header__logo" src={HeaderLogo} alt="Лого" />
      <Routes>
				<Route path="/sign-in" element={
					<NavLink to="/sign-up" className="header__link">Регистрация</NavLink>
				}
				/>

				<Route path="/sign-up" element={
					<NavLink to="/sign-in" className="header__link">Войти</NavLink>
				}
				/>

				<Route
					path="/"
					element={
						<nav className="header__nav">
							<p className="header__email">{userEmail}</p>
							<NavLink
								to="/sign-in"
								className="header__link header__link_color_grey"
								onClick={onExit}
							>
								Выйти
							</NavLink>
						</nav>
					}
				/>
			</Routes>
    </header>
  );
}


