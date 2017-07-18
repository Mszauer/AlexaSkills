var overwatchFacts = [
    'Before changing her name to Pharah, Blizzard took a more direct approach and flat out named her Rocket Queen.',
    'Blizzard chose to use the sound of a beer bottle opening, in reverse, to create the headshot sound.',
    'Since Chris Metzen, the voice of Bastion, isn’t half robot, his voice was run through various voice modulations and software plugins.',
    'Overwatch is translated into 12 languages with over 84,000 voice lines',
    'Overwatch even has easter eggs hidden in certain maps and even in how some of the characters react to each other (dialogue).',
    'In the map Hanamura, there is an arcade that has references to Starcraft and Heroes Of The Storm.',
    'Overwatch‘s open beta completely shattered records. In just seven days, over 9.7 million players joined.',
    'Overwatch Emerged From The Ashes Of “Titan”',
    'When Overwatch was revealed at Blizzcon 2014, it was Blizzards first new IP in 17 years.',
    'The robotic beings in Overwatch are known as Omnics, which were created inside of factories known as Omniums. ',
    'In Overwatchs cinematic trailer, Reaper used a grenade launcher against Winston. This has been cut from the base game.',
    'Bastions tiny yellow bird friend is named Ganymede, who was a beautiful young boy from Greek mythology.',
    'One of Hanzos lines that you can unlock sees him say, "I choose you, Spirit Dragon." ',
];
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
    
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if(intentName == "OverwatchFactsIntent"){
        handleFactResponse(intent,session,callback);
    }else if(intentName == "AMAZON.YesIntent"){
        handleYesResponse(intent,session,callback);
    }else if (intentName == "AMAZON.NoIntent"){
        handleNoResponse(intent,session,callback);
    }else if (intentName == "AMAZON.HelpIntent"){
        handleGetHelpRequest(intent,session,callback);
    }else if (intentName == "AMAZON.StopIntent"){
        handleFinishSessionRequest(intent,session,callback);
    }else if (intentName == "AMAZON.CancelIntent"){
        handleFinishSessionRequest(intent,session,callback);
    }else {
        throw "Invalid Intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome to Overwatch Facts! I can tell you random overwatch facts. Would you like to hear a random fact?";
    var reprompt = "Do you want to hear an overwatch facts";
    var header = "Overwatch Facts";
    var shouldEndSession = false;
    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    };

    callback(sessionAttributes,buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession));
}

function handleFactResponse(intent,session,callback){
    var random = getRandomInt(0,overwatchFacts.length);
    var speechOutput = overwatchFacts[random];
    speechOutput += " Would you like another fact?"
    var header = "Overwatch Fact " + random;
    var repromptText = "Would you like another fact?";
    var shouldEndSession = false;
    callback(session.attributes,buildSpeechletResponse(header,speechOutput,repromptText,shouldEndSession));
}

function handleYesResponse(intent,session,callback){
    // var speechOutput = "Great! Here is another fact. ";
    // var random = getRandomInt(0,overwatchFacts.length);
    // speechOutput += overwatchFacts[random];
    // var repromptText = "Would you like another fact?";
    // var shouldEndSession = false;
    // callback(session.attributes,buildSpeechletResponseWithoutCard(speechOutput,repromptText,shouldEndSession));
    handleFactResponse(intent,session,callback);
}

function handleNoResponse(intent,session,callback){
    handleFinishSessionRequest(intent.attributes,session,callback);
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }

    var speechOutput = "I can tell you random facts about the game overwatch. Would you like to hear a fact?";
    var repromptText = speechOutput;
    var shouldEndSession = false;
    callback(session.attributes,buildSpeechletResponseWithoutCard(speechOutput,repromptText,shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}


// ------- Helper functions to build responses for Alexa -------
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}