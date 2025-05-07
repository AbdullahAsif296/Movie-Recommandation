export const paginationMiddleware = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Validate page and limit
  if (page < 1) {
    return res.status(400).json({ message: 'Page must be greater than 0' });
  }
  
  if (limit < 1 || limit > 100) {
    return res.status(400).json({ message: 'Limit must be between 1 and 100' });
  }
  
  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit
  };
  
  next();
}; 