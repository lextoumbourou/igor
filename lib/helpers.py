import random

from jellyfish import levenshtein_distance as l_dist


def find_closest_match(search_string, items_to_search, max_distance=3):
    lowest = float('inf')
    lowest_match = None
    for item in items_to_search:
        distance = l_dist(search_string, item['label'].encode('utf-8'))
        if (distance <= lowest) and (distance <= max_distance):
            lowest = distance
            lowest_match = item

    return lowest_match


def find_random_item(items):
    random_index = random.randint(0, len(items) - 1)
    return items[random_index]
