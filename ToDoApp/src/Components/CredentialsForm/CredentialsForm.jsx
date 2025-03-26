import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { LoginForm } from '../LoginForm/LoginForm';
import { SignUp } from '../SignUpForm/SignUp';
import { useSoundHandler } from '../../Utils/SoundHandler';

import './CredentialsForm.css';

export const CredentialsForm = () => {
	const navigate = useNavigate();
	const { playSound } = useSoundHandler();

	const [expand, setExpand] = useState(false);
	const [loginBannerState, setLoginBannerState] = useState({ animation: 'none', transform: 'scale(0)' });
	const [signUpBannerState, setSignUpBannerState] = useState({ animation: 'none', transform: 'scale(0)' });
	const [loginFormState, setLoginFormState] = useState({ animation: 'expand 0.7s ease forwards' });
	const [signUpFormState, setSignUpFormState] = useState({ animation: 'expand 0.7s ease forwards' });
	const [loginFormAnimationEndType, setLoginFormAnimationEndType] = useState('expandSignUpBanner');
	const [signUpFormAnimationEndType, setSignUpFormAnimationEndType] = useState('expandLoginFormBanner');
	//Informacion de los forms
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		email: '',
	});
	const soundRef = useRef(null);

	const handleHover = (isHovered) => {
		let soundPath = '/assets/Sounds/leather_inventory.wav';

		if (!isHovered) {
			soundPath = '/assets/Sounds/cloth-inventory.wav';
		}

		playSound(soundPath);

		setExpand(isHovered);
	};

	const handleAnimationEnd = (animationEndType) => {
		switch (animationEndType) {
			case 'expandSignUpBanner':
				setSignUpBannerState({ display: 'block', animation: 'appear 0.5s', transform: 'scale(1)' });
				break;
			case 'loginFormcollapsed':
				setSignUpFormState({ display: 'flex', animation: 'expand 0.7s ease forwards' });
				setLoginFormState({ display: 'none' });
				setSignUpFormAnimationEndType('expandLoginFormBanner');
				break;
			case 'expandLoginFormBanner':
				setLoginBannerState({ display: 'block', animation: 'appear 0.5s', transform: 'scale(1)' });
				break;
			case 'signUpFormcollapsed':
				setLoginFormState({ display: 'flex', animation: 'expand 0.7s ease forwards' });
				setSignUpFormState({ display: 'none' });
				setLoginFormAnimationEndType('expandSignUpBanner');
				break;
			case 'none':
				break;
		}
	};

	const handleBannerClick = (type) => {
		switch (type) {
			case 'disappearLogin':
				setLoginFormState({ display: 'flex', animation: 'collapse 0.7s forwards' });
				setSignUpBannerState({ display: 'none' });
				setLoginFormAnimationEndType('loginFormcollapsed');
				break;
			case 'disappearSignUp':
				setSignUpFormState({ display: 'flex', animation: 'collapse 0.7s forwards' });
				setLoginBannerState({ display: 'none' });
				setSignUpFormAnimationEndType('signUpFormcollapsed');
		}
		setFormData({
			username: '',
			password: '',
			email: '',
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const goLoginFunc = () => {
		setSignUpFormState({ display: 'flex', animation: 'collapse 0.7s forwards' });
		setLoginBannerState({ display: 'none' });
		setSignUpFormAnimationEndType('signUpFormcollapsed');
	};

	return (
		<div id="credentialsFormContainer">
			<div style={loginBannerState} id="loginBanner" className={`banner ${expand ? 'expand' : ''}`} onClick={() => handleBannerClick('disappearSignUp')} onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}></div>

			<div style={signUpBannerState} id="signUpBanner" className={`banner ${expand ? 'expand' : ''}`} onClick={() => handleBannerClick('disappearLogin')} onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}></div>

			<LoginForm navigate={navigate} formData={formData} loginFormState={loginFormState} loginFormAnimationEndType={loginFormAnimationEndType} handleAnimationEnd={handleAnimationEnd} handleChange={handleChange}></LoginForm>

			<SignUp formData={formData} signUpFormState={signUpFormState} signUpFormAnimationEndType={signUpFormAnimationEndType} handleAnimationEnd={handleAnimationEnd} handleChange={handleChange} goLoginFunc={goLoginFunc}></SignUp>

			<audio ref={soundRef}></audio>
		</div>
	);
};
