from XBMCAudioHandler import XBMCAudioHandler
from XBMCVideoHandler import XBMCVideoHandler
from messages import MESSAGES


class XBMCRouter():
    def __init__(self, conn):
        self.conn = conn
        self.audio_handler = XBMCAudioHandler(self.conn)
        self.video_handler = XBMCVideoHandler(self.conn)

    def route(self, result):
        routes = {
            'play_audio': self.handle_audio,
            'watch_video': self.handle_video
        }

        intent = result['outcome']['intent']
        try:
            path = routes[intent]
        except KeyError:
            return {'error': 'Route not found'}

        return path(result['outcome'])

    def handle_video(self, outcome):
        output = {}
        video_filter = {}
        entities = outcome['entities']
        if 'type' in entities:
            video_type = entities['type']['value']
        else:
            video_type = 'movie'

        if 'genre' in entities:
            genre_to_search = entities['genre']['value']
            potential_genre = self.video_handler.find_closest_genre_match(
                genre_to_search, video_type)
            if potential_genre:
                video_filter['genre'] = potential_genre['label']
            else:
                output['message'] = MESSAGE['genre_not_found'].format(
                    genre_to_search)
                return output

        if 'selection' in entities:
            selection = entities['selection']['value']
            if selection == 'random':
                video = self.video_handler.find_random_video(
                    video_filter, video_type)

        self.video_handler.clear_playlist()
        self.video_handler.add_song_to_playlist(song)
        self.video_handler.play_last_song()
        output['message'] = MESSAGES['video_not_found'].format(video['label'])
        return output

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
            selection = entities['selection']['value']
            if selection == 'exact':
                song_name = entities['song']['value']
                song = self.audio_handler.find_song(track_filter, song_name)
                if not song:
                    output['message'] = MESSAGES['song_not_found']
                    return output
            elif selection == 'random':
                song = self.audio_handler.find_random_song(track_filter)

        if song:
            self.audio_handler.clear_playlist()
            self.audio_handler.add_song_to_playlist({'songid': song['songid']})
            self.audio_handler.play_last_song()
            output['message'] = MESSAGES['song_and_artist_found'].format(
                potential_artist['label'], song['label'])
        else:
            output['message'] = MESSAGES['action_not_found']

        return output
