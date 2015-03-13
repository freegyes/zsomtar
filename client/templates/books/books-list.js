Template.booksList.created = function() {
  Session.setDefault('limit', 10);
  Tracker.autorun(function() {
    Meteor.subscribe('books', Session.get('limit'));
  });
}

Template.booksList.rendered = function() {
  // is triggered every time we scroll
  $(window).scroll(function() {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      incrementLimit();
    }
  });
}

Template.booksList.helpers({
  books: function() {     
    var sort = Session.get("sort_by");
    return Books.find({}, {sort: sort, limit: Session.get('limit') });
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

incrementLimit = function() {
  newLimit = Session.get('limit') + 10;
  Session.set('limit', newLimit);
}