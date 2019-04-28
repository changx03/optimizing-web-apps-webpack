import './klondike/scoring.es6';
// require('./klondike/scoring');
import './klondike/klondike';
import './klondike/board';
import './klondike/game';
import { max } from './import-test';

angular.module('solitaire', ['klondike', 'ngDraggable']);

// export const myTest1 = 'Hello world!';

// export const myTest2 = 'Greeting!';

const myMaxVal = max([1, 2, 3, 4, 5]);
