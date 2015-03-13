Template.bookItem.events({
  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Biztos-biztos?")) {
      var currentReferenceId = this._id;
      Books.remove(currentReferenceId);
      Notifications.warn('Kapitány, ó Kapitányom!', 'Törölve, ahogy kérted.');
    }
  }
});