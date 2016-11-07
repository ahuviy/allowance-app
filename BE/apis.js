var express = require('express');
var router = express.Router();
var taskModel = require('./taskModel');
//-----------------------------------------------------------------------------
/**
 * GET all tasks from a specific user
 */
router.get('/uid/:uid/tasks', function (req, res) {
	taskModel.find({userId: req.params.uid}).then(
		function (tasks) {
			res.send(tasks);
		},
		function (err) {
			res.status(400).send({err: err, msg: 'get tasks error'});
		}
	);
});
//-----------------------------------------------------------------------------
/**
 * Add a new task by a specific user
 */
router.post('/uid/:uid/tasks/add', function (req, res) {
	var newTask = new taskModel({
		userId: req.params.uid,
		text: req.body.text,
		createDate: new Date().getTime()
	});
	
	newTask.save().then(
		function () {
			res.send();
		},
		function (err) {
			res.status(400).send({err: err, msg: 'add task error'});
		}
	);
});
//-----------------------------------------------------------------------------
/**
 * Remove a task by a specific user
 */
router.post('/uid/:uid/tasks/delete', function (req, res) {
	taskModel.find(req.body).remove().then(
		function () {
			res.send();
		},
		function (err) {
			res.status(400).send({err: err, msg: 'delete task err'});
		}
	);
});
//-----------------------------------------------------------------------------
module.exports = router;