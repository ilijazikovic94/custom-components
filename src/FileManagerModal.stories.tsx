import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileManagerModal } from './FileManagerModal';
export default {
  title: 'FileManagerModal',
  component: FileManagerModal,
} as ComponentMeta<typeof FileManagerModal>;

const Template: ComponentStory<typeof FileManagerModal> = (args) => <FileManagerModal {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  open: true,
  uploadLotFile: (formData: FormData) => new Promise(resolve => {
    resolve({
      id: 1, identifier: '1111', identifierType: 'lotNumber', type: 'cadastralMap', timestamp: '2021-01-16 19:45:41', s3Path: 'file-3.jpeg'
    })
  }),
  getFile: (s3Path: string) => {
    if (s3Path === 'image-1.jpeg') {
      return fetch('https://dummyimage.com/400x800/000/fff').then(r => r.blob());
    } else if (s3Path === 'image-2.jpeg') {
      return fetch('https://dummyimage.com/800x400/000/fff').then(r => r.blob());
    } else {
      return fetch('http://localhost:6006/dummy.pdf').then(r => r.blob());
    }
  },
  getLotFiles: (lotNumber: string) => new Promise(resolve => {
    if (lotNumber === '1111') {
      resolve([
        {
          id: 1,
          identifier: '1111',
          identifierType: 'lotNumber',
          type: 'cadastralMap',
          timestamp: '2021-01-16 19:45:41',
          s3Path: 'image-1.jpeg',
        },
        {
          id: 2,
          identifier: '1111',
          identifierType: 'lotNumber',
          type: 'zoningGrid',
          timestamp: '2021-01-16 22:45:41',
          s3Path: 'pdf-1.pdf',
        },
      ]);
    } else {
      resolve([{
        id: 2, identifier: '2222', identifierType: 'lotNumber', type: 'streetView', timestamp: '2021-01-16 19:45:41', s3Path: 'image-2.jpeg'
      }]);
    }
  }),
  deleteLotFile: (s3Path: string) => new Promise(resolve => resolve(s3Path)),
  lotNumbers: ['1111', '2222'],
};
