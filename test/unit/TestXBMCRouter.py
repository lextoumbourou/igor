from unittest import TestCase
from mock import MagicMock

from lib import XBMCRouter
from lib.messages import MESSAGES


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

    def test_output_failure_message_when_no_artist_found(self):
        artist = 'Some goose'
        result = {
            'outcome': {
                'intent': 'play_audio',
                'entities': {
                    'artist': {'value': artist},
                }
            }
        }
        audio_mock = MagicMock()
        audio_mock.find_closest_artist_match.return_value = None
        self.xbmc_router.audio_handler = audio_mock
        output = self.xbmc_router.route(result)
        assert output['message'] == MESSAGES['artist_not_found'].format(artist)
