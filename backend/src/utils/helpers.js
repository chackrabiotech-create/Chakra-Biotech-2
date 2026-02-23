const calculateDiscount = (originalPrice, price) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const getPagination = (page = 1, limit = 12) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  return { skip, limit: limitNum, page: pageNum };
};

const getPaginationData = (total, page, limit) => {
  return {
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: parseInt(limit, 10)
  };
};

module.exports = {
  calculateDiscount,
  getPagination,
  getPaginationData
};
