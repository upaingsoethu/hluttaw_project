const paginate = async (
  model,
  page,
  limit,
  query = {},
  populateOptions = null,
  sort = {}
) => {
    
  const skip = (page - 1) * limit;
  const totalItems = await model.countDocuments(query);

  let itemsQuery = model.find(query).skip(skip).limit(limit).sort(sort);

  if (populateOptions) {
    itemsQuery = itemsQuery.populate(populateOptions);
  }

  const items = await itemsQuery;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    items,
  };
};

export default paginate;
