from jellyfish import levenshtein_distance as l_dist

from XBMCHandler import XBMCHandler
import helpers


class XBMCVideoHandler(XBMCHandler):
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
