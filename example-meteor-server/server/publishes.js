Meteor.publish("postList", function(){

    if(this.userId){
        return Post.find();
    }else{
        return [];
    }

});
