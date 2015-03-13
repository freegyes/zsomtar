Meteor.publish('books', function(limit) {
  if (limit > Books.find({userId: this.userId}).count()) {
    limit = 0;
  }

  return Books.find({userId: this.userId}, { limit: limit });
});