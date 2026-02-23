module.exports = {
  JWT_EXPIRES_IN: '30d',
  ITEMS_PER_PAGE: 12,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  CLOUDINARY_FOLDERS: {
    BLOG: 'chakra-bio/blogs',
    PRODUCT: 'chakra-bio/products',
    GALLERY: 'chakra-bio/gallery',
    HERO: 'chakra-bio/hero',
    CATEGORY: 'chakra-bio/categories'
  }
};
