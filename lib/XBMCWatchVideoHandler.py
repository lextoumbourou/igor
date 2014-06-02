from XBMCHandler import XBMCHandler
import helpers
from .messages import MESSAGES


class XBMCWatchVideoHandler(XBMCHandler):
    def __init__(self, conn):
        self.conn = conn
        self.max_distance = 3
        self.playlist_id = 1

    def run(self, outcome):
        output = {}
        video_filter = {}
        video = None
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
                output['message'] = MESSAGES['genre_not_found'].format(
                    genre_to_search)
                return output

        if 'selection' in entities:
            selection = entities['selection']['value']
            if selection == 'random':
                video = self.video_handler.find_random_video(
                    video_filter, video_type)

        if video:
            self.video_handler.clear_playlist()
            self.video_handler.add_item_to_playlist({'movieid': video['movieid']})
            self.video_handler.play_last_playlist_item()
            output['message'] = MESSAGES['video_found'].format(
                video['label'])
        else:
            output['message'] = MESSAGES['video_not_found'].format(video['label'])

    
    def find_closest_genre_match(self, name, video_type):
        genre_data = self.conn.VideoLibrary.GetGenres(type=video_type)
        genres = genre_data['result']['genres']
        return helpers.find_closest_match(name, genres, self.max_distance)

    def find_random_video(self, filt, video_type):
        kwargs = {}
        if filt:
            kwargs['filter'] = filt
        if video_type == 'movie':
            items = self.conn.VideoLibrary.GetMovies(kwargs)
        elif video_type == 'tvshow':
            items = self.conn.VideoLibrary.GetEpisodes(kwargs)
        elif video_type == 'musicvideo':
            items = self.conn.VideoLibrary.GetMusicVideos(kwargs)
        if items:
            return helpers.find_random_item(
                items['result']['{}s'.format(video_type)])
