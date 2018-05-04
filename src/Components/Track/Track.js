import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }


  renderAction(isRemoval) {
    /*
      Displays a + or - as an anchor tag depending on the value passed to this
      method. The isRemoval boolean is set in the Tracklist Component.
    */

    if (this.props.isRemoval) {
      return (
        <a
          onClick={this.removeTrack}
          className="Track-action">-</a>
      );
    } else {
      return (
        <a
          onClick={this.addTrack}
          className="Track-action">+</a>
      );
    }
  }

  addTrack() {
    /*
       Takes track from the SearchResults Component and adds them to the
       Playlist Component
     */
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    // Removes track from the Playlist
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.title}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
