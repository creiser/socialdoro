import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';

/*
 facebook_user:Object
 accessToken:"EAACPEvxZBkLwBAIPfUGmk7wMGtwILQ8vnL8GKvIo7PGvPPOZAUqZC3CZAWZBnNcMzUNexgXFZBxlRGoj7nZA5VR6enBnJFlERlBS3pm3JZAvplhJqxfUQKGSKKyAbxvoZAbZAkFjqGZB81DBZCZAWdRDZC85HJbWcRRYKIW87KpWCEZAqh5HJH3u0NlxZCGd8fRhkrLpvLaosupX8E3uCAZDZD"
 email:"vaisanen.toni@gmail.com"
 expiresIn:5408
 id:"554821988198620"
 name:"Toni Väisänen"
 picture:Object
 data:Object
 height:50
 is_silhouette:false
 url:"http:/scontent.xx.fbcdn.net/v/t1.0-1/p50x50/21150430_514904002190419_8399249937621680234_n.jpg?oh=a2d0dec75e59df5010ba9fe652f14253&oe=5AAD34A7"
 width:50
 signedRequest:"WEJoapdo7LSvBypSOz4RW8auIwEn4m6UzwE6F_oIqUU.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUURyTlRvZktNQjVzWi1SLUhDa1psbGRvVzVEZmRiYlhuU0NzVDdmaEl0RWRURmxzQ1dCa0JKcU8wVnpEZmJ5RUVmY0M5UEh2WWkwbm1KQUNhTll2dXF3RTBsSTlpLWJkaDItWFIwV2VLZ0M0NkNFOWJzTDc0Y0cwZV9oaWlUWllObWlpWE1FVV9zeVdGbjZ4VVAtWXliZ2RiMDFqLWliVUl5dU5jZjNmSk92ZHRBbkhLa3g0dTQ3cDdYc0w1V3hNTU9DMko2NmVmclVXUExVWmt3VGg3ek5XNTBibjFXUXJDVXE3dVMydEdZRWRDaUtGaG9NRElqOHE3am5KZm5kUTJ3b29HTlFkUlZ6a2JCT09LMTdfeUhuT1RQWVA1V0cwY3lOQ2tyd2htWWlYWmx4MG9tNnJLakQ0akVtQjFkM0ZhNUxWSFhwRzg3WXhBd2t0emVha19EaSIsImlzc3VlZF9hdCI6MTUxMTAxNTM5MiwidXNlcl9pZCI6IjU1NDgyMTk4ODE5ODYyMCJ9"
 userID:"554821988198620"
 __proto__:Object
 */

const componentClicked = () => {
    // console.info("Clicked");
}

export const getUserFriendlists = (userId, setFriends) => {

    console.info('getUserFriendlist()');
    const query = "/me/friends";
    window.FB.getLoginStatus(function (response) {
        console.log(response);
        if (response.status === 'connected') {
            const accessToken = response.authResponse.accessToken;
        }
    });


    window.FB.api(query, {fields: 'id,name,picture'}, (response) => {

        console.info("inside FB.api call");

        if (response && !response.error) {
            console.info(response);
            // document.getElementById('debug').innerHTML = JSON.stringify(response);
            setFriends(response);
            return response;

        }
    });

};


export default class FBLoginComponent extends Component {
    constructor(props) {
        super(props);
        this.setLoggedUser = props.setLoggedUser;
    }


    render() {
        return (
            <div>
                <FacebookLogin
                    appId="157311708336316"
                    autoLoad={true}
                    fields="name,email,picture"
                    scope="email,user_friends"
                    onClick={componentClicked}
                    callback={this.setLoggedUser}/>
            </div>)
    }

}