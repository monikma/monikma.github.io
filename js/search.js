(function() {

  function getItemBody(item){
    var itemBody = '<a href="' + item.url + '" style="text-decoration:none;"><h3>' + item.title + '</h3></a>';
    itemBody += '<h5><span class="glyphicon glyphicon-time"></span> '+
        'Post by ' + item.author + ', ' + item.date + '. ';
    for (var t = 0; t< item.tags.length; t++){
         itemBody += '<a href="/search.html?fields=tags&query=' + item.tags[t] +
            (item.tags[t].includes(searchTerm)?'" class="label label-primary">':'" class="label label-default">') + item.tags[t] + '</a> ';
    }
    itemBody += '</h5>' + item.content.substring(0, 150) + '...<hr/>';
    return itemBody;
  }

  function displaySearchResults(results, store) {

    //hide the spinner
    document.getElementById('search-spinner').style.display="none";

    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        appendString += '<li>' + getItemBody(item) + '</li>';
      }
      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  function htmlDecode(value){
    return $('<div/>').html(value).text();
  }

  var searchTerm = getQueryVariable('query');
  var searchFields = getQueryVariable('fields');

  if (searchTerm) {

    if (!searchFields){
        document.getElementById('search-box').setAttribute("value", searchTerm);
    }

    searchFields = searchFields ? searchFields : "title,author,tags,content";
    searchFields = searchFields.split(",");

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
        for (var f=0; f<searchFields.length; f++){
             this.field(searchFields[f]);
             //this.field('title', { boost: 10 });
        }
    });

    for (var key in window.store) { // Add the data to lunr

      var data = {'id': key};
      for (var f=0; f<searchFields.length; f++){
         data[searchFields[f]]=window.store[key][searchFields[f]];
      }
      idx.add(data);

      var results = idx.search(searchTerm); // Get lunr to perform a search
      displaySearchResults(results, window.store); // We'll write this in the next section
    }
  }
})();
