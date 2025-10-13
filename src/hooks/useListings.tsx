import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

function useListings({ search = "", location = "", minPrice, maxPrice }) {
  return useQuery({
    queryKey: ["listings", minPrice, maxPrice, search, location],
    queryFn: () =>
      fetcher({
        url: `/api/public/listings?search=${search}&location=${location}&minPrice=${minPrice}&maxPrice=${maxPrice}&status=active&limit=1&cursor`,
        method: "GET",
      }),
  });
}

export function useSpecificListing({ id }: any) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () =>
      fetcher({
        url: `/api/public/listings/${id}`,
        method: "GET",
      }),
  });
}

export default useListings;
