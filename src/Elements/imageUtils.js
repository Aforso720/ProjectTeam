// utils/imageUtils.js
export const normalizeImageUrl = (imageUrl) => {
  console.log('normalizeImageUrl input:', imageUrl);
  
  if (!imageUrl || typeof imageUrl !== 'string') {
    console.log('normalizeImageUrl: invalid input, returning null');
    return null;
  }
  
  const backendBaseUrl = 'http://localhost:5555';
  const incorrectPrefix = 'http://localhost/storage/';
  
  if (imageUrl.startsWith(incorrectPrefix)) {
    const originalUrl = imageUrl.replace(incorrectPrefix, '');
    const result = `${backendBaseUrl}/storage/${originalUrl}`;
    console.log('normalizeImageUrl: transformed', imageUrl, 'to', result);
    return result;
  }
  
  console.log('normalizeImageUrl: no transformation needed');
  return imageUrl;
};