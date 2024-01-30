import { toast } from 'react-toastify';

// FIXME: const { toast } = require('react-toastify');

export const handleDownload = async (fileUrl, name) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // NOTE: Extract the file name from the URL
    const fileName = name ? name : 'download-file';

    const link = document.createElement('a');
    link.href = url;

    // NOTE: Set the download attribute to the extracted file name
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    toast.error(error);
  }
};
