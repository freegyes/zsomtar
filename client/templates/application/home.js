Template.home.created = function () {
  Session.set('author', '');
  Session.set('title', '');
  Session.set('id', 0);
  Session.set('cover', '/moly-logo.jpeg');
  Session.set('coverLabel', 'Köszi, Moly!');
  Session.set('link', 'http://moly.hu');
  Session.set('results', []);
};

Template.home.rendered = function() {
  $('.toHide').hide();
}

Template.home.helpers({
  books: function() {
    return Books.find({}, {sort: {submitted: -1}});
  },
  author: function () {
    return Session.get('author');
  },
  title: function () {
    return Session.get('title');
  },
  cover: function () {
    return Session.get('cover');
  },
  coverLabel: function () {
    return Session.get('coverLabel');
  },
  link: function() {
    return Session.get('link');
  },
  email: function() {
    return Meteor.user().emails[0].address;
  }
});

Template.home.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var book = {
      title: $('#title').val(),
      author: $('#author').val(),
      status: $('#status').val(),
      price: $('#price').val(),
      bookId: Session.get('id'),
      cover: Session.get('cover'),
      link: Session.get('link')
    };
        
    Meteor.call('bookInsert', book, function(error, result) {
       if (error) Notifications.error('Valami nem stimmel.', 'Próbáld meg újra betölteni az oldalt.');
    });
  },
  'click .callServer': _.debounce(function (e) {
    e.preventDefault();

    var isbn = $('#isbn').val(); 

    Meteor.call('checkMolyISBN', isbn, function(error, result) {
      if (error) {
        return Notifications.error('Valami nem stimmel.', 'Biztos vagy benne, hogy ez egy létező könyv?');
      } else if (!(result.data)) {
        return Notifications.warn('Valami nem stimmel.', 'Sajnos ez az ISBN szám nincs regisztrálva az adatbázisban.');
      } else {
        var data = $.parseJSON(result.content);

        $('#author').val(data.author);
        $('#title').val(data.title);

        Session.set('author', data.author);
        Session.set('title', data.title);
        if (data.cover) {Session.set('cover', data.cover); Session.set('coverLabel', 'Borító');};
        Session.set('id', data.id);

        Notifications.success(Session.get('author'), Session.get('title'));

        var id = Session.get('id');

        Meteor.call('checkMolyId', id, function(error, result) {
          if (error) return Notifications.error('Valami nem stimmel.', 'Biztos vagy benne, hogy ez egy létező könyv?');

          var linkData = $.parseJSON(result);

          Session.set('link', linkData.book.url);
        });

      }

    });
    
  }, 1100, true),
  'keyup #search': _.debounce(function(e) {
    e.preventDefault();
    $('#isbn').val('');

    var query = $('#search').val();

    if (query.length < 2) {return false}

    $('.toHide').fadeIn();

    var searchResults = $('#searchResults');

    searchResults.empty();

    Meteor.call('searchMoly', query, function (error, result) {
      
      if (error) return Notifications.error('Valami nem stimmel.', 'Biztos vagy benne, hogy ez egy létező könyv?');

      var data = $.parseJSON(result);

      if (data.books.length < 1) return Notifications.warn('Valami nem stimmel.', 'Biztos vagy benne, hogy ez egy létező könyv?'); 
      
      Session.set('results', data.books);
        for (var i = 0; i < data.books.length; i++) {

          var toAppend = "<a id=\"" + [i] + "\" class=\"list-group-item\"><strong>" + data.books[i].title + "</strong> - " + data.books[i].author + "</a>";
          searchResults.append(toAppend);
          
        };
    });
    
  }, 1100),
  'keypress #search': function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      return false;
    };
  },
  'keypress #isbn': function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      return false;
    };
  },
  'click .list-group-item': function() {
    var id = event.target.id;
    var selected = Session.get('results');
    var queryId = selected[id].id;

    Meteor.call('checkMolyId', queryId, function(error, result) {
      if (error) return Notifications.error('Valami nem stimmel.', 'Biztos vagy benne, hogy ez egy létező könyv?');

      var data = $.parseJSON(result);

      Session.set('link', data.book.url);
      
      var authors = [];
      for (var i = 0; i < data.book.authors.length; i++) {
        authors.push(data.book.authors[i].name);
      };

      authors = authors.join(", ");

      $('#author').val(authors);
      $('#title').val(data.book.title);

      Session.set('author', authors);
      Session.set('title', data.book.title);
      if (data.book.cover) {Session.set('cover', data.book.cover); Session.set('coverLabel', 'Borító');};
      Session.set('id', data.book.id);

      Notifications.success(Session.get('author'), Session.get('title'));

      $('#searchResults').empty();
      $('.toHide').hide();
      $('#search').val('');
    });

  }
});