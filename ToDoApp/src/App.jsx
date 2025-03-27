import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './Routes/Login/Login';
import { Guild } from './Routes/Guild/Guild';
import { Home } from './Routes/Home/Home';
import { Chat } from './Routes/Chat/Chat';
import { Map } from './Routes/Map/Map';
import { Kingdom } from './Routes/Kingdom/Kingdom';
import { GlobalProvider } from './Context/GlobalContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './App.css';

function App() {
	return (
		<BrowserRouter>
			<GlobalProvider>
				<DndProvider backend={HTML5Backend}>
					<AppContent />
				</DndProvider>
			</GlobalProvider>
		</BrowserRouter>
	);
}

function AppContent() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/guild" element={<Guild />} />
			<Route path="/home" element={<Home />} />
			<Route path="/map" element={<Map />} />
			<Route path="/chat" element={<Chat />} />
			<Route path="/kingdom/:kingdomId" element={<Kingdom />} />
		</Routes>
	);
}

export default App;
