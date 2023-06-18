// axiosConfig.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.openai.com/v1/engines/davinci-codex/completions',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer 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`
  }
});

export default instance;
