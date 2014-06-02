# Igor - XBMC and Wit.ai voice-recognition experiment

A very simple voice-recognition proof of concept for XBMC using [Wit's](https://wit.ai/) API.

Like everything in life, inspired by the movie [Brainscan](http://youtu.be/mT1Vr13s17U?t=25m33s) (25m 33s).

## Quickstart

### Install bower deps

```
> bower install
```

### Install node deps

```
> node install karma
```

### Install Python deps (preferably in a [virtualenv](https://pypi.python.org/pypi/virtualenv))

```
> virtualenv ENV
> source ENV/bin/activate
> pip install -r requirements.txt
```

## To do

1. Improve support for listing audio, include meta data and so forth
2. Add support for listing movies
3. Add contextual events
  * Example: If I to list all genres of a movie, my next "Watch Movie" request should place a higher weight on the ones listed on the screen.
4. Remove the Wit proxy and make calls to Wit using just JS and WebSockets
5. Send audio data directly to Wit, removing the need for the Chrome Voice Recognition API
6. Remove the XBMC proxy :) and make calls to XBMC with JS and WebSockets
7. More to come...

## Sources

http://shapeshed.com/html5-speech-recognition-api/
