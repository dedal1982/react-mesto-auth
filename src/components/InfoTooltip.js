import checkMarkIcon from '../images/сheck-mark.svg';
import crossIcon from '../images/cross.svg';
import { useEffect } from 'react'

export const InfoTooltip = ({ isOpen, onClose, isSuccess }) => {
	useEffect(() => {
		if (!isOpen) return

		function handleESC(e) {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleESC)

		return () => document.removeEventListener('keydown', handleESC)
	}, [isOpen, onClose])

	return (
		<div
			className={`popup popup_type_info-tooltip ${isOpen ? `popup_opened` : ""}`}
			onClick={onClose}
		>
			<div className="popup__container popup__container_type_tooltip" onClick={(e) => e.stopPropagation()} >
				<button
					aria-label="Закрыть"
					type="button"
					className="popup__close"
					onClick={onClose}
				/>
				<img
					src={isSuccess ? checkMarkIcon : crossIcon}
					alt={isSuccess ? "Галочка" : "Крестик"}
					className="popup__icon"
					/>
				<h3 className="popup__text">
					{isSuccess ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}
				</h3>
			</div>
		</div>
	)
}