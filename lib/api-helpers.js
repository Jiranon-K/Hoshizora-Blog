/**
 * 
 * @param {Response} response 
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
export async function handleApiResponse(response) {
 
    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
 
    if (!response.ok) {
     
      if (data && typeof data === 'object' && data.error) {
        throw new Error(data.error);
      }
      
   
      if (typeof data === 'string') {
        throw new Error(data || `HTTP error ${response.status}`);
      }
      
      
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return data;
  }
  
  /**
   *
   * @param {string} url -
   * @param {Object} options
   * @returns {Promise<Object>} 
   */
  export async function fetchApi(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error(`API Error (${url}):`, error);
      throw error;
    }
  }
  
  /**
   * 
   * @param {string} imageUrl 
   * @param {string} fallbackUrl d
   * @returns {string} 
   */
  export function getImageUrlWithTimestamp(imageUrl, fallbackUrl = '/placeholder-image.jpg') {
    if (!imageUrl) return fallbackUrl;
    
    // 
    return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
  }
  
  /**
   * 
   * @param {string|Date} date 
   * @param {Object} options 
   * @returns {string} 
   */
  export function formatThaiDate(date, options = {}) {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    });
  }
  
  /**
   * ฟังก์ชันสำหรับแปลงสถานะเป็นข้อความภาษาไทย
   * @param {string} status 
   * @returns {string} 
   */
  export function getStatusText(status) {
    switch (status) {
      case 'draft': return 'ฉบับร่าง';
      case 'published': return 'เผยแพร่แล้ว';
      case 'archived': return 'เก็บถาวร';
      default: return status;
    }
  }
  
  /**
   * 
   * @param {string} status 
   * @returns {string} 
   */
  export function getStatusColor(status) {
    switch (status) {
      case 'draft': return 'badge-warning';
      case 'published': return 'badge-success';
      case 'archived': return 'badge-ghost';
      default: return 'badge-neutral';
    }
  }