declare module 'react-file-preview-latest' {
  import React from 'react';

  export interface FilePreviewProps {
    type: string;
    file?: object;
    onError?: (error_message?: string | undefined) => void;
    height?: string;
    width?: string;
  }

  export default class FilePreview extends React.Component<FilePreviewProps> {}
}
