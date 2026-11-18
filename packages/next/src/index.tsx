'use client';

import React, { useState, useEffect } from 'react';
import { FestiveAnimation, FestiveAnimationProps } from '@festiveui/react';

export interface NextFestiveAnimationProps extends FestiveAnimationProps {
  ssrPlaceholder?: React.ReactNode;
}

export const NextFestiveAnimation: React.FC<NextFestiveAnimationProps> = ({
  ssrPlaceholder = null,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{ssrPlaceholder}</>;
  }

  return <FestiveAnimation {...props} />;
};

export * from '@festiveui/react';
