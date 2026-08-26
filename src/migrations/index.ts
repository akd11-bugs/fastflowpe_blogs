import * as migration_20260817_103904 from './20260817_103904';
import * as migration_20260817_124850 from './20260817_124850';
import * as migration_20260819_070605 from './20260819_070605';
import * as migration_20260819_075000 from './20260819_075000';
import * as migration_20260819_080000 from './20260819_080000';
import * as migration_20260824_090000 from './20260824_090000';
import * as migration_20260824_120000 from './20260824_120000';
import * as migration_20260825_090000 from './20260825_090000';
import * as migration_20260825_120000 from './20260825_120000';
import * as migration_20260826_090000 from './20260826_090000';
import * as migration_20260826_100000 from './20260826_100000';
import * as migration_20260826_110000 from './20260826_110000';
import * as migration_20260826_180000 from './20260826_180000';

export const migrations = [
  {
    up: migration_20260817_103904.up,
    down: migration_20260817_103904.down,
    name: '20260817_103904',
  },
  {
    up: migration_20260817_124850.up,
    down: migration_20260817_124850.down,
    name: '20260817_124850',
  },
  {
    up: migration_20260819_070605.up,
    down: migration_20260819_070605.down,
    name: '20260819_070605'
  },
  {
    up: migration_20260819_075000.up,
    down: migration_20260819_075000.down,
    name: '20260819_075000'
  },
  {
    up: migration_20260819_080000.up,
    down: migration_20260819_080000.down,
    name: '20260819_080000'
  },
  {
    up: migration_20260824_090000.up,
    down: migration_20260824_090000.down,
    name: '20260824_090000'
  },
  {
    up: migration_20260824_120000.up,
    down: migration_20260824_120000.down,
    name: '20260824_120000'
  },
  {
    up: migration_20260825_090000.up,
    down: migration_20260825_090000.down,
    name: '20260825_090000'
  },
  {
    up: migration_20260825_120000.up,
    down: migration_20260825_120000.down,
    name: '20260825_120000'
  },
  {
    up: migration_20260826_090000.up,
    down: migration_20260826_090000.down,
    name: '20260826_090000'
  },
  {
    up: migration_20260826_100000.up,
    down: migration_20260826_100000.down,
    name: '20260826_100000'
  },
  {
    up: migration_20260826_110000.up,
    down: migration_20260826_110000.down,
    name: '20260826_110000'
  },
  {
    up: migration_20260826_180000.up,
    down: migration_20260826_180000.down,
    name: '20260826_180000'
  },
];
