/*
    Uses Intersection Observer to display element when it is in view. (ie fade in as user 
    scrolls down page)

    References:  
        https://www.npmjs.com/package/react-intersection-observer
        https://react-intersection-observer.vercel.app/?path=/story/introduction--page
*/

import React from 'react';
import { useInView } from 'react-intersection-observer';

export default function Visible({ children }) {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0.6,
    triggerOnce: true
  });

  return (
    <div ref={ref} className="visible-element" style={{opacity: (inView ? 1 : 0)}}>      
      {children}
    </div>
  );
};