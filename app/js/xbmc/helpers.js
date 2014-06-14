'use strict';

var app = angular.module('xbmc.services');

app.factory('helpers', function() {
  // For Levenshtein Distance string matching
  var maxDistance = 3;

  /*
   * findClosestMatch
   *
   * Use Levenshtein Distance to find the closest match to a string
   * in an array of XBMC objects
   */
  var _findClosestMatch = function(itemToFind, itemsToSearch) {
    var lowest = Infinity;
    var lowestMatch = null;

    for (var i = 0; i < itemsToSearch.length; i++) {

      var item = itemsToSearch[i];
      var l = new Levenshtein(itemToFind, item.label);

      if (l.distance <= lowest && l.distance <= maxDistance) {
        lowest = l.distance;
        lowestMatch = item;
      };

    };

    return lowestMatch;
  };

  /*
   * findRandomTime
   *
   * Return a random item in an array
   */
  var _findRandomItem = function(items, random) {
    return items[Math.floor(Math.random() * items.length)];
  };

  return {
    findClosestMatch: _findClosestMatch,
    findRandomItem: _findRandomItem,
  };
});
