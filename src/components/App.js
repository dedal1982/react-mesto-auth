import { useEffect, useState, useCallback } from "react";
import ImagePopup from "./ImagePopup";
import { Header } from "./Header";
import Footer from "./Footer";
import Main from "./Main";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

import { api } from "../utils.js/api";
import * as authApi from "../utils.js/authApi";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Register } from "./Register";
import { Login } from "./Login";
import { InfoTooltip } from "../components/InfoTooltip";

const App = () => {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  const [isInfoTooltipStatus, setIsInfoTooltipStatus] = useState(null);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const handleEditAvatarClick = useCallback(() => {
    setEditAvatarPopupOpen(true);
  }, []);

  const handleEditProfileClick = useCallback(() => {
    setEditProfilePopupOpen(true);
  }, []);

  const handleAddPlaceClick = useCallback(() => {
    setAddPlacePopupOpen(true);
  }, []);

  const handleCardClick = useCallback((card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }, []);

  const closeAllPopups = useCallback(() => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipOpen(false);
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((item) => item._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    const isOwn = card._id === currentUser._id;
    api
      .deleteCard(card._id, !isOwn)
      .then(() => {
        setCards((state) => state.filter((res) => res._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(data) {
    api
      .setUserData(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }

  function handleUpdateAvatar(data) {
    api
      .setUserAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addNewPhotocard(name, link)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch(() => {
        console.log("error");
      });
  }

  useEffect(() => {
    Promise.all([api.getDataUser(), api.getInitialsCards()])
      .then(([data, cards]) => {
        setCurrentUser(data);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    handleTokenCheck();
  }, []);

  const handleTokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      return;
    }
    authApi
      .getContent(jwt)
      .then((data) => {
        setUserData(data.data.email);
        setLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        console.log(`handleTokenCheck - ошибка: ${err}`);
      });
  };

  const onRegister = ({ email, password }) => {
		authApi
			.registration({ email, password })
			.then((data) => {
				if (data) {
					setIsInfoTooltipStatus(true);
					navigate('/sign-in');
				}
			})
			.catch((err) => {
				console.log(`onRegister - ошибка: ${err}`);
			})
			.finally(setIsInfoTooltipOpen(true))
	}
  const onLogin = ({ email, password }) => {
    authApi
      .authorization({ email, password })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          setUserData(email);
          navigate("/");
        }
      })
      .catch((err) => {
        setIsInfoTooltipStatus(false);
        setIsInfoTooltipOpen(true);
        console.log(`onRegister - ошибка: ${err}`);
      });
  };
  const onExit = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    navigate("/sign-in");
    setUserData("");
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header onExit={onExit} userEmail={userData} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                loggedIn={loggedIn}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
              />
            }
          />
          <Route path="/sign-in" element={<Login onLogin={onLogin} />} />
          <Route
            path="/sign-up"
            element={<Register onRegister={onRegister} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        ></ImagePopup>

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccess={isInfoTooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
