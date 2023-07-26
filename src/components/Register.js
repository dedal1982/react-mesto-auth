import { useState } from "react";
import { Link } from "react-router-dom";

export const Register = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ email, password });

  };
  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <h2 className="entry-form__title">Регистрация</h2>
      <input
        className="entry-form__input"
        type="email"
        name="email"
        placeholder="Email"
        value={email || ""}
        onChange={({ target: { value } }) => setEmail(value)}
      />
      <input
        className="entry-form__input"
        type="password"
        name="password"
        placeholder="Пароль"
        value={password || ""}
        onChange={({ target: { value } }) => setPassword(value)}
      />
      <button className="entry-form__button" type="submit">
        Зарегистрироваться
      </button>
      <Link to="/sign-in" className="entry-form__link">
        Уже зарегистрированы? Войти
      </Link>
    </form>
  );
};
