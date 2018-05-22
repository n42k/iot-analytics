const {
  Event,
  EventType,
  EventPropertyType,
  Session,
  Venue,
  User,
  Speaker,
  SpeakerSession,
} = require('./models');
const speakerController = require('./controllers/SpeakerController')
const parser = require('./utils/parser')

module.exports = async () => {
    // Create Event types
    let beaconEventType = await EventType.create({
        name: 'beacon'
    })

    await EventPropertyType.create({
      name: 'time',
      EventTypeId: beaconEventType.id
    })

    await EventPropertyType.create({
      name: 'sessionId',
      EventTypeId: beaconEventType.id
    })

    await EventPropertyType.create({
      name: 'roomId',
      EventTypeId: beaconEventType.id
    })

    await EventPropertyType.create({
      name: 'userId',
      EventTypeId: beaconEventType.id
    })

    let sessionPresentEventType = await EventType.create({
      name: 'sessionpresent'
    })

    await EventPropertyType.create({
      name: 'sessionId',
      EventTypeId: sessionPresentEventType.id
    })

    await EventPropertyType.create({
      name: 'userId',
      EventTypeId: sessionPresentEventType.id
    })

    // Create default users
    let manel = await User.create({
      username: "manel",
      password: "$2a$08$w4GJv4FOMATk2Ngzi41y9Ola6C6RfBESYHbqb8uEpU0WCjiry1Y2e", // voar2
      firstName: "Manuel",
      lastName: "Oliveira",
      company: "Jorge e os Lindos",
      data: "{\"friends\": [1, 2]}"
    });

    let speakerInformation = parser.parseInformation('speakersv2.csv')
    let sessionInformation = parser.parseInformation('events.csv')

    for(let i = 0; i < speakerInformation.length; i++) {
        await Speaker.create({
            name: speakerInformation[i][0],
            email: speakerInformation[i][1],
            username: speakerInformation[i][8],
            password: speakerInformation[i][2],
            company: speakerInformation[i][3],
            location: speakerInformation[i][4],
            description: speakerInformation[i][5],
            website: speakerInformation[i][6],
            photo: speakerInformation[i][7]
        })
    }

    for(let i = 0; i < sessionInformation.length; i++) {
        try {
            await Venue.create({
                name: sessionInformation[i][8]
            })
        } catch (err) {
        }

        let session = await Session.create({
            name: sessionInformation[i][1],
            startTime: sessionInformation[i][2],
            endTime: sessionInformation[i][3],
            description: sessionInformation[i][6],
            capacity: sessionInformation[i][5] || 0,
            type: sessionInformation[i][4],
            venueName: sessionInformation[i][8]
        })

        let speakers = sessionInformation[i][7].split(';');
        for (let j = 0; j < speakers.length; j++) {
            let speakerName = (j === 0) ? speakers[j] : speakers[j].substring(1);
            let speaker = await speakerController.findByName(speakerName);

            if(speaker !== null) {
                await SpeakerSession.create({
                    sessionId: session.id,
                    speakerId: speaker.id,
                })
            }
        }
    }

    await Event.createFromJSON(sessionPresentEventType.id, {
      sessionId: 1,
      userId: manel.id
    })

    await Event.createFromJSON(sessionPresentEventType.id, {
        sessionId: 2,
        userId: manel.id
    })

    await Event.createFromJSON(beaconEventType.id, {
        roomId: 'B002',
        userId: manel.id,
        sessionId: null,
        time: (new Date('5/24/2018 12:22')).getTime()
    })

    await Event.createFromJSON(beaconEventType.id, {
        roomId: 'B002',
        userId: manel.id,
        sessionId: null,
        time: (new Date('5/24/2018 12:22')).getTime()
    })
};
