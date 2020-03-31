import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pop from './Pop';
class VideoPop extends Component {
state = {
    show: false,
    top: null,
    currTime: null,
    popPlaying: false,
    play: this.props.autoplay,
    mute: this.props.mute,
    Vid: React.createRef()
};

static defaultProps = {
    Src: null,
    root: null,
    Poster: null,
    mute: false,
    autoplay:true
};

componentDidMount() {
    const node = this.state.Vid.current;
    this.setEventListeners();
    this.state.mute ? (node.muted = true) : (node.muted = false);
    this.state.play ? (node.play()):(node.pause()); 
    this.setState({
        top: ~~(window.scrollY + node.top)
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
        get: function() {
            return !!(
                this.currentTime > 0 &&
                !this.paused &&
                !this.ended &&
                this.readyState > 2
            );
        }
    });
}

setEventListeners = () => {
    window.addEventListener('scroll', this.handleScroll);
};

handleScroll = () => {
    const node = this.state.Vid.current;
    const property = node.getBoundingClientRect();
    const height = (property.height * 80) / 100;
    if (document.querySelector('video').playing) {
        if (window.scrollY >= height + this.state.top) {
            // node.pause();
            this.setState(
                {
                    show: true,
                    currTime: node.currentTime,
                    popPlaying: true,
                    play:document.querySelector('video').playing,
                    mute: node.muted
                },
                () => {
                    node.pause();
                }
            );
        }
    }

    if (this.state.popPlaying) {
        if (window.scrollY <= height + this.state.top) {
            this.setState(
                {
                    show: false,
                    popPlaying: false
                },
                () => {
                    let el2 = document.getElementById('pop');
                    node.currentTime = el2.currentTime;
                    node.play();
                }
            );
        }
    }
};

handleChange = time => {
    const node = this.state.Vid.current;
    this.setState(
        {
            currTime: time
        },
        () => {
            node.currentTime = this.state.currTime;
            node.play();
        }
    );
};

muteVids = () => {
    const node = this.state.Vid.current;
    const val = !this.state.mute;
    this.setState(
        {
            mute: val
        },
        () => {
            node.muted = this.state.mute;
        }
    );
};

playVids = () => {
    const node = this.state.Vid.current;
    const val = !this.state.play;
    this.setState(
        {
            play: val,
            popPlaying: val
        },
        () => {
            if (!this.state.popPlaying) {
                this.state.play ? node.play() : node.pause();
            }
        }
    );
};

closeVids = time => {
    const node = this.state.Vid.current;
    node.currentTime = time;
    this.setState({
        show: false,
        popPlaying: false
    });
};

render() {
    const { Src, root, Poster, ratio, style, className, zIndex } = this.props;
    const { Vid, show, currTime, mute, play } = this.state;
    return (
        <React.Fragment>
            <video
                ref={Vid}
                style={style}
                id="video-pop"
                className={className}
                controls
                controlsList="nodownload noremoteplayback"
                src={Src}
                poster={Poster}
            />
            <Pop
                src={Src}
                root={root}
                Show={show}
                currtime={currTime}
                change={this.handleChange}
                closeVid={this.closeVids}
                muteVid={this.muteVids}
                playVid={this.playVids}
                mute={mute}
                play={play}
                ratio={ratio}
                zIndex={zIndex}
            />
        </React.Fragment>
    );
}
}

export default VideoPop;

VideoPop.propTypes = {
    Src: PropTypes.string,
    root: PropTypes.string,
    Poster: PropTypes.string,
    mute: PropTypes.bool,
    autoplay:PropTypes.bool,
    ratio:PropTypes.object,
    style:PropTypes.object,
    className:PropTypes.string,
    zIndex:PropTypes.string,
};
