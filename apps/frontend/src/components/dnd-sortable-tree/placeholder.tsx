import type {
  NodeModel,
  PlaceholderRenderParams,
} from "@minoru/react-dnd-treeview";
import type { Node } from ".";

type Props = PlaceholderRenderParams & {
  node: NodeModel<Partial<Node>>;
};

export default function Placeholder({ depth }: Props) {
  return (
    <div
      className="bg-blue-400 rounded-full h-1 absolute right-0 top-0 -translate-y-2/3"
      style={{
        left: depth * 24,
      }}
    />
  );
}
