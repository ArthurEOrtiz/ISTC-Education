// import fs from 'fs';
// import path from "path";
import https from 'https';

export const agent = new https.Agent({
    //ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'istceducation.pfx')),
    rejectUnauthorized: false // This is not recommended for production, but this will accept self-signed certificates.
}); 
