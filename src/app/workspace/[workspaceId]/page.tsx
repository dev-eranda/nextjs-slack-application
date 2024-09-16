interface WorkSpaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkSpaceIdPage = ({ params }: WorkSpaceIdPageProps) => {
  return <div>ID{params.workspaceId}</div>;
};

export default WorkSpaceIdPage;
