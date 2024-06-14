import Main from "@/components/main";
import React from "react";
interface BlogPageProps {
  id: string;
}
const Chat = ({ params }: { params: BlogPageProps }) => {
  const { id } = params;
  return (
    <div>
      <Main id = {id} />
    </div>
  );
};

export default Chat;
