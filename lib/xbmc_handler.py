import re

from xbmcjson import XBMC, PLAYER_VIDEO

class XBMCHandler():
    def __init__(self, host):
        self.host = host

    def connect(self):
        url = '{}/jsonrpc'.format(self.host)
        self.xbmc = XBMC(url)

    def handle_audio(self, outcome):
        """
        Audio hierarchy works like this:
            1. if user has included an artist name, we seek to find artist name with the highest
               to the returned string levenshtein_distance
            2. if a genre is included, as above.
            3. if a song is included, we use the artist name as a filter and find the song
            4. if a song isn't included, we return a list of potential songs and albums
        """
        output = {}
        entities = outcome['entities']
        artist = self.get_artist(entities)
        if artist:
            track, candidates = self.find_track_by_artist(artist)
        else:
            track, candidates = self.find_track_by_filter(outcome)

        if track:
            self.xbmc.Playlist.Add(playlistid=0, item={'songid': track['songid']})
            self.xbmc.Player.Open(item={'playlistid': 0, 'position': 10})
            output['message'] = "Cool, I'm going to go ahead and play ..." + track['label']
        else:
            output['message'] = "Okay, here are some of the tracks you might want to play"
            output['candidates'] = candidates

        return output

    def get_artist(self, entities):
        if entites.get('artist'):
            data = self.xbmc.AudioLibrary.GetArtists()
            for artist in data['result']['artists']:
                if entities.get('artist') == artist['label']:
                    return artist
        return None

    def find_track_by_artist(self, artist):
        output = []
        all_songs = self.xbmc.AudioLibrary.GetSongs(filter={'artist': artist})
        for song in all_songs['result']['artists']:
            output.append(song)

        track = None
        # To do: fix this shit LOL
        if len(output) == 1:
            track = output[0]

        return track, output

    def find_track_by_filter(self, filt):
        output = []
        songs_data = self.xbmc.AudioLibrary.GetSongs()
        for song in songs_data['result']['artists']:
            if filt is in song['label']:
                output.append(artist)

        track = None
        if len(output) == 1:
            track = output[0]

        return track, output

    def route(self, result):
        intent = result['outcome']['intent']
        if intent == 'play_audio':
            return self.handle_audio(result['outcome'])
