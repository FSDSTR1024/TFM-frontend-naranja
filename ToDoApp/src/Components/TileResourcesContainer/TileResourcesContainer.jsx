import './TileResourcesContainer.css';

export const TileResourcesContainer = ({ canEdit }) => {
	const staticTiles = [
		{
			tileImg: '/assets/Sprites/tiles/topLeftGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/topCenterGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/topRightGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/centerLeftGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/centerGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/centerRightGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/bottomLeftGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/bottomCenterGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/bottomRightGrass.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/topRightSand.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/centerTopSand.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/topLeftSand.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/centerLeftSand.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/centerSand.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/centerRightSand.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/bottomLeftSand.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/bottomCenterSand.png',
		},
		{
			tileImg: '/assets/Sprites/tiles/bottomRightSand.png',
		},
	];

	const movingTiles = [
		{
			tileImg: './assets/Sprites/tiles/sheep.gif',
		},
		{
			tileImg: './assets/Sprites/tiles/bwarriorIdle.gif',
		},
		{
			tileImg: '/assets/Sprites/tiles/foamRight.gif',
		},
		{
			tileImg: '/assets/Sprites/tiles/foamTop.gif',
		},
		{
			tileImg: '/assets/Sprites/tiles/foamBottom.gif',
		},
		{
			tileImg: '/assets/Sprites/tiles/foamLeft.gif',
		},
	];

	return (
		<div>
			<div id="tileResourcesContainerLeft" className={`${canEdit ? 'appear' : ''}`}>
				<div id="tileResourcesScroll">
					{staticTiles.map((tile, index) => (
						<div key={index} className="tileBackground">
							<img className="tileResource" src={tile.tileImg} draggable={true} />
						</div>
					))}
				</div>
			</div>

			<div id="tileResourcesContainerRight" className={`${canEdit ? 'appear' : ''}`}>
				<div id="tileResourcesScroll">
					{movingTiles.map((tile, index) => (
						<div key={index} className="tileBackground">
							<img className="tileResource" src={tile.tileImg} draggable={true} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
