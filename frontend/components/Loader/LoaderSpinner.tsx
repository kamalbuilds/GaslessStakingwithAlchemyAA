import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";

const LoaderSpinner = ({
    loading,
    size,
    color
}: any) => {
    return (
        <ClipLoader
            color={color ? color : "#3636da"}
            loading={loading}
            // cssOverride={override}
            size={size ? size : 50}
            aria-label="Loading Spinner"
            data-testid="loader" />
    );
};

export default LoaderSpinner;