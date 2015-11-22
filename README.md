# Meteor server unit test

This is an example scaffold for Meteor server unit testing with Nodejs, Jasmine and Meteor DDP client. We'll test Meteor server methods and publishes.  npm packages list use in this example

- [grunt-jasmine-nodejs](https://github.com/onury/grunt-jasmine-nodejs)
- [node-ddp-client](https://github.com/oortcloud/node-ddp-client)
- [ddp-login](https://github.com/vsivsi/ddp-login)


### Approach

In this scaffold, I use external Nodejs server to test Meteor app with jasmine and Meteor DDP client. It's a simple concept, Meteor client need to connect with DDP protocol, we are testing all Meteor server unit test by this DDP protocol.

### Why this approach
We tried to test our server methods and publishes with [Velocity](http://velocity.readme.io) but server unit test is not ready yet and even there is no way to authenticate a user in the server for testing purpose. Meteor need a client to authenticate in the server. So we also tried with client unit test in velocity, to test server methods and publishes but it's not stable and the way is very complex, you need to maintain lots of sequence of setTimeout. Right now testing is  fast and fun with this approach

### Installation


```sh
$ npm install
$ grunt test
```
If want to manually start meteor server set AUTO_START_METEOR=0
```sh
$ AUTO_START_METEOR=0 grunt test
```

### Sample Meteor server
In this sample server, we have 2 methods "createUser" and "createPost" and a "postList" publish, we write down tests for these.


### Example

Create ddpClient and ddpLogin object for connect and login to Meteor server
```js

DDPClient = require("ddp");
ddpLogin = require('ddp-login');

ddpClient = new DDPClient({
    // All properties optional, defaults shown
    host : "localhost",
    port : 3000,
    ssl  : false,
    autoReconnect : true,
    autoReconnectTimer : 1000 * 60 * 5,
    maintainCollections : true,
    ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
    // uses the SockJs protocol to create the connection
    // this still uses websockets, but allows to get the benefits
    // from projects like meteorhacks:cluster
    // (for load balancing and service discovery)
    // do not use `path` option when you are using useSockJs
    useSockJs: true,
    // Use a full url instead of a set of `host`, `port` and `ssl`
    // do not set `useSockJs` option if `url` is used
    url: 'wss://localhost/websocket'
});

```
Test "createUser" methods

```js
var userId;

var randomEmail = new Date().getTime() + '@gmail.com';
var newUser = {
    email: randomEmail,
    password: 'qweqwe',
    profile: {
        name: "Jhon doe"
    }
};


describe('createNewUser', function(){

    afterEach(function(){
        // clear all collections after each test, otherwise it'll keep cache
        ddpClient.collections = [];
        ddpClient.close();
    });

    it('Should create a new user with email/name/password ', function(done){
        ddpClient.connect(function(err, wasConnect){
            if(err) throw err;
            ddpClient.call('createNewUser', [newUser], function(err, data){
                if(err) throw err;
                expect(data).toBeDefined();
                userId = data;
                done();
            });
        });
    });

    it('Should not create a new user without email and password ', function(done){
        ddpClient.connect(function(err, wasConnect){
            if(err) throw err;
            ddpClient.call('createNewUser', [{}], function(err, data){
                expect(err).toBeDefined();
                done();
            });
        });

    });

    it('Should not create a new user with existing email', function(done){
        ddpClient.connect(function(err, wasConnect){
            if(err) throw err;
            ddpClient.call('createNewUser', [newUser], function(err, data){
                expect(err).toBeDefined();
                done();
            });
        });

    });
});
```

License
----

MIT
