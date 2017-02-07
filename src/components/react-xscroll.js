import './style.scss';
import './style.plug.pulldown.scss';
import './style.plug.pullup.scss';

import XScroll from 'xscroll/build/cmd/xscroll';
import XScrollPullUp from 'xscroll/build/cmd/plugins/pullup';
import XScrollPullDown from 'xscroll/build/cmd/plugins/pulldown';
import XScrollInfinite from 'xscroll/build/cmd/plugins/infinite';
import classNames from 'classnames';

let uid = 0;

class ReactXScroll extends React.Component{
  static propTypes = {
    cssClass:React.PropTypes.string,
    xscrollOptions:React.PropTypes.object,
    pulldownOptions:React.PropTypes.object,
    pullupOptions:React.PropTypes.object,
    infiniteOptions:React.PropTypes.object,
    onRefresh:React.PropTypes.func,
    onInfinite:React.PropTypes.func,
  };

  static defaultProps = {
    xscrollOptions:{},
    pulldownOptions:null,
    pullupOptions:null,
    infiniteOptions:null,
    onRefresh:null,
    onInfinite:null,
  };

  constructor(props){
  	super(props);
    this._renderId= 'rn-xscroll-'+uid++;
    this.state = {
      cssClass:props.cssClass
    }
  }

  createIscroll(){
    let options = Object.assign({
      renderTo:`#${this._renderId}`
    },this.props.xscrollOptions);
    return new XScroll(options);
  }

  createPullUpPlugin(){
    if(this.props.pullupOptions){
      var self=this;
      var pullup = new XScrollPullUp(this.props.pullupOptions);
      pullup.on('loading',function(){
        self.props.onInfinite(self);
      });
      this._xscroll.plug(pullup);
      return pullup;
    }
  }

  createPullDownPlugin(){
    if(this.props.pulldownOptions){
      var self=this;
      var pulldown = new XScrollPullDown(this.props.pulldownOptions);
      pulldown.on('loading',function(e){
        self.props.onRefresh(self);
      });
      this._xscroll.plug(pulldown);
      return pulldown;
    }
  }

  createInfinitePlugin(){
    if(this.props.infiniteOptions){
      var infinite = new XScrollInfinite(this.props.infiniteOptions);
      this._xscroll.plug(infinite);
      return infinite;
    }
  }

  componentDidMount(){
    var self = this;
    var xscroll = this._xscroll = this.createIscroll();
    xscroll.render();
  }

  attachPlugins(){
    this._infinite = this.createInfinitePlugin();
    this._pullup = this.createPullUpPlugin();
    this._pulldown = this.createPullDownPlugin();
    //initial once:?
    this.props.onInfinite && this.props.onInfinite(this);
  }

  invoke(inName){
    var args = [].slice.call(arguments, 1);
    return this._xscroll[inName].apply(this._xscroll, args);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render(){
    return (
      <div id={this._renderId}
        className={classNames('react-xscroll',this.state.cssClass)}>
        <div className="xs-container">
          <div className="xs-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}


export default ReactXScroll;
