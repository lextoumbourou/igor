# Igor - XBMC voice-recognition experiment (powered by [Wit.ai](https://wit.ai/))

**Warning: this software doesn't work yet!**

Like everything in life, inspired by the movie [Brainscan](http://youtu.be/mT1Vr13s17U?t=25m33s) (25m 33s).

## Quickstart

### Install bower deps

```
> bower install
```

### Install node deps

```
> npm install
```

### Run tests

```
> npm test
```

## To do

1. Improve support for listing audio, include meta data and so forth
2. Add support for listing movies
3. Add contextual events
  * Example: If I request to list all genres of a movie, my next "Watch Movie" request should place a higher weight on the ones already listed
4. ~~Remove the Wit proxy and make calls to Wit using just JS and WebSockets~~
5. Send audio data directly to Wit, removing the need for the Chrome Voice Recognition API
6. ~~Remove the XBMC proxy :) and make calls to XBMC with JS and WebSockets~~
7. Display a large icon like Google Now when in record mode
8. Create a settings page for XBMC settings
9. Add TV Show support
10. Display error when unable to connect to XBMC
