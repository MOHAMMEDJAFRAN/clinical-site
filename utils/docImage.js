// utils/imageUtils.js

export const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(new Error('Failed to load image'));
      image.crossOrigin = 'anonymous';
      image.src = url;
    });
  
  export const getCroppedImg = async (imageSrc, pixelCrop) => {
    try {
      const image = await createImage(imageSrc);
      if (!image) throw new Error('Image could not be created');
  
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      if (!pixelCrop) {
        const cropSize = Math.min(image.width, image.height);
        const x = (image.width - cropSize) / 2;
        const y = (image.height - cropSize) / 2;
        pixelCrop = { width: cropSize, height: cropSize, x, y };
      }
  
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
  
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
  
      return canvas.toDataURL('image/jpeg');
    } catch (err) {
      console.error('Failed to crop image:', err);
      throw err;
    }
  };
  