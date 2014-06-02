class XBMCHandler(object):
    def __init__(self, conn):
        self.conn = conn
        # Arbitrary maximum distance for the Levenshtein distance str compare
        # anything higher than this, and it's probably the wrong thing
        self.max_distance = 3
        self.playlist_id = 0

    def run(self):
        raise NotImplementedError('Subclass should implement this')

    def clear_playlist(self):
        return self.conn.Playlist.Clear(playlistid=self.playlist_id)

    def add_item_to_playlist(self, item):
        return self.conn.Playlist.Add(
            playlistid=self.playlist_id, item=item)

    def play_last_playlist_item(self):
        returned = self.conn.Playlist.GetItems(playlistid=self.playlist_id)
        position = len(returned['result']['items']) - 1
        return self.conn.Player.Open(
            item={'playlistid': self.playlist_id, 'position': position})
