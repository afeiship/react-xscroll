import {ReactXScroll,ReactXScrollCtrl} from './main';
import './dev.scss';
import $ from 'n-zepto'

  var pageCache ={};
  var page = 1;
  var totalPage = 5;


class App extends React.Component{
  componentDidMount(){
    this._instance=ReactXScrollCtrl.getInstance('test');
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
  }

  _click(){
    // this._instnace.invoke('scrollTo',0,-100);
  }

  getDataRefresh(args){
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
    if (!pageCache[page]) {
      pageCache[page] = 1;
      $.ajax({
        url: "http://xscroll.github.io/demos/data.json",
        dataType: "json",
        success: function(data) {
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
        <ReactXScroll
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
            infiniteElements:"#J_Scroll .row",
            renderHook:function(el,data){
              el.innerText = data.data.num;
            }
        }}

        xscrollOptions={{
            renderTo: "#J_Scroll",
            lockY:false
        }}>
          <div id="J_Scroll">
            <div className="xs-container">
              <ul className="xs-content">
          			<li  className="row">Pretty row 1</li>
          			<li  className="row">Pretty row 2</li>
          			<li  className="row">Pretty row 3</li>
          			<li  className="row">Pretty row 4</li>
          			<li  className="row">Pretty row 5</li>
          			<li  className="row">Pretty row 6</li>
          			<li  className="row">Pretty row 7</li>
          			<li  className="row">Pretty row 8</li>
          			<li  className="row">Pretty row 9</li>
          			<li  className="row">Pretty row 10</li>
          			<li  className="row">Pretty row 11</li>
          			<li  className="row">Pretty row 12</li>
          			<li  className="row">Pretty row 13</li>
          			<li  className="row">Pretty row 14</li>
          			<li  className="row">Pretty row 15</li>
          			<li  className="row">Pretty row 16</li>
          			<li  className="row">Pretty row 17</li>
          			<li  className="row">Pretty row 18</li>
          			<li  className="row">Pretty row 19</li>
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
          			<li  className="row">Pretty row 30</li>
          			<li  className="row">Pretty row 31</li>
          			<li  className="row">Pretty row 32</li>
          			<li  className="row">Pretty row 33</li>
          			<li  className="row">Pretty row 34</li>
          			<li  className="row">Pretty row 35</li>
          			<li  className="row">Pretty row 36</li>
          			<li  className="row">Pretty row 37</li>
          			<li  className="row">Pretty row 38</li>
          			<li  className="row">Pretty row 39</li>
          			<li  className="row">Pretty row 40</li>
          			<li  className="row">Pretty row 41</li>
          			<li  className="row">Pretty row 42</li>
          			<li  className="row">Pretty row 43</li>
          			<li  className="row">Pretty row 44</li>
          			<li  className="row">Pretty row 45</li>
          			<li  className="row">Pretty row 46</li>
          			<li  className="row">Pretty row 47</li>
          			<li  className="row">Pretty row 48</li>
          			<li  className="row">Pretty row 49</li>
          			<li  className="row">Pretty row 50</li>
          		</ul>
            </div>
          </div>
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
