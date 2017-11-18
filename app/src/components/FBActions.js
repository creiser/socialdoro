/**
 * Created by tvaisanen on 11/18/17.
 */

import React from 'react';
import {Button} from 'react-bootstrap';

/*global FB*/

const APIKEY = 157311708336316;

// This is called with the results from from FB.getLoginStatus().
export const statusChangeCallback = (response) => {
    console.info('statusChangeCallback()');
    console.info(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else {
        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log into this app.';
    }
};


// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.

export const checkLoginState = () => {
    console.info("checkLoginState()");
    console.info(FB);
    FB.getLoginStatus(function (response) {
        console.info("FB.getLoginStatus()");
        statusChangeCallback(response);
    });
    login();
};

export const initFB = () => {


    window.fbAsyncInit = function () {
        FB.init({
            appId: APIKEY,
            cookie: true,  // enable cookies to allow the server to access
            // the session
            xfbml: true,  // parse social plugins on this page
            version: 'v2.5' // use version 2.1
        });
    };
    console.log("Loading fb api");
// Load the SDK asynchronously
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    testAPI();

};

export const testAPI = () => {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/100010124706490', function (response) {
        console.log('Successful login for: ' + response.name);
        console.info('Thanks for logging in, ' + response.name);
    });
};

export const login = () => {
    FB.login(function (response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
                console.log('Good to see you, ' + response.name + '.');
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    });
}

