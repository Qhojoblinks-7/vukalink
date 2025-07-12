// Performance optimization utilities

// Debounce function to limit how often a function can be called
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function to ensure a function is called at most once in a specified time period
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization utility for expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Image lazy loading utility
export const lazyLoadImage = (imgElement, src) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    imageObserver.observe(imgElement);
  } else {
    // Fallback for browsers without IntersectionObserver
    imgElement.src = src;
  }
};

// Preload critical resources
export const preloadResource = (href, as = 'fetch') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Prefetch resources for better performance
export const prefetchResource = (href) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

// Measure performance of a function
export const measurePerformance = (fn, name = 'Function') => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
};

// Optimize scroll events
export const optimizeScroll = (callback, options = {}) => {
  const { throttleMs = 16 } = options; // ~60fps
  return throttle(callback, throttleMs);
};

// Optimize resize events
export const optimizeResize = (callback, options = {}) => {
  const { debounceMs = 250 } = options;
  return debounce(callback, debounceMs);
};

// Cache utility for API responses
export const createCache = (maxSize = 100) => {
  const cache = new Map();
  
  return {
    get: (key) => cache.get(key),
    set: (key, value) => {
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    has: (key) => cache.has(key),
    delete: (key) => cache.delete(key),
    clear: () => cache.clear(),
    size: () => cache.size
  };
};

// Virtual scrolling utility for large lists
export const createVirtualScroller = (items, itemHeight, containerHeight) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  
  return {
    getVisibleRange: (scrollTop) => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount, items.length);
      return { startIndex, endIndex };
    },
    getVisibleItems: (scrollTop) => {
      const { startIndex, endIndex } = this.getVisibleRange(scrollTop);
      return items.slice(startIndex, endIndex);
    },
    getTotalHeight: () => totalHeight,
    getItemHeight: () => itemHeight
  };
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (import.meta.env.DEV && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
      console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
    }
  }
};