import './MapSpritesTable.css';

export const MapSpritesTable = () => {
	// const [tableItems, setTableItems] = useState([]);
	// const [draggedItem, setDraggedItem] = useState(null);

	// Lista de elementos para arrastrar
	const items = ['grass.png', 'sand.png', 'shadow.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'grass.png', 'sand.png', 'shadow.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png', 'elevation1.png'];

	// Manejadores de Drag & Drop
	// const handleDragStart = (item) => {
	// 	setDraggedItem(item);
	// };

	// const handleDragOver = (e) => {
	// 	e.preventDefault();
	// };

	return (
		<div id="mapSpritesContainer">
			{items.map((item, index) => (
				<img key={index} draggable className="sprite" src={`/assets/Sprites/${item}`} alt="" />
			))}
		</div>
	);
};
