import mock

from lib.XBMCRouter import XBMCRouter
from lib.messages import MESSAGES


class TestXbmcRouter():
    def setUp(self):
        self.xbmc_router = XBMCRouter(mock.MagicMock())

    @mock.patch('lib.XBMCRouter.XBMCPlayAudioHandler')
    def test_route_to_audio_when_request(self, audio_mock):
        result = {
            'outcome': {
                'intent': 'play_audio',
                'entities': {
                    'artist': {'value': 'James Blake'},
                }
            }
        }
        self.xbmc_router.route(result)
        assert audio_mock.called

    @mock.patch('lib.XBMCRouter.XBMCListAudioHandler')
    def test_list_audio_when_request(self, list_audio_mock):
        result = {
            'outcome': {
                'intent': 'list_audio',
                'entities': {
                    'artist': {'value': 'James Blake'},
                }
            }
        }
        result = self.xbmc_router.route(result)
        assert list_audio_mock.called

    @mock.patch('lib.XBMCRouter.XBMCWatchVideoHandler')
    def test_watch_video_when_request(self, watch_video_mock):
        result = {
            'outcome': {
                'intent': 'watch_video',
            }
        }
        result = self.xbmc_router.route(result)
        assert watch_video_mock.called
