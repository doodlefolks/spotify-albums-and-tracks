// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items'
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(artist, displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
      console.log(spotifyQueryRequest);
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');
  appendToMe.html('');
  var artistID = event.data.id;
  var artistAlbumsRequest = $.ajax({
    url: 'https://api.spotify.com/v1/artists/' + artistID + '/albums',
    dataType: 'json',
    type: 'GET'
  });

  artistAlbumsRequest.done(function (albums) {
    console.log(albums);
    for (var i = 0; i < albums.items.length; i++) {
      var albumID = albums.items[i].id;
      var albumLi = $('<li id="' + albumID + '">' + albums.items[i].name + '</li>');
      appendToMe.append(albumLi);
      var albumRequest = $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumID,
        dataType: 'json',
        type: 'GET'
      });

      albumRequest.done(function (album) {
        console.log(album);
        var songList = $('<ol class="song-list"></ol>')
        for (var i = 0; i < album.tracks.items.length; i++) {
          var songListItem = $('<li>' + album.tracks.items[i].name + '</li>');
          songList.append(songListItem);
        }
        var albumNode = $('#' + album.id);
        albumNode.append(songList);
      });
    }
  });

}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
