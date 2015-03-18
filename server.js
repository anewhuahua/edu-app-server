var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var User = require('./models/user');
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

app.use('/api', router);
app.listen(port);
console.log('magic happens on port ' + port);
