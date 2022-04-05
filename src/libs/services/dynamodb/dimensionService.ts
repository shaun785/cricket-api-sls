import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Dimension from "../models/Dimension";

class DimensionService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  async getAllDimensions(): Promise<Dimension[]> {
    const result = await this.docClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as Dimension[];
  }

  async getDimensionsByType(dimensionType: string): Promise<Dimension[]> {
    const params = {
      TableName : this.tableName,
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames:{
          "#type": "dimType"
      },
      ExpressionAttributeValues: {
          ":type": dimensionType
      }
    };
  
    const result = await this.docClient
      .query(params)
      .promise();

    return result.Items as Dimension[];
  }

  async getDimension(dimensionType: string, dimensionId: string): Promise<Dimension> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { "dimType": dimensionType, "dimId": dimensionId },
      })
      .promise();

    return result.Item as Dimension;
  }

  async createDimension(Dimension: Dimension): Promise<Dimension> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: Dimension,
      })
      .promise();

    return Dimension;
  }

  async updateDimension(dimensionType: string, dimensionId: string, partialDimension: Partial<Dimension>): Promise<Dimension> {
    const updated = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { "dimType": dimensionType, "dimId": dimensionId },
        UpdateExpression:
          "set #dimName = :dimName, #dimAlias = :dimAlias",
        ExpressionAttributeNames: {
          "#dimName": "dimName",
          "#dimAlias": "dimAlias",
        },
        ExpressionAttributeValues: {
          ":dimName": partialDimension.dimName,
          ":dimAlias": partialDimension.dimAlias
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return updated.Attributes as Dimension;
  }

  async deleteDimension(dimensionType: string, dimensionId: string) {
    return this.docClient
      .delete({
        TableName: this.tableName,
        Key: { "dimType": dimensionType, "dimId": dimensionId },
      })
      .promise();
  }
}

export default DimensionService;