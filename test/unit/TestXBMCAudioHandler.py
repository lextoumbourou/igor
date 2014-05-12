from unittest import TestCase
from mock import MagicMock

from lib import XBMCAudioHandler

import mock_json


class TestXBMCAudioHandler(TestCase):
    def setUp(self):
        self.xbmc_audio = XBMCAudioHandler(MagicMock())

    def test_find_artist_when_requested(self):
        (self.xbmc_audio
            .conn.AudioLibrary.GetArtists.return_value) = mock_json.ARTIST_JSON
        result = self.xbmc_audio.find_closest_artist_match(
            'james blake')
        assert result['label'] == 'James Blake'
