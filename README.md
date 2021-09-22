# R `httpgd` GraphicsDevice API and connection handler

API and connection handler to connect with [R httpgd servers](https://github.com/nx10/httpgd).

## Features

- Simplify `httpgd` server access from JavaScript
- Full TypeScript type definitions
- Automatic WebSocket connection with polling fallback and reconnection

## Usage

### Base usage

Minimal example how to listen for server side changes:

```JavaScript
import { Httpgd } from 'httpgd';

const httpgd = new Httpgd('127.0.0.1:1234', 'mytoken', true);
httpgd.onPlotsChanged((newState) => console.log(newState));
httpgd.connect();

// httpgd.removePlot(...)
// httpgd.getPlotURL(...)
```

Advanced usage example: The client included in the [httpgd R package](https://github.com/nx10/httpgd).

### Direct API access

In applications where there is no need to continuously listen for server side changes, `httpgd` APIs can also be called directly using the `api` module. 

Example: 

```JavaScript
import { url_plot } from 'httpgd/lib/api';

const url = url_plot({ host: '127.0.0.1:1234' }, { id: 'myPlotId' });
document.getElementsByTagName('img')[0].src = url;
```

## License

MIT