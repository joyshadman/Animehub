import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "../config/config";

// Always use the deployed Render API (config.serverUrl) for all environments
export const API_BASE_URL = config.serverUrl;

const fetchData = async (url) => {
  try {
    const { data } = await axios.get(API_BASE_URL + url);

    return data;
  } catch (error) {
    throw error;
  }
};

export const useApi = (endpoint) => {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData(endpoint),
    retry: 2,
    enabled: !!endpoint,
    refetchOnWindowFocus: false,
  });
};

const fetchInfiniteData = async ({ queryKey, pageParam }) => {
  try {
    const endpoint = queryKey[0];
    const { data } = await axios.get(API_BASE_URL + endpoint + pageParam);
    return data;
  } catch (error) {
    throw error;
  }
};
export const useInfiniteApi = (endpoint) => {
  return useInfiniteQuery({
    queryKey: [endpoint],
    queryFn: fetchInfiniteData,
    initialPageParam: 1,
    retry: 0,
    getNextPageParam: (lastpage) => {
      if (lastpage.data.pageInfo.hasNextPage) {
        return lastpage.data.pageInfo.currentPage + 1;
      } else {
        return undefined;
      }
    },
  });
};
