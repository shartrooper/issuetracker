/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
//var MongoClient = require('mongodb');
//var ObjectId = require('mongodb').ObjectID;
const Issue = require('../model/issues');
const IssueHandler = require('../controllers/issueHandler');

module.exports = function (app) {

    app.route('/api/issues/:project')

    .get(async function (req, res) {
        var project = req.params.project;
        const issuesToFilter= req.query;
        
        try{
            const fetchIssues= await Issue.find(req.query);
            
            return res.json(fetchIssues);
            
        }catch(err){
            console.error(err)
        }
    })

    .post(async function (req, res) {
        var project = req.params.project;
        const {
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text
        } = req.body;

        if (!issue_title || !issue_text || !created_by) {
            return res.json({
                failure: "Missing required issue input"
            });
        }

        const issueHandler = new IssueHandler();

        try {
            const newIssue = new Issue({
                issue_title: issueHandler.getTitle(issue_title),
                issue_text: issueHandler.getContent(issue_text),
                created_by: issueHandler.getAuthor(created_by),
                updated_on: new Date(),
                created_on: new Date(),
                assigned_to: issueHandler.getAssigned(assigned_to),
                status_text: issueHandler.getStatusText(status_text),
            });

            const savedIssue = await newIssue.save();

            savedIssue.created_on = issueHandler.dateFormat(savedIssue.created_on);
            savedIssue.updated_on = issueHandler.dateFormat(savedIssue.updated_on);

            res.json(savedIssue.toJSON());
        } catch (err) {
            console.error(err);
        }

    })

    .put(async function (req, res) {
        var project = req.params.project;
        const {
            _id
        } = req.body;

        if (!_id)
            return res.send("no ID sent");

        const issueHandler = new IssueHandler();

        let toUpdateValues = issueHandler.elemsToUpdate(req.body);

        if (typeof toUpdateValues === 'string')
            return res.send(toUpdateValues);

        try {
            await Issue.findByIdAndUpdate({
                _id
            }, toUpdateValues);

            res.send('update successful');
        } catch (err) {
            console.error(err);
            return res.send(`could not update ${_id}`)
        }
    })

    .delete(async function (req, res) {
        var project = req.params.project;
        const {
            _id
        } = req.body;
        const regex = /^[0-9a-fA-F]{24}$/
        if (!_id) {
            return res.send('_id error');
        }
        else if(!regex.test(_id)){
            return res.send('Invalid id');
        }
        try {
            await Issue.findByIdAndDelete(_id);
            return res.send('deleted '+_id);
        } catch (err) {
            console.error(err);
            return res.send(`couldn't delete ${_id}`)
        }
    })

};
