import './MouseRight.css';

export const MouseRight = ({ mouseRightClick, text }) => {
	return (
		<div id="mouseRightClick" style={{ top: mouseRightClick.top, left: mouseRightClick.left, display: mouseRightClick.display, scale: '0.8' }}>
			<h1 id="mouseRightClickText">{text}</h1>
		</div>
	);
};
