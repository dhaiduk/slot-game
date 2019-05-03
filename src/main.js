'use strict';

import * as PIXI from 'pixi.js';
import { Howl } from 'howler';

const size = {
    width: window.innerWidth,
    height: window.innerHeight
};

const SYMBOL_SIZE = size.height / 4;
const REEL_WIDTH = size.width / 5.3;

const Reel_Spin = new Howl({
    src: ['./src/assets/sounds/Reel_Spin.mp3']
});

const Landing_1 = new Howl({
    src: ['./src/assets/sounds/Landing_1.mp3']
});

let running = false;

// Create the application
const app = new PIXI.Application({ transparent: true, width: size.width * 0.98, height: size.height * 0.98 });

// Add the view to the DOM
document.body.appendChild(app.view);

// Create background 
// Create repeat tilingSprite
const backgGround = PIXI.Texture.from('./src/assets/img/winningFrameBackground.jpg');
const tilingSprite = new PIXI.TilingSprite(
    backgGround,
    app.screen.width,
    app.screen.height,
);
app.stage.addChild(tilingSprite);

// Create background frame
const frameSprite = new PIXI.Sprite.from('./src/assets/img/slotOverlay.png')
frameSprite.width = size.width;
frameSprite.height = size.height;
app.stage.addChild(frameSprite);

PIXI.Loader.shared
    .add('01', './src/assets/img/symbols/01.png')
    .add('02', './src/assets/img/symbols/02.png')
    .add('03', './src/assets/img/symbols/03.png')
    .add('04', './src/assets/img/symbols/04.png')
    .add('05', './src/assets/img/symbols/05.png')
    .add('06', './src/assets/img/symbols/06.png')
    .add('07', './src/assets/img/symbols/07.png')
    .add('08', './src/assets/img/symbols/08.png')
    .add('09', './src/assets/img/symbols/09.png')
    .add('10', './src/assets/img/symbols/10.png')
    .add('11', './src/assets/img/symbols/11.png')
    .add('12', './src/assets/img/symbols/12.png')
    .add('13', './src/assets/img/symbols/13.png')
    .load(onAssetsLoaded);

function onAssetsLoaded() {
    const slotTextures = [
        PIXI.Texture.from('01'),
        PIXI.Texture.from('02'),
        PIXI.Texture.from('03'),
        PIXI.Texture.from('04'),
        PIXI.Texture.from('05'),
        PIXI.Texture.from('06'),
        PIXI.Texture.from('07'),
        PIXI.Texture.from('08'),
        PIXI.Texture.from('09'),
        PIXI.Texture.from('10'),
        PIXI.Texture.from('11'),
        PIXI.Texture.from('12'),
        PIXI.Texture.from('13'),
    ];

    //Create reels container
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
        reel.blur.blurX = reel.blur.blurY = 0;
        rc.filters = [reel.blur];
        for (let j = 0; j < 5; j++) {
            const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
    }
    reelContainer.y = (app.screen.height - SYMBOL_SIZE * 2) / 2;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
    app.stage.addChild(reelContainer);

    // Create textureTop
    const textureTop = PIXI.Texture.from('./src/assets/img/Mr_Monkey_2b.png');
    const spriteTop = new PIXI.Sprite(textureTop);
    spriteTop.x = Math.round((app.screen.width / 2 - textureTop.width / 2));
    spriteTop.y = Math.round((textureTop.height / 10));
    app.stage.addChild(spriteTop);

    // Create start button begin
    //Textures Start Button
    const textureStartDisabled = PIXI.Texture.from('./src/assets/img/btn_spin_disable.png');
    const textureStartHover = PIXI.Texture.from('./src/assets/img/btn_spin_hover.png');
    const textureStartNormal = PIXI.Texture.from('./src/assets/img/btn_spin_normal.png');
    const textureStartPressed = PIXI.Texture.from('./src/assets/img/btn_spin_pressed.png');
    const button = new PIXI.Sprite(textureStartNormal);
    button.width = button.height = SYMBOL_SIZE / 2;
    button.x = Math.round((app.screen.width - button.width));
    button.y = Math.round((app.screen.height - button.height));
    button.buttonMode = true;
    button.interactive = true;
    button
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut)
        .on('buttonDisabled', onButtonDisabled)
    app.stage.addChild(button);

    function onButtonDown() {
        this.texture = (running) ? textureStartDisabled : textureStartPressed;
    };

    function onButtonUp() {
        startPlay();
        this.texture = (running) ? textureStartDisabled : textureStartNormal;
    };

    function onButtonOver() {
        this.texture = (running) ? textureStartDisabled : textureStartHover;
    };

    function onButtonOut() {
        this.texture = (running) ? textureStartDisabled : textureStartNormal;
    }

    function onButtonDisabled(e) {
        e.detail.texture = textureStartDisabled;
    };


    // Start play function
    function startPlay() {
        if (running) return;
        running = true;

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const target = r.position + 50;
            const time = 600 + i * 600;
            tweenTo(r, 'position', target, time, backout(0.2), null, i === reels.length - 1 ? reelsComplete : null);
        }
        Reel_Spin.play();
    };

    // Reels done
    function reelsComplete() {
        running = false;
        Reel_Spin.stop();
        button.texture = textureStartNormal;
    };

    //Animate update
    app.ticker.add((deltaTime) => {
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });
};

const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
};
//Animate update
app.ticker.add((deltaTime) => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            Landing_1.play();
            remove.push(t);
        }
    };
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    };
});

function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
};

function backout(amount) {
    return t => (--t * t * ((amount + 1) * t + amount) + 1);
};



