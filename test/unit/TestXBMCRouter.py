from unittest import TestCase
from mock import MagicMock

from lib import XBMCRouter


class TestXbmcRouter(TestCase):
    def setUp(self):
        self.xbmc_router = XBMCRouter(MagicMock())

    def test_route_to_audio_when_request(self):
        result = {
            'outcome': {
                'intent': 'play_audio',
                'entities': {
                    'artist': {'value': 'James Blake'},
                  }
            }
        }
        audio_mock = MagicMock()
        audio_mock.return_value = 'Audio'
        self.xbmc_router.handle_audio = audio_mock

        result = self.xbmc_router.route(result)
        assert result == 'Audio'
