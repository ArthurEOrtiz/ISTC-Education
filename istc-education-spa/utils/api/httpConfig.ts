import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
    //ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'istceducation.pfx')),
    rejectUnauthorized: false // This is not recommended for production, but this will accept self-signed certificates.
}); 

const headers = {
    'Content-Type': 'application/json'
};

const baseURL = 'https://localhost:7180/';

export const axiosInstance = axios.create({
    baseURL,
    headers,
    httpsAgent
});
