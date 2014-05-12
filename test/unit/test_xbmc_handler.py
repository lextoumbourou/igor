from unittest import TestCase

from lib.xbmc_handler import XBMCHandler

class XBMCHandlerTest(TestCase):
    def setUp(self):
        pass

    def test_play_audio_with_artist_returns_song_list(self):
        result = {
            'outcome': {
                'intent': 'play_audio',
                'entities': {
                    'artist': {'value': 'James Blake'},
                }
            }
        }
        xbmc = XBMCHandler('http://10.0.0.5:8080')
        xbmc.connect()
        output = xbmc.route(result)
        assert output['result']['songs'][0]['label'] == 'Retrograde'
