
                        ;(function () {
                            if (typeof window === 'undefined') {
                                return;
                            }

                            window.__css_reload = function () {
                                if (window.__styleLinkTimeout) {
                                    cancelAnimationFrame(window.__styleLinkTimeout);
                                }

                                window.__styleLinkTimeout = requestAnimationFrame(() => {
                                    var link = document.querySelector('link[href*="assets/platformer-b593e84f.css"]');

                                    if (link) {
                                        if (!window.__styleLinkHref) {
                                            window.__styleLinkHref = link.getAttribute('href');
                                        }

                                        var newLink = document.createElement('link');
                                        newLink.setAttribute('rel', 'stylesheet');
                                        newLink.setAttribute('type', 'text/css');
                                        newLink.setAttribute('href', window.__styleLinkHref + '?' + Date.now());
                                        newLink.onload = () => {
                                            link.remove();
                                        };

                                        document.head.appendChild(newLink);
                                    }
                                });
                            }
                        })();
                    
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    function ___$insertStyle(css) {
        if (!css || typeof window === 'undefined') {
            return;
        }
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.innerHTML = css;
        document.head.appendChild(style);
        return css;
    }

    ___$insertStyle("body {\n  margin: 0;\n  padding: 0;\n  background-color: #000;\n}\nbody #screen {\n  display: block;\n  height: 100vh;\n  margin: auto;\n  image-rendering: pixelated;\n}");

    function throwError(errorMessage) {
        throw new Error(errorMessage);
    }

    class Vec2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        set(x, y) {
            this.x = x;
            this.y = y;
        }
        copy(other) {
            this.set(other.x, other.y);
        }
    }
    class Matrix {
        constructor() {
            this.grid = [];
        }
        set(x, y, value) {
            if (!this.grid[x]) {
                this.grid[x] = [];
            }
            this.grid[x][y] = value;
        }
        get(x, y) {
            const col = this.grid[x];
            if (col)
                return col[y];
        }
        delete(x, y) {
            const col = this.grid[x];
            if (col)
                delete col[y];
        }
        *itemsInRange(left, top, right, bottom) {
            for (let x = left; x <= right; x++) {
                for (let y = top; y <= bottom; y++) {
                    const value = this.get(x, y);
                    if (value)
                        yield [value, x, y];
                }
            }
        }
        forEach(callBack) {
            for (const [x, col] of this.grid.entries()) {
                for (const [y, value] of col.entries()) {
                    callBack(value, x, y);
                }
            }
        }
    }

    class BoundingBox {
        constructor(pos, size, offset) {
            this.pos = pos;
            this.size = size;
            this.offset = offset;
        }
        get bottom() {
            return this.pos.y + this.size.y + this.offset.y;
        }
        set bottom(y) {
            this.pos.y = y - (this.size.y + this.offset.y);
        }
        get top() {
            return this.pos.y + this.offset.y;
        }
        set top(y) {
            this.pos.y = y - this.offset.y;
        }
        get left() {
            return this.pos.x + this.offset.x;
        }
        set left(x) {
            this.pos.x = x - this.offset.x;
        }
        get right() {
            return this.pos.x + this.size.x + this.offset.x;
        }
        set right(x) {
            this.pos.x = (this.size.x + this.offset.x);
        }
        overlaps(box) {
            return (this.bottom > box.top && this.top < box.bottom && this.left < box.right && this.right > box.left);
        }
    }

    class Trait {
        constructor() {
            this.listeners = [];
        }
        listen(name, callBack, count = Infinity) {
            this.listeners.push({
                name,
                callBack,
                count
            });
        }
        queue(task) {
            this.listen(Trait.EVENT_TASK, task, 1);
        }
        finalize(entity) {
            for (const listener of this.listeners) {
                entity.events.process(listener.name, listener.callBack);
                listener.count -= 1;
            }
            this.listeners = this.listeners.filter((listener) => listener.count > 0);
        }
        update(entity, gameContext, level) { }
        obstruct(entity, side, match) { }
        collides(us, them) { }
    }
    Trait.EVENT_TASK = Symbol('task');

    class EventBuffer {
        constructor() {
            this.events = [];
        }
        emit(name, ...args) {
            this.events.push({
                name,
                args
            });
        }
        process(name, callBack) {
            for (const event of this.events) {
                if (event.name === name) {
                    callBack(...event.args);
                }
            }
        }
        clear() {
            this.events.length = 0;
        }
    }

    class Entity {
        constructor() {
            this.pos = new Vec2();
            this.vel = new Vec2();
            this.size = new Vec2();
            this.offset = new Vec2();
            this.bounds = new BoundingBox(this.pos, this.size, this.offset);
            this.traits = new Map();
            this.lifetime = 0;
            this.sounds = new Set();
            this.events = new EventBuffer();
        }
        addTrait(trait) {
            this.traits.set(trait.constructor, trait);
            return trait;
        }
        getTrait(TraitClass) {
            const trait = this.traits.get(TraitClass);
            if (trait instanceof TraitClass) {
                return trait;
            }
        }
        useTrait(TraitClass, fn) {
            const trait = this.getTrait(TraitClass);
            if (trait)
                fn(trait);
        }
        update(gameContext, level) {
            this.traits.forEach((trait) => {
                trait.update(this, gameContext, level);
            });
            if (this.audio)
                this.playSounds(this.audio, gameContext.audioContext);
            this.lifetime += gameContext.deltaTime;
        }
        draw(context) { }
        finalize() {
            this.events.emit(Trait.EVENT_TASK, this);
            this.traits.forEach((trait) => {
                trait.finalize(this);
            });
            this.events.clear();
        }
        obstruct(side, match) {
            this.traits.forEach((trait) => {
                trait.obstruct(this, side, match);
            });
        }
        collides(candidate) {
            this.traits.forEach((trait) => {
                trait.collides(this, candidate);
            });
        }
        playSounds(audioBoard, audioContext) {
            this.sounds.forEach((name) => {
                audioBoard.play(name, audioContext);
            });
            this.sounds.clear();
        }
    }

    var Side;
    (function (Side) {
        Side[Side["top"] = 0] = "top";
        Side[Side["bottom"] = 1] = "bottom";
        Side[Side["left"] = 2] = "left";
        Side[Side["right"] = 3] = "right";
    })(Side || (Side = {}));

    class Jump extends Trait {
        constructor() {
            super(...arguments);
            this.duration = 0.3;
            this.velocity = 200;
            this.engageTime = 0;
            this.ready = 0;
            this.requestTime = 0;
            this.gracePeriod = 0.1;
            this.speedBoost = 0.3;
        }
        start() {
            this.requestTime = this.gracePeriod;
        }
        cancel() {
            this.engageTime = 0;
            this.requestTime = 0;
        }
        update(entity, { deltaTime }) {
            if (this.requestTime > 0) {
                if (this.ready > 0) {
                    entity.sounds.add('jump');
                    this.engageTime = this.duration;
                    this.requestTime = 0;
                }
                this.requestTime -= deltaTime;
            }
            if (this.engageTime > 0) {
                entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
                this.engageTime -= deltaTime;
            }
            this.ready -= 1;
        }
        obstruct(entity, side) {
            if (side === Side.bottom) {
                this.ready = 1;
            }
            else if (side === Side.top) {
                this.cancel();
            }
        }
        get falling() {
            return this.ready < 0;
        }
    }

    class Go extends Trait {
        constructor() {
            super(...arguments);
            this.dir = 0;
            this.acceleration = 400;
            this.distance = 0;
            this.heading = 1;
            this.dragFactor = 1 / 5000;
            this.deceleration = 300;
        }
        update(entity, { deltaTime }) {
            const absX = Math.abs(entity.vel.x);
            if (this.dir !== 0) {
                entity.vel.x += this.acceleration * this.dir * deltaTime;
                const jump = entity.getTrait(Jump);
                if (jump) {
                    if (!jump.falling) {
                        this.heading = this.dir;
                    }
                }
                else {
                    this.heading = this.dir;
                }
            }
            else if (entity.vel.x !== 0) {
                const decel = Math.min(absX, this.deceleration * deltaTime);
                entity.vel.x += -Math.sign(entity.vel.x) * decel;
            }
            else {
                this.distance = 0;
            }
            const drag = this.dragFactor * entity.vel.x * absX;
            entity.vel.x -= drag;
            this.distance += absX * deltaTime;
        }
    }

    class Killable extends Trait {
        constructor() {
            super(...arguments);
            this.dead = false;
            this.deadTime = 0;
            this.removeAfter = 2;
        }
        kill() {
            this.queue(() => {
                this.dead = true;
            });
        }
        revive() {
            this.dead = false;
            this.deadTime = 0;
        }
        update(entity, { deltaTime }, level) {
            if (this.dead) {
                this.deadTime += deltaTime;
                if (this.deadTime > this.removeAfter) {
                    this.queue(() => {
                        level.entities.delete(entity);
                    });
                }
            }
        }
    }

    class Stomper extends Trait {
        constructor() {
            super(...arguments);
            this.bounceSpeed = 400;
        }
        bounce(us, them) {
            us.bounds.bottom = them.bounds.top;
            us.vel.y = -this.bounceSpeed;
        }
        collides(us, them) {
            const killable = them.getTrait(Killable);
            if (!killable || killable.dead) {
                return;
            }
            if (us.vel.y > them.vel.y) {
                this.queue(() => this.bounce(us, them));
                us.sounds.add('stomp');
                us.events.emit(Stomper.EVENT_STOMP, us, them);
            }
        }
    }
    Stomper.EVENT_STOMP = Symbol('stomp');

    class Solid extends Trait {
        constructor() {
            super(...arguments);
            this.obstructs = true;
        }
        obstruct(entity, side, match) {
            if (!this.obstructs)
                return;
            switch (side) {
                case Side.bottom:
                    entity.bounds.bottom = match.y1;
                    entity.vel.y = 0;
                    break;
                case Side.top:
                    entity.bounds.top = match.y2;
                    entity.vel.y = 0;
                    break;
                case Side.right:
                    entity.bounds.right = match.x1;
                    entity.vel.x = 0;
                    break;
                case Side.left:
                    entity.bounds.left = match.x2;
                    entity.vel.x = 0;
                    break;
            }
        }
    }

    class Physics extends Trait {
        update(entity, gameContext, level) {
            entity.pos.x += entity.vel.x * gameContext.deltaTime;
            level.tileCollider.checkX(entity, gameContext, level);
            entity.pos.y += entity.vel.y * gameContext.deltaTime;
            level.tileCollider.checkY(entity, gameContext, level);
            entity.vel.y += level.gravity * gameContext.deltaTime;
        }
    }

    function loadJSON(url) {
        return fetch(url).then(res => res.json());
    }
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => {
                resolve(image);
            });
            image.addEventListener('error', event => {
                reject(`Could not load image from ${url}`);
            });
            image.src = url;
        });
    }

    class SpriteSheet {
        constructor(image, tileWidth, tileHeight) {
            this.image = image;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.tiles = new Map();
            this.animations = new Map();
        }
        define(name, x, y, width, height) {
            const buffers = [false, true].map((flipped) => {
                const buffer = document.createElement('canvas');
                buffer.width = width;
                buffer.height = height;
                const context = buffer.getContext('2d') || throwError('Canvas not supported!');
                if (flipped) {
                    context.scale(-1, 1);
                    context.translate(-width, 0);
                }
                context.drawImage(this.image, x, y, width, height, 0, 0, width, height);
                return buffer;
            });
            this.tiles.set(name, buffers);
        }
        defineTile(name, x, y) {
            this.define(name, x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
        }
        defineAnimation(name, animation) {
            this.animations.set(name, animation);
        }
        draw(name, context, x, y, flip = false) {
            const buffers = this.tiles.get(name);
            if (!buffers) {
                throwError(`SpriteSheet.draw(): Sprite "${name}" not found`);
            }
            context.drawImage(buffers[flip ? 1 : 0], x, y);
        }
        drawTile(name, context, x, y) {
            this.draw(name, context, x * this.tileWidth, y * this.tileHeight);
        }
        drawAnimation(name, context, x, y, distance) {
            const animation = this.animations.get(name);
            if (!animation) {
                throwError(`Animation not found: ${name}`);
            }
            this.drawTile(animation(distance), context, x, y);
        }
        getAnimation(name) {
            const anim = this.animations.get(name);
            if (!anim) {
                throwError(`Animation not found: ${name}`);
            }
            return anim;
        }
    }

    function createAnimation(frames, frameLength) {
        return function resolveFrame(time) {
            const frameIndex = Math.floor((time / frameLength) % frames.length);
            return frames[frameIndex];
        };
    }

    async function loadSpriteSheet(name) {
        const url = `sprites/${name}.json`;
        const sheetSpec = await loadJSON(url);
        const image = await loadImage(sheetSpec.imageURL);
        const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);
        if (sheetSpec.tiles) {
            sheetSpec.tiles.forEach(tileSpec => {
                const [x, y] = tileSpec.index;
                sprites.defineTile(tileSpec.name, x, y);
            });
        }
        if (sheetSpec.frames) {
            sheetSpec.frames.forEach(frameSpec => {
                const [x, y, width, height] = frameSpec.rect;
                sprites.define(frameSpec.name, x, y, width, height);
            });
        }
        if (sheetSpec.animations) {
            sheetSpec.animations.forEach(animSpec => {
                const animation = createAnimation(animSpec.frames, animSpec.frameLength);
                sprites.defineAnimation(animSpec.name, animation);
            });
        }
        return sprites;
    }

    class AudioBoard {
        constructor() {
            this.buffers = new Map();
        }
        add(name, buffer) {
            this.buffers.set(name, buffer);
        }
        play(name, context) {
            const source = context.createBufferSource();
            source.connect(context.destination);
            source.buffer = this.buffers.get(name);
            source.start(0);
        }
    }

    function createAudioLoader(context) {
        return async function loadAudio(url) {
            const res = await fetch(url);
            const data = await res.arrayBuffer();
            return context.decodeAudioData(data);
        };
    }
    async function loadAudioBoard(name, audioContext) {
        const loadAudio = createAudioLoader(audioContext);
        const audioSheet = await loadJSON(`/sounds/${name}.json`);
        const audioBoard = new AudioBoard();
        const audioLoadingTasks = Object.entries(audioSheet.fx).map(([name, { url }]) => loadAudio(url)
            .then(buffer => audioBoard.add(name, buffer))
            .catch(() => console.error(`failed to load ${url}`)));
        await Promise.all(audioLoadingTasks);
        return audioBoard;
    }

    const FAST_DRAG = 1 / 5000;
    const SLOW_DRAG = 1 / 1000;
    class Mario extends Entity {
        constructor(sprites, audio, runAnimation) {
            super();
            this.sprites = sprites;
            this.audio = audio;
            this.runAnimation = runAnimation;
            this.jump = this.addTrait(new Jump());
            this.go = this.addTrait(new Go());
            this.stomper = this.addTrait(new Stomper());
            this.killable = this.addTrait(new Killable());
            this.solid = this.addTrait(new Solid());
            this.physics = this.addTrait(new Physics());
            this.size.set(14, 16);
            this.go.dragFactor = SLOW_DRAG;
            this.killable.removeAfter = 0;
            this.setTurboState(false);
        }
        resolveAnimationFrame() {
            if (this.jump.falling) {
                return 'jump';
            }
            if (this.go.distance > 0) {
                if ((this.vel.x > 0 && this.go.dir < 0) || (this.vel.x < 0 && this.go.dir > 0)) {
                    return 'brake';
                }
                return this.runAnimation(this.go.distance);
            }
            return 'idle';
        }
        draw(context) {
            this.sprites.draw(this.resolveAnimationFrame(), context, 0, 0, this.go.heading < 0);
        }
        setTurboState(turboState) {
            this.go.dragFactor = turboState ? FAST_DRAG : SLOW_DRAG;
        }
    }
    async function loadMario(audioContext) {
        const [marioSprites, audioBoard] = await Promise.all([
            loadSpriteSheet('mario'),
            loadAudioBoard('mario', audioContext)
        ]);
        const runAnimation = marioSprites.getAnimation('run');
        return function createMario() {
            return new Mario(marioSprites, audioBoard, runAnimation);
        };
    }

    async function loadEntities(audioContext) {
        const factories = {};
        const addAs = (name) => (factory) => {
            factories[name] = factory;
        };
        await Promise.all([
            loadMario(audioContext).then(addAs('mario'))
        ]);
        return factories;
    }

    class Font {
        constructor(sprites, size) {
            this.sprites = sprites;
            this.size = size;
        }
        print(text, context, x, y) {
            for (const [pos, char] of [...text].entries()) {
                this.sprites.draw(char, context, x + pos * this.size, y);
            }
        }
    }
    const characters = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    async function loadFont() {
        const image = await loadImage('images/font.png');
        const fontSprite = new SpriteSheet(image, 8, 8);
        const size = 8;
        const rowLen = image.width;
        for (const [index, char] of [...characters].entries()) {
            const x = (index * size) % rowLen;
            const y = Math.floor((index * size) / rowLen) * size;
            fontSprite.define(char, x, y, size, size);
        }
        return new Font(fontSprite, 8);
    }

    class MusicPlayer {
        constructor() {
            this.tracks = new Map();
        }
        addTrack(name, url) {
            const audio = new Audio();
            audio.loop = true;
            audio.src = url;
            this.tracks.set(name, audio);
        }
        playTrack(name) {
            this.pauseAll();
            const audio = this.tracks.get(name);
            audio === null || audio === void 0 ? void 0 : audio.play();
            return audio;
        }
        pauseAll() {
            for (const audio of this.tracks.values()) {
                audio.pause();
            }
        }
    }

    async function loadMusicSheet(name) {
        const musicSheet = await loadJSON(`/music/${name}.json`);
        const musicPlayer = new MusicPlayer();
        for (const [name, track] of Object.entries(musicSheet)) {
            musicPlayer.addTrack(name, track.url);
        }
        return musicPlayer;
    }

    class Compositor {
        constructor() {
            this.layers = [];
        }
        draw(context, camera) {
            this.layers.forEach(layer => {
                layer(context, camera);
            });
        }
    }

    class EventEmitter {
        constructor() {
            this.listeners = [];
        }
        listen(name, callBack) {
            this.listeners.push({
                name,
                callBack
            });
        }
        emit(name, ...args) {
            this.listeners.filter(it => it.name === name).forEach(it => it.callBack(...args));
        }
    }

    class Camera {
        constructor() {
            this.pos = new Vec2(0, 0);
            this.size = new Vec2(256, 224);
        }
    }

    class Scene {
        constructor() {
            this.comp = new Compositor();
            this.events = new EventEmitter();
        }
        draw(gameContext) {
            this.comp.draw(gameContext.videoContext, new Camera());
        }
        update(gameContext) { }
        pause() { }
    }
    Scene.EVENT_COMPLETE = Symbol('scene complete');

    class EntityCollider {
        constructor(entities) {
            this.entities = entities;
        }
        check(subject) {
            for (const candidate of this.entities) {
                if (subject === candidate)
                    continue;
                if (subject.bounds.overlaps(candidate.bounds)) {
                    subject.collides(candidate);
                }
            }
        }
    }

    class TileResolver {
        constructor(matrix, tileSize = 16) {
            this.matrix = matrix;
            this.tileSize = tileSize;
        }
        toIndex(pos) {
            return Math.floor(pos / this.tileSize);
        }
        *toIndexRange(pos1, pos2) {
            const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
            for (let pos = pos1; pos < pMax; pos += this.tileSize) {
                yield this.toIndex(pos);
            }
        }
        getByIndex(indexX, indexY) {
            const tile = this.matrix.get(indexX, indexY);
            if (tile) {
                const x1 = indexX * this.tileSize;
                const x2 = (indexX + 1) * this.tileSize;
                const y1 = indexY * this.tileSize;
                const y2 = (indexY + 1) * this.tileSize;
                return { tile, x1, x2, y1, y2, indexX, indexY };
            }
        }
        searchByPosition(posX, posY) {
            return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
        }
        *searchByRange(x1, x2, y1, y2) {
            for (const indexX of this.toIndexRange(x1, x2)) {
                for (const indexY of this.toIndexRange(y1, y2)) {
                    const match = this.getByIndex(indexX, indexY);
                    if (match) {
                        yield match;
                    }
                }
            }
        }
    }

    const handleX = ({ entity, match }) => {
        if (entity.vel.x > 0) {
            if (entity.bounds.right > match.x1) {
                entity.obstruct(Side.right, match);
            }
        }
        else if (entity.vel.x < 0) {
            if (entity.bounds.left < match.x2) {
                entity.obstruct(Side.left, match);
            }
        }
    };
    const handleY = ({ entity, match }) => {
        if (entity.vel.y > 0) {
            if (entity.bounds.bottom > match.y1) {
                entity.obstruct(Side.bottom, match);
            }
        }
        else if (entity.vel.y < 0) {
            if (entity.bounds.top < match.y2) {
                entity.obstruct(Side.top, match);
            }
        }
    };
    const ground = [handleX, handleY];

    const handlers = {
        ground
    };
    class TileCollider {
        constructor() {
            this.resolvers = [];
        }
        addGrid(tileMatrix) {
            this.resolvers.push(new TileResolver(tileMatrix));
        }
        checkX(entity, gameContext, level) {
            let x;
            if (entity.vel.x > 0) {
                x = entity.bounds.right;
            }
            else if (entity.vel.x < 0) {
                x = entity.bounds.left;
            }
            else {
                return;
            }
            for (const resolver of this.resolvers) {
                const matches = resolver.searchByRange(x, x, entity.bounds.top, entity.bounds.bottom);
                for (const match of matches) {
                    this.handle(0, entity, match, resolver, gameContext, level);
                }
            }
        }
        checkY(entity, gameContext, level) {
            let y;
            if (entity.vel.y > 0) {
                y = entity.bounds.bottom;
            }
            else if (entity.vel.y < 0) {
                y = entity.bounds.top;
            }
            else {
                return;
            }
            for (const resolver of this.resolvers) {
                const matches = resolver.searchByRange(entity.bounds.left, entity.bounds.right, y, y);
                for (const match of matches) {
                    this.handle(1, entity, match, resolver, gameContext, level);
                }
            }
        }
        handle(index, entity, match, resolver, gameContext, level) {
            var _a, _b;
            const tileCollisionContext = {
                entity,
                match,
                resolver,
                gameContext,
                level
            };
            (_b = (_a = handlers[match.tile.type]) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.call(_a, tileCollisionContext);
        }
    }

    class MusicController {
        setPlayer(player) {
            this.player = player;
        }
        playTheme(speed = 1) {
            var _a;
            const audio = (_a = this.player) === null || _a === void 0 ? void 0 : _a.playTrack('main');
            if (audio) {
                audio.playbackRate = speed;
            }
        }
        playHurryTheme() {
            var _a;
            const audio = (_a = this.player) === null || _a === void 0 ? void 0 : _a.playTrack('hurry');
            if (audio) {
                audio.loop = false;
                audio.addEventListener('ended', () => {
                    this.playTheme(1.3);
                }, { once: true });
            }
        }
        pause() {
            var _a;
            (_a = this.player) === null || _a === void 0 ? void 0 : _a.pauseAll();
        }
    }

    const COIN_LIFE_THRESHOLD = 100;
    class Player extends Trait {
        constructor() {
            super();
            this.name = 'UNNAMED';
            this.coins = 0;
            this.lives = 3;
            this.score = 0;
            this.listen(Stomper.EVENT_STOMP, () => {
                this.score += 100;
            });
        }
        addCoins(count) {
            this.coins += count;
            while (this.coins >= COIN_LIFE_THRESHOLD) {
                this.addLives(1);
                this.coins -= COIN_LIFE_THRESHOLD;
            }
            this.queue((entity) => entity.sounds.add('coin'));
        }
        addLives(count) {
            this.lives += count;
        }
    }

    class PlayerController extends Trait {
        constructor(player) {
            super();
            this.player = player;
            this.checkPoint = new Vec2(0, 0);
        }
        update(_, __, level) {
            var _a;
            if (!level.entities.has(this.player)) {
                (_a = this.player.getTrait(Killable)) === null || _a === void 0 ? void 0 : _a.revive();
                this.player.pos.set(this.checkPoint.x, this.checkPoint.y);
                level.entities.add(this.player);
            }
        }
    }

    function createPlayerEnv(playerEntity) {
        const playerEnv = new Entity();
        const playerControl = new PlayerController(playerEntity);
        playerControl.checkPoint.set(64, 64);
        playerEnv.addTrait(playerControl);
        return playerEnv;
    }
    function* findPlayers(entities) {
        for (const entity of entities) {
            if (entity.getTrait(Player))
                yield entity;
        }
    }
    function makePlayer(entity, name) {
        const player = new Player();
        player.name = name;
        entity.addTrait(player);
    }

    function focusPlayer(level) {
        for (const player of findPlayers(level.entities)) {
            level.camera.pos.x = Math.max(0, player.pos.x - 100);
        }
    }
    class Level extends Scene {
        constructor() {
            super(...arguments);
            this.name = '';
            this.entities = new Set();
            this.entityCollider = new EntityCollider(this.entities);
            this.tileCollider = new TileCollider();
            this.music = new MusicController();
            this.camera = new Camera();
            this.gravity = 1500;
            this.totalTime = 0;
        }
        update(gameContext) {
            this.entities.forEach((entity) => {
                entity.update(gameContext, this);
            });
            this.entities.forEach((entity) => {
                this.entityCollider.check(entity);
            });
            this.entities.forEach((entity) => {
                entity.finalize();
            });
            this.totalTime += gameContext.deltaTime;
            focusPlayer(this);
        }
        draw(gameContext) {
            this.comp.draw(gameContext.videoContext, this.camera);
        }
        pause() {
            this.music.pause();
        }
    }
    Level.EVENT_TRIGGER = Symbol('trigger');

    function createBackgroundLayer(level, tiles, sprites) {
        const tileResolver = new TileResolver(tiles);
        const buffer = document.createElement('canvas');
        buffer.width = 256 + 16;
        buffer.height = 240;
        const context = buffer.getContext('2d') || throwError('Canvas not supported!');
        function drawTiles(startIndex, endIndex) {
            context.clearRect(0, 0, buffer.width, buffer.height);
            const items = tiles.itemsInRange(startIndex, 0, endIndex, buffer.height / 16);
            for (const [tile, x, y] of items) {
                if (!tile.name)
                    continue;
                if (sprites.animations.has(tile.name)) {
                    sprites.drawAnimation(tile.name, context, x - startIndex, y, level.totalTime);
                }
                else {
                    sprites.drawTile(tile.name, context, x - startIndex, y);
                }
            }
        }
        return function drawBackgroundLayer(context, camera) {
            const drawWidth = tileResolver.toIndex(camera.size.x);
            const drawFrom = tileResolver.toIndex(camera.pos.x);
            const drawTo = drawFrom + drawWidth;
            drawTiles(drawFrom, drawTo);
            context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y);
        };
    }

    function createSpriteLayer(entities, width = 64, height = 64) {
        const spriteBuffer = document.createElement('canvas');
        spriteBuffer.width = width;
        spriteBuffer.height = height;
        const spriteBufferContext = spriteBuffer.getContext('2d') || throwError('Canvas not supported!');
        return function drawSpriteLayer(context, camera) {
            entities.forEach((entity) => {
                spriteBufferContext.clearRect(0, 0, width, height);
                entity.draw(spriteBufferContext);
                context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);
            });
        };
    }

    class Trigger extends Trait {
        constructor() {
            super(...arguments);
            this.touches = new Set();
            this.conditions = [];
        }
        collides(_, them) {
            this.touches.add(them);
        }
        update(entity, gameContext, level) {
            if (this.touches.size > 0) {
                for (const condition of this.conditions) {
                    condition(entity, this.touches, gameContext, level);
                }
                this.touches.clear();
            }
        }
    }

    class LevelTimer extends Trait {
        constructor() {
            super(...arguments);
            this.totalTime = 300;
            this.currentTime = this.totalTime;
            this.hurryTime = 100;
        }
        update(entity, { deltaTime }, level) {
            this.currentTime -= deltaTime * 2;
            if (this.hurryEmitted !== true && this.currentTime < this.hurryTime) {
                level.events.emit(LevelTimer.EVENT_TIMER_HURRY);
                this.hurryEmitted = true;
            }
            if (this.hurryEmitted !== false && this.currentTime > this.hurryTime) {
                level.events.emit(LevelTimer.EVENT_TIMER_OK);
                this.hurryEmitted = false;
            }
        }
    }
    LevelTimer.EVENT_TIMER_HURRY = Symbol('timer hurry');
    LevelTimer.EVENT_TIMER_OK = Symbol('timer ok');

    function loadPattern(name) {
        return loadJSON(`/sprites/patterns/${name}.json`);
    }
    function setupBackground(levelSpec, level, backgroundSprites, patterns) {
        for (const layer of levelSpec.layers) {
            const grid = createGrid(layer.tiles, patterns);
            const backgroundLayer = createBackgroundLayer(level, grid, backgroundSprites);
            level.comp.layers.push(backgroundLayer);
            level.tileCollider.addGrid(grid);
        }
    }
    function setupEntities(levelSpec, level, entityFactory) {
        levelSpec.entities.forEach(({ name, pos: [x, y] }) => {
            const createEntity = entityFactory[name];
            if (!createEntity) {
                throwError(`Could not find factory function for entity "${name}"`);
            }
            const entity = createEntity();
            entity.pos.set(x, y);
            level.entities.add(entity);
        });
        const spriteLayer = createSpriteLayer(level.entities);
        level.comp.layers.push(spriteLayer);
    }
    function setupTriggers(levelSpec, level) {
        if (!levelSpec.triggers)
            return;
        for (const triggerSpec of levelSpec.triggers) {
            const trigger = new Trigger();
            trigger.conditions.push((entity, touches, gc, level) => {
                level.events.emit(Level.EVENT_TRIGGER, triggerSpec, entity, touches);
            });
            const entity = new Entity();
            entity.addTrait(trigger);
            entity.pos.set(...triggerSpec.pos);
            entity.size.set(64, 64);
            level.entities.add(entity);
        }
    }
    function createTimer() {
        const timer = new Entity();
        timer.addTrait(new LevelTimer());
        return timer;
    }
    function setupBehavior(level) {
        const timer = createTimer();
        level.entities.add(timer);
        level.events.listen(LevelTimer.EVENT_TIMER_OK, () => {
            level.music.playTheme();
        });
        level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () => {
            level.music.playHurryTheme();
        });
    }
    function createLevelLoader(entityFactory) {
        return async function loadLevel(name) {
            const levelSpec = await loadJSON(`levels/${name}.json`);
            const [backgroundSprites, musicPlayer, patterns] = await Promise.all([
                loadSpriteSheet(levelSpec.spriteSheet),
                loadMusicSheet(levelSpec.musicSheet),
                loadPattern(levelSpec.patternSheet)
            ]);
            const level = new Level();
            level.name = name;
            level.music.setPlayer(musicPlayer);
            setupBackground(levelSpec, level, backgroundSprites, patterns);
            setupEntities(levelSpec, level, entityFactory);
            setupTriggers(levelSpec, level);
            setupBehavior(level);
            return level;
        };
    }
    function createGrid(tiles, patterns) {
        const grid = new Matrix();
        for (const { x, y, tile } of expandTiles(tiles, patterns)) {
            grid.set(x, y, tile);
        }
        return grid;
    }
    function* expandSpan(xStart, xLength, yStart, yLength) {
        const xEnd = xStart + xLength;
        const yEnd = yStart + yLength;
        for (let x = xStart; x < xEnd; x++) {
            for (let y = yStart; y < yEnd; y++) {
                yield { x, y };
            }
        }
    }
    function expandRange(range) {
        if (range.length === 4) {
            const [xStart, xLength, yStart, yLength] = range;
            return expandSpan(xStart, xLength, yStart, yLength);
        }
        else if (range.length === 3) {
            const [xStart, xLength, yStart] = range;
            return expandSpan(xStart, xLength, yStart, 1);
        }
        else if (range.length === 2) {
            const [xStart, yStart] = range;
            return expandSpan(xStart, 1, yStart, 1);
        }
        else {
            throwError(`Invalid range of length ${range.length}`);
        }
    }
    function* expandRanges(ranges) {
        for (const range of ranges) {
            yield* expandRange(range);
        }
    }
    function* expandTiles(tiles, patterns) {
        function* walkTiles(tiles, offsetX, offsetY) {
            for (const tile of tiles) {
                for (const { x, y } of expandRanges(tile.ranges)) {
                    const derivedX = x + offsetX;
                    const derivedY = y + offsetY;
                    if (tile.pattern) {
                        if (!patterns[tile.pattern]) {
                            throwError(`pattern ${tile.pattern} not found`);
                        }
                        const { tiles } = patterns[tile.pattern];
                        yield* walkTiles(tiles, derivedX, derivedY);
                    }
                    else if (tile.name) {
                        yield {
                            tile,
                            x: derivedX,
                            y: derivedY
                        };
                    }
                    else {
                        throwError(`Tile does not have a name or a pattern: ${JSON.stringify(tile)}`);
                    }
                }
            }
        }
        yield* walkTiles(tiles, 0, 0);
    }

    class SceneRunner {
        constructor() {
            this.sceneIndex = -1;
            this.scenes = [];
        }
        get currentScene() {
            return this.scenes[this.sceneIndex];
        }
        addScene(scene) {
            this.scenes.push(scene);
            scene.events.listen(Scene.EVENT_COMPLETE, () => {
                this.runNext();
            });
        }
        runNext() {
            var _a;
            (_a = this.currentScene) === null || _a === void 0 ? void 0 : _a.pause();
            this.sceneIndex += 1;
        }
        update(gameContext) {
            var _a, _b;
            (_a = this.currentScene) === null || _a === void 0 ? void 0 : _a.update(gameContext);
            (_b = this.currentScene) === null || _b === void 0 ? void 0 : _b.draw(gameContext);
        }
    }

    class Keyboard {
        constructor() {
            this.keyStates = new Map();
            this.keyListeners = new Map();
        }
        addListener(code, callBack) {
            this.keyListeners.set(code, callBack);
            this.keyStates.set(code, 0);
        }
        listenTo(target) {
            const keyEvents = ['keydown', 'keyup'];
            keyEvents.forEach(eventName => {
                target.addEventListener(eventName, event => {
                    this.handleEvent(event);
                });
            });
        }
        handleEvent(event) {
            if (event.repeat)
                return;
            const listener = this.keyListeners.get(event.code);
            const keyState = event.type === 'keydown' ? 1 : 0;
            if (listener) {
                this.keyStates.set(event.code, keyState);
                listener(keyState);
                event.preventDefault();
            }
        }
    }

    class InputRouter {
        constructor() {
            this.receivers = new Set();
        }
        addReceiver(receiver) {
            this.receivers.add(receiver);
        }
        dropReceiver(receiver) {
            this.receivers.delete(receiver);
        }
        route(routeInput) {
            for (const receiver of this.receivers) {
                routeInput(receiver);
            }
        }
    }

    function setupKeyboard(target) {
        const input = new Keyboard();
        const router = new InputRouter();
        let leftState = 0;
        let rightState = 0;
        input.listenTo(target);
        input.addListener('ArrowRight', (keyState) => {
            rightState = keyState;
            router.route((entity) => {
                entity.useTrait(Go, (go) => {
                    go.dir = rightState - leftState;
                });
            });
        });
        input.addListener('ArrowLeft', (keyState) => {
            leftState = keyState;
            router.route((entity) => {
                entity.useTrait(Go, (go) => {
                    go.dir = rightState = leftState;
                });
            });
        });
        input.addListener('KeyZ', (pressed) => {
            if (pressed) {
                router.route((entity) => {
                    entity.useTrait(Jump, (jump) => jump.start());
                });
            }
            else {
                router.route((entity) => {
                    entity.useTrait(Jump, (jump) => jump.cancel());
                });
            }
        });
        input.addListener('KeyX', (keyState) => {
            router.route((entity) => {
                if (entity instanceof Mario) {
                    entity.setTurboState(keyState === 1);
                }
            });
        });
        return router;
    }

    function createColorLayer(color) {
        return function drawColor(context) {
            context.fillStyle = color;
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        };
    }
    function createTextLayer(font, text) {
        return function drawText(context) {
            const screenWidth = Math.floor(context.canvas.width / font.size);
            const screenHeight = Math.floor(context.canvas.height / font.size);
            const x = screenWidth / 2 - text.length / 2;
            const y = screenHeight / 2;
            font.print(text, context, x * font.size, y * font.size);
        };
    }

    function getPlayer(level) {
        for (const entity of findPlayers(level.entities)) {
            if (entity.getTrait(Player))
                return entity;
        }
        throwError('Player not found!');
    }
    function createPlayerProgressLayer(font, level) {
        const size = font.size;
        const spriteBuffer = document.createElement('canvas');
        spriteBuffer.width = 32;
        spriteBuffer.height = 32;
        const spriteBufferContext = spriteBuffer.getContext('2d') || throwError('Canvas not supported!');
        return function drawPlayerProgress(context) {
            var _a;
            const entity = getPlayer(level);
            font.print(`WORLD ${level.name}`, context, size * 12, size * 12);
            spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
            entity.draw(spriteBufferContext);
            context.drawImage(spriteBuffer, size * 12, size * 15);
            const lifeCount = String((_a = entity.getTrait(Player)) === null || _a === void 0 ? void 0 : _a.lives).padStart(2, ' ');
            font.print(`x ${lifeCount}`, context, size * 16, size * 16);
        };
    }

    function getPlayerTrait(level) {
        for (const entity of findPlayers(level.entities)) {
            const trait = entity.getTrait(Player);
            if (trait)
                return trait;
        }
    }
    function getTimerTrait(level) {
        for (const entity of level.entities) {
            const trait = entity.getTrait(LevelTimer);
            if (trait)
                return trait;
        }
    }
    function createDashboardLayer(font, level) {
        const line1 = font.size;
        const line2 = font.size * 2;
        return function drawDashboard(context) {
            const player = getPlayerTrait(level);
            if (player) {
                font.print(player.name, context, 16, line1);
                font.print(String(player.score).padStart(6, '0'), context, 16, line2);
                font.print('@x' + String(player.coins).padStart(2, '0'), context, 96, line2);
            }
            font.print('WORLD', context, 152, line1);
            font.print(level.name, context, 160, line2);
            const timer = getTimerTrait(level);
            if (timer) {
                font.print('TIME', context, 208, line1);
                font.print(String(Math.floor(timer.currentTime)).padStart(3, '0'), context, 216, line2);
            }
        };
    }

    class TimedScene extends Scene {
        constructor() {
            super(...arguments);
            this.countDown = 2;
        }
        update(gameContext) {
            this.countDown -= gameContext.deltaTime;
            if (this.countDown <= 0) {
                this.events.emit(Scene.EVENT_COMPLETE);
            }
        }
    }

    function createEntityLayer(entities) {
        return function drawBoundingBox(context, camera) {
            context.strokeStyle = 'red';
            entities.forEach((entity) => {
                context.strokeRect(entity.bounds.left - camera.pos.x, entity.bounds.top - camera.pos.y, entity.size.x, entity.size.y);
            });
        };
    }
    function createTileCandidateLayer(tileResolver) {
        const tileSize = tileResolver.tileSize;
        const resolvedTiles = [];
        const getByIndexOriginal = tileResolver.getByIndex;
        tileResolver.getByIndex = function getByIndexFake(x, y) {
            resolvedTiles.push({ x, y });
            return getByIndexOriginal.call(tileResolver, x, y);
        };
        return function drawTileCandidates(context, camera) {
            context.strokeStyle = 'blue';
            resolvedTiles.forEach(({ x, y }) => {
                context.strokeRect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
            });
            resolvedTiles.length = 0;
        };
    }
    function createCollisionLayer(level) {
        const drawTileCandidates = level.tileCollider.resolvers.map(createTileCandidateLayer);
        const drawBoundingBoxes = createEntityLayer(level.entities);
        return function drawCollision(context, camera) {
            for (const draw of drawTileCandidates) {
                draw(context, camera);
            }
            drawBoundingBoxes(context, camera);
        };
    }

    class Timer {
        constructor(deltaTime = 1 / 60) {
            this.deltaTime = deltaTime;
            this.accumulatedTime = 0;
            this.update = (dt) => { };
            this.updateProxy = (time) => {
                if (this.lastTime != null) {
                    this.accumulatedTime += (time - this.lastTime) / 1000;
                    this.accumulatedTime = Math.min(this.accumulatedTime, 1);
                    while (this.accumulatedTime > this.deltaTime) {
                        this.update(this.deltaTime);
                        this.accumulatedTime -= this.deltaTime;
                    }
                }
                this.lastTime = time;
                this.enqueue();
            };
        }
        start() {
            this.enqueue();
        }
        enqueue() {
            requestAnimationFrame(this.updateProxy);
        }
    }

    async function main(canvas) {
        var _a;
        const videoContext = canvas.getContext("2d") || throwError("Canvas not supported!");
        videoContext.imageSmoothingEnabled = false;
        const audioContext = new AudioContext();
        const [entityFactory, font] = await Promise.all([
            loadEntities(audioContext),
            loadFont()
        ]);
        const loadLevel = createLevelLoader(entityFactory);
        const sceneRunner = new SceneRunner();
        const mario = ((_a = entityFactory.mario) === null || _a === void 0 ? void 0 : _a.call(entityFactory)) || throwError('where mario tho?');
        makePlayer(mario, 'MARIO');
        const inputRouter = setupKeyboard(window);
        inputRouter.addReceiver(mario);
        async function runLevel(name) {
            const loadScreen = new Scene();
            loadScreen.comp.layers.push(createColorLayer('black'));
            loadScreen.comp.layers.push(createTextLayer(font, `LOADING ${name}...`));
            sceneRunner.addScene(loadScreen);
            sceneRunner.runNext();
            await new Promise((resolve) => setTimeout(resolve, 500));
            const level = await loadLevel(name);
            level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
                if (spec.type === 'goto') {
                    for (const entity of touches) {
                        if (entity.getTrait(Player)) {
                            runLevel(spec.name);
                            return;
                        }
                    }
                }
            });
            const playerProgressLayer = createPlayerProgressLayer(font, level);
            const dashboardLayer = createDashboardLayer(font, level);
            mario.pos.set(0, 0);
            mario.vel.set(0, 0);
            level.entities.add(mario);
            const playerEnv = createPlayerEnv(mario);
            level.entities.add(playerEnv);
            const waitScreen = new TimedScene();
            waitScreen.comp.layers.push(createColorLayer('black'));
            waitScreen.comp.layers.push(dashboardLayer);
            waitScreen.comp.layers.push(playerProgressLayer);
            sceneRunner.addScene(waitScreen);
            level.comp.layers.push(createCollisionLayer(level));
            level.comp.layers.push(dashboardLayer);
            sceneRunner.addScene(level);
            sceneRunner.runNext();
        }
        const timer = new Timer();
        timer.update = function update(deltaTime) {
            if (!document.hasFocus())
                return;
            const gameContext = {
                deltaTime,
                audioContext,
                entityFactory,
                videoContext
            };
            sceneRunner.update(gameContext);
        };
        timer.start();
        runLevel('debug-progression');
    }
    document.addEventListener("DOMContentLoaded", () => {
        const canvas = document.getElementById("screen");
        if (canvas instanceof HTMLCanvasElement) {
            main(canvas).catch(e => console.error(e));
        }
        else {
            console.warn("Try Modern browser");
        }
    });

}));
//# sourceMappingURL=platformer.js.map
