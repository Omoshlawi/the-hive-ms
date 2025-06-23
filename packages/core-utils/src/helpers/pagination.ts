import { Request } from "express";
import qs from "querystring";

export interface PaginationControls {
  next: string | null;
  prev: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 120;
export const DEFAULT_PAGE = 1;

export const getPaginationControls = (
  req: Request,
  totalCount: number
): PaginationControls => {
  // Validate totalCount
  if (!Number.isInteger(totalCount) || totalCount < 0) {
    throw new Error("totalCount must be a non-negative integer");
  }

  const query: Record<string, any> = req.query ?? {};

  // Parse and validate pageSize
  let pageSize = DEFAULT_PAGE_SIZE;
  if (query.pageSize !== undefined) {
    const parsedPageSize = parseInt(String(query.pageSize), 10);
    if (
      !isNaN(parsedPageSize) &&
      parsedPageSize > 0 &&
      parsedPageSize <= MAX_PAGE_SIZE
    ) {
      pageSize = parsedPageSize;
    }
  }

  // Parse and validate page
  let page = DEFAULT_PAGE;
  if (query.page !== undefined) {
    const parsedPage = parseInt(String(query.page), 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Ensure current page doesn't exceed total pages
  if (totalPages > 0 && page > totalPages) {
    page = totalPages;
  }

  // Build base URL
  const baseUrl =
    req.originalUrl?.split("?")[0] || req.baseUrl || req.path || "";

  // Create query object without page for building URLs
  const { page: _, ...queryWithoutPage } = query;

  // Build next URL
  let next: string | null = null;
  if (page < totalPages) {
    const nextQuery = { ...queryWithoutPage, page: page + 1, pageSize };
    next = `${baseUrl}?${qs.stringify(nextQuery)}`;
  }

  // Build previous URL
  let prev: string | null = null;
  if (page > 1) {
    const prevQuery = { ...queryWithoutPage, page: page - 1, pageSize };
    prev = `${baseUrl}?${qs.stringify(prevQuery)}`;
  }

  return {
    next,
    prev,
    currentPage: page,
    pageSize,
    totalPages,
    totalCount,
  };
};

export const getPageSize = (pageSize: number, page: number) =>
  (page - 1) * pageSize;

export const paginate = (query: Record<string, any> = {}) => {
  let pageSize = DEFAULT_PAGE_SIZE;
  let page = DEFAULT_PAGE;

  if (query && typeof query.pageSize !== "undefined") {
    const parsedPageSize = parseInt(query.pageSize, 10);
    if (!isNaN(parsedPageSize) && parsedPageSize > 0) {
      pageSize = parsedPageSize;
    }
  }

  if (query && typeof query.page !== "undefined") {
    const parsedPage = parseInt(query.page, 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  return {
    skip: getPageSize(pageSize, page),
    take: pageSize,
  };
};
