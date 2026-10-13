import { useEffect } from 'react';
import { createCustomCursor } from '../animations/cursor';

export function CustomCursor() {
  useEffect(() => createCustomCursor(), []);
  return null;
}
