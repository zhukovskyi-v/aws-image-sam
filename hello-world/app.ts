import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import sharp from 'sharp';
import axios from 'axios';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const imageUrl =
            'https://images.unsplash.com/photo-1691094281108-1eb6af036fc7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=michael-baccin-FEsY2pYB13I-unsplash.jpg';
        const image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageData = Buffer.from(image.data, 'binary');

        const resizedImageBuffer = await sharp(imageData)
            .resize(200, 200) // Specify the desired width and height
            .toBuffer();

        // Return the resized image as a base64-encoded string
        const resizedImageBase64 = resizedImageBuffer.toString('base64');
        const responseBody = {
            resizedImage: resizedImageBase64,
            contentType: 'image/jpeg', // Change the content type as needed
        };
        const response = {
            statusCode: 200,
            body: JSON.stringify(responseBody),
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return response;
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
