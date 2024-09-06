interface PanelHeaderProps {
  name: string;
}

export default function PanelHeader(props: PanelHeaderProps) {
  const { name } = props;

  return (
    <div className="flex items-center justify-start mb-4">
      <div className="w-1 h-5 mr-2 bg-red-600 float-start" />
      <span className="text-lg font-bold">{name}</span>
    </div>
  );
}
