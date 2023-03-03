import { Configuration, OpenAIApi } from 'openai';
import { ChatGPTAPI } from 'chatgpt';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();

// const configuration = new Configuration({
//   organization: 'org-kDex0pXZ70aayJCiXwzcCMmH',
//   apiKey: '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',
// });
// const openai = new OpenAIApi(configuration);

const chatgpt = new ChatGPTAPI({
  apiKey: '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',
  debug: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3001;

//for openai
// app.post('/', async (req, res) => {
//   const { message } = req.body;
//   console.log(`app.post ${message}`);
//   const response = await openai.createCompletion({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: `${message}` }],
//     max_tokens: 100,
//     n:1,
//     stop: "",
//     temperature: 0.5,
//   });
//   console.log('**response: ' + response.data.choices[0].message.content);
//   res.json({
//     data: response.data.choices[0].message.content,
//   });
// });

// for chatgpt
app.post('/', async (req, res) => {
  const { message } = req.body;
  //   console.log(`app.post ${message}`);
  const response = await chatgpt.sendMessage(`${message}`);
  //   console.log('@@response: ' + response.text);
  res.json({
    data: response.text,
  });
});

app.listen(port, () => {
  console.log(`ChatGPT API is listening at http://localhost:${port}`);
});
