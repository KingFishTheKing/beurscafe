(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{24:function(t,e,a){t.exports=a(36)},33:function(t,e,a){},34:function(t,e,a){},36:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),s=a(21),c=a.n(s),i=a(2),o=a(3),l=a(6),u=a(4),m=a(5),p=a(12),d=a(10),h=function(t){function e(){return Object(i.a)(this,e),Object(l.a)(this,Object(u.a)(e).apply(this,arguments))}return Object(m.a)(e,t),Object(o.a)(e,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("nav",{className:"navbar navbar-expand bg-light sticky-top mb-2 navbar-light"},r.a.createElement("ul",{className:"navbar-nav mr-auto"},r.a.createElement("li",{className:"nav-item"},r.a.createElement(p.b,{to:"/register",className:"nav-link"},"Register")),r.a.createElement("li",{className:"nav-item"},r.a.createElement(p.b,{to:"/settings",className:"nav-link"},"Settings")),r.a.createElement("li",{className:"nav-item"},r.a.createElement(p.b,{to:"/products",className:"nav-link"},"Products")))))}}]),e}(r.a.Component),b=a(11),f=(a(33),{maxWidth:"100px",maxHeight:"100px",width:"auto",height:"auto",objectFit:"contain"}),g=function(t){function e(){return Object(i.a)(this,e),Object(l.a)(this,Object(u.a)(e).apply(this,arguments))}return Object(m.a)(e,t),Object(o.a)(e,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("img",{alt:"",src:this.props.source,style:f}))}}]),e}(r.a.Component),v=function(t){function e(t){var a;return Object(i.a)(this,e),(a=Object(l.a)(this,Object(u.a)(e).call(this,t))).state={amount:a.props.amount,currentPrice:a.props.currentPrice,hasUpdated:!0},a.plusOne=a.plusOne.bind(Object(b.a)(a)),a.minusOne=a.minusOne.bind(Object(b.a)(a)),a.setInput=a.props.setInput,a}return Object(m.a)(e,t),Object(o.a)(e,[{key:"componentWillMount",value:function(){document.title="Register"}},{key:"minusOne",value:function(){0!==this.state.amount&&this.setState({amount:this.state.amount-1,hasUpdated:!1})}},{key:"plusOne",value:function(){this.setState({amount:this.state.amount+1,hasUpdated:!1})}},{key:"componentDidUpdate",value:function(){this.state.hasUpdated||(this.setInput(this.props.productId,this.state.amount),this.setState({hasUpdated:!0}))}},{key:"componentWillReceiveProps",value:function(t){this.setState({amount:t.amount,currentPrice:t.currentPrice})}},{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"col-auto col-sm-6 col-md-4 col-lg-3 mb-2"},r.a.createElement("div",{className:"bg-light rounded p-3"},r.a.createElement("div",{className:"row mb-4 d-flex justify-content-between p-3"},r.a.createElement("b",null,this.props.name),"\u20ac ",this.props.currentPrice),r.a.createElement("div",{className:"row mb-4"},r.a.createElement("div",{className:"col-12 d-flex justify-content-center"},this.props.display?r.a.createElement(g,{className:"col-12",source:"".concat("","/image/").concat(this.props.display)}):null)),r.a.createElement("div",{className:"row mb-2"},r.a.createElement("div",{className:"col-6"},r.a.createElement("p",{className:"buttons minus rounded",onClick:this.minusOne},"-")),r.a.createElement("div",{className:"col-6"},r.a.createElement("p",{className:"buttons plus rounded",onClick:this.plusOne},"+"))))))}}]),e}(r.a.Component),j=function(t){function e(t){var a;return Object(i.a)(this,e),(a=Object(l.a)(this,Object(u.a)(e).call(this,t))).state={total:t.total,products:t.products},a}return Object(m.a)(e,t),Object(o.a)(e,[{key:"componentWillReceiveProps",value:function(t){this.setState({total:t.total,products:t.products})}},{key:"render",value:function(){var t=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"col-12 col-lg-2 row ml-auto mr-auto mb-2 align-items-start"},r.a.createElement("ul",{style:{width:"100%"},className:"list-group list-group-flush col-12"},Object.entries(this.state.total).map(function(e){return r.a.createElement("li",{key:e[0],className:"list-group-item d-flex justify-content-between align-items-start"},t.state.products[e[0]].name," ",r.a.createElement("small",{className:"text-muted ml-2"},"(\u20ac",t.state.products[e[0]].currentPrice,")"),r.a.createElement("span",{className:"badge badge-primary badge-pill ml-auto"},e[1]))})),r.a.createElement("p",{className:"mt-3 col-12 h3 d-flex justify-content-around text-primary"},r.a.createElement("span",null,"Total \u20ac",Math.round(100*Object.entries(this.state.total).map(function(e){return t.state.products[e[0]].currentPrice*[e[1]]}).reduce(function(t,e){return t+e},0))/100)),r.a.createElement("div",{className:"col-12 d-flex justify-content-around"},r.a.createElement("button",{className:"btn btn-danger",onClick:this.props.reset},"Reset"),r.a.createElement("button",{className:"btn btn-primary btn-lg",onClick:this.props.done},"Done"))))}}]),e}(r.a.Component),E=function(t){function e(t){var a;return Object(i.a)(this,e),(a=Object(l.a)(this,Object(u.a)(e).call(this,t))).state={total:Array(Object.entries(a.props.products).length).fill(0)},a.done=a.done.bind(Object(b.a)(a)),a.reset=a.reset.bind(Object(b.a)(a)),a}return Object(m.a)(e,t),Object(o.a)(e,[{key:"setInput",value:function(t,e){this.setState(function(a){return{total:a.total.map(function(a,n){return n===Number(t)?e:a})}})}},{key:"reset",value:function(){this.setState({total:Array(Object.entries(this.props.products).length).fill(0)})}},{key:"done",value:function(){}},{key:"componentWillMount",value:function(){}},{key:"render",value:function(){var t=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"row"},r.a.createElement(j,{products:this.props.products,total:this.state.total,reset:this.reset,done:this.done}),r.a.createElement("div",{className:"row productList mr-auto col-12 col-lg-10"},Object.entries(this.props.products).map(function(e,a){return r.a.createElement(v,Object.assign({key:a,productId:e[0]},e[1],{amount:t.state.total[e[0]]||0,id:t.props.id,setInput:t.setInput.bind(t)}))}))))}}]),e}(r.a.Component),O=function(t){function e(t){var a;return Object(i.a)(this,e),(a=Object(l.a)(this,Object(u.a)(e).call(this,t))).state=t,a}return Object(m.a)(e,t),Object(o.a)(e,[{key:"render",value:function(){return r.a.createElement("h1",null,"Settings")}}]),e}(r.a.Component),y=function(t){function e(t){var a;return Object(i.a)(this,e),(a=Object(l.a)(this,Object(u.a)(e).call(this,t))).state=t,a}return Object(m.a)(e,t),Object(o.a)(e,[{key:"render",value:function(){return r.a.createElement("h1",null,"Products")}}]),e}(r.a.Component),k=(a(34),{display:"flex",justifyContent:"center",alignItems:"center",height:window.innerHeight+"px",width:"100%",position:"absolute",top:0,left:0}),N={height:"100px",width:"100px",border:"16px #f5b042 solid",borderTop:"16px rgba(0,0,0,0) solid",borderRadius:"50%",animationName:"rotation",animationDuration:"2s",animationIterationCount:"infinite",animationTimingFunction:"linear"},w={display:"flex",flexDirection:"column",alignItems:"center"},x=function(t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:k},r.a.createElement("div",{style:w},r.a.createElement("div",{style:N}),r.a.createElement("div",{className:"mt-2"},t.waitingFor))))},S=function(t){function e(t){var a;return Object(i.a)(this,e),(a=Object(l.a)(this,Object(u.a)(e).call(this,t))).state={settings:{},products:{},loading:""},a.URL=null,a}return Object(m.a)(e,t),Object(o.a)(e,[{key:"componentWillMount",value:function(){document.body.classList.add("container-fluid"),document.title="Beurscafe"}},{key:"componentDidMount",value:function(){var t=this;this.URL=new URL(window.location.href),this.setState({loading:"Loading Settings"}),fetch("http://localhost:3000/api/settings").then(function(t){return t.json()}).then(function(e){return t.setState({settings:e,loading:"Loading Products"}),fetch("http://localhost:3000/api/products")}).then(function(t){return t.json()}).then(function(e){return t.setState({products:e,loading:!1})});new WebSocket("ws://localhost:3000/input"),new WebSocket("ws://localhost:3000/viewer")}},{key:"render",value:function(){var t=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement(p.a,null,r.a.createElement(h,null),this.state.loading?r.a.createElement(x,{waitingFor:this.state.loading}):r.a.createElement(r.a.Fragment,null,r.a.createElement(d.a,{from:"/",to:"/register"}),r.a.createElement(d.b,{path:"/register",render:function(){return r.a.createElement(E,{id:t.state.settings.id,products:t.state.products})}}),r.a.createElement(d.b,{path:"/settings",component:O}),r.a.createElement(d.b,{path:"/products",component:y}))))}}]),e}(r.a.Component);a(35);c.a.render(r.a.createElement(S,null),document.getElementById("root"))}},[[24,1,2]]]);
//# sourceMappingURL=main.18ff7561.chunk.js.map