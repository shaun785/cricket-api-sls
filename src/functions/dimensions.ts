import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import formatJSONResponse from "../libs/formatJsonResponse";
import { dimensionService } from "../libs/dynamodb";
import middyfy from '../libs/middyfy';

export const handler: Handler = middyfy(
  async (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
  
    try {
      switch (event?.httpMethod) {
        case "GET":
          if (event?.pathParameters?.type) {
            const dimensions = await dimensionService.getAllDimensions();
            return formatJSONResponse(200, dimensions);
          } else {
            const dimensions = await dimensionService.getDimensionsByType(event?.pathParameters?.type);
            return formatJSONResponse(200, dimensions);
          }
        case "POST":
          // const dimensions = await dimensionService.createDimension(event.body);
          return formatJSONResponse(200, {});

      }

    } catch (err) {
      return formatJSONResponse(400, err);
    }
  });