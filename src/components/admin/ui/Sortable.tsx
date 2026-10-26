"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

export { arrayMove };

export type HandleProps = ReturnType<typeof useSortable>["listeners"] & ReturnType<typeof useSortable>["attributes"];

/**
 * Drag-and-drop reordering (dnd-kit). Items are dragged by their ⋮⋮ handle:
 * `renderItem` gets `handleProps` to spread onto <DragHandle>.
 */
export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  layout = "list",
  className,
  style,
}: {
  items: T[];
  getId: (item: T, index: number) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, handleProps: HandleProps) => ReactNode;
  layout?: "list" | "grid";
  className?: string;
  style?: React.CSSProperties;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = items.map(getId);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    onReorder(arrayMove(items, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <div className={className} style={style}>
          {items.map((item, i) => (
            <SortableItem key={ids[i]} id={ids[i]}>
              {(handleProps) => renderItem(item, i, handleProps)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, children }: { id: string; children: (handleProps: HandleProps) => ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        position: "relative",
        zIndex: isDragging ? 2 : undefined,
        opacity: isDragging ? 0.85 : undefined,
      }}
    >
      {children({ ...attributes, ...listeners } as HandleProps)}
    </div>
  );
}
