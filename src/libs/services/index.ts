import createDynamoDBClient from "../db";
import DimensionService from "./dimensionService";

const DIMENSION_TABLE = 'dimensions';

const dimensionService = new DimensionService(createDynamoDBClient(), DIMENSION_TABLE);

export { dimensionService };