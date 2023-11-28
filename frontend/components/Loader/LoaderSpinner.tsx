import React from 'react';
import FadeLoader from "react-spinners/FadeLoader";

const LoaderSpinner = ({
    loading
}: any) => {
    return (
        <FadeLoader
            color="#3636da"
            loading={loading}
            // cssOverride={override}
            // size={150}
            aria-label="Loading Spinner"
            data-testid="loader" />
    );
};

export default LoaderSpinner;