export default function Tooltip(props: { content: string }) {
  return (
    <span className="tooltip rounded shadow-lg p-1 bg-gray-100 text-red-500 -ml-4 ">
      {props.content}
    </span>
  );
}
