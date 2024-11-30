//clean the mobile url
export function cleanInstagramUrl(fullUrl: string) {
    try {
      const url = new URL(fullUrl);
      if (url.pathname.includes('/reel/')) {
        const pathParts = url.pathname.split('/');
        const reelId = pathParts[pathParts.indexOf('reel') + 1];
        return `https://www.instagram.com/reel/${reelId}/`;
      }
      return null; 
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  }

