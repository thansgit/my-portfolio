"use client";

import * as THREE from "three";
import { useEffect } from "react";

/**
 * Handles touch and pointer interactions for the TetheredCard component
 * Manages browser-level touch event behavior and cursor styles
 */
export const useTouchHandling = (dragged: THREE.Vector3 | false, hovered: boolean) => {
  // Prevent default touch behavior when dragging
  useEffect(() => {
    const preventTouchDefault = (e: TouchEvent) => {
      // Only prevent default if we're actually dragging the object
      if (dragged && e.cancelable) {
        e.preventDefault();
      }
    };
    
    // Only add the event listener when dragging
    if (dragged) {
      document.addEventListener('touchmove', preventTouchDefault, { passive: false });
      return () => document.removeEventListener('touchmove', preventTouchDefault);
    }
    
    return undefined;
  }, [dragged]);

  // Add a separate effect to handle touch events on the canvas
  useEffect(() => {
    // Find the canvas element
    const canvas = document.querySelector('canvas');
    
    if (!canvas) return;
    
    // Function to handle touchstart on the canvas
    const handleCanvasTouchStart = (e: TouchEvent) => {
      // Don't prevent default here to allow scrolling when not interacting with the 3D object
    };
    
    // Function to handle touchmove on the canvas
    const handleCanvasTouchMove = (e: TouchEvent) => {
      // Only prevent default if we're dragging the object
      if (dragged && e.cancelable) {
        e.preventDefault();
      }
    };
    
    // Add event listeners to the canvas only
    canvas.addEventListener('touchstart', handleCanvasTouchStart);
    canvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
    
    // Clean up
    return () => {
      canvas.removeEventListener('touchstart', handleCanvasTouchStart);
      canvas.removeEventListener('touchmove', handleCanvasTouchMove);
    };
  }, [dragged]);

  // Update cursor based on hover state
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged]);
}; 