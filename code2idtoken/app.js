const axios = require('axios')
const qs = require('querystring')

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {

    console.log(event)

    let app_url = process.env.Authing_App_URL
    let authing_oidc_token_url = `https://${app_url}.authing.cn/oauth/oidc/token`
    let app_id = process.env.Authing_App_ID
    let app_secret = process.env.Authing_App_Secret
    let redirect_url = process.env.Authing_Redirect_URL

    try {
        let querystr
        let id_token
        
        if (event.queryStringParameters) {
            querystr = event.queryStringParameters
            console.log(querystr)

            if (querystr['code']) { 
                console.log(authing_oidc_token_url)
                console.log(app_id)
                console.log(app_secret)
                console.log(redirect_url)
                console.log(querystr['code'])

                //start exchange token from authing
                let response_authing = await axios.post( 
                    authing_oidc_token_url,
                    qs.stringify({
                        "client_id" : app_id,
                        "client_secret" : app_secret,
                        "grant_type" : "authorization_code",
                        "redirect_uri" : redirect_url,
                        "code" : querystr['code'] 
                    }),
                    {
                        headers: {
                            "Content-Type" : "application/x-www-form-urlencoded"
                        }
                    });
                
                console.log(response_authing)
                id_token = response_authing.data['id_token']
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        'id_token' : id_token
                    })
                }
            }   
        }
        else {
            response = {
                statusCode: 400,
                body: JSON.stringify('Missing Code')
            };
        }

        response.headers = {
            'Access-Control-Allow-Origin' : '*'
        }
        return response
        
    } catch (err) {
        console.log(err);
        return err;
    }
}
