import { isMapMetaDataAvailable } from '../../common/mapMetaData';
import { settings } from './_build/DarkPlasma_DarkMap_parameters';

/**
 * @param {Game_Map.prototype} gameMap
 */
function Game_Map_DarkMapMixIn(gameMap) {
  gameMap.isDark = function () {
    return isMapMetaDataAvailable() && $dataMap.meta.dark;
  };

  gameMap.lightEvents = function () {
    return this.events().filter((event) => event.hasLight());
  };
}

Game_Map_DarkMapMixIn(Game_Map.prototype);

/**
 * @param {Game_Event.prototype} gameEvent
 */
function Game_Event_DarKMapMixIn(gameEvent) {
  gameEvent.hasLight = function () {
    return this.event() && this.event().meta.light;
  };

  gameEvent.lightRadius = function () {
    if (!this.hasLight()) {
      return 0;
    }
    return this.event().meta.lightRadius ? Number(this.event().lightRadius) : settings.lightRadius;
  };

  gameEvent.lightColor = function () {
    if (!this.hasLight()) {
      return null;
    }
    return this.event().meta.lightColor || lightColor();
  };
}

Game_Event_DarKMapMixIn(Game_Event.prototype);

function darkColor() {
  return `#${(
    (1 << 24) +
    ((255 - settings.darkness) << 16) +
    ((255 - settings.darkness) << 8) +
    255 -
    settings.darkness
  )
    .toString(16)
    .slice(1)}`;
}

function lightColor() {
  return `#${((1 << 24) + (settings.lightColor.red << 16) + (settings.lightColor.green << 8) + settings.lightColor.blue)
    .toString(16)
    .slice(1)}`;
}

Bitmap.prototype.fillGradientCircle = function (centerX, centerY, radius, lightColor) {
  const context = this._context;
  const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, lightColor);
  gradient.addColorStop(1, darkColor());
  context.save();
  context.globalCompositeOperation = 'lighter';
  context.fillStyle = gradient;
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  context.restore();
};

/**
 * @param {Spriteset_Map.prototype} spritesetMap
 */
function Spriteset_Map_DarkMapMixIn(spritesetMap) {
  const _createLowerLayer = spritesetMap.createLowerLayer;
  spritesetMap.createLowerLayer = function () {
    _createLowerLayer.call(this);
    this.createDarknessLayer();
  };

  spritesetMap.createDarknessLayer = function () {
    this._darknessLayer = new DarknessLayer();
    this.addChild(this._darknessLayer);
  };
}

Spriteset_Map_DarkMapMixIn(Spriteset_Map.prototype);

class DarknessLayer extends PIXI.Container {
  constructor() {
    super();
    this._width = Graphics.width;
    this._height = Graphics.height;
    this.createBitmap();
  }

  createBitmap() {
    this._bitmap = new Bitmap(this._width, this._height);
    const sprite = new Sprite(this.viewport);
    sprite.bitmap = this._bitmap;
    sprite.opacity = 255;
    sprite.blendMode = 2;
    sprite.x = 0;
    sprite.y = 0;
    this.addChild(sprite);
  }

  update() {
    if ($gameMap.isDark()) {
      this._bitmap.fillRect(0, 0, this._width, this._height, darkColor());
      this._bitmap.fillGradientCircle($gamePlayer.screenX(), $gamePlayer.screenY(), settings.lightRadius, lightColor());
      $gameMap.lightEvents().forEach((event) => {
        this._bitmap.fillGradientCircle(event.screenX(), event.screenY(), event.lightRadius(), event.lightColor());
      });
    }
  }
}
