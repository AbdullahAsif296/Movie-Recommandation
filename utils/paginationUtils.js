export const paginatedResponse = (data, total, page, limit) => {
  return {
    data,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};
