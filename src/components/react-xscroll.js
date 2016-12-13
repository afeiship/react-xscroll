import './style.scss';
import './style.plug.pulldown.scss';
import './style.plug.pullup.scss';

import XScroll from 'xscroll/build/cmd/xscroll';
import PullUp from 'xscroll/build/cmd/plugins/pullup';
import PullDown from 'xscroll/build/cmd/plugins/pulldown';
import Infinite from 'xscroll/build/cmd/plugins/infinite';
import classNames from 'classnames';

import $ from 'n-zepto'


let instanceMap = {};

class ReactXScroll extends React.Component{
  static propTypes = {
    cssClass:React.PropTypes.string,
    delegateHandle:React.PropTypes.string,
    xscrollOptions:React.PropTypes.object,
    pulldownOptions:React.PropTypes.object,
    pullupOptions:React.PropTypes.object,
    infiniteOptions:React.PropTypes.object,
    onRefresh:React.PropTypes.func,
    onInfinite:React.PropTypes.func,
  };

  static defaultProps = {
    cssClass:'wrapper',
    delegateHandle:'',
    xscrollOptions:{},
    pulldownOptions:{},
    pullupOptions:{},
    infiniteOptions:{},
    onRefresh:null,
    onInfinite:null
  };

  static createIscroll(inOptions){
    return new XScroll(inOptions);
  }
  static createPullUpPlugin(inScrollInstance,inOptions){
    var pullup = new PullUp(inOptions);
    inScrollInstance.plug(pullup);
    return pullup;
  }
  static createPullDownPlugin(inScrollInstance,inOptions){
    var pulldown = new PullDown(inOptions);
    inScrollInstance.plug(pulldown);
    return pulldown;
  }
  static createInfinitePlugin(inScrollInstance,inOptions){
    var infinite = new Infinite(inOptions);
    inScrollInstance.plug(infinite);
    return infinite;
  }

  static getInstance(inHandle){
    return instanceMap[inHandle];
  }
  constructor(inProps){
    super(inProps);
    instanceMap[inProps.delegateHandle] = this;
  }

  componentDidMount(){
    var self = this;
    var xscroll = this._xscroll = ReactXScroll.createIscroll(this.props.xscrollOptions);
    var infinite = this._infinite = ReactXScroll.createInfinitePlugin(this._xscroll,this.props.infiniteOptions);
    var pullup = this._pullup = ReactXScroll.createPullUpPlugin(this._xscroll,this.props.pullupOptions);
    var pulldown = this._pulldown = ReactXScroll.createPullDownPlugin(this._xscroll,this.props.pulldownOptions);

    pullup.on('loading',function(){
      self.props.onInfinite(self);
    });

    pulldown.on('loading',function(e){
      self.props.onRefresh(self);
    })

    this.props.onInfinite(this);
    xscroll.render();
  }

  invoke(inName){
    var args = [].slice.call(arguments, 1);
    return this._xscroll[inName].apply(this._xscroll, args);
  }

  render(){
    return (
      <div data-delegate-handle={this.props.delegateHandle} className={classNames('react-xscroll-wrapper',this.props.cssClass)}>
        {this.props.children}
      </div>
    );
  }
}


export default ReactXScroll;
