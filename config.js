const U = 17;
const FIELD_WIDTH = 17;
const FIELD_HEIGHT = 17;
const FIELD_WIDTH_PX = FIELD_WIDTH * U;
const FIELD_HEIGHT_PX = FIELD_HEIGHT * U;
const START_X = Math.floor(FIELD_WIDTH / 2);
const START_Y = Math.floor(FIELD_HEIGHT / 2);
const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  NONE: { x: 0, y: 0 },
};
const FRAMERATE_0 = 630;
const FRAMERATE_1 = 540;
const FRAMERATE_2 = 470;
const FRAMERATE_3 = 380;
const FRAMERATE_4 = 290;
const FRAMERATE_5 = 230;
const COLOR_SNAKE_BODY = '#239b56';
const COLOR_SNAKE_HEAD = '#196f3d';
const COLOR_FOOD = '#d22d3b';
const COLOR_BLANK = '#f0f0f1';
const COLOR_FOG = 'rgba(88, 64, 70, 0.5)';