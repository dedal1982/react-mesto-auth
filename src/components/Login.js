import { useState } from "react";

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };
  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <h2 className="entry-form__title">Вход</h2>
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
        minLength="4"
        value={password || ""}
        onChange={({ target: { value } }) => setPassword(value)}
      />
      <button className="entry-form__button" type="submit">
        Войти
      </button>
    </form>
  );
};
