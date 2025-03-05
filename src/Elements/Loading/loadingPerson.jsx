import React from 'react';
import ContentLoader from 'react-content-loader';

const LoadingPerson = (props) => (
  <ContentLoader 
    speed={2}
    width={props.width} 
    height={props.height}
    viewBox="0 0 400 250"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    {/* Круг */}
    <circle cx="50" cy="50" r="50" />

    {/* Первая линия */}
    <rect x="120" y="20" rx="5" ry="5" width="200" height="50" />

    {/* Вторая линия */}
    <rect x="120" y="80" rx="5" ry="5" width="150" height="50" />
  </ContentLoader>
);

export default LoadingPerson;