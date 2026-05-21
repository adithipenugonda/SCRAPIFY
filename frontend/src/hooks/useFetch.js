import {
  useState,
  useEffect,
} from "react";


// ==========================================
// CUSTOM FETCH HOOK
// ==========================================
const useFetch = (
  fetchFunction,
  dependencies = []
) => {

  // ========================================
  // STATES
  // ========================================
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  // ========================================
  // FETCH DATA
  // ========================================
  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        const response =
          await fetchFunction();

        setData(response);

      } catch (err) {

        setError(
          err.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchData();

  }, dependencies);


  // ========================================
  // RETURN
  // ========================================
  return {
    data,
    loading,
    error,
  };

};

export default useFetch;