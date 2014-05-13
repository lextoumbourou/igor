from xbmcjson import XBMC, PLAYER_VIDEO

from XBMCAudioHandler import XBMCAudioHandler


class XBMCRouter():
    def __init__(self, conn):
        self.conn = conn

    def route(self, result):
        routes = {'play_audio': self.handle_audio}

        intent = result['outcome']['intent']
        try:
            path = routes[intent]
        except KeyError:
            return {'error': 'Route not found'}

        return path(result['outcome'])

    def handle_audio(self, outcome):
        track_filter = {}
        output = {}
        entities = outcome['entities']
        audio_handler = XBMCAudioHandler(self.conn)
        if 'artist' in entities:
            potential_artist = audio_handler.find_closest_artist_match(
                entities['artist'])
            if potential_artist:
                track_filter['artist'] = potential_artist

        song = audio_handler.find_random_song(track_filter)
        audio_handler.clear_playlist()
        audio_handler.add_song_to_playlist(song)
        audio_handler.play_last_song()
        output['message'] = "Cool, I'm going to go ahead and play ..." + song['label']
        return output
