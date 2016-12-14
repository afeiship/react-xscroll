import './style.scss';
import './style.plug.pulldown.scss';
import './style.plug.pullup.scss';

import XScroll from 'xscroll/build/cmd/xscroll';
import XScrollPullUp from 'xscroll/build/cmd/plugins/pullup';
import XScrollPullDown from 'xscroll/build/cmd/plugins/pulldown';
import XScrollInfinite from 'xscroll/build/cmd/plugins/infinite';
import classNames from 'classnames';

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

  static createIscroll(inProps){
    return new XScroll(inProps.xscrollOptions);
  }

  static createPullUpPlugin(inScrollInstance,inProps){
    var pullup = new XScrollPullUp(inProps.pullupOptions);
    pullup.on('loading',function(){
      inProps.onInfinite(self);
    });
    inScrollInstance.plug(pullup);
    return pullup;
  }

  static createPullDownPlugin(inScrollInstance,inProps){
    var pulldown = new XScrollPullDown(inProps.pulldownOptions);
    inScrollInstance.plug(pulldown);
    pulldown.on('loading',function(e){
      inProps.onRefresh(self);
    });
    return pulldown;
  }

  static createInfinitePlugin(inScrollInstance,inProps){
    var infinite = new XScrollInfinite(inProps.infiniteOptions);
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
    var xscroll = this._xscroll = ReactXScroll.createIscroll(this.props);
    this._infinite = ReactXScroll.createInfinitePlugin(xscroll,this.props);
    this._pullup = ReactXScroll.createPullUpPlugin(xscroll,this.props);
    this._pulldown = ReactXScroll.createPullDownPlugin(xscroll,this.props);

    //initial once:?
    this.props.onInfinite && this.props.onInfinite(this);
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
