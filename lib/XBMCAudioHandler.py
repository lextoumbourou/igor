import random

from jellyfish import levenshtein_distance as l_dist


class XBMCAudioHandler():
    def __init__(self, conn):
        self.conn = conn
        # Arbitrary maximum distance for the Levenshtein distance str compare
        # anything higher than this, and it's probably the wrong artist
        self.max_distance = 3

    def find_closest_artist_match(self, name):
        artists_data = self.conn.AudioLibrary.GetArtists()
        lowest = float('inf')
        lowest_artist = None
        for artist in artists_data['results']['artists']:
            distance = l_dist(name, artist['label'])
            if (distance <= lowest) and (distance <= self.max_distance):
                lowest = distance
                lowest_artist = artist

        return lowest_artist

    def find_random_song(self, filt):
        song_data = self.conn.AudioLibrary.GetSongs(filt)
        songs = song_data['result']['songs']
        random_index = random.randint(0, len(songs))
        return songs[random_index]
