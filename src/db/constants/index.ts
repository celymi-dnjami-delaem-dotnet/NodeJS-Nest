const getMissingEntityExceptionMessage = (entity: string): string =>
    `Unable to perform this operation due to missing ${entity} by provided parameters`;

export const missingCategoryEntityExceptionMessage: string = getMissingEntityExceptionMessage('category');
export const missingProductEntityExceptionMessage: string = getMissingEntityExceptionMessage('product');
export const missingUserEntityExceptionMessage: string = getMissingEntityExceptionMessage('user');
