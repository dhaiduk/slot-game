import * as PIXI from 'pixi.js';


function renderPixi(size) {

    // Create the application
    const app = new PIXI.Application({ transparent: true, width: size.width, height: size.height });

    // Add the view to the DOM
    document.body.appendChild(app.view);

    // Create background 
    // Create  repeat tilingSprite
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
        .add('./src/assets/img/symbols/01.png', './src/assets/img/symbols/01.png')
        .add('./src/assets/img/symbols/02.png', './src/assets/img/symbols/02.png')
        .add('./src/assets/img/symbols/03.png', './src/assets/img/symbols/03.png')
        .add('./src/assets/img/symbols/04.png', './src/assets/img/symbols/04.png')
        .add('./src/assets/img/symbols/05.png', './src/assets/img/symbols/05.png')
        .add('./src/assets/img/symbols/06.png', './src/assets/img/symbols/06.png')
        .add('./src/assets/img/symbols/07.png', './src/assets/img/symbols/07.png')
        .add('./src/assets/img/symbols/08.png', './src/assets/img/symbols/08.png')
        .add('./src/assets/img/symbols/09.png', './src/assets/img/symbols/09.png')
        .add('./src/assets/img/symbols/10.png', './src/assets/img/symbols/10.png')
        .add('./src/assets/img/symbols/11.png', './src/assets/img/symbols/11.png')
        .add('./src/assets/img/symbols/12.png', './src/assets/img/symbols/12.png')
        .add('./src/assets/img/symbols/13.png', './src/assets/img/symbols/13.png')
        .load(onAssetsLoaded);


    const SYMBOL_SIZE = app.screen.height / 5.5;
    const REEL_WIDTH = app.screen.width / 5.3;

    function onAssetsLoaded() {

        const slotTextures = [
            PIXI.Texture.from('./src/assets/img/symbols/01.png'),
            PIXI.Texture.from('./src/assets/img/symbols/02.png'),
            PIXI.Texture.from('./src/assets/img/symbols/03.png'),
            PIXI.Texture.from('./src/assets/img/symbols/04.png'),
            PIXI.Texture.from('./src/assets/img/symbols/05.png'),
            PIXI.Texture.from('./src/assets/img/symbols/06.png'),
            PIXI.Texture.from('./src/assets/img/symbols/07.png'),
            PIXI.Texture.from('./src/assets/img/symbols/08.png'),
            PIXI.Texture.from('./src/assets/img/symbols/09.png'),
            PIXI.Texture.from('./src/assets/img/symbols/10.png'),
            PIXI.Texture.from('./src/assets/img/symbols/11.png'),
            PIXI.Texture.from('./src/assets/img/symbols/12.png'),
            PIXI.Texture.from('./src/assets/img/symbols/13.png'),
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
        app.stage.addChild(reelContainer);



        const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
        reelContainer.y = margin;
        reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);

        // Create textureTop
        const textureTop = PIXI.Texture.from('./src/assets/img/Mr_Monkey_2b.png');
        const spriteTop = new PIXI.Sprite(textureTop);
        spriteTop.x = Math.round((app.screen.width / 2 - textureTop.width / 2));
        spriteTop.y = Math.round((textureTop.height / 10));
        app.stage.addChild(spriteTop);

        // Create start button begin__________________________________________________________________________
        const textureStartDisabled = PIXI.Texture.from('./src/assets/img/btn_spin_disable.png');
        const textureStartHover = PIXI.Texture.from('./src/assets/img/btn_spin_hover.png');
        const textureStartNormal = PIXI.Texture.from('./src/assets/img/btn_spin_normal.png');
        const textureStartPressed = PIXI.Texture.from('./src/assets/img/btn_spin_pressed.png');
        const button = new PIXI.Sprite(textureStartNormal);
        button.x = Math.round((app.screen.width - button.width / 2));
        button.y = Math.round((app.screen.height - button.height / 2));
        button.buttonMode = true;
        button.interactive = true;
        button.anchor.set(0.7);
        button
            .on('pointerdown', onButtonDown)
            .on('pointerup', onButtonUp)
            .on('pointerupoutside', onButtonUp)
            .on('pointerover', onButtonOver)
            .on('pointerout', onButtonOut);

        app.stage.addChild(button);


        function onButtonDown() {
            startPlay();
            this.isdown = true;
            this.texture = textureStartPressed;
            this.alpha = 1;
        }

        function onButtonUp() {
            this.isdown = false;
            if (this.isOver) {
                this.texture = textureStartHover;
            }
            else {
                this.texture = textureButton;
            }
        }

        function onButtonOver() {
            this.isOver = true;
            if (this.isdown) {
                return;
            }
            this.texture = textureStartHover;
        }

        function onButtonOut() {
            this.isOver = false;
            if (this.isdown) {
                return;
            }
            this.texture = textureStartNormal;
        }
        // Create start button end __________________________________________________________________________


        let running = false;


        function startPlay() {
            if (running) return;
            running = true;
            console.log(reels.length);
            for (let i = 0; i < reels.length; i++) {
                const r = reels[i];
                const extra = Math.floor(Math.random() * 3);
                const target = r.position + 10 + i * 5 + extra;
                const time = 2500 + i * 600 + extra * 600;
                tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
            }
        }


        function reelsComplete() {
            running = false;
        }


        app.ticker.add((delta) => {

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
    }


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
    }

    app.ticker.add((delta) => {
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
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            tweening.splice(tweening.indexOf(remove[i]), 1);
        }
    });


    function lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }


    function backout(amount) {
        return t => (--t * t * ((amount + 1) * t + amount) + 1);
    }

    /*function resize() {
        if (window.innerWidth / window.innerHeight >= ratio) {
            ancho = ~~(window.innerHeight * ratio);
            alto = window.innerHeight;

            app.view.style.position = 'absolute';
            app.view.style.width = ancho + 'px';
            app.view.style.height = alto + 'px';
            //console.log("A");

            app.view.style.left = ~~((window.innerWidth - ancho) / 2) + 'px';
            app.view.style.top = '0px';

        } else {

            ancho = window.innerWidth;
            alto = ~~(window.innerWidth / ratio);

            app.view.style.position = 'absolute';
            app.view.style.width = ancho + 'px';
            app.view.style.height = alto + 'px';
            //console.log("B");
            app.view.style.left = 0 + 'px';
            app.view.style.top = (window.innerWidth - (alto / 2)) + 'px';

        }
        //console.log(ancho,alto);


    }
    window.onresize = function (event) {
        resize();
    };*/
}
export default renderPixi;