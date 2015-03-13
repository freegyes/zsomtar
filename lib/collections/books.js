Books = new Mongo.Collection('books');

Books.allow({
  update: function() { return true; },
  remove: function() { return true; }
});

Meteor.methods({
  bookInsert: function(bookAttributes) {
   // check(title, Match.Any);
   // check(author, Match.Any);
   // check(status, Match.Any);
   // check(price, Match.Any);
   // check(bookId, Match.Any);
   // check(cover, Match.Any);
   // check(link, Match.Any);

    var user = Meteor.user();
    var book = _.extend(bookAttributes, {
      userId: user._id,
      submitted: new Date()
    });

    var bookId = Books.insert(book);

    return {
      _id: bookId
    };
  }
});