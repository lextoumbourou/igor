import random

from jellyfish import levenshtein_distance as l_dist


class SongNotFound(Exception):
    pass


class XBMCAudioHandler(object):
    def __init__(self, conn):
        self.conn = conn
        # Arbitrary maximum distance for the Levenshtein distance str compare
        # anything higher than this, and it's probably the wrong artist
        self.max_distance = 3

    def find_closest_artist_match(self, name):
        artists_data = self.conn.AudioLibrary.GetArtists()
        lowest = float('inf')
        lowest_artist = None
        for artist in artists_data['result']['artists']:
            distance = l_dist(name, artist['label'].encode('utf-8'))
            if (distance <= lowest) and (distance <= self.max_distance):
                lowest = distance
                lowest_artist = artist

        return lowest_artist

    def find_random_song(self, filt):
        kwargs = {}
        if filt:
            kwargs['filter'] = filt
        returned = self.conn.AudioLibrary.GetSongs(kwargs)
        if returned['result']:
            songs = returned['result']['songs']
            random_index = random.randint(0, len(songs))
            return songs[random_index]
        else:
            raise SongNotFound

    def clear_playlist(self):
        return self.conn.Playlist.Clear(playlistid=0)

    def add_song_to_playlist(self, song):
        return self.conn.Playlist.Add(
            playlistid=0, item={'songid': song['songid']})

    def play_last_song(self):
        returned = self.conn.Playlist.GetItems(playlistid=0)
        position = len(returned['result']['items']) - 1
        return self.conn.Player.Open(
            item={'playlistid': 0, 'position': position})
