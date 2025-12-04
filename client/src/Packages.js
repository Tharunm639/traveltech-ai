import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PackageSection from './PackageSection';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const query = useQuery();
  const searchTerm = query.get('q') || '';

  useEffect(() => {
    (async () => {
      try {
        const url = searchTerm ? `/api/packages?q=${encodeURIComponent(searchTerm)}` : '/api/packages';
        const res = await fetch(url);
        const data = await res.json();
        setPackages(data.docs || []);
      } catch (e) { console.error(e); }
    })();
  }, [searchTerm]);

  return (
    <div>
      <PackageSection
        title={searchTerm ? `Search Results for "${searchTerm}"` : "All Holiday Packages"}
        packages={packages}
      />
    </div>
  );
}