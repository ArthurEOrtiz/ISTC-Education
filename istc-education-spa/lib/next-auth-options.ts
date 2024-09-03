import { NextAuthOptions } from 'next-auth';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        AzureADB2CProvider({
            tenantId: process.env.AZURE_AD_B2C_TENANT_NAME as string,
            clientId: process.env.AZURE_AD_B2C_CLIENT_ID as string,
            clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET as string,
            primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW as string,
            authorization: { 
                params: { 
                    // scope: 'openid offline_access test.read test.write',
                    scope: `https://${process.env.AZURE_AD_B2C_TENANT_NAME as string}.onmicrosoft.com/api/test.read  https://${process.env.AZURE_AD_B2C_TENANT_NAME as string}.onmicrosoft.com/api/test.write offline_access openid`, 
                } }
        }),
    ],
    logger: {
        error(code, ...message) {
            console.error(code, ...message);
        },
        warn(code, ...message) {
            console.warn(code, ...message);
        },
        debug(code, ...message) {
            console.debug(code, ...message);
        }
    },
    debug: true,
};