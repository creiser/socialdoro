import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const APP_KEY = 157311708336316;

/*global FB*/

  window.fbAsyncInit = function() {
    FB.init({
      appId            : APP_KEY,
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.11'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  const FB = window.FB;

  console.log(window.FB);


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
