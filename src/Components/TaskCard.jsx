import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  TASK: 'task',
};

export default function TaskCard({ task }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white shadow-md rounded-lg p-4 mb-4 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="font-bold text-lg">{task.title}</div>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="mt-2 text-xs text-gray-400">Status: {task.status}</p>
    </div>
  );
}
