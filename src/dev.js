import ReactXScroll from './main';
import './dev.scss';
import $ from 'n-zepto'

  var pageCache ={};
  var page = 1;
  var totalPage = 5;


class App extends React.Component{
  componentDidMount(){
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
  }

  _click(){
    // this._instnace.invoke('scrollTo',0,-100);
  }

  getDataRefresh(args){
    var self = this;
    $.ajax({
        url: "http://xscroll.github.io/demos/data.json",
        dataType:"json",
        success:function(data){
          args._pulldown.reset(function(){
            args._xscroll.render();
          });
        }
    });
  }

  getDataInfinite(args){
    var self = this;
    if (!pageCache[page]) {
      pageCache[page] = 1;
      $.ajax({
        url: "http://xscroll.github.io/demos/data.json",
        dataType: "json",
        success: function(data) {
          window.aa= args;
          if (page > totalPage) {
            //last page
            args._pullup.complete();
            //destroy plugin
            args._xscroll.unplug(args._pullup);
            return;
          };
          args._infinite.append(0, data);
          args._xscroll.render();
          //loading complete
          args._pullup.complete();
          page++;
        }
      })
    }

  }

  render(){
    return (
      <div className="hello-iscroll">
        <header id="header" onClick={this._click.bind(this)}>
          Header
        </header>
        <ReactXScroll ref="xs1"
          cssClass="J_Scroll1"
           xscrollOptions={{
            lockY:true,
            lockX:false,
            scrollbarX:false,
            scrollbarY:false
        }}>
            <div  className="row">Pretty row 1</div>
            <div  className="row">Pretty row 2</div>
            <div  className="row">Pretty row 3</div>
            <div  className="row">Pretty row 4</div>
            <div  className="row">Pretty row 5</div>
            <div  className="row">Pretty row 6</div>
            <div  className="row">Pretty row 7</div>
        </ReactXScroll>

        <ReactXScroll
        ref="xs2"
          cssClass="J_Scroll"
        onRefresh={this.getDataRefresh.bind(this)}
        onInfinite={this.getDataInfinite.bind(this)}
        pulldownOptions={{
          autoRefresh:false
        }}
        pullupOptions={{
            upContent:"pull up to load more ...",
            downContent:"release to load ...",
            loadingContent:"loading ...",
            bufferHeight:0
        }}

        infiniteOptions={{
            infiniteElements:".J_Scroll .row",
            renderHook:function(el,data){
              // el.innerText = data.data.num;
            }
        }}

        xscrollOptions={{
            lockY:false
        }}>
              <ul>
          			<li  className="row">Pretty row 20</li>
          			<li  className="row">Pretty row 21</li>
          			<li  className="row">Pretty row 22</li>
          			<li  className="row">Pretty row 23</li>
          			<li  className="row">Pretty row 24</li>
          			<li  className="row">Pretty row 25</li>
          			<li  className="row">Pretty row 26</li>
          			<li  className="row">Pretty row 27</li>
          			<li  className="row">Pretty row 28</li>
          			<li  className="row">Pretty row 29</li>
          		</ul>
        </ReactXScroll>
        <footer id="footer">Footer</footer>
      </div>
    );
  }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
