import _ from 'lodash';
import { checkForMatches, convertFormDataToUpdates, DataType, Entity, groupUpdates, partitionUpdates, reorderSchema } from './utils';

describe("Utils", () => {

  it("partitions updates", () => {
    const updates = [
      {inscriptionNumber: '1111', field: 'buyerIds', value: []},
      {inscriptionNumber: '1111', field: 'transactionValue', value: 5000},
    ]

    expect(partitionUpdates(updates))
      .toEqual([
        [updates[1]],
        [updates[0]],
      ])
  })

  it("groups updates", () => {
    const updates = [
      {
        inscriptionNumber: '1111',
        field: 'transactionValue',
        value: 50000,
      },
      {
        inscriptionNumber: '1111',
        field: 'squareFeet',
        value: 450,
      },
      {
        inscriptionNumber: '2222',
        field: 'transactionValue',
        value: 20000,
      },
    ]

    expect(groupUpdates(updates)).toEqual([
      {
        inscriptionNumber: '1111',
        fieldUpdates: {
          transactionValue: 50000,
          squareFeet: 450,
        },
        relations: [],
      },
      {
        inscriptionNumber: '2222',
        fieldUpdates: {
          transactionValue: 20000
        },
        relations: [],
      },
    ])
  })

  it("groups updates with relations", () => {
    const updates = [
      {
        inscriptionNumber: '1111',
        field: 'transactionValue',
        value: 50000,
      },
      {
        inscriptionNumber: '1111',
        field: 'squareFeet',
        value: 450,
      },
      {
        inscriptionNumber: '2222',
        field: 'transactionValue',
        value: 20000,
      },
      {
        inscriptionNumber: '1111',
        field: 'buyerIds',
        value: [11, 12],
      },
    ]

    expect(groupUpdates(updates)).toEqual([
      {
        inscriptionNumber: '1111',
        fieldUpdates: {
          transactionValue: 50000,
          squareFeet: 450,
        },
        relations: [{entity: Entity.Buyer, entityIds: [11, 12]}],
      },
      {
        inscriptionNumber: '2222',
        fieldUpdates: {
          transactionValue: 20000
        },
        relations: [],
      },
    ])
  })

  describe("Schema ordering", () => {
    const schema = {
      lotNumbers: DataType.MultiSelect,
      inscriptionNumber: DataType.Number,
      transactionValue: DataType.Number,
    }

    it("reorders schema", () => {
      const ordering = [
        "inscriptionNumber",
        "lotNumbers",
        "transactionValue",
      ]
  
      expect(reorderSchema({schema, ordering})).toEqual({
        transactionValue: DataType.Number,
        lotNumbers: DataType.MultiSelect,
        inscriptionNumber: DataType.Number,
      })
    })
  
    it("reorders schema with some unspecified fields", () => {
      const ordering = [
        "lotNumbers",
        "transactionValue",
      ]
  
      const reorderedSchema = reorderSchema({schema, ordering})
      expect(_.keys(reorderedSchema))
        .toEqual([
          ...ordering,
          "inscriptionNumber",
        ])
    })
  })

  it("converts form data to updates", () => {
    const formData = {
      inscriptionNumber: '111111',
      transactionValue: 5000,
    }

    expect(convertFormDataToUpdates(formData)).toEqual([
      {
        inscriptionNumber: '111111',
        field: 'transactionValue',
        value: 5000,
      }
    ])
  })

  it("converts empty form data to updates", () => {
    const formData = {}

    expect(convertFormDataToUpdates(formData)).toEqual([])
  })

  describe("Detect text matches", () => {
    it("contains a match using multiple values", () => {
      const params = {
        filter: 'contains',
        value: 'Montreal',
        filterValue: 'Mont,Lav',
      }
      expect(checkForMatches(params)).toBeTruthy()
    })

    it("contains a match using one filter with comma and space", () => {
      const params = {
        filter: 'contains',
        value: 'Montreal',
        filterValue: 'Mont, ',
      }
      expect(checkForMatches(params)).toBeTruthy()
    })

    it("contains a match using two filters separated by comma and space", () => {
      const params = {
        filter: 'contains',
        value: 'Montreal',
        filterValue: 'Something, Montr',
      }
      expect(checkForMatches(params)).toBeTruthy()
    })

    it("contains a match using one filter with comma and multiple spaces", () => {
      const params = {
        filter: 'contains',
        value: 'Montreal',
        filterValue: 'Mont,     ',
      }
      expect(checkForMatches(params)).toBeTruthy()
    })

    it("contains a match using multiple filters with commas and multiple spaces", () => {
      const params = {
        filter: 'contains',
        value: 'Montreal',
        filterValue: 'not  ,   Mon',
      }
      expect(checkForMatches(params)).toBeTruthy()
    })

    it("contains a match using filter without comma and without spaces", () => {
      const params = {
        filter: 'contains',
        value: 'Montreal',
        filterValue: '  Mon  ',
      }
      expect(checkForMatches(params)).toBeTruthy()
    })

    it("contains a match using one value without comma", () => {
      const params = {
        filter: 'contains',
        value: 'Montreal',
        filterValue: 'Mont',
      }
      expect(checkForMatches(params)).toBeTruthy()
    })

    it("does not contain a match", () => {
      const params = {
        filter: 'notContains',
        value: 'Toronto',
        filterValue: 'Mont,Lav',
      }
      expect(checkForMatches(params)).toBeTruthy()
    })
  })
})