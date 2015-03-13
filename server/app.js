Meteor.startup(function() {
  Meteor.methods({
    checkMolyISBN: function (isbn) {
      //check(isbn, String);
      this.unblock();

      var query = "http://moly.hu/api/book_by_isbn.json?q=" + isbn;
      try {
        var result = HTTP.call("GET", query);
        return result;
      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        return false;
      }
    },
    checkMolyId: function (id) {
      //check(id, Match.Any);
      this.unblock();

      var query = "http://moly.hu/api/book/" + id + ".json";
      try {
        var result = HTTP.call("GET", query);

        return result.content;
      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        return false;
      }
    },
    searchMoly: function (query) {
      //check(query, String);
      this.unblock();

      var searchQuery = "http://moly.hu/api/books.json?q=" + query;

      try {
        var result = HTTP.call("GET", searchQuery);
        return result.content;
      } catch (e) {
        return false;
      }
    }
  });
});