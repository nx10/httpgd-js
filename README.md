# R `httpgd` GraphicsDevice API and connection handler

API and connection handler to connect with [R httpgd servers](https://github.com/nx10/httpgd).

## Features

- Simplify `httpgd` server access from JavaScript
- Full TypeScript type definitions
- Automatic WebSocket connection with polling fallback and reconnection

## Usage

Minimal example how to listen for server side changes:

```JavaScript
import 'httpgd';

const httpgd = new Httpgd('127.0.0.1:1234', 'mytoken', true);
httpgd.onPlotsChanged((newState) => console.log(newState));
httpgd.connect();
```

Advanced usage example: The client included in the [httpgd R package](https://github.com/nx10/httpgd).

## License

MIT