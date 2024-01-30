import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';

import { jsPDF } from 'jspdf';

export const convertBase64Image = (file) => {
  if (!file) return '';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// NOTE: Create a function to fetch the Blob data
async function fetchBlobData(blobUrl) {
  const response = await fetch(blobUrl);
  const blobData = await response.blob();
  return blobData;
}
// NOTE: Create a function to convert Blob data to base64
export async function convertBlobToBase64(blobUrl, mimeType) {
  const blobData = await fetchBlobData(blobUrl);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(`data:${mimeType};base64,${reader.result.split(',')[1]}`); // NOTE: Extract base64 part from the result
    };
    reader.onerror = reject;
    reader.readAsDataURL(blobData);
  });
}

export const handleFile = async (e, allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i) => {
  const base64 = await convertBase64Image(e.target.files[0]);

  if (!allowedExtensions.exec(e.target.value)) {
    toast.error(`File Must be an image`);
    return false;
  }

  if (e.target.files[0].size / 1024 / 1024 > 5) {
    toast.error(`File size should be equal or less than 5mb`);
    return false;
  }
  return base64;
};

export const fileCaseHandler = (type) => {
  switch (type) {
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'pptx';
    case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'xlsx';
    case 'plain':
      return 'txt';
    case 'x-zip-compressed':
      return 'zip';
    case 'x-matroska':
      return 'mkv';
    case 'x-ms-wmv':
      return 'wmv';
    default:
      return type;
  }
};

export const exportAsPNG = (componentRef) => {
  const elementToCapture = componentRef.current;
  if (!elementToCapture) return;

  html2canvas(elementToCapture).then((canvas) => {
    const pngUrl = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'Bugs_Report.png';
    a.click();
  });
};
export const exportAsPDF = (componentRef) => {
  const doc = new jsPDF({
    orientation: 'landscape', // NOTE: Set the orientation to landscape
  });

  // NOTE: Reference to the component element you want to export
  const elementToCapture = componentRef.current;
  if (!elementToCapture) return;

  // NOTE: Use html2canvas to convert the component to a PNG
  html2canvas(elementToCapture).then((canvas) => {
    const pngDataUrl = canvas.toDataURL('image/png');

    // NOTE: Calculate the dimensions for the PDF page based on the PNG's size
    const imgWidth = doc.internal.pageSize.getWidth(); // NOTE: Use page width for landscape
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // NOTE: Add the PNG image to the PDF
    doc.addImage(pngDataUrl, 'PNG', 0, 0, imgWidth, imgHeight);

    // NOTE: Save the PDF
    doc.save('Bugs_Report.pdf');
  });
};

export const imageChangeHandler = async (e) => {
  const file = e?.target?.files[0];
  if (file) {
    const blob = new Blob([e?.target?.files[0]], { type: file.type });
    const blobUrl = URL?.createObjectURL(blob);

    const base64 = await convertBase64Image(e?.target?.files[0]);
    return { name: file?.name, url: blobUrl, base64 };
  }
};

export const downloadCSV = (data, filename = 'resultCSV') => {
  const url = URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`); // NOTE: Replace with desired filename and extension
  document.body.appendChild(link);
  link.click();
  // NOTE: Cleanup the temporary URL
  window.URL.revokeObjectURL(url);
};
