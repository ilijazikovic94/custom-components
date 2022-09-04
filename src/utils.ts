import _, { every, has, partition, pick } from 'lodash';
import { ComparableUpdate } from './ComparablesTable';

export enum DataType {
  Number = 'number',
  Date = 'date',
  Text = 'text',
  MultiSelect = 'multiselect',
}

export interface Schema {
  [key: string]: DataType;
}

export const mapMySqlSchemaToAppSchema: (mysqlSchema: Array<{ [key: string]: string }>) => Schema = (mysqlSchema) =>
  _(mysqlSchema as any)
    .keyBy(({ Field }) => Field)
    .mapValues(({ Type }) =>
      Type.indexOf('int') > -1 || Type.indexOf('decimal') > -1
        ? DataType.Number
        : Type.indexOf('varchar') > -1
        ? DataType.Text
        : Type.indexOf('date') > -1
        ? DataType.Date
        : DataType.Text
    )
    .value();

export interface GenericObject {
  [key: string]: any;
}
export interface Dictionary {
  [key: string]: Primitive;
}
export type Primitive = string | boolean | number;
export type Identifier = string | number;
export type LotFile = {id: number, identifier: string, identifierType: string, type: string, timestamp: string, s3Path: string};

export enum Entity {
  Buyer = 'buyer',
  Seller = 'seller',
  Lot = 'lot',
  ZoningCategory = 'zoningCategory',
}

export const fieldEntities = {
  buyerIds: Entity.Buyer,
  sellerIds: Entity.Seller,
  lotNumbers: Entity.Lot,
  zoningIds: Entity.ZoningCategory,
} as {[key: string]: Entity}

export interface Relation {
  entity: Entity;
  entityIds: Primitive[];
}
export interface GroupedUpdate {
  inscriptionNumber: string;
  fieldUpdates: Dictionary;
  relations: Relation[];
}

type PartialUpdate = Omit<ComparableUpdate, 'inscriptionNumber'>;

export const partitionUpdates: (updates: Array<PartialUpdate>) => [Array<PartialUpdate>, Array<PartialUpdate>] = (updates) =>
  partition(updates, ({ field }) => !multiSelectFields.includes(field));

export const groupUpdates: (updates: Array<ComparableUpdate>) => Array<GroupedUpdate> = (updates) =>
  _(updates)
    .groupBy('inscriptionNumber')
    .map((updates, inscriptionNumber) => {
      const [fieldUpdates, relations] = partitionUpdates(updates.map((u) => pick(u, ['field', 'value'])));

      return {
        inscriptionNumber,
        fieldUpdates: _(fieldUpdates)
          .keyBy(({ field }) => field)
          .mapValues(({ value }) => value as Primitive)
          .value(),
        relations: relations.map(({ field, value }) => ({
          entity: fieldEntities[field],
          entityIds: value as Primitive[],
        })),
      };
    })
    .value();

export const multiSelectFields = ["lotNumbers", "buyerIds", "sellerIds", "zoningIds"]
export const fieldNames = {
  buyerIds: "Registered Buyers",
  sellerIds: "Registered Sellers",
  lotNumbers: "Lot Number",
  zoningIds: "Zoning Categories",
} as {[key: string]: string}

export const fieldHints = {
  inscriptionNumber:
    'If the inscription number you enter is already in the database then you will receive an error message when you click submit. The form will not be reset so you can change the number and re-submit without filling out the form again.',
  lotNumbers: 'Type a lot number then press enter to add it',
  presentationDate: 'Enter a date in this format: YYYY-MM-DD',
  withInfrastructure: 'Enter a 1 for true and a 0 for false',
};

export const reorderSchema: (props: { schema: Schema; ordering: Array<string> }) => Schema = ({ schema, ordering }) => {
  return _(schema)
    .keys()
    .orderBy((key) => (ordering.includes(key) ? ordering.indexOf(key) : ordering.length))
    .keyBy((key) => key)
    .mapValues((value, key) => schema[key])
    .value();
};

export const convertFormDataToUpdates: (formData: GenericObject) => ComparableUpdate[] = (formData) => {
  return _(formData)
    .omit('inscriptionNumber')
    .map((v, k) => ({
      inscriptionNumber: formData.inscriptionNumber,
      field: k,
      value: v,
    }))
    .value();
};

export const requiredFields = ['inscriptionNumber', 'lotNumbers', 'transactionValue'];

export const isFormDataSubmittable = (formData: GenericObject) => every(requiredFields, (field) => has(formData, field));

export const fileTypeValues = [
  {
    key: 'cadastralMap',
    value: 'Cadastral map',
  },
  {
    key: 'businessRegisterPagePdf',
    value: 'Business register page print-out',
  },
  {
    key: 'satelliteView',
    value: 'Google Maps satellite view',
  },
  {
    key: 'streetView',
    value: 'Google Maps street view',
  },
  {
    key: 'taxPdf',
    value: 'Assessment role tax PDF',
  },
  {
    key: 'salePdf',
    value: 'Land register sale PDF',
  },
  {
    key: 'landPagePdf',
    value: 'Land register page print-out',
  },
  {
    key: 'lotPagePdf',
    value: 'Assessment role page print-out',
  },
  {
    key: 'zoningGrid',
    value: 'Zoning grid',
  },
  {
    key: 'other',
    value: 'Other',
  },
];

export const checkForMatches = (params: {filter: string, value: string, filterValue: string}): boolean => {
  const filterTextSections: string[] =
    _(params.filterValue)
      .split(',')
      .map(_.trim)
      .without('')
      .value()
  const hasMatches = _.some(filterTextSections, (section) => params.value.includes(section))
  return params.filter === 'contains' ? hasMatches : !hasMatches
}
