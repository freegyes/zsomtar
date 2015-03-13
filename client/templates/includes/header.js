Meteor.startup(function(){
  Session.set("sort_by", {submission: -1});
});

Template.header.events({
  'click .btnRawCSV' : function(e) {
    e.preventDefault();
    var rawData = Books.find({}, {fields: {author: 1, title: 1}}).fetch();
    csv = json2csv( rawData, true, true );
    var blob = new Blob([csv], {type: "text/plain;charset=utf-8;",});

    saveAs(blob, "leltar.csv");
  } 
})