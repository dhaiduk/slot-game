import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ transparent: true, width: 1200, height: 600 });
document.body.appendChild(app.view);

app.stage.addChild(PIXI.Sprite.from('./src/assets/img/winningFrameBackground.jpg'));
app.stage.addChild(PIXI.Sprite.from('./src/assets/img/slotOverlay.png'));

PIXI.Loader.shared
    .add('./src/assets/img/symbols/01.png', './src/assets/img/symbols/01.png')
    .add('./src/assets/img/symbols/02.png', './src/assets/img/symbols/02.png')
    .add('./src/assets/img/symbols/03.png', './src/assets/img/symbols/03.png')
    .add('./src/assets/img/symbols/04.png', './src/assets/img/symbols/04.png')
    .load(onAssetsLoaded);

const REEL_WIDTH = 200;
const SYMBOL_SIZE = 160;

function onAssetsLoaded() {

    const slotTextures = [
        PIXI.Texture.from('./src/assets/img/symbols/01.png'),
        PIXI.Texture.from('./src/assets/img/symbols/02.png'),
        PIXI.Texture.from('./src/assets/img/symbols/03.png'),
        PIXI.Texture.from('./src/assets/img/symbols/04.png'),
    ];

    const reels = [];
    const reelContainer = new PIXI.Container();
    for (let i = 0; i < 5; i++) {
        const rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter(),
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        for (let j = 0; j < 4; j++) {
            const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);

            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);

}
   