import HttpRequest from '@/libs/axios'
import config from '@/config'
//const baseUrl = config.baseUrl.dev; 
const baseUrl = "";

const axios = new HttpRequest(baseUrl);
export default axios;