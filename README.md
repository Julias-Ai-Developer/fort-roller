# fort-roller
A lightweight TypeScript/JavaScript library for rolling dice and generating random outcomes with support for standard notation (e.g., `2d6`, `1d20+5`).

## Features

- Simple dice notation parsing
- Multiple dice types support
- Modifier calculations
- Random outcome generation

## Installation

```bash
npm install fort-roller
```

## Usage

```typescript
import { rollDice } from 'fort-roller';

const result = rollDice('2d6+3');
console.log(result); // { total: 11, rolls: [4, 5], modifier: 3 }
```

## License

MIT