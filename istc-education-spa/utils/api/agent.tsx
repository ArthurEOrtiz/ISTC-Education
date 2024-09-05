import fs from 'fs';
import https from 'https';
import path from "path";

export const agent = new https.Agent({
    //ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'istceducation.pfx')),
    rejectUnauthorized: false // This is not recommended for production, but this will accept self-signed certificates.
}); 
