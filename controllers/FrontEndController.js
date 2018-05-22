const { SessionController, UserController, SpeakerController } = require('./database');

const { EventController } = require('./');
const { Event } = require('../models');

let admins = {};
let adminId = 0;

self = module.exports = {
    async index (req, res) {

        res.render('index', {title: 'Dashboard!'})
    },

    async sessions (req, res) {
        SessionController.list().then((sessions) =>
        {
            res.render('sessions', {sessions: sessions})
        });
    },

    async sessionDetails(req, res) {
        SessionController.getById(req.params.id).then(async (result) => {
            Event.filterAll('sessionpresent', {
                sessionId: req.params.id,
            }).then(async (array_of_ids) => {
                let array_of_users = [];

                for(let i= 0; i < array_of_ids.length; i++)
                {
                    let user = await UserController.getById(array_of_ids[i].dataValues.properties.userId);
                    array_of_users.push(user);
                }

                res.render('sessionDetails', {session: result, users: array_of_users })
            })
        })
    },

    async users (req, res) {
        UserController.list().then((users) =>
        {
            res.render('users', {users: users})
        });
    },

    async user(req, res) {
        let userId = req.params.id;
        Event.filterAll('sessionpresent', {
            userId: userId,
        }).then(async (result) => {

            let array_of_sessions = [];

            for(let i= 0; i < result.length; i++)
            {
                let session = await SessionController.getById(result[i].dataValues.properties.sessionId);
                array_of_sessions.push(session);
            }

            res.render('user', {userId: userId, userName: req.params.username, sessions: array_of_sessions})
        })

    },

    async speakers (req, res) {
        SpeakerController.list().then((speakers) =>
        {
            res.render('speakers', {speakers: speakers})
        });
    },

    speaker(req, res) {

        SpeakerController.getById(req.params.id).then((speaker) =>
        {
            if(speaker[0] != null)
            {
                res.render('speaker', {speaker: speaker[0]});
            }
        });

    },

    async attachAdmin(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',  // <- Important headers
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write('\n');
        (function(adminId) {
            admins[adminId] = res;  // <- Add this admin to those we consider "attached"
            req.on("close", function(){delete admins[adminId]});  // <- Remove this admin when he disconnects
        })(++adminId)
    },

    async sendEvent()
    {
        let session = {
            name: "jaquim",
            description: "Dsadsada",
            startTime: '2018-05-21 09:00:00',
            duration: '03:30:00',
            VenueId: 2
        };

        for (adminId in admins) {
            admins[adminId].write( "data: " + JSON.stringify(session) + "\n\n"); // <- Push a message to a single attached admin
        }
    },

    async teste(req, res)
    {
        self.sendEvent();
        res.sendStatus(200);
    }
};