import * as migration_20250224_091656 from './20250224_091656'
import * as migration_seed from './seed'

export const migrations = [
  {
    up: migration_20250224_091656.up,
    down: migration_20250224_091656.down,
    name: '20250224_091656',
  },
  {
    up: migration_seed.up,
    name: 'seed',
  },
]
