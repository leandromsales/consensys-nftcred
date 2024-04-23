import { useState } from "react";

export default function useContentState() {
  const [activeContent, setActiveContent] = useState("loan");

  const handleSetActiveContent = (content) => {
    setActiveContent(content);
  };

  return { activeContent, handleSetActiveContent };
}
