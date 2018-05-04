import React, { Component } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: ''
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // adds tracks to the playlist
  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let currentPlaylist = this.state.playlistTracks; // set the playlist object to a variable that can be manipulated
      currentPlaylist.push(track); // add the selected track to the array variable
      this.setState({playlistTracks: currentPlaylist}); // set the new array to the playlistTracks state
    }
  }

  // removes tracks from the playlist
  removeTrack(track) {
    let filteredTracks = this.state.playlistTracks.filter(playlistSong => playlistSong.id !== track.id);
    // filteredTracks variable iterates through the current playlist and filters out the track passed in the method call

    this.setState({playlistTracks: filteredTracks}); // set the playlistTracks array in constructor to filteredTracks variable
  }

  // Updates playlistName state with variable passed to method
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  // Saves playlist to Spotify account
  savePlaylist() {
    // variable that maps all of the track uris currently in playlistTracks array
    const playlistTracks = this.state.playlistTracks.map(track => track.uri);
    const playlistName = this.state.playlistName; // variable for state of playlistName

    Spotify.savePlaylist(playlistName, playlistTracks); // External method in Spotify.js

    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });

    console.log(this.state.playlistName);
  }

  search(term) {
    /*
      Method that calls Spotify's search method with passed variable,
      which THEN sets the states of searchResults with the returned tracks
    */
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks});
    });
  }

  render() {

    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>


        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
            onAdd={this.addTrack} />

            <Playlist playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
