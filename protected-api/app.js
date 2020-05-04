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
    console.log(context)
    try {
        response = {
            'statusCode': 200,
            headers: {
                'Access-Control-Allow-Origin' : '*'
            },
            body: JSON.stringify({
                message: "You're authorized. Source IP:  " + event.requestContext.identity.sourceIp
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
