import React, { Component } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// Components
import Help from './Help';
// Helpers
import { isValidLatitude, isValidLongitude } from '../util/helpers';

const styles = {
  mapContainer: {
    width: '100%',
    height: '400px',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '24px',
    '.ant-modal &': {
      marginBottom: 0
    },
    '& .leaflet-container': {
      width: 'inherit',
      height: 'inherit'
    }
  },
  help: {
    position: 'absolute',
    zIndex: '1111',
    display: 'inline-block',
    top: '0',
    right: '0',
    fontSize: '20px',
    background: '#fff'
  }
};

class MapComponent extends Component {
  constructor(props) {
    super(props);

    const { lat, lng } = this.props;
    this.state = {
      latlng: { lat, lng },
      center: {
        lat: Number.isFinite(lat) ? lat : 0, // if we do not have coordinates, then setting center as 0
        lng: Number.isFinite(lng) ? lng : 0 // if we do not have coordinates, then setting center as 0
      },
      zoom: isValidLatitude(lat) && isValidLongitude(lng) ? 10 : 3 // bigger zoom if we have coordinates
    };

    this.mapRef = React.createRef();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { lat, lng } = nextProps;
    if (lat !== this.props.lat || lng !== this.props.lng) {
      this.setState(state => {
       return {
         latlng: { lat: parseFloat(lat), lng: parseFloat(lng) },
         center: {
           lat: isValidLatitude(lat) ? parseFloat(lat) : 0,
           lng: isValidLongitude(lng) ? parseFloat(lng) : 0
         },
         zoom: !isValidLatitude(lat) || !isValidLongitude(lng) ? 3 : state.zoom
       }
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
    const { helpText, classes } = this.props;
    const { lat, lng } = this.state.latlng;
    const marker = isValidLatitude(lat) && isValidLongitude(lng) ? <Marker position={this.state.latlng}/> : null;

    return (
      <div className={classes.mapContainer}>
        {helpText && (
          <div className={classes.help}>
            <Help title={helpText} />
          </div>
        )}
        <Map
          center={this.state.center}
          zoom={this.state.zoom}
          onClick={this.handleClick}
          ref={this.mapRef}
          doubleClickZoom={false}
          maxBounds={ [{lat: 90, lng: 180}, {lat: -90, lng: -180}] }
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
  getCoordinates: PropTypes.func.isRequired,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default injectSheet(styles)(MapComponent);