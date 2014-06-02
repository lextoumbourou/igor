from . import helpers, exceptions


def find_song(filt, name, max_distance, conn):
    kwargs = {}
    if filt:
        kwargs['filter'] = filt
    song_data = conn.AudioLibrary.GetSongs(kwargs)
    songs = song_data['result']['songs']
    return helpers.find_closest_match(name, songs, max_distance)


def find_random_song(filt, conn):
    kwargs = {}
    if filt:
        kwargs['filter'] = filt
    returned = conn.AudioLibrary.GetSongs(kwargs)
    if returned['result']:
        songs = returned['result']['songs']
        return helpers.find_random_item(songs)
    else:
        raise exceptions.SongNotFound


def find_closest_artist_match(name, max_distance, conn):
    artists_data = conn.AudioLibrary.GetArtists()
    artists = artists_data['result']['artists']
    return helpers.find_closest_match(name, artists, max_distance)
