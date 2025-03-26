import { Button } from '../Button/Button';
import { UserAPI } from '../../../api/user';
import { useState, useRef, useEffect } from 'react';
import { PopUp } from '../PopUp/PopUp';
import { isValidEmail } from '../../Utils/helper';

import './SignUp.css';

export const SignUp = ({ formData, signUpFormState, signUpFormAnimationEndType, handleAnimationEnd, handleChange, goLoginFunc }) => {
	const [openPopup, setOpenPopup] = useState(false);
	const [popupContent, setPopupContent] = useState('');
	const [goLogin, setGoLogin] = useState(false);
	const usernameInput = useRef(null);
	const emailInput = useRef(null);
	const passwordInput = useRef(null);

	const handleFormButtonClick = (e) => {
		e.preventDefault();

		setOpenPopup(true);

		if (formData.username === '' || formData.email === '' || formData.password === '') {
			setPopupContent('All fields are required');
		} else if (!isValidEmail(formData.email)) {
			setPopupContent('Invalid email format');
		} else {
			UserAPI.signUp(formData)
				.then((response) => {
					if (response.status === 201) {
						setPopupContent('Sign up successful');
						setGoLogin(true);
					}
				})
				.catch((error) => {
					if (error.response.status === 400) {
						setPopupContent('Email already exists');
					}
				});
		}
	};

	const handlePopupClose = () => {
		setOpenPopup(false);
		if (goLogin) {
			goLoginFunc();
			setGoLogin(false);
		}
	};

	useEffect(() => {
		usernameInput.current.focus();
		usernameInput.current.value = '';
		emailInput.current.value = '';
		passwordInput.current.value = '';
	}, [signUpFormState]);

	return (
		<div>
			<form style={signUpFormState} className="form" id="signUpForm" onAnimationEnd={() => handleAnimationEnd(signUpFormAnimationEndType)}>
				<div className="inputContainer" id="signUpInputContainer">
					<div className="InputBackground SignUpInputBackground">
						<input type="text" spellCheck="false" name="username" id="usernameSignUp" ref={usernameInput} placeholder="Username" className="Input" maxLength={16} onChange={(event) => handleChange(event)} />
					</div>
					<div className="InputBackground SignUpInputBackground">
						<input type="text" spellCheck="false" name="email" id="emailSignUp" placeholder="Email" ref={emailInput} className="Input" onChange={(event) => handleChange(event)} />
					</div>
					<div className="InputBackground SignUpInputBackground">
						<input type="password" spellCheck="false" name="password" id="passwordSignUp" placeholder="Password" ref={passwordInput} className="Input" onChange={(event) => handleChange(event)} />
					</div>
					<Button text="SignUp" backgroundImage="/assets/Sprites/Button_Red_3Slides.png" top="520px" left="50%" onClick={(e) => handleFormButtonClick(e)}></Button>
				</div>
			</form>

			<PopUp openPopup={openPopup} setOpenPopup={setOpenPopup} handleClick={handlePopupClose}>
				{popupContent}
			</PopUp>
		</div>
	);
};
