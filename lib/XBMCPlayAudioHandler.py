from XBMCHandler import XBMCHandler

from .xbmc import find_song, find_closest_artist_match, find_random_song
from .messages import MESSAGES


class XBMCPlayAudioHandler(XBMCHandler):
    def __init__(self, conn):
        self.conn = conn
        self.max_distance = 3
        self.playlist_id = 0

    def run(self, outcome):
        track_filter = {}
        output = {}
        potential_artist = song = None
        entities = outcome['entities']
        if 'artist' in entities:
            artist_to_search = entities['artist']['value']
            potential_artist = find_closest_artist_match(
                artist_to_search, self.conn, self.max_distance)
            if potential_artist:
                track_filter['artist'] = potential_artist['label']
            else:
                output['message'] = MESSAGES['artist_not_found'].format(
                    artist_to_search)
                return output

        if 'selection' in entities:
            if (
                entities['selection'].get('body') == 'exact' or
                'song' in entities
            ):
                song_name = entities['song']['value']
                song = find_song(track_filter, song_name)
                if not song:
                    output['message'] = MESSAGES['song_not_found']
                    return output

            if entities['selection'].get('body') == 'random':
                song = find_random_song(track_filter)

        if song:
            self.clear_playlist()
            self.add_item_to_playlist({'songid': song['songid']})
            self.play_last_playlist_item()
            if potential_artist:
                output['message'] = MESSAGES['song_and_artist_found'].format(
                    potential_artist['label'], song['label'])
            else:
                output['message'] = (
                    MESSAGES['song_found'].format(song['label']))
        else:
            output['message'] = MESSAGES['action_not_found']

        return output
