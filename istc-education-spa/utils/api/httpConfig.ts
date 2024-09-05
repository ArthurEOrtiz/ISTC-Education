import https from 'https';

export const agent = new https.Agent({
    //ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'istceducation.pfx')),
    rejectUnauthorized: false // This is not recommended for production, but this will accept self-signed certificates.
}); 

export const headers = {
    'Content-Type': 'application/json'
};

export const rootUrl = 'https://localhost:7180/';

