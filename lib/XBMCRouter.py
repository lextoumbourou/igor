from .XBMCListAudioHandler import XBMCListAudioHandler
from .XBMCWatchVideoHandler import XBMCWatchVideoHandler
from .XBMCPlayAudioHandler import XBMCPlayAudioHandler
from messages import MESSAGES


class XBMCRouter():
    def __init__(self, conn):
        self.conn = conn

    def route(self, result):
        routes = {
            'play_audio': XBMCPlayAudioHandler,
            'list_audio': XBMCListAudioHandler,
            'watch_video': XBMCWatchVideoHandler,
        }
        intent = result['outcome']['intent']

        try:
            path = routes[intent](self.conn)
        except KeyError:
            return {'error': 'Route not found'}

        return path.run(result['outcome'])
