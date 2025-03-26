import { useState, useEffect, useContext } from 'react';
import { TileMapDefaultTiles } from '../../Data/TileMapDefaultTiles';
import { GlobalContext } from '../../Context/GlobalContext';
import { Button } from '../Button/Button';
import { GuildsAPI } from '../../../api/guilds';
import { MouseRight } from '../../MouseRight/MouseRight';

import './TileMap.css';

export const TileMap = ({ canEdit, setCanEdit }) => {
	// Tiles
	const [tiles, setTiles] = useState([]);
	const [mouseRightClick, setMouseRightClick] = useState({
		top: 0,
		left: 0,
		offsetX: 24,
		offsetY: -120,
		display: 'none',
	});

	const globalContext = useContext(GlobalContext);

	// Manejador de cuando se arrastra un sprite y esta sobre un tile del tileMap
	const handleDragOver = (e, isHovered) => {
		e.preventDefault();

		const tile = e.target;

		// Si esta sobre el tile
		if (isHovered) {
			// Añadir sombra
			tile.style.boxShadow = '0 0 30px 15px white';
		} else {
			// Quitar sombra
			tile.style.removeProperty('box-shadow');
		}
	};

	// Manejador de cuando se dropea un sprite sobre el tile del tileMap
	const handleDrop = (e, tileInfo) => {
		e.preventDefault();

		const tile = e.target;

		// Quitar sombra porque el onDragLeave no se llama al hacer el drop
		tile.style.removeProperty('box-shadow');

		// Obtener el sprite que se esta arrastrando
		const htmlContent = e.dataTransfer.getData('text/html');
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = htmlContent;
		const imgElement = tempDiv.querySelector('img');

		// Capa del tile nuevo que se coloca
		const tileBelowLayer = tileInfo.layer;

		// Informacion del nuevo tile
		const tileBelow = {
			id: tileInfo.pos[0].toString() + tileInfo.pos[1].toString() + tileBelowLayer.toString(),
			className: tileInfo.pos[0].toString() + tileInfo.pos[1].toString() + tileBelowLayer.toString() + ' tile tileAnimation',
			pos: tileInfo.pos,
			layer: tileBelowLayer,
			left: tileInfo.left,
			top: tileInfo.top,
			zIndex: tileBelowLayer.toString(),
			backgroundImage: `url(${imgElement.src})`,
		};

		const updatedTiles = [];

		// Actualizamos la informacion de los tiles
		for (let i = 0; i < tiles.length; i++) {
			// Actualizamos la informacion del tile que recibe el sprite
			if (tiles[i].id === tileInfo.id) {
				tiles[i].layer += 1;
				tiles[i].id = tiles[i].pos[0].toString() + tiles[i].pos[1].toString() + tiles[i].layer.toString();
				tiles[i].zIndex = tiles[i].layer.toString();
				tiles[i].className = tiles[i].id + ' tile';
				// Anadimos el nuevo tile que va debajo del que ya estaba
				updatedTiles.push(tileBelow);
			}

			updatedTiles.push(tiles[i]);
		}

		setTiles(updatedTiles);

		// Quitar el div que ha ayudado a saber el sprite  que se ha arrastrado
		tempDiv.remove();
	};

	// Borrado de tile
	const handleRightClick = (e, tileInfo) => {
		e.preventDefault();

		if (tileInfo.layer <= 0) return;

		const updatedTiles = [];

		for (let i = 0; i < tiles.length; i++) {
			// Actualizamos la informacion del tile que recibe el borrado
			if (tiles[i].id === tileInfo.id) {
				tiles[i].layer -= 1;
				tiles[i].id = tiles[i].pos[0].toString() + tiles[i].pos[1].toString() + tiles[i].layer.toString();
				tiles[i].className = tiles[i].id + ' tile';
				tiles[i].zIndex = tiles[i].layer.toString();
			}

			// El tile que se va a borrar no lo metemos
			if (tiles[i].pos[0] === tileInfo.pos[0] && tiles[i].pos[1] === tileInfo.pos[1] && tiles[i].layer === tileInfo.layer - 1) {
				continue;
			}
			updatedTiles.push(tiles[i]);
		}

		setTiles(updatedTiles);
		setMouseRightClick({ top: mouseRightClick.top, left: mouseRightClick.left, offsetX: mouseRightClick.offsetX, offsetY: mouseRightClick.offsetY, display: 'none' });
	};

	// Manejador de cuando se pasa el mouse por encima de un tile con sprite
	const handleMouseOver = (e, tileInfo, display) => {
		e.preventDefault();

		if (tileInfo.layer <= 0) return;

		const top = (parseInt(tileInfo.top) + mouseRightClick.offsetY).toString() + 'px';
		const left = (parseInt(tileInfo.left) + mouseRightClick.offsetX).toString() + 'px';

		// Actualizamos la posicion del raton que muestra como quitar el sprite
		setMouseRightClick({ top: top, left: left, offsetX: mouseRightClick.offsetX, offsetY: mouseRightClick.offsetY, display: display });
	};

	// Manejador de cuando acaba la animacion del sprite recien colocado
	const handleAnimationEnd = (e, tileInfo) => {
		e.preventDefault();

		const updatedTiles = [];

		for (let i = 0; i < tiles.length; i++) {
			if (tiles[i].id === tileInfo.id) {
				// Quitar el className de Animation para que no se haga la animacion de nuevo al arrastrar un nuevo sprite
				tiles[i].className = tiles[i].pos[0].toString() + tiles[i].pos[1].toString() + tiles[i].layer.toString() + ' tile';
			}
			updatedTiles.push(tiles[i]);
		}

		setTiles(updatedTiles);
	};

	const setTileMap = () => {
		if (globalContext.guildInfo.tilemap.length !== 0) {
			setTiles(globalContext.guildInfo.tilemap);
		} else {
			TileMapDefaultTiles.tileMap.forEach((layer, layerIndex) => {
				layer.forEach((row, rowIndex) => {
					row.forEach((tile, colIndex) => {
						if (tile) {
							const tileInfo = {
								id: rowIndex.toString() + colIndex.toString() + layerIndex.toString(),
								className: rowIndex.toString() + colIndex.toString() + layerIndex.toString() + ' tile',
								pos: [rowIndex, colIndex],
								layer: layerIndex,
								left: `${colIndex * 64}px`,
								top: `${rowIndex * 64}px`,
								zIndex: layerIndex.toString(),
								backgroundImage: tile,
							};

							setTiles((prevState) => [...prevState, tileInfo]);
						}
					});
				});
			});
		}
	};

	useEffect(() => {
		setTileMap();
	}, []);

	const handleClick = (id) => {
		switch (id) {
			case 'save':
				GuildsAPI.saveTileMap(globalContext.guildInfo.guildname, tiles).then((response) => {
					if (response.status === 200) {
						globalContext.setGuildInfo({ ...globalContext.guildInfo, tilemap: tiles });
					}
				});
				setCanEdit(false);
				break;
			case 'cancel':
				setCanEdit(false);
				setTiles([]);
				setTileMap();
				break;
		}
	};

	return (
		<div id="tileMapContainer">
			<div id="tileMap" style={{ pointerEvents: canEdit ? 'all' : 'none' }}>
				<MouseRight mouseRightClick={mouseRightClick} text=""></MouseRight>
				{tiles.map((tile, index) => (
					<div
						key={index}
						className={tile.className}
						style={{ left: tile.left, top: tile.top, zIndex: tile.zIndex, backgroundImage: tile.backgroundImage }}
						onDrop={(e) => handleDrop(e, tile)}
						onDragOver={(e) => handleDragOver(e, true)}
						onDragLeave={(e) => handleDragOver(e, false)}
						onContextMenu={(e) => handleRightClick(e, tile)}
						onMouseEnter={(e) => handleMouseOver(e, tile, 'block')}
						onMouseLeave={(e) => handleMouseOver(e, tile, 'none')}
						onAnimationEnd={(e) => handleAnimationEnd(e, tile)}
					></div>
				))}
			</div>

			<div style={{ display: canEdit ? 'block' : 'none' }}>
				<Button
					text=""
					backgroundImage="/assets/Sprites/saveButton.png"
					backgroundImageHover="/assets/Sprites/saveButtonHover.png"
					backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
					width="64px"
					height="64px"
					widthHoverAnimation="96px"
					heightHoverAnimation="96px"
					top="-50px"
					left="0"
					onClick={() => handleClick('save')}
				></Button>
				<Button
					text=""
					backgroundImage="/assets/Sprites/cancelButton.png"
					backgroundImageHover="/assets/Sprites/cancelButtonHover.png"
					backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
					width="64px"
					height="64px"
					widthHoverAnimation="96px"
					heightHoverAnimation="96px"
					top="-50px"
					left="100%"
					onClick={() => handleClick('cancel')}
				></Button>
			</div>
		</div>
	);
};
