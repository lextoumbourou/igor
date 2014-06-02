from unittest import TestCase
from mock import MagicMock, patch

from lib.XBMCPlayAudioHandler import XBMCPlayAudioHandler

import mock_json


class TestXbmc(TestCase):
    def setUp(self):
        self.xbmc_audio = XBMCPlayAudioHandler(MagicMock())

    def test_find_artist_when_requested(self):
        (self.xbmc_audio
            .conn.AudioLibrary.GetArtists.return_value) = mock_json.ARTIST_JSON
        result = self.xbmc_audio.find_closest_artist_match(
            'james blake')
        assert result['label'] == 'James Blake'

    def test_find_a_random_song_by_artist_returns_song(self):
        (self.xbmc_audio
            .conn.AudioLibrary.GetSongs.return_value) = mock_json.SONG_JSON
        with patch('random.randint', return_value=1):
            result = self.xbmc_audio.find_random_song(
                {'artist': 'James Blake'})
            assert result['label'] == 'Song 2'

    #def test_output_failure_message_when_no_artist_found(self):
    #    artist = 'Some goose'
    #    result = {
    #        'outcome': {
    #            'intent': 'play_audio',
    #            'entities': {
    #                'artist': {'value': artist},
    #            }
    #        }
    #    }
    #    audio_mock.find_closest_artist_match.return_value = None
    #    self.xbmc_router.audio_handler = audio_mock
    #    output = self.xbmc_router.route(result)
    #    assert output['message'] == (
    #        MESSAGES['artist_not_found'].format(artist))
