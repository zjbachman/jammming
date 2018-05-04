let accessToken; // user token that is retrieved upon logging in and giving the app access
const client_ID = 'c369c14f144148de98e584256af6d98f'; // the app's client id
const redirect_URI =  'http://localhost:3000/'; //'http://zjbachman.surge.sh';
let expiresIn; // expiration time for the application's access

const Spotify = {
  getAccessToken() {
    // if the token isn't set, redirect to the Spotify authorization page

    const url = window.location.href; // URL in the browser's address bar
    const token = url.match(/access_token=([^&]*)/); // detects token in the URL
    const expiration = url.match(/expires_in=([^&]*)/); // detects expiration in URL

    if(accessToken) {
      return accessToken; // return access token if it it already set
    } else if (token && expiration) {

      /*
        If the token and an expiration time are found in the URL, set the
        browser to timeout after the set time. Then return the access token.
      */
      accessToken = token[1];
      expiresIn = expiration[1]
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    } else {
        // redirects user to the Spotify account page to gain authorization
        window.location = `https://accounts.spotify.com/authorize?client_id=${client_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_URI}`;
    }
  },

  search(term) {
    this.getAccessToken(); // uses access token to determine if account is eligible for using

    /*
        - Fetch a list of tracks from Spotify with the passed search term
          - access token headers are needed for authorization
        - Pass page reponse that will return it in json format if the response is okay
        - Pass the okay response to an anonymous function that maps the jsonResponse to track data
    */
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error('Request Failed');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        })
      );
      } else {
        return [];
      }
    });
  },

  savePlaylist(playlistName, trackUri) {
    let userId;
    let playlist_id;

    this.getAccessToken();

    /*
      This section follows the Implicit Grant Flow in the API documentation
    */

    if(playlistName && trackUri) {
      return fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error('Request Failed');
    }, networkError => console.log(networkError.message)).then(jsonResponse => {
        return userId = jsonResponse.id;
    }).then(() => {
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: {Authorization: `Bearer ${accessToken}`},
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(response => {
        if(response.ok) {
          return response.json();
        }

        throw new Error('Request Failed');
      }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      return playlist_id = jsonResponse.id;
    });
  }).then(() => {
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlist_id}/tracks`, {
      headers: {Authorization: `Bearer ${accessToken}`},
      method: 'POST',
      body: JSON.stringify({uris: trackUri})
    }).then(response => {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Request Failed');
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {

  });
});
} else {
  return;
}
}
}

export default Spotify;
