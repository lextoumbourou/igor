from XBMCHandler import XBMCHandler
import helpers
from .messages import MESSAGES

from .xbmc import find_song, find_closest_artist_match, find_random_song

class XBMCListAudioHandler(XBMCHandler):
    def __init__(self, conn):
        self.conn = conn
        self.max_distance = 3
        self.playlist_id = 0

    def list_audio_by_artist(self, filt):
        kwargs = {}
        if filt:
            kwargs = {
                'filter': filt,
                'properties': [
                    'title', 'artist', 'genre', 'thumbnail'
                ]
            }

        returned = self.conn.AudioLibrary.GetSongs(kwargs)
        return returned['result']['songs']

    def run(self, outcome):
        output = {}
        artist = None
        entities = outcome['entities']

        if 'artist' in entities and entities.get('selection', {}).get('value'):
            artist_to_search = entities['artist']['body']
            potential_artist = find_closest_artist_match(
                    artist_to_search, self.conn, self.max_distance)
            if potential_artist:
                track_filter = {'artist': potential_artist['label']}
                return {
                    'body': self.list_audio_by_artist(track_filter),
                    'message': MESSAGES['song_list_by_artist'].format(potential_artist['label'])
                }


            else:
                output['message'] = MESSAGES['artist_not_found'].format(
                    artist_to_search)
                return output

            output['message'] = MESSAGES['song_list_by_artist'].format(artist)
        else:
            output['message'] = MESSAGES['cant_find_artist_to_list']

        return output
