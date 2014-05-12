from unittest import TestCase
from mock import MagicMock, patch

from lib import XBMCAudioHandler

import mock_json


class TestXbmc(TestCase):
    def setUp(self):
        self.xbmc_audio = XBMCAudioHandler(MagicMock())

    def test_find_artist_when_requested(self):
        (self.xbmc_audio
            .conn.AudioLibrary.GetArtists.return_value) = mock_json.ARTIST_JSON
        result = self.xbmc_audio.find_closest_artist_match(
            'james blake')
        assert result['label'] == 'James Blake'

    def test_find_a_random_song_by_artist_returns_song(self):
        (self.xbmc_audio
            .conn.AudioLibrary.GetSongs.return_value) = mock_json.SONG_JSON
        with patch('random.randint', return_value=1) as _:
            result = self.xbmc_audio.find_random_song({'artist': 'James Blake'})
            assert result['label'] == 'Song 2'
