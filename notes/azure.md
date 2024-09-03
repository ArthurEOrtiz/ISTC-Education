### 20240830

#### Sources

[Register a web application in Azure Active Directory B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-applications)

[Create user flows and custom policies in Azure Active Directory B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy)

[Configure authentication in a sample single-page application by using Azure AD B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/configure-authentication-sample-spa-app?tabs=app-reg-ga)

- REDIRECT URI - The redirect URI is the endpoint to which the user is sent by the authorization server (Azure AD B2C, in this case) after completing its interaction with the user, and to which an access token or authorization code is sent upon successful authorization. In a production application, it's typically a publicly accessible endpoint where your app is running, like `https://contoso.com/` auth-response. For testing purposes like this tutorial, you can set it to `https://jwt.ms`, a Microsoft-owned web application that displays the decoded contents of a token (the contents of the token never leave your browser). During app development, you might add the endpoint where your application listens locally, like `https://localhost:5000`. You can add and modify redirect URIs in your registered applications at any time.

    -  The following restrictions apply to redirect URIs:

        - The reply URL must begin with the scheme https, unless you use a localhost redirect URL.

        - The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`, do not specify `.../ABC/response-oidc` in the reply URL. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.

        - The reply URL should include or exclude the trailing forward slash as your application expects it. For example, `https://contoso.com/auth-response` and `https://contoso.com/auth-response/` might be treated as nonmatching URLs in your application.

- CLIENT SECRET - For a web application, you need to create an application secret. The client secret is also known as an application password. The secret will be used by your application to exchange an authorization code for an access token.

    - Do I need a client secret for an SPA?
        - AI mostly saids yes, and i see it used in the example code.
