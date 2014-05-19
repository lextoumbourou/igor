from XBMCAudioHandler import XBMCAudioHandler
from messages import MESSAGES


class XBMCRouter():
    def __init__(self, conn):
        self.conn = conn
        self.audio_handler = XBMCAudioHandler(self.conn)

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
        if 'artist' in entities:
            artist_to_search = entities['artist']['value']
            potential_artist = self.audio_handler.find_closest_artist_match(
                artist_to_search)
            if potential_artist:
                track_filter['artist'] = potential_artist['label']
            else:
                output['message'] = MESSAGES['artist_not_found'].format(
                    artist_to_search)
                return output

        if 'selection' in entities:
            if entities['selection']['value'] == 'exact':
                song_name = entities['song']['value']
                song = self.audio_handler.find_song(track_filter, song_name)
                if not song:
                    output['message'] = MESSAGES['song_not_found']
                    return output
            else:
                song = self.audio_handler.find_random_song(track_filter)

        self.audio_handler.clear_playlist()
        self.audio_handler.add_song_to_playlist(song)
        self.audio_handler.play_last_song()
        output['message'] = (
            "Okay. I'll play {} - {}".format(
                potential_artist['label'], song['label'])
        )

        return output
