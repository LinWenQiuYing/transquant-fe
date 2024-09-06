import React from "react";

export default function CustomTitle(props: {
  title: React.ReactNode;
  tip?: React.ReactNode;
}) {
  const { title, tip } = props;
  return (
    <div className="flex items-center justify-start mb-4">
      <div className="w-1 h-5 mr-2 bg-red-600 float-start" />
      <span className="text-lg font-bold">{title}</span>
      {tip && <span className="ml-2 text-gray-400 cursor-pointer">{tip}</span>}
    </div>
  );
}
