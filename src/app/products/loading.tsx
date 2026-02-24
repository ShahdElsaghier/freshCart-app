"use client";
import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex space-x-1">
        <div className="w-3 h-8 bg-green-500 animate-bounce"></div>
        <div className="w-3 h-8 bg-green-500 animate-bounce delay-150"></div>
        <div className="w-3 h-8 bg-green-500 animate-bounce delay-300"></div>
        <div className="w-3 h-8 bg-green-500 animate-bounce delay-450"></div>
        <div className="w-3 h-8 bg-green-500 animate-bounce delay-600"></div>
      </div>
    </div>
  );
}