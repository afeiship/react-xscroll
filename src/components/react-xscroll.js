import './style.scss';
import './style.plug.pulldown.scss';
import './style.plug.pullup.scss';

import XScroll from 'xscroll/build/cmd/xscroll';
import PullUp from 'xscroll/build/cmd/plugins/pullup';
import Infinite from 'xscroll/build/cmd/plugins/infinite';
import classNames from 'classnames';

import $ from 'n-zepto'


let instanceMap = {};


class ReactXScroll extends React.Component{
  static propTypes = {
    cssClass:React.PropTypes.string,
    delegateHandle:React.PropTypes.string,
    xscrollOptions:React.PropTypes.object,
    pullupOptions:React.PropTypes.object,
    infiniteOptions:React.PropTypes.object,
    onInfinite:React.PropTypes.func,
  };

  static defaultProps = {
    cssClass:'wrapper',
    delegateHandle:'',
    xscrollOptions:{},
    pullupOptions:{},
    infiniteOptions:{},
    onInfinite:null
  };

  static createIscroll(inProps){
    return new XScroll(inProps.xscrollOptions);
  }
  static createPullUpPlugin(inProps){
    return new PullUp(inProps.pullupOptions);
  }
  static createInfinitePlugin(inProps){
    return new Infinite(inProps.infiniteOptions);
  }

  static getInstance(inHandle){
    return instanceMap[inHandle];
  }
  constructor(inProps){
    super(inProps);
    instanceMap[inProps.delegateHandle] = this;
  }

  componentDidMount(){
    var pageCache ={};
    var page = 1;
    var totalPage = 5;

    var xscroll = new XScroll({
        renderTo: "#J_Scroll",
        lockY:false
    });

    var infinite = new Infinite({
        infiniteElements:"#J_Scroll .row",
        renderHook:function(el,data){
          el.innerText = data.data.num;
        }
    })


    var pullup = new PullUp({
        upContent:"pull up to load more ...",
        downContent:"release to load ...",
        loadingContent:"loading ...",
        bufferHeight:0
    });

    var getData = function() {
      if (!pageCache[page]) {
        pageCache[page] = 1;
        $.ajax({
          url: "http://xscroll.github.io/demos/data.json",
          dataType: "json",
          success: function(data) {
            if (page > totalPage) {
              //last page
              pullup.complete();
              //destroy plugin
              xscroll.unplug(pullup);
              return;
            };
            infinite.append(0, data);
            xscroll.render();
            //loading complete
            pullup.complete();
            page++;
          }
        })
      }
    };

    pullup.on('loading',function(){
        getData();
    });

    getData();
    xscroll.plug(infinite);
    xscroll.plug(pullup);
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
