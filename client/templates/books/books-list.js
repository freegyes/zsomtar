Template.booksList.helpers({
  books: function() {     
    var sort = Session.get("sort_by");
    return Books.find({}, {sort: sort});
  }
});

Template.booksList.events({
  'click .sort-by-alphabet-title': function () {
    Session.set('sort_by', {title: 1});
  },
  'click .sort-by-alphabet-author': function () {
    Session.set('sort_by', {author: 1});
  },
  'click .sort-by-submission': function () {
    Session.set('sort_by', {submitted: -1});
  }
})