import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, TileLayer } from 'react-leaflet';

class MapComponent extends Component {
  constructor(props) {
    super(props);

    const { lat, lng } = this.props;
    this.state = {
      latlng: { lat, lng },
      center: {
        lat: lat || 0, // if we do not have coordinates, then setting center as 0
        lng: lng || 0 // if we do not have coordinates, then setting center as 0
      },
      zoom: lat !== null && lng !== null ? 13 : 3 // bigger zoom if we have coordinates
    };

    this.mapRef = React.createRef();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { lat, lng } = nextProps;
    if (lat !== this.props.lat || lng !== this.props.lng) {
      this.setState({
        latlng: { lat: parseFloat(lat), lng: parseFloat(lng) },
        center: { lat: parseFloat(lat), lng: parseFloat(lng) }
      });
    }
  }

  handleClick = e => {
    const map = this.mapRef.current;
    this.setState({
      latlng: e.latlng,
      center: e.latlng,
      zoom: map.leafletElement.getZoom()
    });

    this.props.getCoordinates(e.latlng.lat, e.latlng.lng);
  };

  render() {
    const { lat, lng } = this.state.latlng;
    const marker = lat !== null && lng !== null ? <Marker position={this.state.latlng}/> : null;

    return (
      <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
        <Map
          center={this.state.center}
          zoom={this.state.zoom}
          onClick={this.handleClick}
          ref={this.mapRef}
          doubleClickZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {marker}
        </Map>
      </div>
    );
  }
}

MapComponent.propTypes = {
  lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  getCoordinates: PropTypes.func.isRequired
};

export default MapComponent;