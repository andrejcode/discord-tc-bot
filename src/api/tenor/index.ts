import axios from 'axios';

const API_KEY = process.env.TENOR_API;
const URL = `https://tenor.googleapis.com/v2/search?q=excited&key=${API_KEY}&limit=1&random=true`;

export default async function fetchGif(): Promise<string | undefined> {
  if (API_KEY) {
    try {
      const reponse = await axios.get(URL);
      return reponse.data.results[0].media_formats.gif.url;
    } catch (e) {
      throw new Error('Unable to fetch gif.');
    }
  } else {
    throw Error('Unable to get Tenor API key.');
  }
}
