const U = 10;
const FIELD_WIDTH = 17;
const FIELD_HEIGHT = 9;
const START_X = Math.floor(FIELD_WIDTH / 2);
const START_Y = Math.floor(FIELD_HEIGHT / 2);
const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  NONE: { x: 0, y: 0 },
};
const FRAMERATE_0 = 700;
const FRAMERATE_1 = 600;
const FRAMERATE_2 = 500;
const FRAMERATE_3 = 400;
const FRAMERATE_4 = 300;