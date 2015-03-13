Meteor.publish('books', function() {
  return Books.find({userId: this.userId});
});