"use client";
import { useState } from "react";

export default function ChatListBtn() {
  const [isDropdownActive, setDropdownActive] = useState(false);
  const toggleDropdown = () => {
    // console.log('clicked ');
    setDropdownActive(!isDropdownActive);
    console.log("isDropdownActive =", isDropdownActive);
  };

  return (
    <div>
      <button className="ChatListBtn" onClick={toggleDropdown}>
        리스트
      </button>
    </div>
  );
}
