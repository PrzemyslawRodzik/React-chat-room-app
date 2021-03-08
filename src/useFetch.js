import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const getData = async () => {
    setData([...data, { id: 1, name: "przemek" }]);
    setIsLoading(false);
  };
  useEffect(() => {
    getData();
  }, [url]);

  return { isLoading, data };
};
