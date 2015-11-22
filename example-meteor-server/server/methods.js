Meteor.methods({
    createNewUser:function(user){
        try{
            id = Accounts.createUser(user);
            if(id)return id;
            else throw new Meteor.Error(415,'Email already exist');
        }catch(e){
            throw e;
        }

    },
    createPost:function(post){
         if(this.userId){
             return Post.insert(post);
         }else{
             throw new Meteor.Error(403,'Access Denied');
         }

    }
});
