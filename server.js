var path = require('path');
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var User = require('./models/user');
var Chat = require('./models/chat');

var port     = process.env.PORT || 8080; 
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());



router.use(function(req, res, next) {
	console.log('Something is happening.');
	next();
});
router.get('/', function(req, res) {
	res.json({ message: 'Edu RestFul API' });	
});
router.route('/users')
	.post(function(req, res) {
		var user = new User();	
		user.name = req.body.name;  
		user.save(function(err) {
			if (err)
				res.send(err);
			res.json({ message: 'user '+ user.name  +' created!' });
		});
	})

	.get(function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);
			res.json(users);
	  });
  });

router.route('/users/:user_name')
	.get(function(req, res) {
    User.findByName(req.params.user_name, function(err, user) {
      if (err) 
        res.send(err);
      res.json(user);
    });
	})
	.delete(function(req, res) {
    User.remove({name: req.params.user_name}, function(err, bear) {
      if (err)
        res.send(err);
      res.json({ message: 'delete '+ req.params.user_name + ' successfully'});
    });
  });


router.route('/users/:user_name/friends')
  .get(function(req, res) {
    user = new User({name: req.params.user_name});
    user.getFriends(function(err, friends){
      res.json(friends); 
    });
  })
 .post(function(req, res) {
    user = new User({name: req.params.user_name});
    friends  = req.body.friends;
    for (var i=0;i<friends.length;i++) {
      console.log(friends[i]);
      user.addFriend(friends[i], function(err) {
			  if (err)
				  console.log(err);
	   });
    }
    
    res.json({ message: 'friends '+ req.params.user_name + ' create successfully'});
  });

router.route('/chats/:from/:to')
  .get(function(req, res) {
    user = new User({name: req.params.to});
    user.getChatsFrom(req.params.from, function(err, chats){
      res.json(chats); 
    });
  })
  .post(function(req, res) {
    user = new User({name: req.params.from});
    chats = req.body.chats;
    for (var i=0;i<chats.length;i++) {
      console.log(chats[i]);
      user.addChatsTo(req.params.to, chats[i], function(err) {
			  if (err)
				  console.log(err);
	   });
    }
    
    res.json({ message: 'chats from '+ req.params.from + ' to '+ req.params.to +' create successfully'});
  });
/*
router.route('/chats/:from/:to/last')  // from=me, to=friend
  .get(function(req, res) {
    var last = 0;
    var returnChat = {"friend": req.params.to, "time": 0};
    user = new User({name: req.params.to});
    user.getLastChatFrom(req.params.from, function(err, chats){
      // res.json(chats); 
      if (chats && chats[0]) {
        d = new Date(chats[0].time);
        if(d.getTime()>last){
          returnChat = {"message": chats[0].message, "from": chats[0].from, "to": chats[0].to, "friend":req.params.to, "time":d.getTime()};
          if (last>0)
            res.json(returnChat);
          last = d.getTime();
        }
      } else {
        if (last>0)
           res.json(returnChat);
        last = 1;
      }
      
    });
    user = new User({name: req.params.from});
    user.getLastChatFrom(req.params.to, function(err, chats){
      // res.json(chats); 
      if (chats && chats[0]) {
        d = new Date(chats[0].time);
        if(d.getTime()>last){
          returnChat = {"message": chats[0].message, "from": chats[0].from, "to": chats[0].to, "friend":req.params.to, "time":d.getTime()};
          if (last>0)
            res.json(returnChat);
          last = d.getTime();
        }
      } else {
        if (last>0)
           res.json(returnChat);
        last = 1;
      }
    });
    // async
  });
*/

router.route('/chats/:from/:to/last')  // from=me, to=friend
  .get(function(req, res) {
    Chat.getLastMsg(req.params.from, req.params.to, function(err, chats) {
      if (chats && chats[0]) {
        console.log(chats[0]);
        d = new Date(chats[0].time);
        returnChat = {"message": chats[0].message, "from": chats[0].from, "to": chats[0].to, "friend":req.params.to, "time":d.getTime()};
        res.json(returnChat);
      }
    });
  });
  

app.use('/api', router);
app.use(express.static(path.join(__dirname, 'profile')));

app.listen(port);
console.log('magic happens on port ' + port);
