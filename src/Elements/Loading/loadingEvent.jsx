import React from "react";
import ContentLoader from 'react-content-loader';

const LoadingEvent = (props) =>{
  return(
  <ContentLoader 
    speed={2}
    width={props.width} 
    height={props.height}
    viewBox="0 0 400 250"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
  <rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
  </ContentLoader>
  );
};

export default LoadingEvent;