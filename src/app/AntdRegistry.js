'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';

const AntdRegistry = ({ children }) => {
  const cache = createCache();
  
  useServerInsertedHTML(() => {
    const styleText = extractStyle(cache, true);
    return (
      <style 
        id="antd-server" 
        dangerouslySetInnerHTML={{ __html: styleText }}
        suppressHydrationWarning
      />
    );
  });
  
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default AntdRegistry;