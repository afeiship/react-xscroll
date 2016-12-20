import './style.scss';
import './style.plug.pulldown.scss';
import './style.plug.pullup.scss';

import XScroll from 'xscroll/build/cmd/xscroll';
import XScrollPullUp from 'xscroll/build/cmd/plugins/pullup';
import XScrollPullDown from 'xscroll/build/cmd/plugins/pulldown';
import XScrollInfinite from 'xscroll/build/cmd/plugins/infinite';
import classNames from 'classnames';

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
    delegateHandle:'',
    xscrollOptions:{},
    pulldownOptions:{},
    pullupOptions:{},
    infiniteOptions:{},
    onRefresh:null,
    onInfinite:null
  };

  createIscroll(){
    return new XScroll(this.props.xscrollOptions);
  }

  createPullUpPlugin(){
    var self=this;
    var pullup = new XScrollPullUp(this.props.pullupOptions);
    pullup.on('loading',function(){
      self.props.onInfinite(self);
    });
    this._xscroll.plug(pullup);
    return pullup;
  }

  createPullDownPlugin(){
    var self=this;
    var pulldown = new XScrollPullDown(this.props.pulldownOptions);
    pulldown.on('loading',function(e){
      self.props.onRefresh(self);
    });
    this._xscroll.plug(pulldown);
    return pulldown;
  }

  createInfinitePlugin(){
    var infinite = new XScrollInfinite(this.props.infiniteOptions);
    this._xscroll.plug(infinite);
    return infinite;
  }

  componentDidMount(){
    var self = this;
    var xscroll = this._xscroll = this.createIscroll(this.props);
    this._infinite = this.createInfinitePlugin(xscroll,this.props);
    this._pullup = this.createPullUpPlugin(xscroll,this.props);
    this._pulldown = this.createPullDownPlugin(xscroll,this.props);

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
      <div className={classNames('react-xscroll',this.props.cssClass)}>
        {this.props.children}
      </div>
    );
  }
}


export default ReactXScroll;
