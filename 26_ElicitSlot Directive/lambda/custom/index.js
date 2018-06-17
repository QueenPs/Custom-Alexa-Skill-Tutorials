/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = 'Welcome to the Third Demo Skill!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withSimpleCard('Hello World', speechText)
			.getResponse();
	},
};

const HelloWorldIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
	},
	handle(handlerInput) {
		const speechText = 'Hello World!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.withSimpleCard('Hello World', speechText)
			.getResponse();
	},
};

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const speechText = 'You can say hello to me!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.withSimpleCard('Hello World', speechText)
			.getResponse();
	},
};

const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			(handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
				handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
	},
	handle(handlerInput) {
		const speechText = 'Goodbye!';

		return handlerInput.responseBuilder
			.speak(speechText)
			.withSimpleCard('Hello World', speechText)
			.getResponse();
	},
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

		return handlerInput.responseBuilder.getResponse();
	},
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(`Error handled: ${error.message}`);

		return handlerInput.responseBuilder
			.speak('Sorry, I can\'t understand the command. Please say again.')
			.reprompt('Sorry, I can\'t understand the command. Please say again.')
			.getResponse();
	},
};


const IntroWithAgeHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'IntroWithAge';
	},
	handle(handlerInput) {
		const {
			request
		} = handlerInput.requestEnvelope;
		const {
			intent
		} = request;
		if (request.dialogState === 'STARTED') {
			if (intent.slots.Age.value === undefined || intent.slots.Age.value === null)
				intent.slots.Age.value = 24;

			return handlerInput.responseBuilder
				.addDelegateDirective(intent)
				.withShouldEndSession(false)
				.getResponse();
		} else if (request.dialogState !== 'COMPLETED') {
			return handlerInput.responseBuilder
				.addDelegateDirective()
				.withShouldEndSession(false)
				.getResponse();
		} else {
			const name = intent.slots.PersonName.value;
			const age = intent.slots.Age.value;
			const speechText = `Hey ${name}, Your age is ${age}`;

			return handlerInput.responseBuilder
				.speak(speechText)
				.getResponse();
		}
	}
}

const AddUserPreferenceHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AddUserPreference';
	},
	handle(handlerInput){
		const { intent } = handlerInput.requestEnvelope.request;
		const personNameSlot = intent.slots.PersonName;
		const countryNameSlot = intent.slots.CountryName;
		const countSlot = intent.slots.Count;

		if(personNameSlot.value === undefined || personNameSlot.value === null) {
			return handlerInput.responseBuilder
				.speak('Tell me your name')
				.addElicitSlotDirective(personNameSlot.name)
				.getResponse();
		} else if(countryNameSlot.value === undefined || countryNameSlot.value === null) {
			return handlerInput.responseBuilder
				.speak('Which country do you want to visit?')
				.addElicitSlotDirective(countryNameSlot.name)
				.getResponse();
		} else if(countSlot.value === undefined || countSlot.value === null) {
			return handlerInput.responseBuilder
				.speak('With how many friends?')
				.addElicitSlotDirective(countSlot.name)
				.getResponse();
		} else {
			const personName = personNameSlot.value;
			const countryName = countryNameSlot.value;
			const count = countSlot.value;

			const speech = `Your name is ${personName}. You want to visit ${countryName} with ${count} other.`;

			return handlerInput.responseBuilder
				.speak(speech)
				.getResponse();
		}
	}
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
	.addRequestHandlers(
		LaunchRequestHandler,
		HelloWorldIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler,

		IntroWithAgeHandler,
		AddUserPreferenceHandler
	)
	.addErrorHandlers(ErrorHandler)
	.addRequestInterceptors(function (requestEnvelope) {
		console.log("\n" + "******************* REQUEST ENVELOPE **********************");
		console.log("\n" + JSON.stringify(requestEnvelope, null, 4));
	})
	.addResponseInterceptors(function (requestEnvelope, response) {
		console.log("\n" + "******************* RESPONSE  **********************");
		console.log("\n" + JSON.stringify(response, null, 4));
	})
	.lambda();