import random

from XBMCHandler import XBMCHandler
import helpers


class SongNotFound(Exception):
    pass


class XBMCAudioHandler(XBMCHandler):
    def __init__(self, conn):
        self.conn = conn
        self.max_distance = 3
        self.playlist_id = 0

    def find_closest_artist_match(self, name):
        artists_data = self.conn.AudioLibrary.GetArtists()
        artists = artists_data['result']['artists']
        return helpers.find_closest_match(name, artists, self.max_distance)

    def find_song(self, filt, name):
        kwargs = {}
        if filt:
            kwargs['filter'] = filt
        song_data = self.conn.AudioLibrary.GetSongs(kwargs)
        songs = returned['result']['songs']
        return helpers.find_closest_match(name, songs, self.max_distance)

    def find_random_song(self, filt):
        kwargs = {}
        if filt:
            kwargs['filter'] = filt
        returned = self.conn.AudioLibrary.GetSongs(kwargs)
        if returned['result']:
            songs = returned['result']['songs']
            return helpers.find_random_item(songs)
        else:
            raise SongNotFound

    
