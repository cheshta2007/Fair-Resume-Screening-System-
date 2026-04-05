const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const sessionClient = new dialogflow.SessionsClient();

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId = uuid.v4() } = req.body;
    const projectId = process.env.DIALOGFLOW_PROJECT_ID;

    if (!projectId) {
      return res.json({ response: "AI Chatbot is in demo mode. (Set DIALOGFLOW_PROJECT_ID in .env)" });
    }

    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ response: result.fulfillmentText });
  } catch (err) {
    console.error('Dialogflow error:', err.message);
    res.json({ response: "I'm having trouble thinking right now. Please try again later." });
  }
};
