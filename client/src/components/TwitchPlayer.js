import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { updateActive } from '../actions/actions';
import { convertToTime }  from '../lib/tools';
import MomentList from './MomentList';

const PlayerW = styled.div`
	display: flex;
	justify-content: center;
	background-color: rgba(100, 65, 164, 1);
	width: 100vw;
	position: relative;
	margin-left: -50vw;
	margin-right: -50vw;
	height: 432px;
	margin-bottom: 20px;
	background-image: url("https://www.transparenttextures.com/patterns/shattered.png");
`;

const ActiveEmoteHighlight = styled.div`
	display: flex;
	flex-basis: 0;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	background: rgba(100, 65, 164, 1);
	opacity: 0.4;
	${props => props.imgID && `
		background-image : url(https://static-cdn.jtvnw.net/emoticons/v1/${props.imgID}/3.0);
		background-size: cover;
		background-repeat: no-repeat;
		background-blend-mode: luminosity;
	`}
	${props => props.flipped && `
		transform: scaleX(-1);
	`}
`;

class TwitchPlayer extends Component {
  constructor(props){
    super(props);
    this.player = null;

    this.state = {
      id: null
    }
  }

  componentWillMount() {
		this.setId();
	}

	componentDidMount() {
		this.setPlayer();
		this.updateTime();
	}
 
	componentDidUpdate() {
		this.updateTime();
	}

	componentWillReceiveProps(nextProps) {
		this.setId();
		this.setPlayer();
		this.updateTime();
	}

  setId() {
		if (!this.state.id) {
			this.setState({
				id: `twitch-${this.props.videoID}`
			});
		}
	}


	setPlayer() {
    if (!this.player) {
			const options = {};
      options.width = 768;
      options.height = 432;
			options.channel = "";
			options.collection="";
			options.video = "v" + this.props.videoID;
			this.player = new window.Twitch.Player(this.state.id, options);
		}

		const that = this;
		this.player.addEventListener(window.Twitch.Player.PLAY, () => {
			this.updateTime();
		});
	}

  updateTime() {
		const time = this.props.library.find(emote => emote.name === this.props.activeEmote).moments[this.props.activeMoment];
    this.player.seek(time);
  }

  render() {
		const tempImageSolution = this.props.library.find(emote => emote.name === this.props.activeEmote).imgID;
		return (
			
      <PlayerW>
				<ActiveEmoteHighlight imgID={tempImageSolution}/>
				<div id={this.state.id || ''} className="twitch-video-embed"></div>

				<MomentList
					moments={this.props.library.find(emote => emote.name === this.props.activeEmote).moments} 
					activeMoment={this.props.activeMoment}
				/>
				<ActiveEmoteHighlight imgID={tempImageSolution} flipped/>
      </PlayerW>
		);
	}
}

const mapState = ({ loadedData }, ownProps) => ({
	query : ownProps.query ? ownProps.query : undefined,
	videoID : loadedData.videoID,
	library : loadedData.library,
	activeEmote : loadedData.activeEmote,
	activeMoment : loadedData.activeMoment
});

export default connect(mapState)(TwitchPlayer);