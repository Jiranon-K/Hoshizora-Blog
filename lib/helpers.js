
export function getImageUrl(filename) {
 
    if (filename && (filename.startsWith('http://') || filename.startsWith('https://'))) {
      return filename;
    }
    
    
    if (filename && filename.startsWith('/uploads/')) {
      const filenameOnly = filename.replace('/uploads/', '');
      return `/api/file/${filenameOnly}`;
    }
    
    
    if (filename && !filename.startsWith('/')) {
      return `/api/file/${filename}`;
    }
    
    return filename || '/placeholder-image.jpg';
  }