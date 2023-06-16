import useSwr from "swr";

import fetcher from "@/libs/fetcher";

const useCurrentProfile = () => {
	const { data, error, isLoading, mutate } = useSwr("/api/profile", fetcher);
	return {
		data,
		error,
		isLoading,
		mutate,
	};
};

export default useCurrentProfile;
