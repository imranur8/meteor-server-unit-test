describe("Meteor server status", function(){
    var exec = require('child_process').exec;
    beforeAll(function(done){

        if( process.env.AUTO_START_METEOR === undefined ){
            // check if there any process busy with port 3000 and kill it
            // start meteor example server before start test
            exec('(kill -9 $(lsof -n -i4TCP:3000 | grep LISTEN | awk "{print $2}");cd example-meteor-server;meteor;)',function (error, stdout, stderr) {});
        }
        done();

    });


    it("it should alive on port 3000" , function(done){

        // set env start_meteor=0 if want to run the meteor server separatly
        if( process.env.AUTO_START_METEOR === undefined ){
            timeOut = 1000 * 60 * 2;
        }else{
            timeOut = 1000;
        }

        setTimeout(function(){
            exec('lsof -n -i4TCP:3000 | grep LISTEN',function (error, stdout, stderr) {
                expect(stdout).toBeDefined();
                done();
            });
        },  timeOut);

    }, 1000 * 60 * 5 );
});


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

describe('createPost', function(){
    afterEach(function(){
        ddpClient.collections = [];
        ddpClient.close();
    });

    var post = {
        title : 'This is a test post title',
        content : 'This is test post content'
    };

    it('Should create a post by authorized user', function(done){

        ddpClient.connect(function(err, wasReconnect){
            ddpLogin.loginWithEmail(ddpClient, newUser.email, newUser.password, function (err, userInfo) {
                if(err) throw err;
                ddpClient.call('createPost', [post], function(err, data){
                    if(err) throw err;
                    expect(data).toBeDefined();
                    done();
                });
            });
        });

    });
    it('Should not create a post by unauthorized user', function(done){
        ddpClient.connect(function(err, wasReconnect){
            if(err) throw err;
            ddpClient.call('createPost', [post], function(err, data){
                expect(err).toBeDefined();
                done();
            });

        });

    });
});


describe('postList', function(){

    afterEach(function(){
        ddpClient.collections = [];
        ddpClient.close();
    });

    it('Should subscribe postList by authorized user', function(done){
        ddpClient.connect(function(err, wasReconnect){
            if(err) throw err;
            ddpLogin.loginWithEmail(ddpClient, newUser.email, newUser.password, function (err, userInfo) {
                if(err) throw err;
                ddpClient.subscribe('postList', [], function(err, data){
                    if(err) throw err;
                    expect(ddpClient.collections.posts).toBeDefined();
                    done();
                });
            });
        });
    });

    it('Should not subscribe postList by authorized user', function(done){
        ddpClient.connect(function(err, wasReconnect){
            if(err) throw err;
            ddpClient.subscribe('postList', [], function(err, data){
                if(err) throw err;
                expect(ddpClient.collections.posts).toBeUndefined();
                done();
            });
        });
    });
});
