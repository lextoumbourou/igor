from unittest import TestCase
from mock import MagicMock

from lib import XBMCAudioHandler

class TestXBMCAudioHandler(TestCase):
    ARTIST_JSON = {
        'id': 1,
        'jsonrpc': 2.0,
        'results': {'artists': [
            {'label': 'James Blake', 'artistid': 1},
            {'label': 'Mark Morrison', 'artistid': 2}
        ]}
    }

    def setUp(self):
        self.xbmc_audio = XBMCAudioHandler(MagicMock())

    def test_find_artist_when_requested(self):
        (self.xbmc_audio
            .conn.AudioLibrary.GetArtists.return_value) = self.ARTIST_JSON
        result = self.xbmc_audio.find_closest_artist_match(
            'james blake')
        assert result['label'] == 'James Blake'
