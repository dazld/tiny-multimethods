# tiny-multimethods

A lightweight implementation of Clojure-style multimethods for JavaScript in under 30 lines of code. Define functions that dispatch to different implementations based on runtime values.

## Installation

```bash
npm install tiny-multimethod
```

## Usage

```javascript
import { defmulti, DEFAULT } from 'tiny-multimethod';

// Create a multimethod that dispatches based on shape type
const calculateArea = defmulti(
  shape => shape.type,
  ['circle', shape => Math.PI * shape.radius ** 2],
  ['rectangle', shape => shape.width * shape.height],
  [DEFAULT, shape => {
    throw new Error(`Can't calculate area of ${shape.type}`);
  }]
);

// Use it
console.log(calculateArea({ type: 'circle', radius: 5 })); // 78.54...
console.log(calculateArea({ type: 'rectangle', width: 4, height: 3 })); // 12

// Add new methods dynamically
calculateArea.addMethod('triangle', shape =>
  (shape.base * shape.height) / 2
);
```

## Features

- 🪶 Lightweight: Less than 30 lines of code
- 🎯 Flexible dispatch: Use any function to determine which method to call
- 🔌 Extensible: Add new methods at runtime
- 🛟 Default cases: Handle unknown values gracefully
- 🧩 Multiple dispatch patterns: Support for both array pairs and separate arguments

## API

### `defmulti(dispatchFn, ...methods)`

Creates a new multimethod using the provided dispatch function and method implementations.

Parameters:
- `dispatchFn`: Function that takes an argument and returns a dispatch value
- `...methods`: Array of `[dispatchValue, implementation]` pairs

Returns: A function that will dispatch to the appropriate method based on the dispatch function's result.

### `DEFAULT`

A special symbol used to define default method implementations.

## Examples

### Content Renderer

```javascript
const renderContent = defmulti(
  content => content.type,
  ['text', content => `<p>${content.value}</p>`],
  ['image', content => `<img src="${content.url}" alt="${content.alt || ''}">`],
  ['video', content => `
    <video controls>
      <source src="${content.url}" type="video/mp4">
    </video>
  `],
  [DEFAULT, content => `<div>Unsupported content type: ${content.type}</div>`]
);

// Usage
renderContent({ type: 'text', value: 'Hello World' });
// <p>Hello World</p>
```

### Priority-based Notifications

```javascript
const notifyUser = defmulti(
  notification => notification.priority,
  ['high', n => {
    console.log('🚨 URGENT:', n.message);
    return 'high-priority-handled';
  }],
  ['medium', n => {
    console.log('ℹ️ NOTICE:', n.message);
    return 'medium-priority-handled';
  }],
  ['low', n => {
    console.log('📝 FYI:', n.message);
    return 'low-priority-handled';
  }]
);

notifyUser({ priority: 'high', message: 'System is down!' });
// 🚨 URGENT: System is down!
```

### Complex Dispatch

```javascript
const calculateShipping = defmulti(
  // Dispatch based on multiple factors
  order => `${order.method}-${order.type}`,

  ['express-fragile', order => {
    const baseCost = order.weight * 0.1 + order.distance * 0.05;
    return baseCost * 2.5 + 15; // Extra handling + insurance
  }],

  ['standard-regular', order => {
    return order.weight * 0.1 + order.distance * 0.05;
  }]
);
```

### Dynamic Method Addition

```javascript
const processor = defmulti(
  data => data.version,
  ['v1', data => ({ ...data, upgraded: true })]
);

// Add support for new version later
processor.addMethod('v2', data => ({
  ...data,
  upgraded: true,
  timestamp: Date.now()
}));
```

## Why Use This?

- **Clean Code Organization**: Group related implementations together instead of scattered if/else statements
- **Runtime Extensibility**: Add new behaviors without modifying existing code
- **Simple but Powerful**: Lightweight implementation that handles most common use cases
- **Flexible Dispatch**: Use any function to determine which implementation to use

## Inspiration

This implementation is inspired by Clojure's multimethod system, bringing similar capabilities to JavaScript in a lightweight package.

## License

MIT

## Contributing

Issues and pull requests are welcome! Feel free to contribute to make this tiny utility even better.
